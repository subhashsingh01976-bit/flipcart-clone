# 🛍️ Flipkart Clone — Full Stack MERN Application

A full-featured Flipkart clone built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js).

---

## 📁 Project Structure

```
flipkart clone/
├── client/          # React + Vite frontend (Port: 5173)
└── server/          # Node.js + Express backend (Port: 5000)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm

---

### ⚡ Quick Start

#### Terminal 1 — Start Backend
```bash
cd "e:\flipcart clone\server"
npm install
npm run dev
```
> Backend runs at: **http://localhost:5000**

#### Terminal 2 — Start Frontend
```bash
cd "e:\flipcart clone\client"
npm install
npm run dev
```
> Frontend runs at: **http://localhost:5173**

---

### 🌱 Seed the Database (First Time)
```bash
cd "e:\flipcart clone\server"
node seeder.js
```
This will create:
- **10 sample products** across all categories
- **Admin account**: `admin@flipkart.com` / `admin123`
- **Test account**: `test@flipkart.com` / `test1234`

---

## 🔌 API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/users/register` | Register new user |
| POST | `/api/users/login` | Login user |
| GET | `/api/users/profile` | Get profile (auth required) |
| PUT | `/api/users/profile` | Update profile (auth required) |

### Products
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/products` | Get all products (with filters) |
| GET | `/api/products?keyword=phone` | Search products |
| GET | `/api/products?category=Mobiles` | Filter by category |
| GET | `/api/products?minPrice=500&maxPrice=5000` | Filter by price |
| GET | `/api/products?sortBy=price_asc` | Sort products |
| GET | `/api/products/:id` | Get single product |
| GET | `/api/products/featured` | Get featured products |
| POST | `/api/products/:id/reviews` | Add review (auth required) |

### Cart
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/cart` | Get user cart |
| POST | `/api/cart` | Add item to cart |
| PUT | `/api/cart/:productId` | Update item quantity |
| DELETE | `/api/cart/:productId` | Remove item |
| DELETE | `/api/cart/clear` | Clear cart |

### Orders
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/orders` | Place new order |
| GET | `/api/orders/myorders` | Get my orders |
| GET | `/api/orders/:id` | Get order by ID |
| PUT | `/api/orders/:id/cancel` | Cancel order |

---

## 🔧 Environment Variables

### `server/.env`
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/flipkart_clone
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

---

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- React Router v6
- Redux Toolkit
- Axios
- React Icons
- Vanilla CSS

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt Password Hashing
- Morgan (HTTP Logging)
- Express Async Handler

---

## 📊 Features

### Frontend
- ✅ Homepage with hero carousel, categories, product sections
- ✅ Product listing with search, filters, sorting
- ✅ Product detail with image gallery, offers, specs
- ✅ Shopping cart with quantity controls
- ✅ 3-step checkout with payment options
- ✅ Login/Signup with JWT auth
- ✅ My Orders page
- ✅ Account/Profile page
- ✅ Wishlist functionality
- ✅ Responsive design

### Backend
- ✅ User registration & login with JWT
- ✅ Product CRUD with text search
- ✅ Cart management (DB-backed)
- ✅ Order placement with price validation
- ✅ Stock management
- ✅ Product reviews & ratings
- ✅ Address management
- ✅ Admin routes
- ✅ Global error handling
