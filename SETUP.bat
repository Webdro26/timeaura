@echo off
echo ========================================
echo    TimeAura - Setup Script (Windows)
echo ========================================
echo.

echo [1/4] Installing server dependencies...
cd server
call npm install
cd ..

echo.
echo [2/4] Installing client dependencies...
cd client
call npm install
cd ..

echo.
echo [3/4] Setup complete!
echo.
echo NEXT STEPS:
echo  1. Edit server\.env with your MongoDB URI and API keys
echo  2. Run: cd server ^&^& npm run seed
echo  3. Open terminal 1: cd server ^&^& npm run dev
echo  4. Open terminal 2: cd client ^&^& npm run dev
echo  5. Visit: http://localhost:5173
echo.
echo Admin Login: admin@timeaura.com / Admin@123
echo.
pause
