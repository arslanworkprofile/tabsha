@echo off
echo Installing root dependencies...
call npm install

echo Installing backend dependencies...
cd backend
call npm install
cd ..

echo Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo.
echo All done! Now:
echo   1. Copy backend\.env.example to backend\.env
echo   2. Edit backend\.env with your MongoDB URI + Cloudinary keys
echo   3. node backend\seed.js
echo   4. npm run dev
pause
