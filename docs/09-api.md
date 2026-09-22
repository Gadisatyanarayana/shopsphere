# 09. REST API Endpoint Reference

## Authentication Routes
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Authenticate user & return JWT token
- `POST /api/auth/logout` - Clear token cookie
- `GET /api/auth/me` - Get current user profile (Protected)
- `PUT /api/auth/profile` - Update profile & addresses (Protected)

## Product Routes
- `GET /api/products` - List products with filter, search, sort, pagination
- `GET /api/products/:identifier` - Get detail by slug or ObjectId
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

## Cart & Wishlist Routes
- `GET /api/cart` - Fetch user cart (Protected)
- `POST /api/cart` - Add item to cart (Protected)
- `PUT /api/cart/:itemId` - Update item quantity (Protected)
- `DELETE /api/cart/:itemId` - Remove item (Protected)
- `GET /api/wishlist` - Fetch user wishlist (Protected)
- `POST /api/wishlist` - Toggle product in wishlist (Protected)

## Orders & Payments
- `POST /api/orders` - Create order (Protected)
- `GET /api/orders` - Get user order history (Protected)
- `POST /api/payment/create-order` - Generate Razorpay / Dev payment order (Protected)
- `POST /api/payment/verify` - Verify payment signature (Protected)
