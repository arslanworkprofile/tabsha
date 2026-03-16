# Railway Deployment Guide

## Backend Environment Variables (set in Railway dashboard)
PORT=5000
MONGO_URI=mongodb+srv://arslanshah4837_db_user:Tabsha2025@tabsha.yxm2eyg.mongodb.net/tabsha?retryWrites=true&w=majority&appName=Tabsha
JWT_SECRET=tabsha_secret_key_2024
CLIENT_URL=https://YOUR-FRONTEND.up.railway.app
BASE_URL=https://YOUR-BACKEND.up.railway.app
NODE_ENV=production

## Frontend Environment Variables (set in Railway dashboard)
REACT_APP_API_URL=https://YOUR-BACKEND.up.railway.app/api

## Backend Service Settings
- Root Directory: backend
- Start Command: node server.js

## Frontend Service Settings  
- Root Directory: frontend
- Build Command: npm run build
- Start Command: npx serve -s build -l $PORT

## To seed database on Railway
1. Change backend Start Command to: node seed.js
2. Deploy and wait for "SEED COMPLETE" in logs
3. Change Start Command back to: node server.js
4. Deploy again

## To fix admin role on Railway
1. Change backend Start Command to: node fix-admin.js
2. Deploy and wait for "Fixed" in logs
3. Change Start Command back to: node server.js
4. Deploy again
