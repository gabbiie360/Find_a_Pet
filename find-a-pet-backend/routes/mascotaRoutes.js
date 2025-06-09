// backend/routes/mascotaRoutes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { crearMascota, obtenerMisMascotas, reportarMascotaPerdida } = require('../controllers/mascotaController');

// Todas estas rutas están protegidas y requieren un token válido.

// POST /api/mascotas -> Crear una nueva mascota
router.post('/', verifyToken, crearMascota);

// GET /api/mascotas -> Obtener las mascotas del usuario logueado
router.get('/', verifyToken, obtenerMisMascotas);

// PUT /api/mascotas/:id/reportar -> Marcar una mascota como perdida
router.put('/:id/reportar', verifyToken, reportarMascotaPerdida);

module.exports = router;