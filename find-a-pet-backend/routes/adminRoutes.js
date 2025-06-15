// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middleware/verifyAdmin'); // Nuestro nuevo guardia
const { 
    getDashboardStats, 
    getAllUsers, 
    getAllMascotas,
    deleteUser,
    deleteMascota,
    createUser,
    updateUser
} = require('../controllers/adminController');

// Todas las rutas aquí están protegidas y solo accesibles para administradores
router.get('/stats', verifyAdmin, getDashboardStats);
router.get('/users', verifyAdmin, getAllUsers);
router.get('/mascotas', verifyAdmin, getAllMascotas);
router.delete('/users/:id', verifyAdmin, deleteUser);
router.delete('/mascotas/:id', verifyAdmin, deleteMascota);
router.post('/users', verifyAdmin, createUser);
router.put('/users/:id', verifyAdmin, updateUser);

module.exports = router;