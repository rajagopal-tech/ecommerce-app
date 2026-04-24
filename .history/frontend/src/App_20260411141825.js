import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import Products from "./components/Products";
import Orders from "./components/Orders";
import Navbar from "./components/Navbar";
import About from "./components/About";
import Cart from "./components/Cart";
import { CartProvider } from "./context/CartContext";

function App() {
  const [cart, setCart] = useState([]);

  // load from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  return (
    <Router>
      <CartProvider><Layout</CartProvider>
    </Router>
  );
}

function Layout({ cart, setCart }) {
  const location = useLocation();
  const hideNavbarRoutes = ["/", "/register"];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar cart={cart} />}

      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ pass props */}
        <Route path="/products" element={<Products cart={cart} setCart={setCart} />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
      </Routes>
    </>
  );
}

export default App;