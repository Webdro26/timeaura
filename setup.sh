#!/bin/bash
echo "========================================"
echo "   TimeAura - Setup Script (Mac/Linux)"
echo "========================================"
echo ""

echo "[1/3] Installing server dependencies..."
cd server && npm install && cd ..

echo ""
echo "[2/3] Installing client dependencies..."
cd client && npm install && cd ..

echo ""
echo "[3/3] All dependencies installed!"
echo ""
echo "NEXT STEPS:"
echo "  1. Edit server/.env with your MongoDB URI and API keys"
echo "  2. Run:  cd server && npm run seed"
echo "  3. Terminal 1:  cd server && npm run dev"
echo "  4. Terminal 2:  cd client && npm run dev"
echo "  5. Visit: http://localhost:5173"
echo ""
echo "Admin: admin@timeaura.com / Admin@123"
