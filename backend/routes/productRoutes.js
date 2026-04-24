const express = require('express');
const router = express.Router();

const { createProduct, getProducts, getProductById, createProductReview, updateProduct, deleteProduct } = require('../controllers/productController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// Create product (Protected - Admin Only)
router.post('/', auth, admin, createProduct);

// Get all products (Public)
router.get('/', getProducts);

// Get single product (Public)
router.get('/:id', getProductById);

// Create product review (Auth)
router.post('/:id/reviews', auth, createProductReview);

// Update product (Admin)
router.put('/:id', auth, admin, updateProduct);

// Delete product (Admin)
router.delete('/:id', auth, admin, deleteProduct);


module.exports = router;