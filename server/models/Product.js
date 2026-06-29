const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Product name is required"], trim: true },
    brand: { type: String, required: [true, "Brand is required"] },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Mobiles", "Electronics", "Fashion", "Home", "Appliances", "Beauty", "Grocery", "Toys", "Travel"],
    },
    description: { type: String, required: true },
    highlights: [{ type: String }],
    price: { type: Number, required: [true, "Price is required"], min: 0 },
    originalPrice: { type: Number, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    image: { type: String, required: true },
    images: [{ type: String }],
    specs: { type: Map, of: String },
    seller: { type: String, default: "Flipkart Store" },
    stock: { type: Number, default: 100, min: 0 },
    inStock: { type: Boolean, default: true },
    freeDelivery: { type: Boolean, default: true },
    assured: { type: Boolean, default: false },
    reviews: [reviewSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    tags: [{ type: String }],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Full-text search index
productSchema.index({ name: "text", brand: "text", category: "text", description: "text" });
productSchema.index({ category: 1, price: 1, rating: -1 });

// Auto-calculate discount when price and originalPrice set
productSchema.pre("save", function (next) {
  if (this.originalPrice && this.price) {
    this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
