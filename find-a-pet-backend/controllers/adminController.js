// backend/controllers/adminController.js
const User = require('../models/User');
const Mascota = require('../models/Mascota');

// Obtener datos agregados para el dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMascotas = await Mascota.countDocuments();
    const mascotasPerdidas = await Mascota.countDocuments({ estado: 'perdida' });
    
    // Aquí podrías añadir más estadísticas complejas en el futuro
    res.json({ totalUsers, totalMascotas, mascotasPerdidas });
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