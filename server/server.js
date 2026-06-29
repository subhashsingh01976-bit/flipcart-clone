const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");

// Load env variables
dotenv.config();

const app = express();

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.CLIENT_URL || "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:3000",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ─── Static Files (uploaded images) ───────────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🛍️ Flipkart Clone API is running",
    version: "1.0.0",
    endpoints: {
      users:    "/api/users",
      products: "/api/products",
      orders:   "/api/orders",
      cart:     "/api/cart",
    },
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/users",    require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders",   require("./routes/orderRoutes"));
app.use("/api/cart",     require("./routes/cartRoutes"));

// ─── Error Handlers ───────────────────────────────────────────────────────────
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
app.use(notFound);
app.use(errorHandler);

// ─── Database Connection & Server Start ───────────────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/flipkart_clone";

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected:", mongoose.connection.host);

    app.listen(PORT, () => {
      console.log("\n🚀 Flipkart Clone API Server");
      console.log("──────────────────────────────────────────");
      console.log(`   Mode:     ${process.env.NODE_ENV || "development"}`);
      console.log(`   Port:     http://localhost:${PORT}`);
      console.log(`   API:      http://localhost:${PORT}/api`);
      console.log(`   Health:   http://localhost:${PORT}/api/health`);
      console.log(`   Products: http://localhost:${PORT}/api/products`);
      console.log("──────────────────────────────────────────\n");
    });
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    console.error("\n💡 Make sure MongoDB is running:");
    console.error("   1. Install MongoDB: https://www.mongodb.com/try/download/community");
    console.error("   2. Start it: mongod");
    console.error("   3. Or use MongoDB Atlas (cloud): update MONGO_URI in .env\n");
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err.message);
  process.exit(1);
});

startServer();
