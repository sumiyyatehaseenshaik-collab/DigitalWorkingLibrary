# Antigravity Digital Library System

A complete, high-end, professional full-stack Digital Library Management System built using a **luxury modern library aesthetic** and state-of-the-art technologies. 

Features conceptual AI-like semantic searches, user borrowing/returning transaction flows, interactive administrative command panels, and persistent timelines, powered by **PostgreSQL** and **MongoDB**.

---

## 🏛️ UI/UX Design System (Luxury Monochromatic Coffee Theme)

The interface follows a custom-crafted luxury aesthetic utilizing premium color tokens:
*   **Shades**: `Biscuit (#c6a67a)`, `Cream (#fdfbf7)`, `Beige (#e5d3b3)`
*   **Accents**: Warm coffee wood tones (`#0d0b09`, `#181411`, `#231d19`, `#2e2621`)
*   **Visual Highlights**: Rounded glassmorphic panels, glowing backlights, smooth vector hover effects, high-fidelity metadata cards, and animated timeline structures.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React + Vite (ES6 Modular JSX)
- **Styling**: Tailwind CSS + Custom scrollbars & loading shimmers
- **Routing**: React Router DOM (v6 Protected routes & role gates)
- **Icons**: Lucide React Core

### Backend
- **Core**: Spring Boot (Java Maven Core)
- **Security**: Spring Security + BCrypt Encryption
- **Authorization**: JSON Web Tokens (JWT) using secure localStorage session binding
- **CORS**: Fully configured cross-origin rules for frontend access

### Databases
- **Relational**: PostgreSQL (Catalog data, users, and checkout lease tables)
- **Document Store**: MongoDB (AI semantic search logs & reading history timelines)

---

## 📂 Project Structure

```
ANTIGRAVITY-DIGITAL-LIBRARY/
├── frontend/             # React + Vite + Tailwind application
│   ├── src/
│   │   ├── components/   # BookCard, BookModal, Navbar, Sidebar, ProtectedRoute
│   │   ├── pages/        # Login, Register, Dashboard, Catalogue, Details, Borrowed, Search, Profile, Admin
│   │   ├── services/     # api.js API fetch Client
│   │   ├── App.jsx       # Router, Layouts, Title bindings
│   │   └── main.jsx      # Mount roots
│   └── package.json
├── backend/              # Spring Boot Maven application
│   ├── src/main/java/com/library/digital/
│   │   ├── controllers/  # Auth, Book, Borrow, Dashboard, ActivityHistory
│   │   ├── dto/          # Signup, AuthRequest, AuthResponse, BookDto, BorrowDto
│   │   ├── models/       # Book, User, BorrowRecord, ReadingLog, SearchActivity
│   │   ├── repositories/ # Book, User, BorrowRecord, ReadingLog, SearchActivity
│   │   ├── security/     # SecurityConfig, JwtUtils, UserDetailsServiceImpl
│   │   └── services/     # BookService, BorrowService, SemanticSearchService
│   └── pom.xml
├── database/             # Relational & document store script seeds
│   ├── schema.sql        # PostgreSQL Tables
│   ├── data.sql          # Seed data (includes exactly 20 books & bcrypt users)
│   └── mongodb_setup.js  # MongoDB collection creations and seeds
├── postman/              # Automated API collections
│   └── antigravity_library.postman_collection.json
└── screenshots/          # Layout presentation specifications
    └── ui_layout_specifications.md
```

---

## 🚀 Setup & Execution Guide

### 1. PostgreSQL & pgAdmin Setup
1.  Open your **pgAdmin** console client.
2.  Create a new relational database called `antigravity_library`.
3.  Open the **Query Tool** inside pgAdmin for the `antigravity_library` database.
4.  Copy the SQL commands inside [schema.sql](file:///database/schema.sql) and execute them to construct tables.
5.  Copy the commands inside [data.sql](file:///database/data.sql) and execute them to seed 20 premium books and default accounts.

### 2. MongoDB Setup
1.  Make sure your local MongoDB Server instance is active (`mongodb://localhost:27017`).
2.  Run the initialization script using **mongosh** (MongoDB shell):
    ```bash
    mongosh mongodb://localhost:27017/antigravity_library database/mongodb_setup.js
    ```
    This drops any old instances, creates collection collections `reading_logs` and `search_activities`, and inputs initial seeds.

### 3. Backend Setup & Run (Spring Boot)
1.  Open your IDE (Eclipse, Spring Tool Suite, IntelliJ, or VS Code).
2.  Import the `backend/` directory as a **Maven Project**.
3.  Open `backend/src/main/resources/application.properties` and customize database credentials:
    - `spring.datasource.username=your_postgres_user`
    - `spring.datasource.password=your_postgres_password`
4.  Run the application by executing the main method inside `DigitalLibraryApplication.java`.
5.  The backend server executes on port **8080** (API root `http://localhost:8080/api`).

### 4. Frontend Setup & Run (React + Vite)
1.  Open a terminal inside the `frontend/` directory.
2.  Install all package modules:
    ```bash
    npm install
    ```
3.  Execute the local Vite development server:
    ```bash
    npm run dev
    ```
4.  Open your browser and navigate to the address shown (usually `http://localhost:5173`).

---

## 🔐 Credentials & Access Roles

*   **ADMIN Administrator Node**:
    - Username: `admin`
    - Password: `admin123`
    - Access: Full catalog curation (add, edit, delete books), global activity logs, analytics charts, and user toggles.
*   **USER Standard Member Node**:
    - Username: `user`
    - Password: `user123`
    - Access: Catalog browser, borrowing, returns, conceptual semantic search, personal timeline logs, and profile shelf stats.

---

## 🧪 API Testing (Postman)

1.  Open the **Postman** desktop application.
2.  Click **Import** in the top navigation bar.
3.  Choose the [antigravity_library.postman_collection.json](file:///postman/antigravity_library.postman_collection.json) file.
4.  Set a Postman environment or global variables:
    - `base_url`: `http://localhost:8080/api`
5.  Execute **Signin Admin** or **Signin User** to automatically authenticate and populate the dynamic `{{token}}` headers for all other requests.
