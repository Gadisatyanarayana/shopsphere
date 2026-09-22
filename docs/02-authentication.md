# 02. Authentication & JWT Security

## How Authentication Works in ShopSphere
1. **Registration/Login**: User sends credentials (`email`, `password`) to `POST /api/auth/login`.
2. **Password Verification**: Express retrieves user document from MongoDB (including select: `+password`) and calls `bcrypt.compare(enteredPassword, user.password)`.
3. **JWT Generation**: Upon match, `user.getSignedJwtToken()` signs a JSON Web Token containing `user.id` and `user.role` using `JWT_SECRET`.
4. **Token Delivery**: Token is returned in JSON payload & set as HTTP-Only cookie.
5. **Protected Access**: Client includes token in HTTP header `Authorization: Bearer <token>`.
6. **Middleware Inspection**: `protect` middleware decodes token with `jwt.verify()` and sets `req.user`.

## Core Code Example (JWT Middleware)
```javascript
const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
  if (!token) return next(new ApiError(401, 'Access token missing'));
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id).select('-password');
  next();
};
```

## Common Interview Questions
- **Q: Why hash passwords with bcrypt instead of MD5/SHA256?**
  - *Answer*: Bcrypt uses a configurable salt factor and work factor designed to be computationally slow, rendering brute-force and rainbow table attacks infeasible.
