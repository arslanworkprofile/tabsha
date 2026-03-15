# 🛍️ Tabsha Custom Design — Full Stack MERN E-Commerce

A complete, production-ready e-commerce platform for Pakistani fashion with a luxury UI, full admin panel, user authentication, Cloudinary image uploads, and Stripe payment integration.

---

## 🚀 Quick Start (3 steps)

```bash
# Step 1 — Install all dependencies
cd tabsha
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..

# Step 2 — Configure environment
cd backend && cp .env.example .env
# Edit backend/.env with your MongoDB URI and Cloudinary keys

# Step 3 — Seed database and start
node backend/seed.js
npm run dev
```

**Frontend:** http://localhost:3000  
**Backend API:** http://localhost:5000/api  
**Admin Panel:** http://localhost:3000/admin

---

## 🔐 Default Login Credentials (after seeding)

| Role  | Email              | Password  |
|-------|--------------------|-----------|
| Admin | admin@tabsha.pk    | admin123  |
| User  | user@tabsha.pk     | user123   |

---

## 📁 Complete Project Structure

```
tabsha/
├── package.json              ← Root runner (npm run dev starts both servers)
├── README.md
├── backend/
│   ├── server.js
│   ├── seed.js               ← Run once to populate DB
│   ├── .env.example
│   ├── middleware/
│   │   ├── auth.js           ← JWT protect + adminOnly
│   │   └── errorHandler.js   ← Global error + 404
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js        ← With variants: size x color x stock
│   │   ├── Category.js
│   │   └── Order.js          ← With full status history
│   └── routes/
│       ├── authRoutes.js
│       ├── productRoutes.js
│       ├── categoryRoutes.js
│       ├── orderRoutes.js
│       ├── userRoutes.js
│       ├── uploadRoutes.js   ← Cloudinary image upload
│       └── paymentRoutes.js  ← Stripe PaymentIntent + webhook
└── frontend/
    ├── jsconfig.json
    └── src/
        ├── App.js            ← All routes defined here
        ├── index.js          ← Entry with ErrorBoundary
        ├── index.css         ← Complete design system + CSS variables
        ├── store.js          ← Zustand: auth, cart, wishlist (all persisted)
        ├── hooks/index.js    ← useProducts, useCategories, useDebounce, etc.
        ├── utils/
        │   ├── api.js        ← Axios with JWT auto-inject
        │   └── helpers.js    ← formatPrice, calcDiscount, timeAgo, etc.
        ├── components/
        │   ├── common/
        │   │   ├── ErrorBoundary.jsx
        │   │   ├── LoadingSpinner.jsx
        │   │   ├── ConfirmModal.jsx
        │   │   └── ImageUploader.jsx
        │   ├── layout/
        │   │   ├── Navbar.jsx + .css
        │   │   └── Footer.jsx + .css
        │   └── shop/
        │       ├── ProductCard.jsx + .css
        │       ├── RelatedProducts.jsx
        │       └── StripePayment.jsx
        └── pages/
            ├── NotFoundPage.jsx
            ├── shop/
            │   ├── HomePage.jsx + .css
            │   ├── ShopPage.jsx + .css
            │   ├── ProductDetailPage.jsx + .css
            │   ├── CartPage.jsx + .css
            │   ├── CheckoutPage.jsx + .css
            │   ├── OrderConfirmationPage.jsx
            │   ├── MyOrdersPage.jsx
            │   ├── WishlistPage.jsx
            │   ├── ProfilePage.jsx
            │   └── SizeGuidePage.jsx + .css
            ├── auth/
            │   ├── LoginPage.jsx
            │   ├── RegisterPage.jsx
            │   └── AuthPages.css
            └── admin/
                ├── AdminLayout.jsx + .css
                ├── AdminDashboard.jsx + .css
                ├── AdminProducts.jsx
                ├── AdminAddProduct.jsx
                ├── AdminCategories.jsx
                ├── AdminOrders.jsx
                ├── AdminOrderDetail.jsx
                └── AdminUsers.jsx
```

---

## ⚙️ Environment Variables

### `backend/.env`

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/tabsha
JWT_SECRET=change_this_to_a_long_random_string_in_production
CLIENT_URL=http://localhost:3000
NODE_ENV=development

# Cloudinary — free account at cloudinary.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe — optional, only needed for card payments
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### `frontend/.env`

```env
REACT_APP_API_URL=/api
# Uncomment and add your Stripe publishable key for card payments:
# REACT_APP_STRIPE_KEY=pk_test_your_publishable_key
```

---

## 🌟 Features

