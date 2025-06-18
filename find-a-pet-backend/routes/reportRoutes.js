// backend/routes/reportRoutes.js

const express = require('express');
const router = express.Router();
// Ya no necesitas 'Readable', 'cloudinary' o 'Report' aquí
const {
  createReport, // <-- Usaremos la función del controlador
  getAllReports,
  getMyReports,
  updateReport,
  resolveReport,
  deleteReport,
  getReportById
} = require('../controllers/reportController');

const verifyToken = require('../middleware/verifyToken');
const upload = require('../middleware/upload'); // multer para procesar la imagen

// La ruta ahora es mucho más limpia
router.post('/', verifyToken, upload.single('imagen'), createReport); // Usamos 'createReport'
router.get('/:id', getReportById);

// Rutas adicionales (sin cambios)
router.get('/', getAllReports);
router.get('/mine', verifyToken, getMyReports);
router.get('/:id', getReportById);
router.put('/:id', verifyToken, updateReport);
router.put('/:id/resolve', verifyToken, resolveReport);
router.delete('/:id', verifyToken, deleteReport);
router.put('/:reportId/resolve', verifyToken, resolveReport);

module.exports = router;