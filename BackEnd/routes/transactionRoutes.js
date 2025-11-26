const express = require('express');
const router = express.Router();

const { 
  getTransactions, 
  addTransaction, 
  deleteTransaction,
  updateTransaction,
  getDashboardData
} = require('../controllers/transactionController');

const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload'); 

router.route('/')
  .get(protect, getTransactions)
  .post(protect, upload.single('image'), addTransaction); 

// 2. Rute Dashboard (HARUS DIATAS /:id)
router.get('/dashboard', protect, getDashboardData);

router.route('/:id')
  .delete(protect, deleteTransaction)
  .put(protect, upload.single('image'), updateTransaction);

module.exports = router;