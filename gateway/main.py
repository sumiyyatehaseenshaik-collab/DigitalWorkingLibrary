import httpx
from fastapi import FastAPI, Request, Response, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Digital Library API Gateway")

# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# BACKEND CONFIG
# ==========================================

BACKEND_URL = "http://localhost:9696"

# ==========================================
# ROOT ENDPOINT
# ==========================================

@app.get("/")
def home():
    return {
        "service": "Digital Library API Gateway",
        "status": "Running",
        "backend": BACKEND_URL
    }

# ==========================================
# HEALTH CHECK
# ==========================================

@app.get("/health")
def health():
    return {
        "status": "UP",
        "gateway": "ACTIVE"
    }

# ==========================================
# SEMANTIC SEARCH DATA
# ==========================================

SEMANTIC_RESULTS = {
    "books on artificial intelligence": [8, 9, 22],
    "beginner friendly programming books": [2, 3, 4],
    "machine learning": [8, 9],
    "coding style": [2, 3, 4],
    "database": [6],
    "web development": [14, 15, 16],
    "career": [17, 18]
}

# ==========================================
# SEMANTIC SEARCH
# ==========================================

@app.get("/api/books/semantic-search")
async def semantic_search(
    query: str = Query(
        ...,
        description="Natural language query for semantic book search"
    )
):
    
    print("Semantic Search Called")
    print("Query =", query)
    clean_query = query.strip().lower()
    matched_ids = []

    for key, ids in SEMANTIC_RESULTS.items():
        if clean_query in key or key in clean_query:
            matched_ids = ids
            break
        print("Matched IDs =", matched_ids)

    try:
        async with httpx.AsyncClient() as client:

            if not matched_ids:
                response = await client.get(
                    f"{BACKEND_URL}/api/books"
                )

                if response.status_code == 200:

                    books = response.json()
                    words = clean_query.split()

                    results = []

                    for book in books:

                        title = str(
                            book.get("title", "")
                        ).lower()

                        category = str(
                            book.get("category", "")
                        ).lower()

                        if any(
                            word in title or word in category
                            for word in words
                        ):
                            results.append(book)

                    return results

            matched_books = []

            for book_id in matched_ids:

                res = await client.get(
                    f"{BACKEND_URL}/api/books/{book_id}"
                )

                if res.status_code == 200:
                    matched_books.append(res.json())

            return matched_books

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Semantic Search Error: {str(e)}"
        )

# ==========================================
# GATEWAY STATUS
# ==========================================

@app.get("/api/gateway/status")
async def gateway_status():
    return {
        "gateway": "RUNNING",
        "backend": BACKEND_URL,
        "service": "FastAPI Gateway"
    }

# ==========================================
# REVERSE PROXY
# ==========================================

@app.api_route(
    "/api/{path:path}",
    methods=["GET", "POST", "PUT", "DELETE"]
)
async def route_api(request: Request, path: str):

    url = f"{BACKEND_URL}/api/{path}"

    headers = dict(request.headers)

    headers["host"] = BACKEND_URL.replace(
        "http://",
        ""
    )

    headers.pop("content-length", None)

    body = await request.body()

    params = dict(request.query_params)

    async with httpx.AsyncClient() as client:

        try:

            response = await client.request(
                method=request.method,
                url=url,
                headers=headers,
                params=params,
                content=body,
                timeout=20.0
            )

            return Response(
                content=response.content,
                status_code=response.status_code,
                headers=dict(response.headers)
            )

        except httpx.ConnectError:

            raise HTTPException(
                status_code=503,
                detail="Backend service is offline. Make sure Spring Boot is running on port 9696."
            )

        except Exception as e:

            raise HTTPException(
                status_code=500,
                detail=str(e)
            )

# ==========================================
# START SERVER
# ==========================================

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000
    )