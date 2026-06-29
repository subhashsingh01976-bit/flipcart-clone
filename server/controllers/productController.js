const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");

// @desc    Get all products with filtering, sorting, pagination, search
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const {
    keyword,
    category,
    brand,
    minPrice,
    maxPrice,
    minRating,
    sortBy,
    page = 1,
    limit = 12,
    assured,
    freeDelivery,
  } = req.query;

  // Build query
  const query = {};

  // Full-text search
  if (keyword) {
    query.$text = { $search: keyword };
  }

  // Category filter
  if (category && category !== "All") {
    query.category = { $regex: new RegExp(category, "i") };
  }

  // Brand filter
  if (brand) {
    query.brand = { $regex: new RegExp(brand, "i") };
  }

  // Price filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Rating filter
  if (minRating) {
    query.rating = { $gte: Number(minRating) };
  }

  // Assured filter
  if (assured === "true") {
    query.assured = true;
  }

  // Free delivery filter
  if (freeDelivery === "true") {
    query.freeDelivery = true;
  }

  // Sorting
  let sortOptions = {};
  switch (sortBy) {
    case "price_asc": sortOptions = { price: 1 }; break;
    case "price_desc": sortOptions = { price: -1 }; break;
    case "rating": sortOptions = { rating: -1 }; break;
    case "discount": sortOptions = { discount: -1 }; break;
    case "newest": sortOptions = { createdAt: -1 }; break;
    default:
      // Relevance: text score if searching
      if (keyword) {
        sortOptions = { score: { $meta: "textScore" } };
      } else {
        sortOptions = { isFeatured: -1, createdAt: -1 };
      }
  }

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    Product.find(query).sort(sortOptions).skip(skip).limit(limitNum),
    Product.countDocuments(query),
  ]);

  res.json({
    success: true,
    products,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    total,
    limit: limitNum,
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json({ success: true, product });
});

// @desc    Get featured products for homepage
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const featured = await Product.find({ isFeatured: true }).limit(10);
  res.json({ success: true, products: featured });
});

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
const getProductsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const { limit = 8 } = req.query;

  const products = await Product.find({ category: { $regex: new RegExp(category, "i") } })
    .sort({ rating: -1 })
    .limit(parseInt(limit));

  res.json({ success: true, products });
});

// @desc    Create a product (Admin)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, message: "Product created", product });
});

// @desc    Update a product (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, message: "Product updated", product: updated });
});

// @desc    Delete a product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.deleteOne();
  res.json({ success: true, message: "Product deleted" });
});

// @desc    Add a review to product
// @route   POST /api/products/:id/reviews
// @access  Private
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Check if already reviewed
  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error("You have already reviewed this product");
  }

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;

  await product.save();
  res.status(201).json({ success: true, message: "Review added" });
});

// @desc    Get all categories
// @route   GET /api/products/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct("category");
  res.json({ success: true, categories });
});

module.exports = {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getCategories,
};
