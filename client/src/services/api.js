import axios from "axios";

// Base URL — Vite proxy handles /api → backend
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const user = localStorage.getItem("flipkart_user");
  if (user) {
    const parsed = JSON.parse(user);
    if (parsed.token) {
      config.headers.Authorization = `Bearer ${parsed.token}`;
    }
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("flipkart_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ─── Auth APIs ─────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post("/users/register", data),
  login: (data) => api.post("/users/login", data),
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data) => api.put("/users/profile", data),
  addAddress: (data) => api.post("/users/address", data),
  deleteAddress: (id) => api.delete(`/users/address/${id}`),
  toggleWishlist: (productId) => api.put(`/users/wishlist/${productId}`),
};

// ─── Product APIs ──────────────────────────────────────────────────
export const productAPI = {
  getProducts: (params) => api.get("/products", { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  getFeatured: () => api.get("/products/featured"),
  getCategories: () => api.get("/products/categories"),
  getByCategory: (category, limit) => api.get(`/products/category/${category}`, { params: { limit } }),
  addReview: (productId, data) => api.post(`/products/${productId}/reviews`, data),
  // Admin
  createProduct: (data) => api.post("/products", data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

// ─── Cart APIs ─────────────────────────────────────────────────────
export const cartAPI = {
  getCart: () => api.get("/cart"),
  addToCart: (data) => api.post("/cart", data),
  updateItem: (productId, quantity) => api.put(`/cart/${productId}`, { quantity }),
  removeItem: (productId) => api.delete(`/cart/${productId}`),
  clearCart: () => api.delete("/cart/clear"),
};

// ─── Order APIs ────────────────────────────────────────────────────
export const orderAPI = {
  createOrder: (data) => api.post("/orders", data),
  getMyOrders: () => api.get("/orders/myorders"),
  getOrder: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
  // Admin
  getAllOrders: (params) => api.get("/orders", { params }),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  getStats: () => api.get("/orders/admin/stats"),
};

export default api;
