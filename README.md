# ⌚ TimeAura — Premium Watch & Sunglasses E-Commerce

> **Wear Time. Own Style.** — A full-stack MERN e-commerce platform.

---

## 🗂️ Project Structure

```
timeaura/
├── server/          ← Node.js + Express + MongoDB backend
└── client/          ← React + Vite + Tailwind frontend
```

---

## ⚡ Quick Setup (Step by Step)

### Prerequisites
- Node.js v18+ installed → https://nodejs.org
- MongoDB Atlas account (free) → https://mongodb.com/atlas
- Git (optional)

---

### STEP 1 — Backend Setup

```bash
cd server
npm install
cp .env.example .env
```

Open `server/.env` and fill in:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/timeaura
JWT_SECRET=any_long_random_string_here
JWT_ADMIN_SECRET=another_long_random_string_here

# Get free keys from razorpay.com/dashboard (Test Mode)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx

# Get free keys from cloudinary.com/console
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CLIENT_URL=http://localhost:5173
```

---

### STEP 2 — Seed the Database

```bash
cd server
npm run seed
```

This creates:
- ✅ Admin user: admin@timeaura.com / Admin@123
- ✅ 7 watch brands (Casio, Fossil, Titan, etc.)
- ✅ 6 sunglass types (Aviator, Round, Square, etc.)
- ✅ 8 watch products + 6 sunglass products
- ✅ 3 sample coupons: TIMEAURA10, WELCOME200, STYLE20

---

### STEP 3 — Start Backend

```bash
cd server
npm run dev
```

Backend runs at: http://localhost:5000

---

### STEP 4 — Frontend Setup

Open a **new terminal**:

```bash
cd client
npm install
cp .env.example .env
```

The default `.env` works as-is (uses Vite proxy to localhost:5000).

---

### STEP 5 — Start Frontend

```bash
cd client
npm run dev
```

Frontend runs at: http://localhost:5173 🎉

---

## 🔑 Login Credentials

| Role  | Email / Phone        | Password  |
|-------|----------------------|-----------|
| Admin | admin@timeaura.com   | Admin@123 |
| User  | Any mobile number    | OTP login (shown in server terminal in dev mode) |

---

## 🛒 Sample Coupons to Test

| Code          | Discount         | Min Order |
|---------------|------------------|-----------|
| TIMEAURA10    | 10% (max ₹500)   | ₹1,000    |
| WELCOME200    | ₹200 flat        | ₹1,500    |
| STYLE20       | 20% (max ₹1,000) | ₹3,000    |

---

## 💳 Razorpay Test Cards

Use these in test mode:
- Card: 4111 1111 1111 1111
- Expiry: Any future date
- CVV: Any 3 digits
- OTP: 1234

---

## 📱 Pages

**Frontend:**
- `/` — Homepage with loader
- `/watches` — All watches with filters
- `/sunglasses` — All sunglasses
- `/brand/:slug` — Brand-specific watches
- `/men` `/women` — Gender collections
- `/shop` — Shop all with filters
- `/product/:slug` — Product detail
- `/cart` — Shopping cart
- `/checkout` — Checkout + Razorpay
- `/login` — OTP login + guest
- `/dashboard` — User account
- `/orders` — Order history

**Admin (login at `/admin/login`):**
- `/admin` — Dashboard analytics
- `/admin/products` — Manage products
- `/admin/orders` — Manage + update orders
- `/admin/brands` — Watch brands
- `/admin/categories` — Sunglass types
- `/admin/coupons` — Discount codes
- `/admin/messages` — Contact messages

---

## 🔧 Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, React Router v6
- **Backend:** Node.js, Express.js, MongoDB Atlas, Mongoose
- **Auth:** JWT, OTP (console in dev / Twilio in prod)
- **Payments:** Razorpay
- **Images:** Cloudinary + Multer

---

## 🚀 Production Deployment

**Backend (Render/Railway):**
1. Push `server/` to GitHub
2. Create web service, set all env vars
3. Build command: `npm install`
4. Start command: `npm start`

**Frontend (Vercel/Netlify):**
1. Push `client/` to GitHub
2. Build command: `npm run build`
3. Output dir: `dist`
4. Set `VITE_API_URL` to your backend URL

---

## 📞 Support

Built with ❤️ by TimeAura Team

---

## 🎬 Luxury Scroll-Driven Video Hero

The homepage hero is a **scroll-controlled canvas animation** (Rolex-style) built from extracted video frames.

### How it works
- `client/src/components/common/ScrollVideoHero.jsx` preloads 300 JPEG frames from `client/public/frames/hero/`
- As the user scrolls through the hero section, the canvas draws the corresponding frame (object-cover, centered)
- On mobile / low-memory / reduced-motion devices, it automatically falls back to a normal looping `<video>` using `client/src/assets/videos/hero.mp4`

### Replacing the hero video
1. Replace `client/src/assets/videos/hero.mp4` with your new video file
2. Re-generate the frame sequence with **ffmpeg**:

```bash
# Extract 30fps frames, scaled to 960px width, saved as frame_0001.jpg ... frame_NNNN.jpg
ffmpeg -i client/src/assets/videos/hero.mp4 \
  -vf "fps=30,scale=960:-1" \
  -q:v 4 \
  client/public/frames/hero/frame_%04d.jpg \
  -y
