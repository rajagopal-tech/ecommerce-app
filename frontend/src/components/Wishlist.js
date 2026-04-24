import React, { useState, useEffect } from 'react';
import API from '../api';
import { ShoppingBag, Eye, Heart, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import '../wishlist.css';

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toggleWishlist } = useWishlist();
  const { cart, setCart, setIsCartOpen } = useContext(CartContext);
  const navigate = useNavigate();

  const fetchItems = async () => {
    try {
      const res = await API.get('/users/wishlist');
      // res is already the response data because of the API interceptor
      setItems(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleRemove = async (id) => {
    await toggleWishlist(id);
    setItems(items.filter(item => item._id !== id));
  };

  const addToCart = (product) => {
    const exists = cart.find(item => item._id === product._id);
    if (exists) {
      setCart(cart.map(item =>
        item._id === product._id ? { ...item, qty: item.qty + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
    setIsCartOpen(true);
  };

  if (loading) return <div className="wishlist-loading"><div className="loader"></div></div>;

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h1>My Wishlist</h1>
        <p>You have {items.length} items saved for later.</p>
      </div>

      {items.length === 0 ? (
        <div className="empty-wishlist">
          <Heart size={64} />
          <h3>Your wishlist is empty</h3>
          <p>Tap the heart icon on any product to save it here.</p>
          <button onClick={() => navigate('/products')} className="start-btn">
            Discover Products <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        <div className="wishlist-grid">
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div 
                key={item._id} 
                className="wishlist-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="card-image">
                  <img src={item.image} alt={item.name} />
                  <button className="remove-btn" onClick={() => handleRemove(item._id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="card-info">
                  <Link to={`/product/${item._id}`}>
                    <h3>{item.name}</h3>
                  </Link>
                  <p className="price">₹{item.price}</p>
                  <div className="card-actions">
                    <button className="bag-btn" onClick={() => addToCart(item)}>
                      <ShoppingBag size={18} />
                      <span>Add to Bag</span>
                    </button>
                    <Link to={`/product/${item._id}`} className="view-btn">
                      <Eye size={18} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
