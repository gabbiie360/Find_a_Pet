const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');



router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', verifyToken, getUserProfile);
router.put('/profile', verifyToken, updateUserProfile);
router.post('/forgot-password', forgotPassword); // NUEVA
router.post('/reset-password/:token', resetPassword); // NUEVA

module.exports = router;
