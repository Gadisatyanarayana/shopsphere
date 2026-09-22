# ShopSphere 🛒 | Production Full-Stack MERN E-Commerce Marketplace

ShopSphere is a full-stack, production-grade e-commerce marketplace platform built with the MERN (MongoDB, Express.js, React, Node.js) architecture. It features secure JWT authentication, role-based authorization, complete product management with dynamic multi-field search and filters, real-time cart and wishlist persistence, step-by-step checkout with Razorpay online payment integration (plus safe development mock payment fallback), order tracking, product reviews by verified buyers, coupon validation, an executive admin analytics dashboard with custom dynamic charts, student documentation (`docs/`), and 50 full-stack interview preparation questions.

---

## 🌟 Key Features

### 👤 Customer Experience
- **Authentication**: Secure JWT registration & login, password hashing with bcrypt, profile and saved address management.
- **Product Discovery**: Search by keyword, filter by department category, price range, and star ratings. Sort by price low/high, rating, or newest.
- **Interactive Details**: Multi-image zoom gallery, technical specifications table, dynamic stock indicator, write customer review modal.
- **Cart & Wishlist**: Real-time cart synchronization, stock validation before checkout, coupon code discount validator, wishlist save/remove and move-to-cart transfer.
- **Checkout & Payment**: Multi-step checkout, Razorpay online payments integration with automatic signature verification (HMAC SHA256) and safe development payment fallback.
- **Orders & Tracking**: Order status timeline tracking (Pending -> Confirmed -> Processing -> Shipped -> Delivered), cancel order action, printable invoice generator.

### 🛡️ Admin Dashboard & Management
- **Executive Analytics**: Live metric cards (Revenue, Total Orders, Customers, Catalog Products, Low Stock alerts), dynamic custom SVG revenue growth charts, top selling products progress bars.
- **Product Catalog Management**: Full CRUD operations for products with instant featured toggles and stock updates.
- **Order Processing**: View customer orders with status progression dropdown updates.
- **Category & Coupon Management**: Category directory controller, coupon code generator (percentage/fixed discount, minimum purchase limits, expiry dates).

---

## 🏗️ Architecture Diagram

```
+-----------------------------------------------------------------------+
|                            REACT FRONTEND                             |
|    Vite + Tailwind CSS + Redux Toolkit + React Router + Axios         |
+-----------------------------------------------------------------------+
                                  |  HTTP REST / JSON (JWT Bearer Token)
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

---

## 📁 Repository Structure

```
ShopSphere/
├── client/                      # React Vite Frontend
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── components/          # Reusable UI components (Navbar, Footer, ProductCard, Charts, Toast, Modal)
│   │   ├── layouts/             # MainLayout, AdminLayout, ProtectedRoute, AdminRoute
│   │   ├── pages/               # Customer & Admin pages
│   │   ├── services/            # Axios API service instance
│   │   ├── store/               # Redux Toolkit store & async slices
│   │   ├── App.jsx              # Application router
│   │   ├── main.jsx             # React DOM root entry
│   │   └── index.css            # Tailwind CSS design system
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
├── server/                      # Node.js Express API Backend
│   ├── src/
│   │   ├── config/              # MongoDB connection
│   │   ├── controllers/         # REST API business logic controllers
│   │   ├── middleware/          # JWT protect, adminOnly, validation, error handler
│   │   ├── models/              # Mongoose database models
│   │   ├── routes/              # Express API routes
│   │   ├── utils/               # Seed script, ApiError, ApiResponse helpers
│   │   ├── app.js               # Express application configuration
│   │   └── server.js            # Server entry point
│   ├── package.json
│   └── .env.example
├── docs/                        # Student Educational Documentation (01-11)
├── package.json                 # Root script runner (concurrently)
├── README.md                    # Master documentation
└── .gitignore
```

---

## 🚀 Quickstart & Local Installation Guide

### Prerequisites
- Node.js (v18 or higher)
- MongoDB running locally (`mongodb://127.0.0.1:27017/shopsphere`) or a MongoDB Atlas connection string.

### 1. Install All Dependencies
Run from the root directory to install dependencies for root, server, and client:
```bash
npm run install:all
```

### 2. Seed Database with Initial Data
Run the automated seed script to populate MongoDB with admin accounts, customer accounts, categories, 20 products, reviews, and coupons:
```bash
npm run seed
```

*Demo Login Accounts:*
- **Admin**: `admin@shopsphere.com` | Password: `Admin@123`
- **Customer**: `customer@shopsphere.com` | Password: `User@123`

### 3. Run Development Server
Launch both Express backend API (`port 5000`) and React Vite frontend (`port 5173`) concurrently:
```bash
npm run dev
```

Visit **`http://localhost:5173`** in your web browser.

---

## 📚 Student Learning & Interview Documentation (`docs/`)

Explore the detailed educational documentation guides located inside the `docs/` folder:

1. [01-project-architecture.md](file:///e:/PROJECTS/mern%20stak%20projet/docs/01-project-architecture.md)
2. [02-authentication.md](file:///e:/PROJECTS/mern%20stak%20projet/docs/02-authentication.md)
3. [03-products.md](file:///e:/PROJECTS/mern%20stak%20projet/docs/03-products.md)
4. [04-cart.md](file:///e:/PROJECTS/mern%20stak%20projet/docs/04-cart.md)
5. [05-orders.md](file:///e:/PROJECTS/mern%20stak%20projet/docs/05-orders.md)
6. [06-payments.md](file:///e:/PROJECTS/mern%20stak%20projet/docs/06-payments.md)
7. [07-admin-dashboard.md](file:///e:/PROJECTS/mern%20stak%20projet/docs/07-admin-dashboard.md)
8. [08-database.md](file:///e:/PROJECTS/mern%20stak%20projet/docs/08-database.md)
9. [09-api.md](file:///e:/PROJECTS/mern%20stak%20projet/docs/09-api.md)
10. [10-deployment.md](file:///e:/PROJECTS/mern%20stak%20projet/docs/10-deployment.md)
11. [11-interview-preparation.md](file:///e:/PROJECTS/mern%20stak%20projet/docs/11-interview-preparation.md) (Contains **50 full-stack MERN interview questions & answers**)

---

## 🛠️ Verification & Production Build
To verify the React frontend Vite compilation, run:
```bash
npm run build
```

---
*Created for B.Tech full-stack web development and software architecture portfolio.*
