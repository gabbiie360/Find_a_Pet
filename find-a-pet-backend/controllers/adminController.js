// backend/controllers/adminController.js
const User = require('../models/User');
const Mascota = require('../models/Mascota');
const bcrypt = require('bcrypt');
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

// Crear un nuevo usuario desde el panel de admin
exports.createUser = async (req, res) => {
  try {
    const { nombre, email, telefono, ciudad, password, rol } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'Este correo ya está registrado.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ nombre, email, telefono, ciudad, password: hashedPassword, rol });
    
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) { res.status(500).json({ msg: 'Error del servidor al crear usuario.' }); }
};

// Actualizar un usuario existente
exports.updateUser = async (req, res) => {
  try {
    const { nombre, email, telefono, ciudad, rol } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado.' });

    // Actualizar campos
    user.nombre = nombre;
    user.email = email;
    user.telefono = telefono;
    user.ciudad = ciudad;
    user.rol = rol;

    // Opcional: Si se envía una nueva contraseña, la hasheamos y actualizamos.
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }
    
    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (err) { res.status(500).json({ msg: 'Error del servidor al actualizar usuario.' }); }
};