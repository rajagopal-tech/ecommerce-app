import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingBag, ArrowRight, Trash2, Minus, Plus, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "../cart.css";

function Cart() {
  const { cart, setCart } = useContext(CartContext);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // ➕ increase qty
  const increaseQty = (id) => {
    setCart(cart.map(item =>
      item._id === id
        ? { ...item, qty: (item.qty || 1) + 1 }
        : item
    ));
  };

  // ➖ decrease qty
  const decreaseQty = (id) => {
    setCart(cart
      .map(item =>
        item._id === id
          ? { ...item, qty: item.qty - 1 }
          : item
      )
      .filter(item => item.qty > 0)
    );
  };

  // ❌ remove item
  const removeItem = (id) => {
    setCart(cart.filter(item => item._id !== id));
  };

  // 💰 total
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * (item.qty || 1),
    0
  );

  const handleOrderPlacement = async () => {
    try {
      await API.post("/orders", {
        items: cart,
        total: totalPrice
      });

      setCart([]);
      localStorage.removeItem("cart");
      setMessage("Order placed successfully! ✅");
      
      setTimeout(() => {
        setMessage("");
        navigate("/orders");
      }, 2000);

    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to place order");
    }
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <button className="back-btn" onClick={() => navigate("/products")}>
            <ChevronLeft size={20} />
            <span>Continue Shopping</span>
          </button>
          <h2>Your Bag ({cart.length})</h2>
        </div>

        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="success-msg"
          >
            {message}
          </motion.div>
        )}

        {cart.length === 0 ? (
          <motion.div 
            className="empty-cart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <ShoppingBag size={64} className="empty-icon" />
            <h3>Your bag is empty</h3>
            <p>Looks like you haven't added anything yet.</p>
            <Link to="/products" className="start-shopping-btn">
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="cart-content">
            <div className="cart-items-list">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div 
                    key={item._id} 
                    className="cart-item"
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="item-image">
                       {/* Placeholder for item image if available */}
                       <div className="img-placeholder"><ShoppingBag size={24} /></div>
                    </div>
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p className="item-category">Premium Choice</p>
                      <div className="item-price">₹{item.price}</div>
                    </div>

                    <div className="item-actions">
                      <div className="qty-controls">
                        <button className="qty-btn" disabled={item.qty === 1} onClick={() => decreaseQty(item._id)}>
                          <Minus size={16} />
                        </button>
                        <span className="qty-val">{item.qty || 1}</span>
                        <button className="qty-btn" onClick={() => increaseQty(item._id)}>
                          <Plus size={16} />
                        </button>
                      </div>
                      <button className="remove-btn" onClick={() => removeItem(item._id)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="free">Free</span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>₹{totalPrice}</span>
              </div>
              
              <button className="proceed-btn" onClick={handleOrderPlacement}>
                <span>Proceed to Order</span>
                <ArrowRight size={20} />
              </button>

              <button className="continue-btn" onClick={() => navigate("/products")}>
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;