### Customer Storefront
- Animated hero with 3-slide carousel, auto-advance
- Category grid (fetches live from DB or shows defaults)
- Product catalog with sidebar filters: category, price range, size
- Sort: newest, price asc/desc, most popular
- Grid and list view toggle
- Product detail page: multi-image gallery with zoom, color swatches, size picker with out-of-stock handling
- Related products section
- Product reviews with star ratings
- Shopping cart: quantity controls, free-shipping progress bar
- Wishlist saved to localStorage
- 3-step checkout: Shipping Address → Payment Method → Order Review
- Payment options: Cash on Delivery, EasyPaisa, JazzCash, Stripe
- Order confirmation page
- My Orders history
- User profile with name, phone, password change
- Size guide with women's and men's measurement charts
- Fully responsive — mobile drawer nav, mobile filters
- Search overlay with popular tags
- 404 page with helpful quick links

### Admin Panel
- Dashboard with revenue, total orders, pending count, customer count
- Recent orders table with links to detail view
- Products: searchable list, image thumbnails, stock color-coding
- Add/Edit product: all fields including fabric, care instructions, tags
- Variant builder: add unlimited size × color × hex-code × stock combinations
- Product labels: Featured, New Arrival, Bestseller, Active/Inactive toggles
- Category CRUD with modal: name, description, image, sort order, active toggle
- Orders: filterable by status tabs, quick status dropdown per row
- Order detail: step progress tracker, item list with color swatches, totals breakdown, status history timeline, tracking number field
- Users: search by name/email, activate/deactivate toggle, delete (protected from deleting admins)

### Technical
- JWT auth with 30-day tokens, auto-refresh via Axios interceptors
- bcryptjs password hashing with salt rounds
- Cloudinary multi-image upload with public_id tracking
- Global Express error handler catches Mongoose ValidationError, duplicate keys, CastErrors
- Zustand stores persist cart + wishlist + auth token to localStorage
- Framer Motion page transitions and component animations
- React ErrorBoundary for graceful crash handling
- Stripe PaymentIntent creation + webhook verification
- Custom React hooks: useProducts, useCategories, useDebounce, useScrollY, useMediaQuery

---

## 💳 Payment Setup

### Cash on Delivery
Works out of the box — no configuration needed.

### Stripe (Card Payments)
1. Create a free account at [stripe.com](https://stripe.com)
2. Go to Dashboard → Developers → API Keys
3. Add to `backend/.env`: `STRIPE_SECRET_KEY=sk_test_...`
4. Add to `frontend/.env`: `REACT_APP_STRIPE_KEY=pk_test_...`
5. In `CheckoutPage.jsx`, import `StripePayment` and render it when `paymentMethod === 'stripe'`

### EasyPaisa / JazzCash
Requires a Pakistani merchant account. The UI options are already in place — integrate your preferred gateway in `backend/routes/paymentRoutes.js`.

---

## 🚢 Deployment

### Backend (Railway / Render / any Node host)
```bash
cd backend && npm start
```
Set all `.env` variables in your platform's environment settings.

### Frontend (Vercel / Netlify)
```bash
cd frontend && npm run build
```
Deploy the `build/` folder.  
Set `REACT_APP_API_URL=https://your-backend-domain.com/api` as an env variable on your platform.

### MongoDB Atlas (production)
Replace `MONGO_URI` with:
```
mongodb+srv://user:password@cluster.mongodb.net/tabsha?retryWrites=true
```

---

## 🛠 Troubleshooting

| Problem | Fix |
|---------|-----|
| MongoDB connection refused | Start MongoDB: `mongod` or use Atlas |
| Image upload fails | Verify Cloudinary keys in `backend/.env` |
| Login not working | Run `node backend/seed.js` |
| CORS error in browser | Ensure `CLIENT_URL` in `.env` matches frontend origin |
| Port 5000 already in use | `lsof -ti:5000 \| xargs kill` or change PORT |
| `npm run dev` fails | Run `npm install` at root first |
| Stripe not working | COD always works — Stripe config is optional |

---

## 🎨 Design System Quick Reference

| Variable | Value | Use |
|----------|-------|-----|
| `--gold` | `#c9a84c` | Primary accent, buttons, badges |
| `--black` | `#0a0a0a` | Text, primary buttons |
| `--white` | `#fafaf8` | Background |
| `--cream` | `#f5f0e8` | Section backgrounds |
| `--font-display` | Cormorant Garamond | Headings, product names |
| `--font-body` | DM Sans | All UI text |

All design tokens are in `frontend/src/index.css`. Change a variable, retheme the whole site.

---

Built with ❤️ for **Tabsha Custom Design** — Pakistan's premier custom fashion platform.
