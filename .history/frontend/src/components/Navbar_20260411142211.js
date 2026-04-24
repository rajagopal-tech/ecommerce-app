import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../navbar.css"
function Navbar({cart}) {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  // load cart count
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cart.length);
    };

    updateCartCount();

    // listen for changes
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="navbar">
      <h2 className="logo">MyShop</h2>

      <div className="nav-links">
        <Link to="/products">Home</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/cart">
          Cart ({cartCount}) {/* 🔥 count shown */}
        </Link>
        <Link to="/about">About</Link>

        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Navbar;