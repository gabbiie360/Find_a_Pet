const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  // --- Campos de Identificación del Animal ---
  nombre: {
    type: String,
    required: [true, 'El nombre del animal es requerido'],
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

    mascotaOriginalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mascota'
    },

  // --- Campos del Reporte ---
  tipo: { 
    type: String,
    enum: ['perdida', 'encontrada', 'adopcion', 'resuelto'],
    required: true
  },
  descripcion: {
    type: String,
    required: true,
    trim: true
  },
  ciudad: {
    type: String,
    required: true,
    trim: true
  },
  fotos: {
    type: [String],
    default: []
  },
  recompensa: {
    type: Number,
    default: 0
  },
  
  // --- Campos Específicos para Mascotas Perdidas ---
  fechaPerdida: { 
    type: Date 
  },
  ultimaUbicacion: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // Formato: [longitud, latitud]
      index: '2dsphere' // Esencial para búsquedas geoespaciales
    },
    texto: {
      type: String,
      trim: true
    }
  },

  // --- Referencia al Usuario ---
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  // Añade automáticamente los campos `createdAt` y `updatedAt`
  timestamps: true 
});

// Evita que se guarde la propiedad `ultimaUbicacion` si tanto 'texto' como 'coordinates' están vacíos.
reportSchema.pre('save', function(next) {
  if (this.ultimaUbicacion && !this.ultimaUbicacion.texto && (!this.ultimaUbicacion.coordinates || this.ultimaUbicacion.coordinates.length === 0)) {
    this.ultimaUbicacion = undefined;
  }
  next();
});

module.exports = mongoose.model('Report', reportSchema);