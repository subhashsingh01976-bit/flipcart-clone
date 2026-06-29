import { useState, useEffect } from "react";
import { FiPackage, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { orderAPI } from "../../services/api";
import "./Orders.css";

const formatPrice = (p) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(p);

const getStatusColor = (status) => {
  switch (status) {
    case "Delivered":
      return "#388e3c";
    case "Processing":
    case "Confirmed":
    case "Shipped":
    case "Out for Delivery":
      return "#ff9f00";
    case "Cancelled":
    case "Returned":
      return "#ff6161";
    default:
      return "#878787";
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getMyOrders();
      setOrders(response.data.orders);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await orderAPI.cancelOrder(orderId);
        fetchOrders();
      } catch (err) {
        alert(err.response?.data?.message || "Could not cancel order");
      }
    }
  };

  return (
    <div className="orders-page animate-fade-in">
      <div className="orders-layout">
        {/* Sidebar */}
        <aside className="orders-sidebar">
          <div className="orders-sidebar-header">
            <FiPackage size={18} />
            <div>
              <p className="sidebar-user-label">My Orders</p>
            </div>
          </div>
          <nav className="orders-nav">
            {["Orders", "My Profile", "SuperCoins", "Flipkart Plus Zone", "Saved Cards", "Saved Addresses", "Notifications", "Privacy"].map((item) => (
              <Link to="#" key={item} className="orders-nav-item">
                {item}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <div className="orders-main">
          <h1 className="orders-title">My Orders</h1>

          {loading ? (
            <div className="skeleton" style={{ height: 300, borderRadius: 4 }}></div>
          ) : error ? (
            <div className="orders-empty">
              <h2>Something went wrong</h2>
              <p>{error}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="orders-empty">
              <FiPackage size={60} color="#e0e0e0" />
              <h2>No orders yet</h2>
              <p>You haven't placed any orders</p>
              <Link to="/" className="btn btn-primary">Start Shopping</Link>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div className="order-card" key={order._id} id={`order-${order._id}`}>
                  {/* Order header */}
                  <div className="order-card-header">
                    <div>
                      <span className="order-id">Order #{order.trackingId || order._id}</span>
                      <span className="order-date">Placed on {formatDate(order.createdAt)}</span>
                    </div>
                    <span className="order-status" style={{ color: getStatusColor(order.status) }}>
                      ● {order.status}
                    </span>
                  </div>

                  {/* Items */}
                  {order.orderItems.map((item) => {
                    const productId = item.product?._id || item.product;
                    return (
                      <div className="order-item" key={item._id || productId}>
                        <img src={item.image} alt={item.name} className="order-item-img" />
                        <div className="order-item-info">
                          <p className="order-item-name">{item.name}</p>
                          <p className="order-item-qty">Qty: {item.quantity}</p>
                          <p className="order-item-price">{formatPrice(item.price)}</p>
                        </div>
                        <div className="order-item-actions">
                          {productId && (
                            <Link to={`/product/${productId}`} className="order-action-btn">
                              Buy Again
                            </Link>
                          )}
                          {order.status === "Delivered" && (
                            <button className="order-action-btn" id={`rate-btn-${item._id}`}>
                              Rate & Review
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Order footer */}
                  <div className="order-card-footer">
                    <span className="order-total">Total: {formatPrice(order.totalPrice)}</span>
                    <div style={{ display: "flex", gap: 12 }}>
                      {["Processing", "Confirmed"].includes(order.status) && (
                        <button
                          className="btn btn-outline"
                          style={{ padding: "6px 14px", fontSize: 13 }}
                          onClick={() => handleCancelOrder(order._id)}
                          id={`cancel-order-${order._id}`}
                        >
                          Cancel Order
                        </button>
                      )}
                      <button className="order-detail-btn" id={`order-detail-${order._id}`}>
                        View Details <FiChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
