import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import "./navbar.css";

function Navbar() {
  const { cart } = useContext(CartContext);

  return (
    <div className="navbar">
      <h2>MyShop</h2>

      <div className="nav-links">
        <Link to="/products">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/cart">Cart ({cart.length})</Link>
      </div>
    </div>
  );
}

export default Navbar;