const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mascotaSchema = new Schema({
  propietarioId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true
  },
  especie: {
    type: String,
    required: [true, 'La especie es requerida'],
    trim: true
  },
  raza: {
    type: String,
    trim: true
  },
  descripcion: {
    type: String,
    required: true,
    trim: true
  },
  fotos: {
    type: [String],
    default: []
  },
  estado: {
    type: String,
    enum: ['en-casa', 'perdida', 'adopcion', 'encontrada'],
    default: 'en-casa'
  },
  ciudad: {
    type: String,
    required: true,
    trim: true
  },
  ultimaUbicacion: {
    texto: {
      type: String,
      trim: true
    }
  },
  fechaPerdida: {
    type: Date
  },
  recompensa: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true // Añade createdAt y updatedAt
});

module.exports = mongoose.model('Mascota', mascotaSchema);