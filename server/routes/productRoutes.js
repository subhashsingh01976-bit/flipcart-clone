const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getCategories,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/categories", getCategories);
router.get("/category/:category", getProductsByCategory);
router.get("/:id", getProductById);

// Protected routes
router.post("/:id/reviews", protect, addReview);

// Admin routes
router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
