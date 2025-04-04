const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  tipo: { 
    type: String,
    enum: ['perdido', 'encontrado', 'adopcion'],
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
  fecha: {
    type: Date,
    default: Date.now
  },
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Report', reportSchema);
