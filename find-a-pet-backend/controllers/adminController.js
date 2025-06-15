// backend/controllers/adminController.js
const User = require('../models/User');
const Mascota = require('../models/Mascota');
const Report = require('../models/Report'); // Importamos el modelo de Reportes
const { subDays, format } = require('date-fns');

// Obtener datos agregados para el dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMascotas = await Mascota.countDocuments();
    const mascotasPerdidas = await Mascota.countDocuments({ estado: 'perdida' });
    const totalReportes = await Report.countDocuments();
    
    // --- CÁLCULO DE LA NUEVA MÉTRICA ---
    const mascotasEncontradas = await Mascota.countDocuments({ fechaEncontrada: { $exists: true, $ne: null } });

    // --- CÁLCULO PARA EL GRÁFICO ---
    const hoy = new Date();
    const hace7Dias = subDays(hoy, 7);
    
    const nuevosUsuarios = await User.aggregate([
        { $match: { fechaRegistro: { $gte: hace7Dias } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$fechaRegistro" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
    ]);

    const nuevasMascotas = await Mascota.aggregate([
        { $match: { createdAt: { $gte: hace7Dias } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
    ]);

    const mascotasEncontradasDiarias = await Mascota.aggregate([
        { $match: { fechaEncontrada: { $gte: hace7Dias } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$fechaEncontrada" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
    ]);
    
    // Aquí podrías añadir más estadísticas complejas en el futuro
    res.json({ totalUsers, totalMascotas, mascotasPerdidas, totalReportes, nuevosUsuarios, nuevasMascotas, mascotasEncontradasDiarias });
  } catch (err) { res.status(500).json({ msg: 'Error del servidor' }); }
};

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) { res.status(500).json({ msg: 'Error del servidor' }); }
};

// Obtener todas las mascotas
exports.getAllMascotas = async (req, res) => {
  try {
    const mascotas = await Mascota.find().populate('propietarioId', 'nombre');
    res.json(mascotas);
  } catch (err) { res.status(500).json({ msg: 'Error del servidor' }); }
};

// Eliminar un usuario
exports.deleteUser = async (req, res) => {
    try {
        await Mascota.deleteMany({ propietarioId: req.params.id }); // Borra sus mascotas
        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Usuario y sus mascotas eliminados.' });
    } catch (err) { res.status(500).json({ msg: 'Error del servidor' }); }
};

// Eliminar una mascota
exports.deleteMascota = async (req, res) => {
    try {
        await Mascota.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Mascota eliminada.' });
    } catch (err) { res.status(500).json({ msg: 'Error del servidor' }); }
};