import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FiTrash2, FiMinus, FiPlus, FiShoppingCart } from "react-icons/fi";
import {
  selectCartItems,
  selectCartTotal,
  removeFromCart,
  updateQuantity,
} from "../../redux/cartSlice";
import "./Cart.css";

const formatPrice = (p) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(p);

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  const totalOriginal = items.reduce(
    (sum, item) => sum + (item.originalPrice || item.price) * item.quantity,
    0
  );
  const totalDiscount = totalOriginal - total;
  const deliveryCharge = total > 500 ? 0 : 40;
  const finalTotal = total + deliveryCharge;

  if (items.length === 0) {
    return (
      <div className="cart-empty animate-fade-in">
        <div className="cart-empty-icon">
          <FiShoppingCart size={80} color="#e0e0e0" />
        </div>
        <h2>Your cart is empty!</h2>
        <p>Add items to it now.</p>
        <Link to="/" className="btn btn-primary">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="cart-page animate-fade-in">
      <div className="cart-layout">
        {/* Cart Items */}
        <div className="cart-items-wrap">
          <div className="cart-items-header">
            <h1 className="cart-title">My Cart ({items.length} items)</h1>
          </div>

          {items.map((item) => {
            const itemId = item._id || item.id;
            return (
              <div className="cart-item" key={itemId} id={`cart-item-${itemId}`}>
                <Link to={`/product/${itemId}`} className="cart-item-img-wrap">
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                </Link>

                <div className="cart-item-info">
                  <Link to={`/product/${itemId}`} className="cart-item-name">{item.name}</Link>
                  <p className="cart-item-brand">{item.brand}</p>
                  {item.assured && (
                    <div className="cart-item-assured">
                      <span style={{ color: "#2874f0", fontSize: 11, fontWeight: 700 }}>flipkart</span>
                      <span style={{ color: "#fb641b", fontSize: 11, fontWeight: 700 }}>assured</span>
                    </div>
                  )}
                  <p className="cart-item-seller">Seller: {item.seller}</p>
                  <div className="cart-item-price-row">
                    <span className="cart-item-price">{formatPrice(item.price)}</span>
                    {item.originalPrice > item.price && (
                      <>
                        <span className="cart-item-original">{formatPrice(item.originalPrice)}</span>
                        <span className="cart-item-discount">{item.discount}% off</span>
                      </>
                    )}
                  </div>
                  <div className="cart-item-delivery">
                    {item.freeDelivery ? "✓ Free Delivery" : "Delivery charges apply"}
                  </div>
                </div>

                {/* Quantity + Remove */}
                <div className="cart-item-actions">
                  <div className="cart-qty">
                    <button
                      className="cart-qty-btn"
                      onClick={() => dispatch(updateQuantity({ id: itemId, quantity: item.quantity - 1 }))}
                      id={`cart-qty-minus-${itemId}`}
                    >
                      <FiMinus size={12} />
                    </button>
                    <span className="cart-qty-num">{item.quantity}</span>
                    <button
                      className="cart-qty-btn"
                      onClick={() => dispatch(updateQuantity({ id: itemId, quantity: item.quantity + 1 }))}
                      id={`cart-qty-plus-${itemId}`}
                    >
                      <FiPlus size={12} />
                    </button>
                  </div>
                  <button
                    className="cart-remove-btn"
                    onClick={() => dispatch(removeFromCart(itemId))}
                    id={`cart-remove-${itemId}`}
                  >
                    <FiTrash2 size={14} />
                    Remove
                  </button>
                </div>
              </div>
            );
          })}

          {/* Place Order Button */}
          <div className="cart-place-order-bar">
            <button className="btn-place-order" onClick={() => navigate("/checkout")} id="place-order-btn">
              PLACE ORDER
            </button>
          </div>
        </div>

        {/* Price Summary */}
        <div className="cart-summary">
          <h2 className="cart-summary-title">PRICE DETAILS</h2>
          <div className="cart-summary-rows">
            <div className="summary-row">
              <span>Price ({items.length} items)</span>
              <span>{formatPrice(totalOriginal)}</span>
            </div>
            <div className="summary-row discount">
              <span>Discount</span>
              <span className="text-green">− {formatPrice(totalDiscount)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Charges</span>
              <span className={deliveryCharge === 0 ? "text-green" : ""}>
                {deliveryCharge === 0 ? "FREE" : formatPrice(deliveryCharge)}
              </span>
            </div>
          </div>
          <div className="cart-summary-divider" />
          <div className="summary-row total">
            <span>Total Amount</span>
            <span>{formatPrice(finalTotal)}</span>
          </div>
          <div className="cart-summary-divider" />
          <p className="cart-summary-savings">
            You will save {formatPrice(totalDiscount)} on this order
          </p>

          <div className="cart-summary-safe">
            🔒 Safe and Secure Payments. Easy returns. 100% Authentic products.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
