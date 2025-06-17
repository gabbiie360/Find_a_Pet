const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  telefono: {
    type: String,
    required: true,
    trim: true
  },
  // La ciudad y país se guardan al registrarse
  ciudad: {
    type: String,
    required: true
  },
  pais: {
    type: String,
    required: false
  },
  // --- NUEVO CAMPO AÑADIDO ---
  direccionDetallada: {
    type: String,
    trim: true,
    default: ''
  },

  password: {
    type: String,
    required: true
  },
  fotoPerfil: { 
    type: String, 
    default: '' 
  },  
  rol: {
    type: String,
    enum: ['usuario', 'admin'],
    default: 'usuario'
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);