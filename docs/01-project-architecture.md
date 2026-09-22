# 01. ShopSphere Project Architecture Guide

## Overview & Architecture Concept
ShopSphere is built using the **MERN (MongoDB, Express.js, React, Node.js)** full-stack architecture following modular separation of concerns.

```
+-----------------------------------------------------------------------+
|                            REACT FRONTEND                             |
|    Vite + Tailwind CSS + Redux Toolkit + React Router + Axios         |
+-----------------------------------------------------------------------+
                                  |  HTTP REST / JSON (JWT Authorization)
                                  v
+-----------------------------------------------------------------------+
|                             EXPRESS API                               |
|   Helmet + CORS + Morgan + JWT Auth Middleware + Controllers          |
+-----------------------------------------------------------------------+
                                  |  Mongoose ODM Drivers
                                  v
+-----------------------------------------------------------------------+
|                           MONGODB DATABASE                            |
|    Users | Products | Categories | Carts | Orders | Coupons | Reviews |
+-----------------------------------------------------------------------+
```

## Directory Responsibilities

- **`client/`**: Modern React single-page application built with Vite.
  - `src/services/api.js`: Centralized Axios instance with request Bearer JWT injection & response error interceptor.
  - `src/store/`: Redux Toolkit store slices (`auth`, `product`, `cart`, `wishlist`, `order`).
  - `src/pages/`: Customer shopping flow & Admin management pages.

- **`server/`**: RESTful Express API backend.
  - `src/config/db.js`: MongoDB database connection script.
  - `src/models/`: Mongoose schemas with validation, virtuals, and hooks.
  - `src/middleware/`: JWT verification, role-based protection, and global error handling.
  - `src/controllers/`: Business logic functions for REST routes.

## How Communication Works
1. User interacts with UI (e.g. clicks "Add to Cart").
2. React triggers Redux thunk action -> invokes Axios `API.post('/cart')`.
3. Request carries JWT in HTTP `Authorization: Bearer <token>` header.
4. Express routes match -> `authMiddleware.protect` validates token.
5. Controller executes Mongoose queries against MongoDB.
6. Unified JSON response (`{ success: true, data, message }`) returned to React UI.
