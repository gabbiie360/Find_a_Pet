const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  tipo: { 
    type: String,
    enum: ['perdida', 'encontrada', 'adopcion'],
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  ciudad: {
    type: String,
    required: true
  },
  fotos: {
    type: [String], // array de URLs (puede ser vacío)
    default: []
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
   fechaPerdida: { type: Date },
   
   ultimaUbicacion: {
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point'
  },
  coordinates: {
    type: [Number], // [longitud, latitud]
    default: undefined
  },
  texto: {
    type: String
  }
}

});

module.exports = mongoose.model('Report', reportSchema);
