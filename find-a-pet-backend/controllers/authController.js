const User = require('../models/User');
const Report = require('../models/Report');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Controlador para manejar el restablecimiento de contraseña
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ msg: 'Correo no registrado' });

  const token = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
  await user.save();

  const resetLink = `http://localhost:5173/reset-password/${token}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: 'Restablecer contraseña',
    html: `<p>Hola ${user.nombre},</p>
           <p>Haz clic aquí para cambiar tu contraseña:</p>
           <a href="${resetLink}">${resetLink}</a>`
  };

  try {
    console.log("Intentando enviar correo desde:", process.env.EMAIL_FROM);
    console.log("Hacia:", user.email);

    await transporter.sendMail(mailOptions);
    res.status(200).json({ msg: 'Correo enviado para restablecer contraseña' });
  } catch (error) {
    console.error('Error al enviar correo:', error);
    res.status(500).json({ msg: 'Error al enviar el correo.' });
  }
};


// Cambiar contraseña desde token (reset)
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) return res.status(400).json({ msg: 'Token inválido o expirado' });

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.status(200).json({ msg: 'Contraseña actualizada correctamente' });
};
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
    console.error('ERROR EN REGISTRO:', err);
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
    console.error('ERROR EN LOGIN:', err);
    res.status(500).json({ msg: 'Error al iniciar sesión' });
  }
};

// OBTENER PERFIL
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

    const reports = await Report.find({ creadoPor: userId }).sort({ fecha: -1 });
    res.status(200).json({ user, reports });
  } catch (err) {
    console.error('ERROR AL OBTENER PERFIL:', err);
    res.status(500).json({ msg: 'Error del servidor al obtener el perfil' });
  }
};

// ACTUALIZAR PERFIL
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

    const { nombre, telefono, ciudad, fotoPerfil } = req.body;
    user.nombre = nombre || user.nombre;
    user.telefono = telefono || user.telefono;
    user.ciudad = ciudad || user.ciudad;
    user.fotoPerfil = fotoPerfil || user.fotoPerfil;
    
    const updatedUser = await user.save();
    res.status(200).json({ msg: 'Perfil actualizado', user: updatedUser });
  } catch (err) {
    console.error('ERROR ACTUALIZANDO PERFIL:', err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};


// --- EXPORTAMOS TODAS LAS FUNCIONES JUNTAS AL FINAL ---
module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword
};
