# 11. Full-Stack MERN Interview Preparation (50 Comprehensive Q&A)

This document contains 50 interview questions and detailed answers based directly on the **ShopSphere** full-stack e-commerce project architecture.

---

### React & Redux Toolkit (Questions 1–10)

#### Q1: How is Redux Toolkit configured in ShopSphere for global state management?
- **Answer**: Redux Toolkit is configured using `configureStore()` in `client/src/store/index.js`, combining slices for `auth`, `products`, `cart`, `wishlist`, and `orders`. Asynchronous API calls are executed via `createAsyncThunk` (e.g., `loginUser`, `fetchProducts`).
- **Project Example**: When a user clicks "Add to Cart", `dispatch(addToCart({ productId, quantity }))` fires an async thunk that calls `API.post('/cart')` and updates Redux state.

#### Q2: What is the purpose of Axios Interceptors in `client/src/services/api.js`?
- **Answer**: Request interceptors inject the Bearer JWT token into HTTP headers automatically before every outgoing request. Response interceptors catch 401 Unauthorized errors to log out expired sessions cleanly.
- **Project Example**: `config.headers.Authorization = 'Bearer ' + token`.

#### Q3: How does React Router DOM handle protected routes and role authorization?
- **Answer**: `ProtectedRoute` checks `isAuthenticated` from Redux state and redirects to `/login` if false. `AdminRoute` additionally checks `user.role === 'admin'`.

#### Q4: What is the difference between controlled inputs and custom state in forms like Checkout?
- **Answer**: Controlled inputs bind React state directly to input `value` and `onChange` props, ensuring predictable state validation prior to backend payload dispatch.

#### Q5: How are skeleton loaders implemented to improve User Experience (UX)?
- **Answer**: `ProductSkeleton` renders pulsating Tailwind CSS placeholders (`animate-pulse`) while `loading` is true in `productSlice`, preventing layout shifts.

#### Q6: Why use `useEffect` dependencies carefully in components like `Shop.jsx`?
- **Answer**: Specifying query parameters (`keyword`, `category`, `sort`, `page`) in the `useEffect` dependency array ensures automatic data re-fetching whenever URL search params change.

#### Q7: How does ShopSphere prevent unnecessary component re-renders?
- **Answer**: By selecting granular slice data via `useSelector((state) => state.auth.user)` rather than subscribing to the whole Redux state.

#### Q8: What is glassmorphism in modern Tailwind CSS design?
- **Answer**: Glassmorphism combines semi-transparent background colors (`bg-slate-900/70`) with backdrop blur filters (`backdrop-blur-md`) to create sleek modern UI panels.

#### Q9: How does client-side state persist across page reloads?
- **Answer**: Authentication token and basic user data are synced to browser `localStorage` and rehydrated into Redux during app initialization in `App.jsx`.

#### Q10: How are interactive toast notifications managed in React?
- **Answer**: `Toast.jsx` takes a `message` prop and automatically clears itself via a 4-second `setTimeout` cleanup function in `useEffect`.

---

### Node.js & Express.js (Questions 11–20)

#### Q11: How is the Express backend structured for separation of concerns?
- **Answer**: Routes map URL endpoints to controllers; controllers execute business logic and database operations; middleware enforces security, validation, and error handling.

#### Q12: How does `helmet` enhance Express API security?
- **Answer**: Helmet sets HTTP security headers (e.g., Content-Security-Policy, X-Frame-Options) to protect against XSS and clickjacking.

#### Q13: How does CORS middleware function in a decoupled MERN app?
- **Answer**: `cors({ origin: process.env.CLIENT_URL, credentials: true })` permits cross-origin requests from the React frontend port while allowing cookies.

#### Q14: How is centralized error handling implemented in `server/src/middleware/errorHandler.js`?
- **Answer**: An Express error-handling middleware (`(err, req, res, next)`) formats Mongoose validation errors, duplicate keys, and JWT failures into uniform `{ success: false, message, errors }` responses.

#### Q15: What is `express-validator` and how is it used in auth routes?
- **Answer**: It validates incoming payload fields (e.g., `body('email').isEmail()`) before controller execution, returning HTTP 422 if checks fail.

#### Q16: Why use `morgan` middleware in Node.js?
- **Answer**: Morgan logs HTTP request methods, URLs, status codes, and response latency to the server console for debugging.

#### Q17: How does `dotenv` handle environment configuration across dev and prod?
- **Answer**: `dotenv.config()` loads key-value pairs from `.env` into `process.env` at startup.

#### Q18: What is the purpose of `cookie-parser` in Express?
- **Answer**: It parses incoming Cookie headers and populates `req.cookies`, allowing secure HTTP-only token reading.

#### Q19: Why return an `ApiError` class extending `Error`?
- **Answer**: It encapsulates custom HTTP status codes, error arrays, and stack trace capture in a clean object.

#### Q20: How does `server.js` separate HTTP server listening from Express app definition?
- **Answer**: `app.js` defines middleware and routes; `server.js` imports `app.js` and listens on `PORT` after database connection succeeds.

---

### MongoDB & Mongoose (Questions 21–30)

#### Q21: What are Mongoose pre-save hooks and how are they used in `User.js`?
- **Answer**: Pre-save hooks execute before a document is written to MongoDB. `userSchema.pre('save')` automatically hashes plain text passwords using bcrypt if modified.

