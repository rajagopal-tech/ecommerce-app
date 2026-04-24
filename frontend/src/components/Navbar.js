import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { ShoppingBag, Heart, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../navbar.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { cart, toggleCart } = useContext(CartContext);
  const { wishlist } = useWishlist();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user && user.role === "admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const cartItemCount = cart.reduce((total, item) => total + (item.qty || 1), 0);

  return (
    <div className="navbar">
      <div className="logo-container" onClick={() => { navigate("/products"); setIsMenuOpen(false); }}>
        <img src="/favicon.png" alt="Logo" className="nav-logo-img" />
        <h2 className="logo">Shop</h2>
      </div>

      <button className="mobile-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      <div 
        className={`mobile-overlay ${isMenuOpen ? "visible" : ""}`}
        onClick={() => setIsMenuOpen(false)}
      />

      <div className={`nav-links ${isMenuOpen ? "active" : ""}`}>
        <Link to="/products" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
        <Link to="/orders" className="nav-link" onClick={() => setIsMenuOpen(false)}>Orders</Link>
        
        <Link to="/wishlist" className="cart-link" onClick={() => setIsMenuOpen(false)}>
          <div className="cart-icon-wrapper">
            <Heart size={22} className={wishlist.length > 0 ? "text-red-500 fill-current" : ""} />
            {wishlist.length > 0 && (
              <span className="cart-badge" style={{ background: '#f43f5e' }}>{wishlist.length}</span>
            )}
          </div>
        </Link>

        <div className="cart-link" onClick={() => { toggleCart(); setIsMenuOpen(false); }} style={{ cursor: 'pointer' }}>
          <div className="cart-icon-wrapper">
            <ShoppingBag size={22} />
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </div>
        </div>

        <Link to="/profile" className="nav-link" onClick={() => setIsMenuOpen(false)}>Profile</Link>
        <Link to="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>About</Link>
        
        {isAdmin && <Link to="/admin" className="admin-link" onClick={() => setIsMenuOpen(false)}>Admin</Link>}

        <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="logout-btn">Logout</button>
      </div>
    </div>
  );
}


export default Navbar;