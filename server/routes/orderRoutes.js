const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/authMiddleware");

// Protected routes
router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/cancel", protect, cancelOrder);

// Admin routes
router.get("/", protect, admin, getAllOrders);
router.get("/admin/stats", protect, admin, getOrderStats);
router.put("/:id/status", protect, admin, updateOrderStatus);

module.exports = router;