#### Q22: Why use `select: false` on the password field in `User.js`?
- **Answer**: It excludes password hashes from standard query results by default, preventing accidental leakage.

#### Q23: How does MongoDB text indexing work in `Product.js`?
- **Answer**: `productSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' })` enables full-text keyword search via `$text: { $search: keyword }`.

#### Q24: What is the benefit of MongoDB Aggregation Pipelines in `Order.js`?
- **Answer**: Aggregation pipelines process documents in multi-stage data transformations directly on the database server, optimizing performance for analytics.

#### Q25: How does the static `getAverageRating` method in `Review.js` update Product ratings?
- **Answer**: It calculates `$avg` rating and `$sum` count using aggregation and atomically updates `Product.ratings` and `Product.numReviews`.

#### Q26: How is document reference population (`.populate()`) used in Mongoose?
- **Answer**: `.populate('category', 'name slug')` performs a join to replace ObjectId references with full Category documents.

#### Q27: How does compound indexing prevent duplicate reviews?
- **Answer**: `reviewSchema.index({ product: 1, user: 1 }, { unique: true })` ensures a user can leave only one review per product.

#### Q28: What is the purpose of slugifying category and product names?
- **Answer**: Slugifying converts titles into clean, URL-friendly strings (`sonicpro-wireless-headphones`), improving SEO.

#### Q29: How are default embedded schema arrays defined in Mongoose?
- **Answer**: In `User.js`, `addresses: [addressSchema]` embeds address sub-documents directly within the parent User document.

#### Q30: How does `db.js` handle database connection failures gracefully?
- **Answer**: It logs connection errors and exits in production (`process.exit(1)`), avoiding hanging backend server instances.

---

### JWT Authentication & Security (Questions 31–40)

#### Q31: What information is stored inside the ShopSphere JWT token payload?
- **Answer**: Only non-sensitive identifiers: `id` and `role`. Passwords and personal info are never placed in JWTs.

#### Q32: What is the role of `bcrypt.compare()` during login?
- **Answer**: It hashes the entered password using the original salt and compares the result against the stored hash in constant time.

#### Q33: How does `adminOnly` middleware enforce authorization?
- **Answer**: It verifies `req.user && req.user.role === 'admin'`. If false, it returns HTTP 403 Forbidden.

#### Q34: What is the difference between Authentication and Authorization?
- **Answer**: Authentication verifies *who you are* (Login/JWT); Authorization verifies *what you are allowed to do* (Admin roles).

#### Q35: How does ShopSphere prevent JWT token tampering?
- **Answer**: Tokens are signed using a server-side `JWT_SECRET`. Any modification invalidates the cryptographic signature.

#### Q36: Why set `httpOnly: true` on auth cookies?
- **Answer**: HTTP-only cookies cannot be accessed by client-side JavaScript (`document.cookie`), mitigating XSS token theft.

#### Q37: How does password reset/change differ from standard profile updates?
- **Answer**: Password changes require verifying `currentPassword` against bcrypt before hashing and saving the `newPassword`.

#### Q38: What HTTP status code is returned for unauthenticated requests?
- **Answer**: HTTP 401 Unauthorized.

#### Q39: What HTTP status code is returned for unauthorized admin route attempts?
- **Answer**: HTTP 403 Forbidden.

#### Q40: How does `.select('-password')` protect user queries?
- **Answer**: It explicitly strips the password hash field when returning user objects to the client.

---

### Payments, Orders & E-Commerce Logic (Questions 41–50)

#### Q41: Why recalculate order subtotals on the server instead of trusting client totals?
- **Answer**: Clients can inspect and modify JavaScript payloads before sending requests. Server-side lookup against database prices guarantees accuracy and prevents fraud.

#### Q42: How does Razorpay HMAC SHA256 signature verification work?
- **Answer**: `crypto.createHmac('sha256', secret).update(order_id + '|' + payment_id).digest('hex')` generates a signature that must match Razorpay's returned signature.

#### Q43: How does Dev Payment Fallback Mode benefit development and testing?
- **Answer**: It generates mock payment IDs when Razorpay keys are omitted, allowing full end-to-end checkout testing without live API keys.

#### Q44: How does stock reduction work during order creation?
- **Answer**: Mongoose executes `$inc: { stock: -quantity }` for each ordered item.

#### Q45: What happens to product stock when an order is cancelled?
- **Answer**: Stock is restored by incrementing inventory (`$inc: { stock: item.quantity }`).

#### Q46: How does the coupon system validate discounts?
- **Answer**: The backend verifies active status, expiry date, usage limits, and minimum cart spend before applying percentage or fixed discounts.

#### Q47: How does ShopSphere restrict product reviews to verified purchasers?
- **Answer**: `Order.findOne({ user, 'items.product': productId, paymentStatus: 'completed' })` checks whether the user has a completed order for that product.

#### Q48: How are shipping fees dynamically calculated?
- **Answer**: Orders over ₹1,000 qualify for free shipping (`shippingFee = 0`), while smaller orders incur a flat ₹50 fee.

#### Q49: How is an order status timeline tracked in the UI?
- **Answer**: `OrderDetails.jsx` maps status steps (`pending` -> `confirmed` -> `processing` -> `shipped` -> `delivered`) to render a visual progression bar.

#### Q50: How do seed scripts benefit full-stack testing?
- **Answer**: `npm run seed` clears old data and populates MongoDB with admin accounts, customer accounts, categories, 20 products, reviews, and coupons for immediate full-stack testing.
