const express = require('express');
const router = express.Router();
const {
  getAllReports,
  getMyReports,
  updateReport,
  deleteReport
} = require('../controllers/reportController');

const verifyToken = require('../middleware/verifyToken');
const upload = require('../middleware/upload');
const cloudinary = require('../utils/cloudinary');
const Report = require('../models/Report');


// Obtener reportes del usuario actual
router.get('/mine', verifyToken, getMyReports);

// Obtener todos los reportes
router.get('/', getAllReports);

// Crear reporte con imagen integrada
router.post('/create', verifyToken, upload.single('imagen'), async (req, res) => {
  try {
    const { tipo, descripcion, ciudad } = req.body;

    // Subir imagen a Cloudinary si existe
    let imageUrl = '';
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'findapet' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        req.file.stream.pipe(stream);
      });
      imageUrl = result.secure_url;
    }

    // Crear reporte con URL de imagen
    const nuevoReporte = new Report({
      tipo,
      descripcion,
      ciudad,
      fotos: imageUrl ? [imageUrl] : [],
      creadoPor: req.user.id
    });

    await nuevoReporte.save();
    res.status(201).json({ msg: 'Reporte creado exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al crear el reporte' });
  }
});

// Actualizar un reporte
router.put('/:id', verifyToken, updateReport);

// Eliminar un reporte
router.delete('/:id', verifyToken, deleteReport);

module.exports = router;
