import API from "../api";
import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { Search, Plus, Eye, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "../products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cart, setCart, setIsCartOpen } = useContext(CartContext);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  // add to cart
  const addToCart = (product) => {
    const exists = cart.find(item => item._id === product._id);

    if (exists) {
      setCart(cart.map(item =>
        item._id === product._id
          ? { ...item, qty: item.qty + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
    // Open the side cart
    setIsCartOpen(true);
  };

  useEffect(() => {
    setLoading(true);
    API.get("/products")
      .then(res => {
        setProducts(res.data || []); 
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        if (err.status === 401) navigate("/");
      });
  }, [navigate]);

const [search, setSearch] = useState("");

const SkeletonCard = () => (
    <div className="product-card skeleton">
      <div className="skeleton-image"></div>
      <div className="skeleton-text title"></div>
      <div className="skeleton-text price"></div>
      <div className="skeleton-text desc"></div>
      <div className="skeleton-button"></div>
    </div>
);


return (
  <div className="products-page">
    <div className="products-header">
      <h2>Featured Products</h2>
      <p>Discover our latest collection of premium goods.</p>
    </div>

    {/* 🔍 Search */}
    <div className="search-container">
      <Search className="search-icon" size={20} />
      <input
        className ="search-input"
        placeholder="Search for items..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>

    <div className="product-container">
      <AnimatePresence mode="popLayout">
        {loading ? (
          // Show 6 skeletons while loading
          [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
        ) : (
          products
            .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
            .map((p, index) => (
              <motion.div 
                className="product-card" 
                key={p._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <div className="product-image-wrapper">
                  <button 
                    className={`wishlist-toggle ${isInWishlist(p._id) ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); toggleWishlist(p._id); }}
                  >
                    <Heart size={20} fill={isInWishlist(p._id) ? "#f43f5e" : "transparent"} />
                  </button>
                  <Link to={`/product/${p._id}`}>
                    <img src={p.image} alt={p.name} />
                    {p.countInStock === 0 && (
                      <div className="out-of-stock-badge">Sold Out</div>
                    )}
                    <div className="product-overlay">
                      <button className="quick-view-btn">
                        <Eye size={18} />
                        <span>View Details</span>
                      </button>
                    </div>
                  </Link>
                </div>
                <div className="product-info">
                  <Link to={`/product/${p._id}`} className="product-title-link">
                    <h3>{p.name}</h3>
                  </Link>
                  <p className="price">₹{p.price}</p>
                  <p className="description">{p.description}</p>
                  <button 
                    className={`add-to-bag-btn ${p.countInStock === 0 ? 'disabled' : ''}`} 
                    onClick={() => p.countInStock > 0 && addToCart(p)}
                    disabled={p.countInStock === 0}
                  >
                    {p.countInStock === 0 ? 'Out of Stock' : <><Plus size={18} /><span>Add to Bag</span></>}
                  </button>
                </div>
              </motion.div>
            ))
        )}
      </AnimatePresence>
    </div>

  </div>
);
}

export default Products;