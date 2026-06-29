import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { addToCart } from "../../redux/cartSlice";
import { toggleWishlist, selectWishlist } from "../../redux/productSlice";
import StarRating from "../StarRating/StarRating";
import "./ProductCard.css";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const wishlist = useSelector(selectWishlist);
  const prodId = product._id || product.id;
  const isWishlisted = wishlist.includes(prodId);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart(product));
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(prodId));
  };

  const numReviews = product.numReviews !== undefined 
    ? product.numReviews 
    : (Array.isArray(product.reviews) ? product.reviews.length : (product.reviews || 0));

  return (
    <Link to={`/product/${prodId}`} className="product-card" id={`product-card-${prodId}`}>
      {/* Discount Badge */}
      {product.discount > 0 && (
        <div className="product-card-discount">{product.discount}% off</div>
      )}

      {/* Wishlist */}
      <button
        className={`product-card-wishlist ${isWishlisted ? "active" : ""}`}
        onClick={handleWishlist}
        id={`wishlist-btn-${prodId}`}
        aria-label="Add to wishlist"
      >
        <FiHeart size={16} fill={isWishlisted ? "#ff3f6c" : "none"} color={isWishlisted ? "#ff3f6c" : "#878787"} />
      </button>

      {/* Image */}
      <div className="product-card-img-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="product-card-img"
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div className="product-card-body">
        <h3 className="product-card-name">{product.name}</h3>

        {/* Rating */}
        <div className="product-card-rating">
          <StarRating rating={product.rating} compact />
          <span className="product-card-reviews">({numReviews.toLocaleString()})</span>
        </div>

        {/* Price */}
        <div className="product-card-pricing">
          <span className="product-card-price">{formatPrice(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="product-card-original">{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        {/* Assured */}
        {product.assured && (
          <div className="product-card-assured">
            <span className="assured-fk">flipkart</span>
            <span className="assured-label">assured</span>
          </div>
        )}

        {/* Delivery */}
        <p className="product-card-delivery">
          {product.freeDelivery ? "✓ Free Delivery" : "Delivery charges apply"}
        </p>
      </div>

      {/* Hover: Add to Cart */}
      <div className="product-card-hover-actions">
        <button
          className="product-card-cart-btn"
          onClick={handleAddToCart}
          id={`cart-btn-${prodId}`}
        >
          <FiShoppingCart size={15} />
          Add to Cart
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
