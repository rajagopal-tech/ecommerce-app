import { useEffect, useState, useContext, useCallback } from "react";
import API from "../api";
import { 
  Package, 
  Calendar, 
  XCircle, 
  Clock, 
  CheckCircle, 
  Truck,
  ShoppingBag,
  Search,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  MapPin,
  CreditCard,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "../orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const { cart, setCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const filterOrders = useCallback(() => {
    let result = [...orders];
    
    if (activeFilter !== "All") {
      result = result.filter(order => order.status === activeFilter);
    }

    if (searchTerm) {
      result = result.filter(order => 
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredOrders(result);
  }, [searchTerm, activeFilter, orders]);

  useEffect(() => {
    filterOrders();
  }, [filterOrders]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await API.get("/orders");
      setOrders(res.data || []);
      setFilteredOrders(res.data || []);
    } catch (err) {
      console.error("Fetch orders error:", err);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await API.put(`/orders/${id}/cancel`);
      setOrders(orders.map(order =>
        order._id === id ? { ...order, status: "Cancelled" } : order
      ));
    } catch (err) {
      alert(err.message || "Failed to cancel order");
    }
  };

  const buyAgain = (items) => {
    // Add all items from this order to cart
    const newItems = items.map(item => ({ ...item, qty: item.qty || 1 }));
    setCart([...cart, ...newItems]);
    navigate('/cart');
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'Delivered': return { icon: <CheckCircle size={16} />, class: 'delivered', step: 3 };
      case 'Shipped': return { icon: <Truck size={16} />, class: 'shipped', step: 2 };
      case 'Processing': return { icon: <Clock size={16} />, class: 'processing', step: 1 };
      case 'Cancelled': return { icon: <XCircle size={16} />, class: 'cancelled', step: 0 };
      default: return { icon: <Clock size={16} />, class: 'pending', step: 1 };
    }
  };

  const StatusStepper = ({ currentStep, status }) => {
    if (status === 'Cancelled') return null;
    const steps = ['Confirmed', 'Processing', 'Shipped', 'Delivered'];
    return (
      <div className="status-stepper">
        {steps.map((step, index) => (
          <div key={step} className={`step ${index <= currentStep ? 'active' : ''}`}>
            <div className="step-dot">
              {index < currentStep ? <CheckCircle size={12} /> : <span>{index + 1}</span>}
            </div>
            <span className="step-label">{step}</span>
            {index < steps.length - 1 && <div className="step-line"></div>}
          </div>
        ))}
      </div>
    );
  };

  if (loading) return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>Your Orders</h1>
        <div className="skeleton-filters"></div>
      </div>
      <div className="orders-container">
        {[1, 2, 3].map(i => <div key={i} className="order-card skeleton"></div>)}
      </div>
    </div>
  );

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>Your Orders</h1>
        <p>Track, manage and reorder your favorite items</p>
      </div>

      <div className="orders-controls">
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search orders or products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          {['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(filter => (
            <button 
              key={filter} 
              className={activeFilter === filter ? 'active' : ''}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="orders-container">
        <AnimatePresence mode="popLayout">
          {filteredOrders.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="empty-orders"
            >
              <ShoppingBag size={64} />
              <h3>No matching orders</h3>
              <p>Try adjusting your search or filters to find what you're looking for.</p>
              <button onClick={() => {setSearchTerm(""); setActiveFilter("All")}}>Clear All Filters</button>
            </motion.div>
          ) : (
            filteredOrders.map((order, index) => (
              <motion.div 
                key={order._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`order-card ${expandedOrder === order._id ? 'expanded' : ''}`}
              >
                <div className="order-top">
                  <div className="order-meta">
                    <div className="meta-item">
                      <Package size={18} />
                      <div>
                        <span>ORDER ID</span>
                        <strong>#{order._id.slice(-8).toUpperCase()}</strong>
                      </div>
                    </div>
                    <div className="meta-item hide-mobile">
                      <Calendar size={18} />
                      <div>
                        <span>DATE PLACED</span>
                        <strong>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="order-top-right">
                    <div className={`status-badge ${getStatusInfo(order.status).class}`}>
                      {getStatusInfo(order.status).icon}
                      {order.status}
                    </div>
                    <button 
                      className="expand-btn" 
                      onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                    >
                      {expandedOrder === order._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>

                <div className="order-content">
                  <StatusStepper 
                    currentStep={getStatusInfo(order.status).step} 
                    status={order.status} 
                  />

                  <div className="order-items-list">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="item-row">
                        <img src={item.image} alt={item.name} />
                        <div className="item-info">
                          <h4>{item.name}</h4>
                          <p>Quantity: {item.qty} • Size: Large</p>
                        </div>
                        <div className="item-price">₹{item.price * item.qty}</div>
                      </div>
                    ))}
                  </div>

                  <AnimatePresence>
                    {expandedOrder === order._id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="order-details-expanded"
                      >
                        <div className="details-grid">
                          <div className="detail-section">
                            <div className="detail-header"><MapPin size={16} /> Shipping Address</div>
                            <p>Rajagopal Tech, 123 Main St,<br />Chennai, TN 600001, India</p>
                          </div>
                          <div className="detail-section">
                            <div className="detail-header"><CreditCard size={16} /> Payment Summary</div>
                            <div className="summary-row"><span>Subtotal</span> <span>₹{order.total}</span></div>
                            <div className="summary-row"><span>Shipping</span> <span className="free">Free</span></div>
                            <div className="summary-row total"><span>Total</span> <span>₹{order.total}</span></div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="order-footer">
                  <div className="footer-left">
                    {order.status === "Pending" ? (
                      <button className="cancel-order-btn" onClick={() => cancelOrder(order._id)}>
                        Cancel Order
                      </button>
                    ) : order.status === "Delivered" ? (
                      <button className="reorder-btn" onClick={() => buyAgain(order.items)}>
                        <RefreshCw size={16} />
                        Buy it Again
                      </button>
                    ) : (
                      <div className="track-container">
                        <button 
                          className="track-btn"
                          onClick={(e) => {
                            const note = e.currentTarget.nextElementSibling;
                            note.classList.toggle('visible');
                          }}
                        >
                          Track Package
                          <ArrowRight size={16} />
                        </button>
                        <div className="tracking-note">
                          <Clock size={14} />
                          <span>In Transit - Arriving by {new Date(Date.now() + 86400000 * 3).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="footer-right">
                    <span>Order Total</span>
                    <h3>₹{order.total}</h3>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Orders;