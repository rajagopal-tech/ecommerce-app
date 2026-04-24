import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Facebook, 
  Twitter, 
  Instagram
} from 'lucide-react';
import '../footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-logo">
            <ShoppingBag className="logo-icon" />
            <span>MyShop</span>
          </div>
          <p className="brand-desc">Premium quality essentials for your modern lifestyle.</p>
        </div>

        <div className="footer-nav">
          <Link to="/products">Shop</Link>
          <Link to="/about">About</Link>
          <Link to="/orders">Orders</Link>
          <a href="#!">Support</a>
        </div>

        <div className="social-links">
          <a href="#!" aria-label="Facebook"><Facebook size={20} /></a>
          <a href="#!" aria-label="Twitter"><Twitter size={20} /></a>
          <a href="#!" aria-label="Instagram"><Instagram size={20} /></a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} MyShop. All rights reserved.</p>
        <div className="footer-legal">
          <a href="#!">Privacy</a>
          <a href="#!">Terms</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
