import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  selectProducts,
  setSearchQuery,
  setCategory,
  setSortBy,
  setPriceRange,
  setMinRating,
  resetFilters,
  fetchProducts,
} from "../../redux/productSlice";
import ProductCard from "../../components/ProductCard/ProductCard";
import "./ProductList.css";

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price_asc", label: "Price -- Low to High" },
  { value: "price_desc", label: "Price -- High to Low" },
  { value: "rating", label: "Rating" },
  { value: "discount", label: "Discount" },
];

const RATING_OPTIONS = [4, 3, 2, 1];

const ProductList = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const products = useSelector(selectProducts);
  const { sortBy, minRating, priceRange, searchQuery, selectedCategory, loading } = useSelector((state) => state.products);

  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";

  // Reset filters and load initial category/keyword from query params
  useEffect(() => {
    dispatch(resetFilters());
    if (q) dispatch(setSearchQuery(q));
    if (category) {
      const mapped = category.split(" ")[0];
      dispatch(setCategory(mapped));
    }
  }, [q, category, dispatch]);

  // Fetch products reactively when filter state updates
  useEffect(() => {
    dispatch(
      fetchProducts({
        keyword: searchQuery,
        category: selectedCategory === "All" ? "" : selectedCategory,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        minRating: minRating || undefined,
        sortBy,
      })
    );
  }, [dispatch, searchQuery, selectedCategory, priceRange, minRating, sortBy]);

  return (
    <div className="product-list-page animate-fade-in">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">Filters</h2>
          <button
            className="sidebar-clear"
            onClick={() => dispatch(resetFilters())}
            id="clear-filters-btn"
          >
            CLEAR ALL
          </button>
        </div>

        {/* Sort */}
        <div className="sidebar-section">
          <h3 className="sidebar-section-title">SORT BY</h3>
          {SORT_OPTIONS.map((opt) => (
            <label key={opt.value} className="sidebar-radio-label">
              <input
                type="radio"
                name="sort"
                value={opt.value}
                checked={sortBy === opt.value}
                onChange={() => dispatch(setSortBy(opt.value))}
                className="sidebar-radio"
                id={`sort-${opt.value}`}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>

        {/* Price Range */}
        <div className="sidebar-section">
          <h3 className="sidebar-section-title">PRICE RANGE</h3>
          <div className="sidebar-price">
            <span>₹{priceRange[0].toLocaleString()}</span>
            <span>₹{priceRange[1].toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={0}
            max={200000}
            step={1000}
            value={priceRange[1]}
            onChange={(e) => dispatch(setPriceRange([priceRange[0], parseInt(e.target.value)]))}
            className="price-slider"
            id="price-range-slider"
          />
          <div className="sidebar-price-presets">
            {[
              [0, 500, "Under ₹500"],
              [500, 2000, "₹500–₹2K"],
              [2000, 10000, "₹2K–₹10K"],
              [10000, 50000, "₹10K–₹50K"],
              [50000, 200000, "₹50K+"],
            ].map(([min, max, label]) => (
              <button
                key={label}
                className={`price-preset ${priceRange[0] === min && priceRange[1] === max ? "active" : ""}`}
                onClick={() => dispatch(setPriceRange([min, max]))}
                id={`price-preset-${label.replace(/\s+/g, "-")}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div className="sidebar-section">
          <h3 className="sidebar-section-title">CUSTOMER RATINGS</h3>
          {RATING_OPTIONS.map((r) => (
            <label key={r} className="sidebar-radio-label">
              <input
                type="radio"
                name="rating"
                checked={minRating === r}
                onChange={() => dispatch(setMinRating(minRating === r ? 0 : r))}
                className="sidebar-radio"
                id={`rating-${r}`}
              />
              <span className="rating-option">
                {Array(r).fill("★").join("")}{"☆".repeat(5 - r)}&nbsp;& Above
              </span>
            </label>
          ))}
        </div>
      </aside>

      {/* Main */}
      <div className="product-list-main">
        {/* Result Header */}
        <div className="product-list-header">
          <div>
            <h1 className="product-list-query">
              {q ? `Results for "${q}"` : category ? category : "All Products"}
            </h1>
            <p className="product-list-count">{products.length} results found</p>
          </div>
          <div className="sort-bar">
            <span className="sort-label">Sort By</span>
            {SORT_OPTIONS.slice(0, 4).map((opt) => (
              <button
                key={opt.value}
                className={`sort-btn ${sortBy === opt.value ? "active" : ""}`}
                onClick={() => dispatch(setSortBy(opt.value))}
                id={`top-sort-${opt.value}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products */}
        {loading ? (
          <div className="product-list-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 320, borderRadius: 4 }}></div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="no-products">
            <div className="no-products-icon">🔍</div>
            <h2>No products found</h2>
            <p>Try adjusting your filters or search for something else</p>
            <button onClick={() => dispatch(resetFilters())} className="btn btn-primary">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="product-list-grid">
            {products.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
