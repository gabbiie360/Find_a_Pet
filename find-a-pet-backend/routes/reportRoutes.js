const express = require('express');
const router = express.Router();
const { Readable } = require('stream');
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

// Función para convertir buffer a stream
const bufferToStream = (buffer) => {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

// Crear reporte con imagen
router.post('/create', verifyToken, upload.single('imagen'), async (req, res) => {
  try {
    const { tipo, descripcion, ciudad, nombre, especie, raza, recompensa, fechaPerdida, ultimaUbicacionTexto, latitud, longitud } = req.body;

    const nuevaUbicacion = {
      texto: ultimaUbicacionTexto || '',
      coordinates: (latitud && longitud) ? [parseFloat(longitud), parseFloat(latitud)] : undefined,
    };


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
        bufferToStream(req.file.buffer).pipe(stream); // ✅ Usamos .buffer y no .stream
      });
      imageUrl = result.secure_url;
    }

    const nuevoReporte = new Report({
    tipo,
    descripcion,
    ciudad,
    nombre,
    especie,
    raza,
    recompensa: Number(recompensa) || 0,
    fotos: imageUrl ? [imageUrl] : [],
    creadoPor: req.user.id,
    fecha: new Date(),
    fechaPerdida: tipo === 'perdida' ? new Date(fechaPerdida) : null,
    ultimaUbicacion: nuevaUbicacion
  });


    await nuevoReporte.save();
    res.status(201).json({ msg: 'Reporte creado exitosamente', reporte: nuevoReporte });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al crear el reporte' });
  }
});

// Rutas adicionales
router.get('/', getAllReports);
router.get('/mine', verifyToken, getMyReports);
router.put('/:id', verifyToken, updateReport);
router.delete('/:id', verifyToken, deleteReport);

module.exports = router;
