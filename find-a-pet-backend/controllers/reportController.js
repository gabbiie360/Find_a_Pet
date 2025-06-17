const Report = require('../models/Report');
const { storage, cloudinary } = require('../config/cloudinary'); // Asumiendo que está en config
const { Readable } = require('stream');
const Mascota = require('../models/Mascota');

// Función helper para subir a Cloudinary desde un buffer
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'findapet' }, // Tu carpeta en Cloudinary
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    // Convertimos el buffer a un stream legible
    Readable.from(buffer).pipe(stream);
  });
};

// --- CREAR UN NUEVO REPORTE (AHORA CON LÓGICA DE UPLOAD) ---
const createReport = async (req, res) => {
  try {
    // 1. Extraemos todos los datos, incluyendo la posible URL de una foto existente.
    const { tipo, descripcion, ciudad, nombre, especie, raza, recompensa, fechaPerdida, ultimaUbicacionTexto, latitud, longitud, fotoExistenteUrl, mascotaOriginalId } = req.body;

    let imageUrl = '';

    // 2. Lógica de la imagen:
    //    - Si se sube un nuevo archivo, tiene prioridad.
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    } 
    //    - Si no hay archivo nuevo, pero se envió una URL existente, la usamos.
    else if (fotoExistenteUrl) {
      imageUrl = fotoExistenteUrl;
    }

    // 3. Construimos el objeto del reporte con todos los datos.
    const reportData = {
      nombre,
      especie,
      raza,
      tipo,
      descripcion,
      ciudad,
      recompensa: Number(recompensa) || 0,
      fotos: imageUrl ? [imageUrl] : [], // Guardamos la imagen en el array de fotos
      creadoPor: req.user.id,
      mascotaOriginalId: mascotaOriginalId || null,
    };

    // 4. Añadimos campos condicionales
    if (tipo === 'perdida' && fechaPerdida) {
      reportData.fechaPerdida = new Date(fechaPerdida);
    }
    
    if (ultimaUbicacionTexto || (latitud && longitud)) {
      reportData.ultimaUbicacion = {
        texto: ultimaUbicacionTexto,
        coordinates: (latitud && longitud) ? [parseFloat(longitud), parseFloat(latitud)] : undefined
      };
    }

    // 5. Creamos y guardamos el nuevo reporte.
    const newReport = new Report(reportData);
    await newReport.save();
    
    res.status(201).json({ msg: 'Reporte creado exitosamente', report: newReport });

  } catch (err) {
    console.error("Error en createReport:", err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: 'Datos inválidos', errors: err.errors });
    }
    res.status(500).json({ msg: 'Error del servidor al crear el reporte' });
  }
};



// --- OBTENER TODOS LOS REPORTES PÚBLICOS (SIN CAMBIOS) ---
const getAllReports = async (req, res) => {
  try {
    const { tipo, ciudad, especie } = req.query;
    let filtro = {};
    if (tipo) filtro.tipo = tipo;
    if (ciudad) filtro.ciudad = { $regex: ciudad, $options: 'i' }; // Búsqueda insensible a mayúsculas
    if (especie) filtro.especie = especie;

    const reports = await Report.find(filtro)
      .populate('creadoPor', 'nombre') // Solo trae el nombre del creador
      .sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (err) {
    console.error("Error en getAllReports:", err);
    res.status(500).json({ msg: 'Error al obtener los reportes' });
  }
};

// --- OBTENER LOS REPORTES DEL USUARIO AUTENTICADO (SIN CAMBIOS) ---
const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ creadoPor: req.user.id })
      .sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (err) {
    console.error("Error en getMyReports:", err);
    res.status(500).json({ msg: 'Error al obtener tus reportes' });
  }
};

// --- ACTUALIZAR UN REPORTE EXISTENTE (CORREGIDO) ---
const updateReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ msg: 'Reporte no encontrado' });
    }

    // Verificar que el usuario es el dueño del reporte
    if (report.creadoPor.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'No autorizado para editar este reporte' });
    }

    // Lógica flexible y segura para actualizar el reporte
    // $set actualiza solo los campos que vienen en req.body
    const updatedReport = await Report.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true, context: 'query' }
    );

    res.status(200).json({ msg: 'Reporte actualizado exitosamente', reporte: updatedReport });
  } catch (err) {
    console.error("Error en updateReport:", err);
    if (err.name === 'ValidationError') {
        return res.status(400).json({ msg: 'Datos inválidos', errors: err.errors });
    }
    res.status(500).json({ msg: 'Error al actualizar el reporte' });
  }
};

// --- ELIMINAR UN REPORTE (SIN CAMBIOS) ---
const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ msg: 'Reporte no encontrado' });
    }
    if (report.creadoPor.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'No autorizado para eliminar este reporte' });
    }
    await Report.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: 'Reporte eliminado exitosamente' });
  } catch (err) {
    console.error("Error en deleteReport:", err);
    res.status(500).json({ msg: 'Error al eliminar el reporte' });
  }
};

const resolveReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({ msg: 'Reporte no encontrado.' });
    }

    // Verificar que el usuario es el dueño del reporte
    if (report.creadoPor.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'No autorizado para modificar este reporte.' });
    }

    // 1. Actualizar el estado del reporte. Lo cambiamos a 'resuelto'.
    //    Esto lo sacará de las listas de búsqueda activas.
    report.tipo = 'resuelto'; // O 'encontrada-resuelta', como prefieras.
    await report.save();

    // 2. Si el reporte está vinculado a una mascota original, la actualizamos.
    if (report.mascotaOriginalId) {
      await Mascota.findByIdAndUpdate(report.mascotaOriginalId, {
        $set: {
          estado: 'en-casa', // La mascota vuelve a casa
          fechaEncontrada: new Date(),
          fechaPerdida: null, // Limpiamos la fecha de pérdida
          ultimaUbicacion: undefined,
        }
      });
    }

    res.status(200).json({ msg: 'Reporte resuelto y mascota actualizada.' });

  } catch (error) {
    console.error('Error al resolver el reporte:', error);
    res.status(500).json({ msg: 'Error del servidor al resolver el reporte.' });
  }
};

module.exports = {
  createReport,
  resolveReport,
  getAllReports,
  getMyReports,
  updateReport,
  deleteReport
};