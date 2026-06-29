const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide name, email and password");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists with this email");
  }

  const user = await User.create({ name, email, phone, password });

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      superCoins: user.superCoins,
    },
    token: generateToken(user._id),
  });
});

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    res.status(401);
    throw new Error("Account has been deactivated. Contact support.");
  }

  res.json({
    success: true,
    message: "Login successful",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      superCoins: user.superCoins,
      addresses: user.addresses,
    },
    token: generateToken(user._id),
  });
});

// @desc    Get logged-in user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist", "name image price rating");

  res.json({ success: true, user });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = req.body.name || user.name;
  user.phone = req.body.phone || user.phone;
  user.gender = req.body.gender || user.gender;
  if (req.body.avatar) user.avatar = req.body.avatar;

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updated = await user.save();

  res.json({
    success: true,
    message: "Profile updated successfully",
    user: {
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      gender: updated.gender,
      role: updated.role,
      avatar: updated.avatar,
      superCoins: updated.superCoins,
    },
  });
});

// @desc    Add address
// @route   POST /api/users/address
// @access  Private
const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { name, phone, pincode, address, city, state, type } = req.body;

  if (!name || !phone || !pincode || !address || !city || !state) {
    res.status(400);
    throw new Error("Please fill all address fields");
  }

  user.addresses.push({ name, phone, pincode, address, city, state, type });
  await user.save();

  res.status(201).json({ success: true, message: "Address added", addresses: user.addresses });
});

// @desc    Delete address
// @route   DELETE /api/users/address/:addressId
// @access  Private
const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses = user.addresses.filter((a) => a._id.toString() !== req.params.addressId);
  await user.save();
  res.json({ success: true, message: "Address removed", addresses: user.addresses });
});

// @desc    Toggle wishlist item
// @route   PUT /api/users/wishlist/:productId
// @access  Private
const toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.productId;

  const idx = user.wishlist.findIndex((id) => id.toString() === productId);
  let action;

  if (idx > -1) {
    user.wishlist.splice(idx, 1);
    action = "removed";
  } else {
    user.wishlist.push(productId);
    action = "added";
  }

  await user.save();
  res.json({ success: true, message: `Product ${action} to wishlist`, wishlist: user.wishlist });
});

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).sort({ createdAt: -1 });
  res.json({ success: true, count: users.length, users });
});

// @desc    Delete user (Admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error("User not found"); }
  await user.deleteOne();
  res.json({ success: true, message: "User deleted" });
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  addAddress,
  deleteAddress,
  toggleWishlist,
  getAllUsers,
  deleteUser,
};
