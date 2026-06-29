import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiEye, FiEyeOff, FiX, FiLoader } from "react-icons/fi";
import { login } from "../../redux/authSlice";
import { authAPI } from "../../services/api";
import "./Login.css";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill all required fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      let res;
      if (isLogin) {
        res = await authAPI.login({ email: form.email, password: form.password });
      } else {
        if (!form.name) { setError("Please enter your name"); setLoading(false); return; }
        res = await authAPI.register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      }
      const { user, token } = res.data;
      dispatch(login({ ...user, token }));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page animate-fade-in">
      <div className="login-box">
        {/* Left Panel */}
        <div className="login-left">
          <div className="login-left-content">
            <h1 className="login-left-title">
              {isLogin ? "Login" : "Looks like you're new here!"}
            </h1>
            <p className="login-left-sub">
              {isLogin
                ? "Get access to your Orders, Wishlist and Recommendations"
                : "Sign up with your mobile number to get started"}
            </p>
          </div>
          <div className="login-left-img">🛍️</div>
        </div>

        {/* Right Panel: Form */}
        <div className="login-right">
          <button className="login-close" onClick={() => navigate(-1)} id="login-close-btn">
            <FiX size={20} />
          </button>

          <form onSubmit={handleSubmit} className="login-form">
            {!isLogin && (
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="login-input"
                id="login-name"
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Enter Email ID / Mobile number"
              value={form.email}
              onChange={handleChange}
              className="login-input"
              id="login-email"
              required
            />

            {!isLogin && (
              <input
                type="tel"
                name="phone"
                placeholder="Mobile Number"
                value={form.phone}
                onChange={handleChange}
                className="login-input"
                id="login-phone"
              />
            )}

            <div className="login-password-wrap">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter Password"
                value={form.password}
                onChange={handleChange}
                className="login-input"
                id="login-password"
                required
              />
              <button
                type="button"
                className="login-eye"
                onClick={() => setShowPassword(!showPassword)}
                id="toggle-password-btn"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>

            {error && <p className="login-error">{error}</p>}

            <p className="login-terms">
              By continuing, you agree to Flipkart's{" "}
              <a href="/" className="login-link">Terms of Use</a> and{" "}
              <a href="/" className="login-link">Privacy Policy</a>.
            </p>

            <button type="submit" className="login-submit-btn" id="login-submit-btn" disabled={loading}>
              {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
            </button>

            <button
              type="button"
              className="login-toggle-btn"
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              id="login-toggle-btn"
            >
              {isLogin ? "New to Flipkart? Create an account" : "Existing User? Log in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