```

3. Open `ScrollVideoHero.jsx` and update `FRAME_COUNT` to match the new total frame count (e.g. a 12-second video at 30fps = 360 frames)
4. Restart the dev server

> **Note:** Longer videos = more frames = larger download. For best performance, keep hero videos under 12 seconds and frames scaled to ~960px width.

---

## 🎨 Luxury Color System

All theme colors are defined as CSS variables in `client/src/index.css` under `:root`. Change them in **one place** to retheme the entire site:

```css
:root {
  --bg-main:    #0B0B0D;   /* page background */
  --bg-card:    #141414;   /* card/panel background */
  --bg-soft:    #101014;   /* alternating section background */
  --text-main:  #F5F1E8;   /* primary text */
  --text-muted: #9B9B9B;   /* secondary text */
  --accent-gold:        #C9A45C;  /* primary accent */
  --accent-gold-light:  #E2C07A;  /* hover/highlight gold */
  --accent-silver:      #C7C7C7;  /* secondary accent */
  --border-soft:  rgba(255,255,255,0.07);
  --border-gold:  rgba(201,164,92,0.3);
}
```

---

## 🛍️ Brand vs Glass Category Logic

| Product Type | Required Field | Shown On |
|---------------|----------------|----------|
| **Watch**      | Brand (Casio, Fossil, Titan, etc.) | `/watches` brand filter strip, "Shop Watches by Brand" homepage section |
| **Sunglasses** | Glass Category (Aviator, Round, Wayfarer, etc.) | `/sunglasses` glass-type filter strip, "Sunglasses by Glass Type" homepage section |

In the **Admin → Add Product** form:
- Selecting **Watch** shows a required **Brand** dropdown and hides Glass Category
- Selecting **Sunglasses** shows a required **Glass Category** dropdown and hides Brand
- The form validates this before submission

---

## 🔐 Admin Portal

- URL: `/admin/login` (small "Admin Login" link in the footer — not shown prominently on the storefront)
- Separate styling from the user OTP/guest login
- Default credentials: `admin@timeaura.com` / `Admin@123`

### Admin capabilities
- **Dashboard** — total products, orders, users, revenue, recent orders, low-stock alerts
- **Products** — add/edit/delete, Cloudinary image upload, search, filter by Watch/Sunglasses
- **Watch Brands** — full CRUD (applies only to watches)
- **Glass Categories** — full CRUD (applies only to sunglasses)
- **Orders** — view full details, update status (Placed/Confirmed/Processing/Shipped/Delivered/Cancelled), view payment status
- **Homepage** — manage promotional banners; instructions for swapping the hero video
- **Coupons** — add/edit/delete, percentage or flat discount, expiry, min order amount
- **Messages** — view contact form submissions

All admin actions write directly to MongoDB via the existing Express API — no static/mock data.
