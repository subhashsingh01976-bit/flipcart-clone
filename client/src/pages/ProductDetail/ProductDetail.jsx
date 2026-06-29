import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiShoppingCart,
  FiZap,
  FiHeart,
  FiShare2,
  FiChevronRight,
  FiTruck,
  FiShield,
  FiRefreshCw,
} from "react-icons/fi";
import { addToCart } from "../../redux/cartSlice";
import { toggleWishlist, selectWishlist } from "../../redux/productSlice";
import StarRating from "../../components/StarRating/StarRating";
import ProductCard from "../../components/ProductCard/ProductCard";
import { productAPI } from "../../services/api";
import "./ProductDetail.css";

const formatPrice = (p) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(p);

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const wishlist = useSelector(selectWishlist);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await productAPI.getProduct(id);
        const prod = response.data.product;
        setProduct(prod);
        setSelectedImg(0);

        // Fetch related products in the same category
        if (prod.category) {
          const relatedResponse = await productAPI.getProducts({
            category: prod.category,
            limit: 5,
          });
          // Filter out current product
          const filtered = relatedResponse.data.products.filter(
            (p) => p._id !== prod._id
          );
          setRelatedProducts(filtered);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="product-detail-page animate-fade-in" style={{ padding: "40px 12px" }}>
        <div className="skeleton" style={{ height: 400, borderRadius: 8, marginBottom: 20 }}></div>
        <div className="skeleton" style={{ height: 200, borderRadius: 8 }}></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="not-found">
        <h2>Product not found</h2>
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product._id || product.id);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const allImages = product.images?.length > 0 ? product.images : [product.image];

  return (
    <div className="product-detail-page animate-fade-in">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to="/">Home</Link>
        <FiChevronRight size={12} />
        <Link to={`/search?category=${product.category}`}>{product.category}</Link>
        <FiChevronRight size={12} />
        <span>{product.brand}</span>
        <FiChevronRight size={12} />
        <span className="breadcrumb-current">{product.name.slice(0, 40)}...</span>
      </nav>

      <div className="product-detail-layout">
        {/* Left: Images */}
        <div className="product-detail-images">
          <div className="product-img-thumbs">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                className={`thumb-btn ${idx === selectedImg ? "active" : ""}`}
                onClick={() => setSelectedImg(idx)}
                id={`thumb-${idx}`}
              >
                <img src={img} alt={`view ${idx + 1}`} />
              </button>
            ))}
          </div>
          <div className="product-img-main">
            <img src={allImages[selectedImg]} alt={product.name} />
          </div>

          {/* Sticky Action Buttons */}
          <div className="product-detail-sticky-actions">
            <button
              className="btn-detail btn-cart"
              onClick={handleAddToCart}
              id="add-to-cart-btn"
            >
              <FiShoppingCart size={18} />
              {added ? "Added to Cart!" : "ADD TO CART"}
            </button>
            <Link to="/checkout" className="btn-detail btn-buy" id="buy-now-btn">
              <FiZap size={18} />
              BUY NOW
            </Link>
          </div>
        </div>

        {/* Right: Info */}
        <div className="product-detail-info">
          <div className="product-detail-brand">{product.brand}</div>
          <h1 className="product-detail-name">{product.name}</h1>

          {/* Rating */}
          <div className="product-detail-rating">
            <StarRating rating={product.rating} />
            <span className="product-detail-reviews">
              {product.numReviews?.toLocaleString() || 0} Ratings & Reviews
            </span>
          </div>

          {/* Assured */}
          {product.assured && (
            <div className="product-detail-assured">
              <span className="assured-text-fk">flipkart</span>
              <span className="assured-text-label">assured</span>
            </div>
          )}

          {/* Price */}
          <div className="product-detail-price-block">
            <span className="product-detail-price">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="product-detail-original">{formatPrice(product.originalPrice)}</span>
                <span className="product-detail-discount">{product.discount}% off</span>
              </>
            )}
          </div>

          {/* Available offers */}
          <div className="product-detail-offers">
            <h3 className="offers-title">Available offers</h3>
            <ul className="offers-list">
              <li>
                <span className="offer-tag">Bank Offer</span> 10% off on HDFC Bank Credit Card, up to ₹1,500.
              </li>
              <li>
                <span className="offer-tag">Special Price</span> Extra {product.discount}% off
              </li>
              <li>
                <span className="offer-tag">No Cost EMI</span> ₹{Math.round(product.price / 12).toLocaleString()}/month. Standard EMI also available
              </li>
              <li>
                <span className="offer-tag">Partner Offer</span> Sign up for Flipkart Pay Later and get Flipkart Gift Card worth ₹100
              </li>
            </ul>
          </div>

          {/* Delivery */}
          <div className="product-detail-delivery">
            <FiTruck size={15} />
            <div>
              <strong>{product.freeDelivery ? "FREE Delivery" : "Paid Delivery"}</strong>
              <p>by Tomorrow | Details</p>
            </div>
          </div>

          {/* Highlights */}
          <div className="product-detail-highlights">
            <h3>Highlights</h3>
            <ul>
              {product.highlights?.map((h, i) => (
                <li key={i}>
                  <span className="highlight-dot">•</span> {h}
                </li>
              ))}
            </ul>
          </div>

          {/* Seller */}
          <div className="product-detail-seller">
            <span className="seller-label">Seller</span>
            <span className="seller-name">{product.seller}</span>
          </div>

          {/* Description */}
          <div className="product-detail-desc">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {/* Specs */}
          {product.specs && (
            <div className="product-detail-specs">
              <h3>Specifications</h3>
              <table className="specs-table">
                <tbody>
                  {Object.entries(product.specs).map(([key, val]) => (
                    <tr key={key}>
                      <td className="spec-key">{key}</td>
                      <td className="spec-val">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Trust Badges */}
          <div className="product-detail-trust">
            <div className="trust-item">
              <FiShield size={20} color="#2874f0" />
              <span>7 Day Replacement</span>
            </div>
            <div className="trust-item">
              <FiRefreshCw size={20} color="#2874f0" />
              <span>Easy Returns</span>
            </div>
            <div className="trust-item">
              <FiShield size={20} color="#388e3c" />
              <span>Secure Payment</span>
            </div>
          </div>

          {/* Wishlist + Share */}
          <div className="product-detail-secondary">
            <button
              className="btn-secondary"
              onClick={() => dispatch(toggleWishlist(product._id || product.id))}
              id="wishlist-detail-btn"
            >
              <FiHeart
                size={16}
                fill={isWishlisted ? "#ff3f6c" : "none"}
                color={isWishlisted ? "#ff3f6c" : "currentColor"}
              />
              {isWishlisted ? "Wishlisted" : "Wishlist"}
            </button>
            <button className="btn-secondary" id="share-btn">
              <FiShare2 size={16} />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="product-detail-related">
          <div className="home-section-header" style={{ padding: "16px 20px 12px" }}>
            <h2 className="home-section-title">Similar Products</h2>
          </div>
          <div className="product-grid">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id || p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
