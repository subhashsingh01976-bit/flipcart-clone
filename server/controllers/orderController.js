const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentResult } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items provided");
  }

  // Calculate prices from DB to prevent client-side price tampering
  let itemsPrice = 0;
  const validatedItems = [];

  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${item.product}`);
    }
    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    const price = product.price;
    itemsPrice += price * item.quantity;
    validatedItems.push({
      product: product._id,
      name: product.name,
      image: product.image,
      price,
      quantity: item.quantity,
    });

    // Reduce stock
    product.stock -= item.quantity;
    if (product.stock === 0) product.inStock = false;
    await product.save();
  }

  const shippingPrice = itemsPrice > 500 ? 0 : 40;
  const taxPrice = Math.round(itemsPrice * 0.18); // 18% GST
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const order = await Order.create({
    user: req.user._id,
    orderItems: validatedItems,
    shippingAddress,
    paymentResult,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    isPaid: paymentResult?.method !== "cod",
    paidAt: paymentResult?.method !== "cod" ? Date.now() : undefined,
  });

  // Clear user's cart after order placed
  await Cart.findOneAndDelete({ user: req.user._id });

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    order,
  });
});

// @desc    Get logged-in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate("orderItems.product", "name image price");

  res.json({ success: true, count: orders.length, orders });
});

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email phone")
    .populate("orderItems.product", "name image price brand");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Ensure user can only see their own orders (unless admin)
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to view this order");
  }

  res.json({ success: true, order });
});

// @desc    Cancel an order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) { res.status(404); throw new Error("Order not found"); }

  if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403); throw new Error("Not authorized");
  }

  if (["Delivered", "Cancelled"].includes(order.status)) {
    res.status(400);
    throw new Error(`Cannot cancel an order that is already ${order.status}`);
  }

  order.status = "Cancelled";

  // Restore stock
  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      product.stock += item.quantity;
      product.inStock = true;
      await product.save();
    }
  }

  await order.save();
  res.json({ success: true, message: "Order cancelled", order });
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const query = status ? { status } : {};
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [orders, total] = await Promise.all([
    Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("user", "name email"),
    Order.countDocuments(query),
  ]);

  res.json({ success: true, orders, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
});

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) { res.status(404); throw new Error("Order not found"); }

  order.status = status;

  if (status === "Delivered") {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.isPaid = true;
    order.paidAt = order.paidAt || Date.now();
  }

  await order.save();
  res.json({ success: true, message: "Order status updated", order });
});

// @desc    Get order stats (Admin)
// @route   GET /api/orders/stats
// @access  Private/Admin
const getOrderStats = asyncHandler(async (req, res) => {
  const stats = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: "$totalPrice" },
        avgOrderValue: { $avg: "$totalPrice" },
      },
    },
  ]);

  const statusCounts = await Order.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  res.json({ success: true, stats: stats[0], statusCounts });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
};
