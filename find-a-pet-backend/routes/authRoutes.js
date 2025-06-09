const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);

// --- NUEVA RUTA PROTEGIDA ---
// GET /api/auth/me -> devuelve los datos del usuario actual
// Usamos el middleware 'verifyToken' para asegurarnos de que solo usuarios logueados puedan acceder
router.get('/me', verifyToken, getUserProfile);


module.exports = router;
