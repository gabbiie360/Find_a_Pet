// backend/routes/mascotaRoutes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { crearMascota, obtenerMisMascotas, reportarMascotaPerdida, actualizarMascota, marcarComoEncontrada, obtenerMascotaPublico, generarQrMascota, obtenerMascotasPerdidas } = require('../controllers/mascotaController');

// Todas estas rutas están protegidas y requieren un token válido.

// POST /api/mascotas -> Crear una nueva mascota
router.post('/', verifyToken, crearMascota);

// GET /api/mascotas -> Obtener las mascotas del usuario logueado
router.get('/', verifyToken, obtenerMisMascotas);

// PUT /api/mascotas/:id/reportar -> Marcar una mascota como perdida
router.put('/:id/reportar', verifyToken, reportarMascotaPerdida);

// PUT /api/mascotas/:id -> Actualizar una mascota
router.put('/:id', verifyToken, actualizarMascota);

router.put('/:id/encontrada', verifyToken, marcarComoEncontrada);
router.get('/:id/public', obtenerMascotaPublico); // Ruta pública, sin verifyToken
router.get('/:id/qr', verifyToken, generarQrMascota);
router.get('/perdidas', obtenerMascotasPerdidas);

module.exports = router;