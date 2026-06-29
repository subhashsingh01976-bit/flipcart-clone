const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  addAddress,
  deleteAddress,
  toggleWishlist,
  getAllUsers,
  deleteUser,
} = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.post("/address", protect, addAddress);
router.delete("/address/:addressId", protect, deleteAddress);
router.put("/wishlist/:productId", protect, toggleWishlist);

// Admin routes
router.get("/", protect, admin, getAllUsers);
router.delete("/:id", protect, admin, deleteUser);

module.exports = router;
