const Mascota = require('../models/Mascota');
const qrcode = require('qrcode');

// Crear una nueva mascota/reporte
exports.crearMascota = async (req, res) => {
  try {
    const { nombre, especie, raza, descripcion, estado, ciudad } = req.body;

    // --- VALIDACIÓN DE CAMPOS REQUERIDOS ---
    if (!nombre || !especie || !descripcion || !ciudad) {
      return res.status(400).json({ msg: 'Faltan campos requeridos: nombre, especie, descripción y ciudad.' });
    }

    const petData = {
      nombre,
      especie,
      raza,
      descripcion,
      estado,
      ciudad,
      propietarioId: req.user.id
    };
    
    // Si se subió una imagen, Multer y Cloudinary nos dan la URL en req.file.path
    if (req.file) {
      petData.fotos = [req.file.path];
    }

    const nuevaMascota = new Mascota(petData);
    await nuevaMascota.save();
    res.status(201).json({ msg: 'Entrada creada exitosamente', mascota: nuevaMascota });
  } catch (err) {
    console.error('ERROR AL CREAR MASCOTA:', err);
    res.status(500).json({ msg: 'Error del servidor al procesar la solicitud.' });
  }
};

// Actualizar una mascota/reporte
exports.actualizarMascota = async (req, res) => {
  try {
    const mascota = await Mascota.findById(req.params.id);
    if (!mascota || mascota.propietarioId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'No autorizado' });
    }
    
    const updateData = { ...req.body };
    if (req.file) {
      updateData.fotos = [req.file.path];
    }

    const mascotaActualizada = await Mascota.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
    res.status(200).json({ msg: 'Mascota actualizada', mascota: mascotaActualizada });
  } catch (err) {
    console.error('ERROR AL ACTUALIZAR MASCOTA:', err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

// Eliminar una mascota/reporte
exports.eliminarMascota = async (req, res) => {
    try {
        const mascota = await Mascota.findById(req.params.id);
        if (!mascota || mascota.propietarioId.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'No autorizado' });
        }
        await Mascota.findByIdAndDelete(req.params.id);
        res.status(200).json({ msg: 'Mascota eliminada' });
    } catch (err) {
        console.error('ERROR AL ELIMINAR MASCOTA:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

// Obtener las mascotas del usuario (solo las que están 'en-casa')
exports.obtenerMisMascotas = async (req, res) => {
  try {
    const mascotas = await Mascota.find({ propietarioId: req.user.id, estado: 'en-casa' }).sort({ createdAt: -1 });
    res.status(200).json(mascotas);
  } catch (err) { res.status(500).json({ msg: 'Error del servidor' }); }
};


// Obtener los "reportes" del usuario
exports.obtenerMisReportes = async (req, res) => {
    try {
        // Filtra por dueño Y que el estado NO sea 'en-casa'
        const reportes = await Mascota.find({
            propietarioId: req.user.id,
            estado: { $ne: 'en-casa' }
        }).sort({ updatedAt: -1 });
        res.status(200).json(reportes);
    } catch (err) { res.status(500).json({ msg: 'Error del servidor' }); }
};

// Obtener TODOS los reportes públicos para la página /reports y la sección de "últimos reportes"
exports.obtenerTodosReportesPublicos = async (req, res) => {
    try {
        const { ciudad, especie, estado } = req.query;
        // EL FILTRO BASE: siempre excluir 'en-casa'
        const filtro = { estado: { $ne: 'en-casa' } };

        if (especie) filtro.especie = especie;
        if (estado) filtro.estado = estado;
        if (ciudad) filtro.ciudad = new RegExp(ciudad, 'i');

        const reportes = await Mascota.find(filtro).sort({ updatedAt: -1 });
        res.status(200).json(reportes);
    } catch (err) { res.status(500).json({ msg: 'Error del servidor' }); }
};

// Obtener detalles de un reporte/mascota público
exports.obtenerMascotaPublica = async (req, res) => {
  try {
    const mascota = await Mascota.findById(req.params.id).populate('propietarioId', 'nombre telefono email');
    if (!mascota || mascota.estado === 'en-casa') return res.status(404).json({ msg: 'Reporte no encontrado' });
    res.status(200).json(mascota);
  } catch (err) { res.status(500).json({ msg: 'Error del servidor' }); }
};

// Generar QR
exports.generarQrMascota = async (req, res) => {
  try {
    const petUrl = `${process.env.FRONTEND_URL}/pet/${req.params.id}`;
    const qrCodeDataUrl = await qrcode.toDataURL(petUrl);
    res.status(200).json({ qrCode: qrCodeDataUrl });
  } catch (err) { res.status(500).json({ msg: 'Error del servidor' }); }
};