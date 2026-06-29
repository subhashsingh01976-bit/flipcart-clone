const asyncHandler = require("express-async-handler");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
    "name image price originalPrice discount brand assured freeDelivery inStock stock"
  );

  if (!cart) {
    return res.json({ success: true, cart: { items: [], totalPrice: 0, totalItems: 0 } });
  }

  res.json({ success: true, cart });
});

// @desc    Add item to cart / update quantity
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) { res.status(404); throw new Error("Product not found"); }
  if (!product.inStock || product.stock < quantity) {
    res.status(400); throw new Error("Product is out of stock");
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    // Create new cart
    cart = await Cart.create({
      user: req.user._id,
      items: [{ product: productId, name: product.name, image: product.image, price: product.price, quantity }],
    });
  } else {
    const existingItem = cart.items.find((item) => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
      if (existingItem.quantity > product.stock) {
        res.status(400); throw new Error("Cannot add more than available stock");
      }
    } else {
      cart.items.push({
        product: productId,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity,
      });
    }
    await cart.save();
  }

  const populatedCart = await Cart.findById(cart._id).populate(
    "items.product",
    "name image price originalPrice discount brand assured freeDelivery inStock"
  );

  res.status(201).json({ success: true, message: "Item added to cart", cart: populatedCart });
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) { res.status(404); throw new Error("Cart not found"); }

  const item = cart.items.find((i) => i.product.toString() === req.params.productId);
  if (!item) { res.status(404); throw new Error("Item not in cart"); }

  if (quantity <= 0) {
    cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
  } else {
    item.quantity = quantity;
  }

  await cart.save();

  const populatedCart = await Cart.findById(cart._id).populate(
    "items.product",
    "name image price originalPrice discount brand assured freeDelivery inStock"
  );

  res.json({ success: true, message: "Cart updated", cart: populatedCart });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) { res.status(404); throw new Error("Cart not found"); }

  cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
  await cart.save();

  res.json({ success: true, message: "Item removed from cart", cart });
});

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.json({ success: true, message: "Cart cleared" });
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
