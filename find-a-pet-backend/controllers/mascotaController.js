// backend/controllers/mascotaController.js
const Mascota = require('../models/Mascota');

// Crear una nueva mascota
exports.crearMascota = async (req, res) => {
  try {
    const nuevaMascota = new Mascota({
      ...req.body,
      propietarioId: req.user.id // El ID del usuario viene del token verificado
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

// Reportar una mascota como perdida (Actualizar)
exports.reportarMascotaPerdida = async (req, res) => {
  const { id } = req.params; // ID de la mascota
  const { ultimaUbicacion, fechaPerdida, recompensa } = req.body;

  try {
    const mascota = await Mascota.findById(id);
    if (!mascota) {
      return res.status(404).json({ msg: 'Mascota no encontrada' });
    }
    // Verificamos que el usuario que reporta es el dueño de la mascota
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

exports.actualizarMascota = async (req, res) => {
  const { id } = req.params;
  try {
    const mascota = await Mascota.findById(id);
    if (!mascota) return res.status(404).json({ msg: 'Mascota no encontrada' });
    if (mascota.propietarioId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'No autorizado' });
    }
    
    // Si se envía una nueva foto, se añade, no reemplaza las anteriores.
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