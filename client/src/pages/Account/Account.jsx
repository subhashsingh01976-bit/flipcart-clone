import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { FiUser, FiPackage, FiHeart, FiMapPin, FiCreditCard, FiLogOut } from "react-icons/fi";
import { selectUser, logout } from "../../redux/authSlice";
import "./Account.css";

const Account = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const navItems = [
    { icon: <FiPackage />, label: "My Orders", link: "/orders" },
    { icon: <FiHeart />, label: "My Wishlist", link: "/" },
    { icon: <FiMapPin />, label: "My Addresses", link: "/" },
    { icon: <FiCreditCard />, label: "Saved Cards", link: "/" },
  ];

  if (!user) {
    return (
      <div className="account-login-prompt animate-fade-in">
        <FiUser size={60} color="#e0e0e0" />
        <h2>Please login to view your account</h2>
        <Link to="/login" className="btn btn-primary">Login</Link>
      </div>
    );
  }

  return (
    <div className="account-page animate-fade-in">
      <div className="account-layout">
        {/* Sidebar */}
        <aside className="account-sidebar">
          <div className="account-profile-card">
            <img
              src={user.avatar}
              alt={user.name}
              className="account-avatar"
              onError={(e) => (e.target.src = `https://ui-avatars.com/api/?name=${user.name}&background=2874f0&color=fff`)}
            />
            <div>
              <p className="account-welcome">Hello,</p>
              <p className="account-name">{user.name}</p>
            </div>
          </div>

          <nav className="account-nav">
            {navItems.map((item) => (
              <Link to={item.link} key={item.label} className="account-nav-item">
                <span className="account-nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            <button
              className="account-nav-item account-logout"
              onClick={() => dispatch(logout())}
              id="account-logout-btn"
            >
              <span className="account-nav-icon"><FiLogOut /></span>
              Logout
            </button>
          </nav>
        </aside>

        {/* Main */}
        <div className="account-main">
          {/* Profile Info */}
          <div className="account-card">
            <div className="account-card-header">
              <h2>Personal Information</h2>
              <button className="edit-btn" id="edit-profile-btn">Edit</button>
            </div>
            <div className="account-info-grid">
              <div className="info-item">
                <label>Full Name</label>
                <p>{user.name}</p>
              </div>
              <div className="info-item">
                <label>Email Address</label>
                <p>{user.email}</p>
              </div>
              <div className="info-item">
                <label>Mobile Number</label>
                <p>{user.phone || "Not added"}</p>
              </div>
              <div className="info-item">
                <label>Gender</label>
                <p>Not specified</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="account-quick-links">
            {navItems.map((item) => (
              <Link to={item.link} key={item.label} className="quick-link-card">
                <span className="quick-link-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* SuperCoins */}
          <div className="account-card supercoins-card">
            <div className="supercoins-left">
              <h3>🪙 SuperCoins Balance</h3>
              <p className="supercoins-count">0 <span>Coins</span></p>
              <p className="supercoins-sub">Earn coins on every purchase</p>
            </div>
            <div className="supercoins-right">
              <Link to="/" className="btn btn-outline">Explore Benefits</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
