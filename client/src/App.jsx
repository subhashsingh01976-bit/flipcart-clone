import { Routes, Route, ScrollRestoration } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import ProductList from "./pages/ProductList/ProductList";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import Orders from "./pages/Orders/Orders";
import Account from "./pages/Account/Account";

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/search" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/account" element={<Account />} />
          {/* Fallback */}
          <Route
            path="*"
            element={
              <div style={{ textAlign: "center", padding: "80px 20px" }}>
                <h1 style={{ fontSize: 64, color: "#e0e0e0" }}>404</h1>
                <h2>Page not found</h2>
                <a href="/" style={{ color: "#2874f0", marginTop: 16, display: "block" }}>
                  Go to Home
                </a>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
