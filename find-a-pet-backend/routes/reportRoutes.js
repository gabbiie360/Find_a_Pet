const express = require('express');
const router = express.Router();
const { createReport, getAllReports, getMyReports } = require('../controllers/reportController');
const verifyToken = require('../middleware/verifyToken');

// Ruta protegida para obtener reportes del usuario actual
router.get('/mine', verifyToken, getMyReports);

// Ruta para obtener todos los reportes (pública)
router.get('/', getAllReports);

// Ruta protegida para crear
router.post('/create', verifyToken, createReport);

module.exports = router;
