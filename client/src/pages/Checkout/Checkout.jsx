import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiCheck, FiMapPin, FiCreditCard, FiPackage } from "react-icons/fi";
import { selectCartItems, selectCartTotal, clearCart } from "../../redux/cartSlice";
import { orderAPI } from "../../services/api";
import "./Checkout.css";

const formatPrice = (p) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(p);

const STEPS = ["Address", "Order Summary", "Payment"];

const Checkout = () => {
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    pincode: "",
    address: "",
    city: "",
    state: "",
    type: "Home",
  });
  const [payMethod, setPayMethod] = useState("upi");
  const [upi, setUpi] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const deliveryCharge = total > 500 ? 0 : 40;
  const finalTotal = total + deliveryCharge;

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError("");
    const orderItems = items.map((item) => ({
      product: item._id || item.id,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
    }));

    const orderData = {
      orderItems,
      shippingAddress: {
        name: address.name,
        phone: address.phone,
        address: address.address,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
      },
      paymentResult: {
        method: payMethod,
        status: payMethod === "cod" ? "pending" : "completed",
        transactionId: payMethod === "cod" ? "" : "TXN_" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      },
    };

    try {
      const response = await orderAPI.createOrder(orderData);
      setOrderId(response.data.order.trackingId || response.data.order._id);
      dispatch(clearCart());
      setOrderPlaced(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="order-success animate-fade-in">
        <div className="order-success-icon">
          <FiCheck size={48} color="white" />
        </div>
        <h2>Order Placed Successfully!</h2>
        <p>Your order has been placed and will be delivered soon.</p>
        <p className="order-id">Order ID: {orderId}</p>
        <div className="order-success-actions">
          <button className="btn btn-primary" onClick={() => navigate("/orders")} id="view-orders-btn">
            View Orders
          </button>
          <button className="btn btn-ghost" onClick={() => navigate("/")} id="continue-shopping-btn">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page animate-fade-in">
      {/* Steps */}
      <div className="checkout-steps">
        {STEPS.map((s, i) => (
          <div key={s} className={`checkout-step ${i === step ? "active" : i < step ? "done" : ""}`}>
            <div className="step-num">{i < step ? <FiCheck size={14} /> : i + 1}</div>
            <span>{s}</span>
            {i < STEPS.length - 1 && <div className="step-connector" />}
          </div>
        ))}
      </div>

      <div className="checkout-layout">
        {/* Left: Form */}
        <div className="checkout-form-area">
          {/* Step 0: Address */}
          {step === 0 && (
            <div className="checkout-card animate-fade-in">
              <div className="checkout-card-header">
                <FiMapPin size={18} color="#2874f0" />
                <h2>Delivery Address</h2>
              </div>
              <div className="address-form">
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={address.name}
                    onChange={(e) => setAddress({ ...address, name: e.target.value })}
                    className="form-input"
                    id="addr-name"
                  />
                  <input
                    type="tel"
                    placeholder="10-digit mobile number *"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="form-input"
                    id="addr-phone"
                  />
                </div>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Pincode *"
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    className="form-input"
                    id="addr-pincode"
                  />
                  <input
                    type="text"
                    placeholder="Locality"
                    className="form-input"
                    id="addr-locality"
                  />
                </div>
                <textarea
                  placeholder="Address (Area and Street) *"
                  value={address.address}
                  onChange={(e) => setAddress({ ...address, address: e.target.value })}
                  className="form-input form-textarea"
                  id="addr-address"
                />
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="City/District/Town *"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="form-input"
                    id="addr-city"
                  />
                  <select
                    className="form-input"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    id="addr-state"
                  >
                    <option value="">--State--</option>
                    {["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Uttar Pradesh", "Gujarat", "Rajasthan", "West Bengal"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="addr-type-row">
                  <span className="addr-type-label">Address Type</span>
                  {["Home", "Work"].map((t) => (
                    <label key={t} className="addr-type-option">
                      <input
                        type="radio"
                        name="addrType"
                        value={t}
                        checked={address.type === t}
                        onChange={() => setAddress({ ...address, type: t })}
                        id={`addr-type-${t}`}
                      />
                      {t}
                    </label>
                  ))}
                </div>
                <button
                  className="checkout-continue-btn"
                  onClick={() => setStep(1)}
                  disabled={!address.name || !address.phone || !address.pincode}
                  id="addr-continue-btn"
                >
                  DELIVER HERE
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Order Summary */}
          {step === 1 && (
            <div className="checkout-card animate-fade-in">
              <div className="checkout-card-header">
                <FiPackage size={18} color="#2874f0" />
                <h2>Order Summary</h2>
              </div>
              <div className="order-summary-items">
                {items.map((item) => {
                  const itemId = item._id || item.id;
                  return (
                    <div key={itemId} className="order-summary-item">
                      <img src={item.image} alt={item.name} className="order-summary-img" />
                      <div className="order-summary-info">
                        <p className="order-summary-name">{item.name}</p>
                        <p className="order-summary-qty">Qty: {item.quantity}</p>
                      </div>
                      <span className="order-summary-price">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="checkout-actions">
                <button className="btn btn-ghost" onClick={() => setStep(0)} id="back-to-addr-btn">Back</button>
                <button className="checkout-continue-btn" onClick={() => setStep(2)} id="continue-to-payment-btn">
                  CONTINUE
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="checkout-card animate-fade-in">
              <div className="checkout-card-header">
                <FiCreditCard size={18} color="#2874f0" />
                <h2>Payment Options</h2>
              </div>
              <div className="payment-methods">
                {[
                  { id: "upi", label: "UPI", icon: "📱" },
                  { id: "card", label: "Credit/Debit Card", icon: "💳" },
                  { id: "netbanking", label: "Net Banking", icon: "🏦" },
                  { id: "cod", label: "Cash on Delivery", icon: "💵" },
                ].map((m) => (
                  <label key={m.id} className={`payment-method ${payMethod === m.id ? "active" : ""}`}>
                    <input
                      type="radio"
                      name="payment"
                      value={m.id}
                      checked={payMethod === m.id}
                      onChange={() => setPayMethod(m.id)}
                      id={`pay-${m.id}`}
                    />
                    <span className="pay-icon">{m.icon}</span>
                    <span>{m.label}</span>
                  </label>
                ))}
              </div>

              {payMethod === "upi" && (
                <div className="payment-form animate-fade-in">
                  <input
                    type="text"
                    placeholder="Enter UPI ID (e.g. name@upi)"
                    value={upi}
                    onChange={(e) => setUpi(e.target.value)}
                    className="form-input"
                    id="upi-input"
                  />
                </div>
              )}

              {payMethod === "card" && (
                <div className="payment-form animate-fade-in">
                  <input type="text" placeholder="Card Number" className="form-input" id="card-number" />
                  <div className="form-row">
                    <input type="text" placeholder="Expiry MM/YY" className="form-input" id="card-expiry" />
                    <input type="text" placeholder="CVV" className="form-input" id="card-cvv" />
                  </div>
                  <input type="text" placeholder="Name on Card" className="form-input" id="card-name" />
                </div>
              )}

              {error && <p className="login-error" style={{ margin: "16px 20px 0" }}>{error}</p>}

              <div className="checkout-actions">
                <button className="btn btn-ghost" onClick={() => setStep(1)} id="back-to-summary-btn" disabled={loading}>Back</button>
                <button className="checkout-continue-btn" onClick={handlePlaceOrder} id="place-order-final-btn" disabled={loading}>
                  {loading ? "PLACING ORDER..." : `PAY ${formatPrice(finalTotal)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Price Summary */}
        <div className="checkout-summary">
          <h3 className="checkout-summary-title">PRICE DETAILS</h3>
          <div className="checkout-summary-rows">
            <div className="summary-row">
              <span>Price ({items.length} items)</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Charges</span>
              <span className={deliveryCharge === 0 ? "text-green" : ""}>
                {deliveryCharge === 0 ? "FREE" : formatPrice(deliveryCharge)}
              </span>
            </div>
          </div>
          <div className="checkout-summary-divider" />
          <div className="summary-row total">
            <span>Total Payable</span>
            <span>{formatPrice(finalTotal)}</span>
          </div>
          <div className="checkout-summary-divider" />
          <div className="checkout-secure">
            🔒 Safe and Secure Payments. 100% Authentic products.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
