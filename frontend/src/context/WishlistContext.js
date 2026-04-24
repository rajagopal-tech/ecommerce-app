import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load wishlist on mount if logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchWishlist();
    }
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await API.get('/users/wishlist');
      // res is already the response data because of the API interceptor
      setWishlist(res.data.map(item => item._id));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setLoading(false);
    }
  };

  const toggleWishlist = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to add items to your wishlist.');
      return;
    }

    try {
      const res = await API.post(`/users/wishlist/${productId}`);
      // res is already the response data because of the API interceptor
      setWishlist(res.wishlist.map(id => id.toString()));
    } catch (err) {
      console.error('Error toggling wishlist:', err);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, setWishlist, toggleWishlist, isInWishlist, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
