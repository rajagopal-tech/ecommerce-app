import { useState, useEffect } from "react";
import API from "../api";
import {
  Package,
  ShoppingBag,
  Trash2,
  Edit,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  Users,
  AlertCircle,
  ChevronDown
} from "lucide-react";
import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import "../admin.css";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState([]);

  const toggleOrderExpand = (id) => {
    setExpandedOrders(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    countInStock: 0
  });

  useEffect(() => {
    if (activeTab === "products") {
      fetchProducts();
    } else {
      fetchOrders();
    }
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get("/products");
      // Handle the standardized response
      setProducts(res.data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      showMsg("error", "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await API.get("/orders/admin/all");
      setOrders(res.data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      showMsg("error", "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await API.put(`/products/${currentProductId}`, form);
        showMsg("success", "Product updated successfully!");
      } else {
        await API.post("/products", form);
        showMsg("success", "Product added successfully!");
      }
      setForm({ name: "", price: "", image: "", description: "", countInStock: 0 });
      setIsEditing(false);
      setCurrentProductId(null);
      fetchProducts();
    } catch (err) {
      showMsg("error", err.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await API.delete(`/products/${id}`);
      showMsg("success", "Product deleted successfully");
      fetchProducts();
    } catch (err) {
      showMsg("error", "Failed to delete product");
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
      countInStock: product.countInStock || 0
    });
    setIsEditing(true);
    setCurrentProductId(product._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status });
      showMsg("success", `Order updated to ${status}`);
      fetchOrders();
    } catch (err) {
      showMsg("error", "Failed to update order status");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return <CheckCircle size={14} className="text-green" />;
      case 'Processing': return <Clock size={14} className="text-blue" />;
      case 'Cancelled': return <XCircle size={14} className="text-red" />;
      default: return <AlertCircle size={14} className="text-orange" />;
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div>
          <h1>Admin Control Center</h1>
          <p>Manage your inventory and monitor store activity</p>
        </div>
        <div className="admin-stats">
          <div className="stat-card">
            <TrendingUp size={20} />
            <div>
              <span>Total Revenue</span>
              <h3>₹{orders.filter(o => o.status !== 'Cancelled').reduce((acc, o) => acc + o.total, 0).toLocaleString()}</h3>
            </div>
          </div>
          <div className="stat-card">
            <Users size={20} />
            <div>
              <span>Total Orders</span>
              <h3>{orders.length}</h3>
            </div>
          </div>
        </div>
      </header>

      <div className="admin-tabs">
        <button
          className={activeTab === "products" ? "active" : ""}
          onClick={() => setActiveTab("products")}
        >
          <Package size={18} />
          Products
        </button>
        <button
          className={activeTab === "orders" ? "active" : ""}
          onClick={() => setActiveTab("orders")}
        >
          <ShoppingBag size={18} />
          Orders
        </button>
      </div>

      <AnimatePresence mode="wait">
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`admin-toast ${message.type}`}
          >
            {message.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="admin-main">
        {activeTab === "products" ? (
          <div className="admin-grid">
            <section className="admin-card form-section">
              <h2>{isEditing ? "Edit Product" : "Add New Product"}</h2>
              <form className="admin-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Product Name</label>
                  <input name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input name="price" type="number" value={form.price} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input name="countInStock" type="number" value={form.countInStock} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input name="image" value={form.image} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} required />
                </div>
                <div className="form-actions">
                  <button type="submit" className="primary-btn">
                    {isEditing ? "Update Product" : "Add Product"}
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      className="secondary-btn"
                      onClick={() => {
                        setIsEditing(false);
                        setForm({ name: "", price: "", image: "", description: "", countInStock: 0 });
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </section>

            <section className="admin-card list-section">
              <h2>Current Inventory</h2>
              <div className="table-wrapper">
                {loading ? <div className="loader"></div> : (
                  <table>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(p => (
                        <tr key={p._id}>
                          <td className="product-cell">
                            <img src={p.image} alt={p.name} />
                            <span>{p.name}</span>
                          </td>
                          <td>₹{p.price}</td>
                          <td><span className={`badge-stock ${p.countInStock > 0 ? 'in-stock' : 'out-of-stock'}`}>{p.countInStock}</span></td>
                          <td>
                            <div className="row-actions">
                              <button onClick={() => handleEdit(p)} className="icon-btn edit">
                                <Edit size={16} />
                              </button>
                              <button onClick={() => handleDelete(p._id)} className="icon-btn delete">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>
          </div>
        ) : (
          <section className="admin-card orders-section">
            <h2>Order Management</h2>
            <div className="table-wrapper">
              {loading ? <div className="loader"></div> : (
                <table>
                  <thead>
                    <tr>
                      <th></th>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <React.Fragment key={o._id}>
                        <tr className={expandedOrders.includes(o._id) ? "expanded" : ""}>
                          <td>
                            <button 
                              className="expand-btn" 
                              onClick={() => toggleOrderExpand(o._id)}
                            >
                              <ChevronDown 
                                size={18} 
                                style={{ transform: expandedOrders.includes(o._id) ? 'rotate(180deg)' : 'none', transition: '0.2s' }} 
                              />
                            </button>
                          </td>
                          <td className="id-cell">#{o._id.slice(-6).toUpperCase()}</td>
                          <td>
                            <div className="customer-info">
                              <strong>{o.user?.name}</strong>
                              <span>{o.user?.email}</span>
                            </div>
                          </td>
                          <td>₹{o.total}</td>
                          <td>
                            <span className={`status-badge ${o.status.toLowerCase()}`}>
                              {getStatusIcon(o.status)}
                              {o.status}
                            </span>
                          </td>
                          <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                          <td>
                            <select 
                              className="status-select"
                              value={o.status}
                              onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                        {expandedOrders.includes(o._id) && (
                          <tr className="details-row">
                            <td colSpan="7">
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="order-details-container"
                              >
                                <h4>Ordered Items</h4>
                                <div className="details-grid">
                                  {o.items.map((item, idx) => (
                                    <div key={idx} className="detail-item">
                                      <img src={item.image} alt={item.name} />
                                      <div className="detail-info">
                                        <h5>{item.name}</h5>
                                        <p>₹{item.price} x {item.qty}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
