const User = require('../models/User');
const Report = require('../models/Report');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// REGISTRO
const registerUser = async (req, res) => {
  try {
    const { nombre, email, telefono, ciudad, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'Este correo ya está registrado' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      nombre,
      email,
      telefono,
      ciudad,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ msg: 'Usuario registrado exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al registrar el usuario' });
  }
};

// LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Correo no registrado' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: user._id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      msg: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al iniciar sesión' });
  }
};

// --- NUEVA FUNCIÓN PARA OBTENER EL PERFIL ---
const getUserProfile = async (req, res) => {
  try {
    // 1. Obtenemos el ID del usuario desde el token que ya fue verificado por el middleware
    const userId = req.user.id;

    // 2. Buscamos al usuario en la BD, pero excluimos la contraseña de la respuesta
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    // 3. Buscamos todos los reportes creados por este usuario
    const reports = await Report.find({ creadoPor: userId }).sort({ fecha: -1 });

    // 4. Enviamos toda la información junta
    res.status(200).json({
      user,
      reports
    });

  } catch (err) {
    console.error('💥 ERROR AL OBTENER PERFIL:', err);
    res.status(500).json({ msg: 'Error del servidor al obtener el perfil' });
  }
};

// EXPORTAR FUNCIONES
module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};
