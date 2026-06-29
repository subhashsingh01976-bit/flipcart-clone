const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const shippingAddressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
});

const paymentResultSchema = new mongoose.Schema({
  method: { type: String, enum: ["upi", "card", "netbanking", "cod"], required: true },
  transactionId: { type: String },
  status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
  paidAt: { type: Date },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderItems: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    paymentResult: paymentResultSchema,
    itemsPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    taxPrice: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ["Processing", "Confirmed", "Shipped", "Out for Delivery", "Delivered", "Cancelled", "Returned"],
      default: "Processing",
    },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    estimatedDelivery: { type: Date },
    trackingId: { type: String },
  },
  { timestamps: true }
);

// Generate tracking ID before save
orderSchema.pre("save", function (next) {
  if (this.isNew && !this.trackingId) {
    this.trackingId = "FK" + Date.now().toString(36).toUpperCase();
    // Estimated delivery: 3-5 business days
    const delivery = new Date();
    delivery.setDate(delivery.getDate() + 4);
    this.estimatedDelivery = delivery;
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
