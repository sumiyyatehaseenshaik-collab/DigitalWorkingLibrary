import httpx
from fastapi import FastAPI, Request, Response, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

app = FastAPI(title="Digital Library API Gateway")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BACKEND_URL = "http://localhost:8080"

# Vector Search Placeholder Database
SEMANTIC_RESULTS = {
    "books on artificial intelligence": [5, 6, 7, 8],
    "beginner friendly programming books": [1, 2, 9, 17],
    "machine learning": [6, 7, 8],
    "coding style": [1, 2, 4],
    "database": [12, 13, 14, 15],
    "ux": [16, 17, 18],
    "career": [19, 20]
}

@app.get("/api/books/semantic-search")
async def semantic_search(query: str = Query(..., description="The query to search semantically")):
    """
    Simulates a Vector Database semantic search using book embeddings.
    Maps natural language queries to pre-defined vector matches,
    then fetches full book details from the Spring Boot backend.
    """
    clean_query = query.strip().lower()
    matched_ids = []

    # Simple semantic similarity mapping
    for key, ids in SEMANTIC_RESULTS.items():
        if key in clean_query or clean_query in key:
            matched_ids = ids
            break

    # If no semantic matches, search by categories or simple keywords
    if not matched_ids:
        # We will fetch all books from Spring Boot and filter them
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(f"{BACKEND_URL}/api/books")
                if response.status_code == 200:
                    books = response.json()
                    words = clean_query.split()
                    matched_ids = [
                        b["id"] for b in books 
                        if any(w in b["title"].lower() or w in b["summary"].lower() or w in b["category"].lower() for w in words)
                    ]
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Backend connection error: {str(e)}")

    if not matched_ids:
        return []

    # Fetch details for matching book IDs
    async with httpx.AsyncClient() as client:
        try:
            matched_books = []
            for book_id in matched_ids:
                res = await client.get(f"{BACKEND_URL}/api/books/{book_id}")
                if res.status_code == 200:
                    matched_books.append(res.json())
            return matched_books
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error retrieving book details: {str(e)}")


@app.api_route("/api/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def route_api(request: Request, path: str):
    """
    Reverse proxies all other requests to the Spring Boot backend.
    """
    url = f"{BACKEND_URL}/api/{path}"
    
    # Read headers and request body
    headers = dict(request.headers)
    # Host header must be updated for backend to resolve
    headers["host"] = BACKEND_URL.replace("http://", "")
    
    # Remove Content-Length header, let httpx calculate it
    if "content-length" in headers:
        headers.pop("content-length")
        
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
                timeout=10.0
            )
            return Response(
                content=response.content,
                status_code=response.status_code,
                headers=dict(response.headers)
            )
        except httpx.ConnectError:
            raise HTTPException(
                status_code=503, 
                detail="Backend service is offline. Make sure Spring Boot app is running on port 8080."
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
