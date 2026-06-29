import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCategory } from "../../redux/productSlice";
import HeroBanner from "../../components/HeroBanner/HeroBanner";
import ProductCard from "../../components/ProductCard/ProductCard";
import { categories } from "../../data/categories";
import { productAPI } from "../../services/api";
import "./Home.css";

const Home = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        const response = await productAPI.getProducts({ limit: 40 });
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching homepage products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeProducts();
  }, []);

  const handleCategoryClick = (name) => {
    dispatch(setCategory(name));
  };

  const electronicsProducts = products.filter((p) => p.category === "Electronics").slice(0, 5);
  const fashionProducts = products.filter((p) => p.category === "Fashion").slice(0, 5);
  const topOffers = [...products].sort((a, b) => b.discount - a.discount).slice(0, 10);

  return (
    <div className="home-page animate-fade-in">
      {/* Hero Section */}
      <div className="home-hero">
        <HeroBanner />
      </div>

      {/* Categories Section */}
      <section className="home-section categories-section">
        <div className="home-section-header">
          <h2 className="home-section-title">Shop by Category</h2>
          <Link to="/search" className="home-section-link">View All →</Link>
        </div>
        <div className="categories-grid">
          {categories.map((cat) => (
            <Link
              to={`/search?category=${cat.name}`}
              key={cat.id}
              className="category-tile"
              onClick={() => handleCategoryClick(cat.name)}
              id={`home-cat-${cat.id}`}
            >
              <div className="category-tile-icon" style={{ background: `${cat.color}15`, border: `2px solid ${cat.color}30` }}>
                <span className="category-tile-emoji">{cat.icon}</span>
              </div>
              <span className="category-tile-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {loading ? (
        <div className="container" style={{ padding: "40px 0", textAlign: "center" }}>
          <div className="skeleton" style={{ height: 200, marginBottom: 20 }}></div>
          <div className="skeleton" style={{ height: 200 }}></div>
        </div>
      ) : (
        <>
          {/* Top Deals Section */}
          <section className="home-section">
            <div className="home-section-header">
              <h2 className="home-section-title">Best Deals Today</h2>
              <Link to="/search" className="home-section-link">See All →</Link>
            </div>
            <div className="home-products-row">
              {topOffers.slice(0, 5).map((product) => (
                <div className="home-product-item" key={product._id || product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </section>

          {/* Promo Banners Row */}
          <div className="home-promo-row">
            <Link to="/search?category=Fashion" className="promo-banner promo-fashion">
              <div className="promo-content">
                <h3>Fashion Week</h3>
                <p>Up to 70% off on top brands</p>
                <span className="promo-cta">Shop Now →</span>
              </div>
              <div className="promo-bg-emoji">👗</div>
            </Link>
            <Link to="/search?category=Electronics" className="promo-banner promo-electronics">
              <div className="promo-content">
                <h3>Tech Deals</h3>
                <p>Best prices on gadgets</p>
                <span className="promo-cta">Explore →</span>
              </div>
              <div className="promo-bg-emoji">💻</div>
            </Link>
            <Link to="/search?category=Home" className="promo-banner promo-home">
              <div className="promo-content">
                <h3>Home Essentials</h3>
                <p>Transform your space</p>
                <span className="promo-cta">Discover →</span>
              </div>
              <div className="promo-bg-emoji">🏠</div>
            </Link>
          </div>

          {/* Electronics Section */}
          {electronicsProducts.length > 0 && (
            <section className="home-section">
              <div className="home-section-header">
                <h2 className="home-section-title">🔌 Electronics</h2>
                <Link to="/search?category=Electronics" className="home-section-link">View All Electronics →</Link>
              </div>
              <div className="home-products-row">
                {electronicsProducts.map((product) => (
                  <div className="home-product-item" key={product._id || product.id}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Fashion Section */}
          {fashionProducts.length > 0 && (
            <section className="home-section">
              <div className="home-section-header">
                <h2 className="home-section-title">👗 Fashion</h2>
                <Link to="/search?category=Fashion" className="home-section-link">View All Fashion →</Link>
              </div>
              <div className="home-products-row">
                {fashionProducts.map((product) => (
                  <div className="home-product-item" key={product._id || product.id}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Full Grid: Top Offers */}
          <section className="home-section">
            <div className="home-section-header">
              <h2 className="home-section-title">🔥 Top Offers</h2>
              <Link to="/search" className="home-section-link">See All →</Link>
            </div>
            <div className="product-grid">
              {topOffers.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Home;
