const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, toggleWishlist, getWishlist } = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/wishlist')
  .get(protect, getWishlist);

router.route('/wishlist/:productId')
  .post(protect, toggleWishlist);

module.exports = router;
