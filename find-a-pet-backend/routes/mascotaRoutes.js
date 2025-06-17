// backend/routes/mascotaRoutes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

const {
  crearMascota,
  obtenerMisMascotas,
  eliminarMascota,
  reportarMascotaPerdida,
  actualizarMascota,
  marcarComoEncontrada,
  obtenerMascotaPublico,
  generarQrMascota,
  obtenerMascotasPerdidas,
  getRecentReports,
  obtenerMascotasFiltradas 
} = require('../controllers/mascotaController');

// Todas estas rutas están protegidas y requieren un token válido

// Crear una nueva mascota
router.post('/', verifyToken, crearMascota);

// Obtener las mascotas del usuario logueado
router.get('/', verifyToken, obtenerMisMascotas);

// Marcar una mascota como perdida
router.put('/:id/reportar', verifyToken, reportarMascotaPerdida);

// Actualizar una mascota
router.put('/:id', verifyToken, actualizarMascota);

// Marcar mascota como encontrada
router.put('/:id/encontrada', verifyToken, marcarComoEncontrada);

// Obtener mascota de forma pública (por ID)
router.get('/:id/public', obtenerMascotaPublico);

// Generar código QR para mascota
router.get('/:id/qr', verifyToken, generarQrMascota);

// Obtener mascotas perdidas (con filtros)
router.get('/perdidas', obtenerMascotasPerdidas);

// Obtener reportes recientes de los últimos 7 días
router.get('/recientes', getRecentReports);

router.get('/filtradas', obtenerMascotasFiltradas);

// DELETE /api/mascotas/:id
router.delete('/:id', verifyToken, eliminarMascota);

module.exports = router;
