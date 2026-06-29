import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiChevronDown,
  FiLogOut,
  FiPackage,
  FiHeart,
  FiMapPin,
} from "react-icons/fi";
import { selectCartCount } from "../../redux/cartSlice";
import { selectIsLoggedIn, selectUser, logout } from "../../redux/authSlice";
import { setSearchQuery, setCategory } from "../../redux/productSlice";
import { navCategories } from "../../data/categories";
import "./Navbar.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartCount = useSelector(selectCartCount);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectUser);
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      dispatch(setSearchQuery(query.trim()));
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    const mapped = cat === "All" ? "All" : cat.split(" ")[0];
    dispatch(setCategory(mapped));
    navigate(`/search?category=${encodeURIComponent(cat)}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowDropdown(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      {/* Top Bar */}
      <div className="navbar-top">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-text">Flipkart</span>
          <span className="navbar-logo-sub">
            <em>Explore</em>&nbsp;<span>Plus</span>&nbsp;
            <img
              src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/plus_aef861-5cb286.png"
              alt="plus"
              style={{ width: 10, height: 10, display: "inline" }}
              onError={(e) => (e.target.style.display = "none")}
            />
          </span>
        </Link>

        {/* Search */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            className="navbar-search-input"
            type="text"
            placeholder="Search for products, brands and more"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            id="navbar-search-input"
          />
          <button type="submit" className="navbar-search-btn" id="navbar-search-btn">
            <FiSearch />
          </button>
        </form>

        {/* Actions */}
        <div className="navbar-actions">
          {/* Login / Profile */}
          {isLoggedIn ? (
            <div className="nav-dropdown" ref={dropdownRef}>
              <button
                className="nav-btn"
                onClick={() => setShowDropdown(!showDropdown)}
                id="navbar-profile-btn"
              >
                <FiUser size={16} />
                <span>{user?.name?.split(" ")[0] || "Account"}</span>
                <FiChevronDown size={14} />
              </button>
              {showDropdown && (
                <div className="nav-dropdown-menu">
                  <Link
                    to="/account"
                    className="nav-dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    <FiUser size={15} /> My Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="nav-dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    <FiPackage size={15} /> My Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    className="nav-dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    <FiHeart size={15} /> Wishlist
                  </Link>
                  <div className="nav-dropdown-divider" />
                  <button className="nav-dropdown-item" onClick={handleLogout} id="navbar-logout-btn">
                    <FiLogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="nav-btn nav-btn-login" id="navbar-login-btn">
              Login
            </Link>
          )}

          {/* Become Seller */}
          <Link to="/" className="nav-btn" id="navbar-seller-btn">
            <span>Become a Seller</span>
          </Link>

          {/* More */}
          <button className="nav-btn" id="navbar-more-btn">
            <span>More</span>
            <FiChevronDown size={14} />
          </button>

          {/* Cart */}
          <Link to="/cart" className="nav-cart" id="navbar-cart-btn">
            <FiShoppingCart size={20} />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="nav-cart-count">{cartCount > 9 ? "9+" : cartCount}</span>
            )}
          </Link>
        </div>
      </div>

      {/* Category Bar */}
      <div className="category-bar">
        <div className="category-bar-inner">
          {navCategories.map((cat) => (
            <button
              key={cat}
              className={`cat-item ${activeCategory === cat ? "active" : ""}`}
              onClick={() => handleCategoryClick(cat)}
              id={`cat-${cat.replace(/\s+/g, "-").toLowerCase()}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
