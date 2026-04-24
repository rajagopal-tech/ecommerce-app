import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Register from "./components/Register";
import Login from "./components/Login";
import Products from "./components/Products";
import Orders from "./components/Orders";
import Navbar from "./components/Navbar";
import About from "./components/About";
import Cart from "./components/Cart";
import Footer from "./components/Footer";
import ProductDetail from "./components/ProductDetail";
import AdminDashboard from "./components/AdminDashboard";
import CartDrawer from "./components/CartDrawer";
import Profile from "./components/Profile";
import Wishlist from "./components/Wishlist";
import { WishlistProvider } from "./context/WishlistContext";
import ProtectedRoute from "./components/ProtectedRoute";
import "./wishlist.css";

function App() {
  return (
    <Router>
      <CartProvider>
        <WishlistProvider>
          <Layout />
          <CartDrawer />
        </WishlistProvider>
      </CartProvider>
    </Router>
  );
}

function Layout() {
  const location = useLocation();
  const isAuthPage = ["/", "/register"].includes(location.pathname);

  return (
    <div className="app-layout">
      {!isAuthPage && <Navbar />}

      <main className="main-content">
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </main>

      {!isAuthPage && <Footer />}
    </div>
  );
}

export default App;