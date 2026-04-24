import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Products from "./components/Products";
import Orders from "./components/Orders";
import Navbar from "./components/Navbar";
import About from "./components/About";
import Cart from "./components/Cart";
import { CartProvider } from "./context/CartContext";

/***function App() {
  return (
    <Router>
      <CartProvider>
        <Layout />
      </CartProvider>
    </Router>
  );
}

function Layout() {
  const location = useLocation();
  const hideNavbarRoutes = ["/", "/register"];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}

      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </>
  );
}***

export default App;