import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../cartDrawer.css';

const CartDrawer = () => {
  const { cart, setCart, isCartOpen, setIsCartOpen } = useContext(CartContext);
  const navigate = useNavigate();

  const closeDrawer = () => setIsCartOpen(false);

  const increaseQty = (id) => {
    setCart(cart.map(item =>
      item._id === id ? { ...item, qty: (item.qty || 1) + 1 } : item
    ));
  };

  const decreaseQty = (id) => {
    setCart(cart.map(item =>
      item._id === id ? { ...item, qty: Math.max(1, (item.qty || 1) - 1) } : item
    ));
  };

  const removeItem = (id) => {
    setCart(cart.filter(item => item._id !== id));
  };

  const totalPrice = cart.reduce((total, item) => total + item.price * (item.qty || 1), 0);

  const handleCheckout = () => {
    closeDrawer();
    navigate('/cart');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="cart-drawer-backdrop"
          />

          {/* Drawer Content */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="cart-drawer"
          >
            <div className="drawer-header">
              <div className="header-title">
                <ShoppingBag size={24} />
                <h2>Your Shopping Bag</h2>
                <span className="count-badge">{cart.length} items</span>
              </div>
              <button onClick={closeDrawer} className="close-btn">
                <X size={24} />
              </button>
            </div>

            <div className="drawer-content">
              {cart.length === 0 ? (
                <div className="empty-state">
                  <ShoppingBag size={64} />
                  <h3>Your bag is empty</h3>
                  <p>Looks like you haven't added anything yet.</p>
                  <button onClick={closeDrawer} className="continue-btn">Start Shopping</button>
                </div>
              ) : (
                <div className="cart-items">
                  {cart.map((item) => (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="drawer-item"
                    >
                      <div className="item-img">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="item-info">
                        <h4>{item.name}</h4>
                        <p className="price">₹{item.price}</p>
                        <div className="qty-controls">
                          <button onClick={() => decreaseQty(item._id)}><Minus size={14} /></button>
                          <span>{item.qty || 1}</span>
                          <button onClick={() => increaseQty(item._id)}><Plus size={14} /></button>
                        </div>
                      </div>
                      <button onClick={() => removeItem(item._id)} className="remove-item">
                        <Trash2 size={18} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="drawer-footer">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span className="total-price">₹{totalPrice}</span>
                </div>
                <p className="shipping-note">Taxes and shipping calculated at checkout</p>
                <button className="checkout-btn" onClick={handleCheckout}>
                  <span>Check Out</span>
                  <ArrowRight size={20} />
                </button>
                <button className="view-cart-link" onClick={() => { closeDrawer(); navigate('/cart'); }}>
                  View Full Cart
                </button>
                <button className="continue-shopping-btn" onClick={closeDrawer}>
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
