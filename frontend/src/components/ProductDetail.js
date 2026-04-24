import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import API from '../api';
import { 
  Star, 
  ShoppingBag, 
  ChevronRight, 
  Minus, 
  Plus, 
  Truck, 
  ShieldCheck, 
  RotateCcw,
  MessageCircle,
  ThumbsUp,
  Heart
} from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { motion, AnimatePresence } from 'framer-motion';
import '../productDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, setCart, setIsCartOpen } = useContext(CartContext);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');

  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
        setMainImage(res.data.image);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch product");
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = () => {
    const exists = cart.find(item => item._id === product._id);
    if (exists) {
      setCart(cart.map(item =>
        item._id === product._id
          ? { ...item, qty: item.qty + qty }
          : item
      ));
    } else {
      setCart([...cart, { ...product, qty }]);
    }
    // Open the side cart
    setIsCartOpen(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }
    setReviewLoading(true);
    try {
      await API.post(`/products/${id}/reviews`, { rating, comment });
      setReviewMessage("Review added successfully! ✅");
      setRating(0);
      setComment('');
      // Re-fetch product to show new review
      const res = await API.get(`/products/${id}`);
      setProduct(res.data);
      setReviewLoading(false);
      setTimeout(() => setReviewMessage(''), 3000);
    } catch (err) {
      alert(err.message || "Failed to add review");
      setReviewLoading(false);
    }
  };

  if (loading) return <div className="detail-loading"><div className="loader"></div></div>;
  if (error) return <div className="error-page">{error}</div>;
  if (!product) return <div className="error-page">Product not found</div>;

  const images = product.images?.length > 0 ? [product.image, ...product.images] : [product.image];

  return (
    <div className="product-detail-page">
      <div className="breadcrumb">
        <span onClick={() => navigate('/products')}>Home</span>
        <ChevronRight size={14} />
        <span className="active">{product.name}</span>
      </div>

      <div className="detail-container">
        {/* Left: Image Gallery */}
        <div className="image-gallery">
          <div className="thumbnail-list">
            {images.map((img, idx) => (
              <div 
                key={idx} 
                className={`thumbnail ${mainImage === img ? 'active' : ''}`}
                onMouseEnter={() => setMainImage(img)}
              >
                <img src={img} alt={`Product ${idx}`} />
              </div>
            ))}
          </div>
          <div className="main-image">
            <motion.img 
              key={mainImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={mainImage} 
              alt={product.name} 
            />
          </div>
        </div>

        {/* Right: Info Section */}
        <div className="info-section">
          <div className="brand-tag">PREMIUM CHOICE</div>
          <h1>{product.name}</h1>
          
          <div className="rating-summary">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={18} 
                  className={i < Math.round(product.rating) ? 'star-filled' : 'star-empty'} 
                />
              ))}
            </div>
            <span className="review-count">({product.numReviews} Reviews)</span>
          </div>

          <div className="price-tag">
            <span className="currency">₹</span>
            <span className="amount">{product.price}</span>
            <span className="taxes">Incl. of all taxes</span>
          </div>

          <div className={`stock-status ${product.countInStock > 0 ? 'in-stock' : 'out-of-stock'}`}>
            {product.countInStock > 0 ? `In Stock (${product.countInStock} available)` : 'Out of Stock'}
          </div>

          <p className="description">{product.description}</p>

          <div className="purchase-controls">
            <div className={`qty-picker ${product.countInStock === 0 ? 'disabled' : ''}`}>
              <button 
                onClick={() => setQty(Math.max(1, qty - 1))}
                disabled={product.countInStock === 0 || qty <= 1}
              >
                <Minus size={16} />
              </button>
              <span>{qty}</span>
              <button 
                onClick={() => setQty(qty + 1)}
                disabled={product.countInStock === 0 || qty >= product.countInStock}
              >
                <Plus size={16} />
              </button>
            </div>
            <button 
              className={`add-btn ${product.countInStock === 0 ? 'disabled' : ''}`} 
              onClick={addToCart}
              disabled={product.countInStock === 0}
            >
              <ShoppingBag size={20} />
              <span>{product.countInStock === 0 ? 'Out of Stock' : 'Add to Bag'}</span>
            </button>
            <button 
              className={`wishlist-btn ${isInWishlist(product._id) ? 'active' : ''}`}
              onClick={() => toggleWishlist(product._id)}
            >
              <Heart size={20} fill={isInWishlist(product._id) ? "#f43f5e" : "transparent"} />
            </button>
          </div>

          <div className="delivery-info">
            <div className="info-item">
              <Truck size={20} />
              <div>
                <h5>Free Delivery</h5>
                <p>On orders above ₹500</p>
              </div>
            </div>
            <div className="info-item">
              <ShieldCheck size={20} />
              <div>
                <h5>Warranty</h5>
                <p>1 Year Brand Warranty</p>
              </div>
            </div>
            <div className="info-item">
              <RotateCcw size={20} />
              <div>
                <h5>Easy Returns</h5>
                <p>30 Days Return Policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="reviews-section">
        <div className="reviews-header">
          <h2>Customer Reviews</h2>
          <div className="rating-stats">
            <div className="avg-rating">{product.rating.toFixed(1)}</div>
            <div>
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={20} 
                    className={i < Math.round(product.rating) ? 'star-filled' : 'star-empty'} 
                  />
                ))}
              </div>
              <p>Based on {product.numReviews} active reviews</p>
            </div>
          </div>
        </div>

        <div className="reviews-layout">
          {/* Review Form */}
          <div className="review-form-container">
            <h3>Share your experience</h3>
            {isLoggedIn ? (
              <form onSubmit={handleReviewSubmit}>
                <div className="star-picker">
                  {[...Array(5)].map((_, i) => {
                    const starVal = i + 1;
                    return (
                      <Star
                        key={i}
                        size={32}
                        className={starVal <= rating ? 'star-filled' : 'star-empty'}
                        onClick={() => setRating(starVal)}
                        style={{ cursor: 'pointer' }}
                      />
                    );
                  })}
                </div>
                <textarea 
                  placeholder="What did you like or dislike? How was the quality?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
                <button type="submit" disabled={reviewLoading}>
                  {reviewLoading ? 'Submitting...' : 'Post Review'}
                </button>
                {reviewMessage && <p className="success-msg">{reviewMessage}</p>}
              </form>
            ) : (
              <div className="login-prompt">
                <p>Please log in to write a review.</p>
                <button onClick={() => navigate('/')}>Login Now</button>
              </div>
            )}
          </div>

          {/* Review List */}
          <div className="reviews-list">
            <AnimatePresence>
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev, idx) => (
                  <motion.div 
                    key={rev._id} 
                    className="review-card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="review-top">
                      <div className="user-avatar">{rev.name.charAt(0)}</div>
                      <div>
                        <h5>{rev.name}</h5>
                        <p className="date">{new Date(rev.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="card-stars">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            className={i < rev.rating ? 'star-filled' : 'star-empty'} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="comment">{rev.comment}</p>
                    <div className="review-footer">
                      <button className="helpful-btn"><ThumbsUp size={14} /> Helpful</button>
                      <span>|</span>
                      <button className="report-btn">Report</button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="no-reviews">
                  <MessageCircle size={48} />
                  <p>No reviews yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
