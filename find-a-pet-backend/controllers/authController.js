const User = require('../models/User');
const Report = require('../models/Report');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// --- CORREGIDO USANDO LA OPCIÓN 2 ---
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // 1. Buscamos al usuario para obtener sus datos y verificar si existe.
    const user = await User.findOne({ email });

    // 2. Si el usuario no existe, enviamos una respuesta genérica por seguridad.
    //    Esto evita que alguien pueda usar este formulario para adivinar qué correos están registrados.
    if (!user) {
      return res.status(200).json({ msg: 'Si su correo está registrado, recibirá un enlace para restablecer la contraseña.' });
    }

    // 3. Generamos el token y la fecha de expiración.
    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 3600000; // 1 hora

    // 4. Actualizamos SOLO los campos necesarios usando updateOne.
    //    Esto evita que Mongoose valide todo el documento y falle por el campo 'pais'.
    await User.updateOne(
      { _id: user._id },
      { $set: { resetPasswordToken: token, resetPasswordExpires: expires } }
    );

    // 5. Configuramos el enlace y el transportador de correo.
    const resetLink = `http://localhost:5173/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      // ¡¡¡IMPORTANTE!!! Reemplaza esto con los datos de tu proveedor de correo.
      host: 'mail.spacemail.com', 
      port: 465, // o 587 si usas STARTTLS
      secure: true, // true para 465, false para 587
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS
      }
    });

    // 6. Creamos las opciones del correo usando los datos del usuario que encontramos.
    const mailOptions = {
      from: `"Find a Pet" <${process.env.EMAIL_FROM}>`,
      to: user.email,
      subject: 'Restablecimiento de contraseña para Find a Pet',
      html: `<p>Hola ${user.nombre},</p>
             <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
             <a href="${resetLink}">${resetLink}</a>
             <p>Este enlace expirará en 1 hora.</p>
             <p>Si no solicitaste este cambio, puedes ignorar este mensaje.</p>`
    };

    // 7. Intentamos enviar el correo.
    await transporter.sendMail(mailOptions);
    
    // 8. Si todo sale bien, enviamos la misma respuesta genérica.
    res.status(200).json({ msg: 'Si su correo está registrado, recibirá un enlace para restablecer la contraseña.' });

  } catch (error) {
    // Si algo falla (la base de datos, el envío de correo), capturamos el error.
    console.error('❌ Error en el proceso de forgotPassword:', error);
    res.status(500).json({ msg: 'Ocurrió un error en el servidor. Inténtalo más tarde.' });
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
    const { nombre, email, telefono, ciudad, pais, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'Este correo ya está registrado' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      nombre,
      email,
      telefono,
      ciudad,
      pais,
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
    const { nombre, telefono, direccionDetallada, fotoPerfil } = req.body;
    
    const updateData = {};

    if (nombre) updateData.nombre = nombre;
    if (telefono) updateData.telefono = telefono;
    if (direccionDetallada) updateData.direccionDetallada = direccionDetallada;
    if (fotoPerfil) updateData.fotoPerfil = fotoPerfil;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    res.status(200).json({ 
      msg: 'Perfil actualizado exitosamente', 
      user: updatedUser 
    });

  } catch (err) {
    console.error('ERROR ACTUALIZANDO PERFIL:', err);
    res.status(500).json({ msg: 'Error del servidor al actualizar el perfil' });
  }
};


// EXPORTAMOS TODAS LAS FUNCIONES
module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword
};