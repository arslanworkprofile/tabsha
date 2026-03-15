# Tabsha Custom Design — Setup Guide

## Windows PowerShell Setup

Run each command separately (PowerShell doesn't support `&&`):

```powershell
# Step 1: Install root dependencies
npm install

# Step 2: Install backend
cd backend
npm install
cd ..

# Step 3: Install frontend
cd frontend
npm install
cd ..
```

OR just double-click **`install.bat`** — it does all three automatically.

## Configure Environment

```powershell
copy backend\.env.example backend\.env
notepad backend\.env
```

Fill in:
```
MONGO_URI=mongodb://localhost:27017/tabsha
JWT_SECRET=any_long_random_string_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Seed Database

```powershell
node backend\seed.js
```

Creates: `admin@tabsha.pk / admin123` and `user@tabsha.pk / user123`

## Run

```powershell
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Admin Panel: http://localhost:3000/admin

---

## What Was Fixed in This Version

### Bugs Fixed
- `useCartStore` getters (`get total`, `get count`) were broken — replaced with proper selector functions `getTotal()` and `getCount()`
- `ShopPage` had an `import` statement at the bottom of the file causing a syntax error
- `AdminCategories` and `AdminAddProduct` had duplicate/unused state (`uploading`) from old code
- Axios interceptor was incorrectly referencing the old store key

### Performance Fixes
- **Removed framer-motion** entirely — the biggest cause of slowness. All animations are now pure CSS (transitions + keyframes)
- **React.lazy + Suspense** code splitting — each page loads only when visited
- **Hero images preloaded** on mount so slides don't flash
- All images use `loading="lazy"` with explicit dimensions
- `useCallback` on all data fetchers to prevent unnecessary re-fetches
- Data fetches cancelled on component unmount (no state updates on unmounted components)

### UI Improvements
- Cleaner, more modern typography (Playfair Display + Inter)
- Consistent gold color system with proper contrast
- Faster hover states (CSS only, no JS)
- Mobile-first responsive design throughout
- Admin sidebar now collapses cleanly
- Product cards show wishlist button only on hover (cleaner grid)

---

## Deployment

### Backend (Railway/Render)
Set all `.env` variables and run `npm start`

### Frontend (Vercel)
Build with `npm run build`, deploy the `build/` folder.
Set environment variable: `REACT_APP_API_URL=https://your-backend.com/api`
