import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import "../navbar.css";

function Navbar() {
  const { cart } = useContext(CartContext);

 

  return (
    <div className="navbar">
      <h2 className="logo">MyShop</h2>

      <div className="nav-links">
        <Link to="/products">Home</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/cart">
          Cart ({cart.length}) {/* ✅ real-time */}
        </Link>
        <Link to="/about">About</Link>

        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Navbar;