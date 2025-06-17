const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const upload = require('../middleware/upload'); 

const {
  crearMascota,
  actualizarMascota,
  eliminarMascota,
  obtenerMisMascotas,
  obtenerMisReportes,
  obtenerTodosReportesPublicos,
  obtenerMascotaPublica,
  generarQrMascota
} = require('../controllers/mascotaController');

// --- RUTAS PROTEGIDAS (Requieren Login) ---
router.post('/', verifyToken, upload.single('image'), crearMascota);
router.put('/:id', verifyToken, upload.single('image'), actualizarMascota);

router.delete('/:id', verifyToken, eliminarMascota);
router.get('/mine', verifyToken, obtenerMisMascotas);
router.get('/my-reports', verifyToken, obtenerMisReportes);
router.get('/:id/qr', verifyToken, generarQrMascota);

// --- RUTAS PÚBLICAS ---
router.get('/public', obtenerTodosReportesPublicos);
router.get('/:id/public', obtenerMascotaPublica);

module.exports = router;