// backend/controllers/mascotaController.js
const Mascota = require('../models/Mascota');
const qrcode = require('qrcode');

// Crear una nueva mascota
exports.crearMascota = async (req, res) => {
  try {
    const nuevaMascota = new Mascota({
      ...req.body,
      propietarioId: req.user.id
    });
    await nuevaMascota.save();
    res.status(201).json({ msg: 'Mascota registrada exitosamente', mascota: nuevaMascota });
  } catch (err) {
    console.error('ERROR AL CREAR MASCOTA:', err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

// Obtener todas las mascotas del usuario logueado
exports.obtenerMisMascotas = async (req, res) => {
  try {
    const mascotas = await Mascota.find({ propietarioId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(mascotas);
  } catch (err) {
    console.error('ERROR AL OBTENER MASCOTAS:', err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

// Reportar una mascota como perdida
exports.reportarMascotaPerdida = async (req, res) => {
  const { id } = req.params;
  const { ultimaUbicacion, fechaPerdida, recompensa } = req.body;

  try {
    const mascota = await Mascota.findById(id);
    if (!mascota) return res.status(404).json({ msg: 'Mascota no encontrada' });
    if (mascota.propietarioId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'No autorizado' });
    }

    mascota.estado = 'perdida';
    mascota.ultimaUbicacion = ultimaUbicacion;
    mascota.fechaPerdida = fechaPerdida;
    mascota.recompensa = recompensa;

    await mascota.save();
    res.status(200).json({ msg: 'Mascota reportada como perdida', mascota });
  } catch (err) {
    console.error('ERROR AL REPORTAR MASCOTA:', err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

// Actualizar una mascota
exports.actualizarMascota = async (req, res) => {
  const { id } = req.params;
  try {
    const mascota = await Mascota.findById(id);
    if (!mascota) return res.status(404).json({ msg: 'Mascota no encontrada' });
    if (mascota.propietarioId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'No autorizado' });
    }

    if (req.body.fotoNueva) {
      req.body.fotos = [...mascota.fotos, req.body.fotoNueva];
    }

    const mascotaActualizada = await Mascota.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ msg: 'Mascota actualizada', mascota: mascotaActualizada });
  } catch (err) {
    console.error('ERROR AL ACTUALIZAR MASCOTA:', err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

// Marcar como encontrada
exports.marcarComoEncontrada = async (req, res) => {
  const { id } = req.params;
  try {
    const mascota = await Mascota.findById(id);
    if (!mascota) return res.status(404).json({ msg: 'Mascota no encontrada' });
    if (mascota.propietarioId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'No autorizado' });
    }
    mascota.estado = 'en casa';
    mascota.fechaPerdida = null;
    mascota.ultimaUbicacion = undefined;
    await mascota.save();
    res.status(200).json({ msg: 'Mascota marcada como encontrada', mascota });
  } catch (err) {
    console.error('ERROR AL MARCAR COMO ENCONTRADA:', err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

// Obtener mascota pública
exports.obtenerMascotaPublico = async (req, res) => {
  try {
    const mascota = await Mascota.findById(req.params.id).populate('propietarioId', 'nombre telefono email');
    if (!mascota) return res.status(404).json({ msg: 'Mascota no encontrada' });
    res.status(200).json(mascota);
  } catch (err) {
    console.error('ERROR AL OBTENER MASCOTA PÚBLICA:', err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

// Generar código QR
exports.generarQrMascota = async (req, res) => {
  try {
    const petUrl = `${process.env.FRONTEND_URL}/pet/${req.params.id}`;
    const qrCodeDataUrl = await qrcode.toDataURL(petUrl);
    res.status(200).json({ qrCode: qrCodeDataUrl });
  } catch (err) {
    console.error('ERROR AL GENERAR QR:', err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

// Obtener mascotas perdidas con filtros
exports.obtenerMascotasPerdidas = async (req, res) => {
  try {
    const filtro = { estado: 'perdida' };

    if (req.query.especie) {
      filtro.especie = req.query.especie;
    }
    if (req.query.ciudad) {
      filtro.ciudad = new RegExp(req.query.ciudad, 'i');
    }

    const mascotas = await Mascota.find(filtro)
      .populate('propietarioId', 'nombre')
      .sort({ fechaPerdida: -1 });

    res.status(200).json(mascotas);
  } catch (err) {
    console.error('ERROR AL OBTENER MASCOTAS PERDIDAS:', err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

// Obtener reportes recientes (últimos 7 días)
exports.getRecentReports = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recientes = await Mascota.find({
      estado: 'perdida',
      fechaPerdida: { $gte: sevenDaysAgo }
    }).sort({ fechaPerdida: -1 }).limit(10);

    res.status(200).json(recientes);
  } catch (err) {
    console.error('ERROR AL OBTENER REPORTES RECIENTES:', err);
    res.status(500).json({ msg: 'Error al obtener reportes recientes' });
  }
};

// Obtener mascotas con filtros avanzados y paginación
exports.obtenerMascotasFiltradas = async (req, res) => {
  try {
    const filtro = {
      estado: { $in: ['perdida', 'encontrada', 'adopcion'] } 
    };

    if (req.query.especie) {
      filtro.especie = req.query.especie;
    }
    if (req.query.ciudad) {
      filtro.ciudad = new RegExp(req.query.ciudad, 'i');
    }
    if (req.query.estado) {
      filtro.estado = req.query.estado; // respeta filtro específico si viene
    }

    const mascotas = await Mascota.find(filtro)
      .populate('propietarioId', 'nombre')
      .sort({ createdAt: -1 });

    res.status(200).json(mascotas);
  } catch (err) {
    console.error('ERROR AL OBTENER MASCOTAS FILTRADAS:', err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

