# 10. Production Deployment Architecture

## Deployment Strategy
1. **Frontend (Vercel)**:
   - Build output: `client/dist`
   - Set environment variable `VITE_API_URL=https://shopsphere-api.onrender.com/api`
2. **Backend (Render / Railway)**:
   - Root command: `node server/src/server.js`
   - Set environment variables: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`
3. **Database (MongoDB Atlas)**:
   - Network Access: Allow access from deployment IPs (`0.0.0.0/0`)
   - Connection URI: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/shopsphere`
