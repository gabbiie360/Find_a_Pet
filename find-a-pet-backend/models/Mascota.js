// backend/models/Mascota.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mascotaSchema = new Schema({
  propietarioId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nombre: { type: String, required: true },
  especie: { type: String, required: true },
  raza: { type: String },
  edad: { type: Number },
  colores: [String],
  descripcion: { type: String, required: true },
  fotos: [String],
  
  // --- CORRECCIÓN EN EL CAMPO 'estado' ---
  estado: {
    type: String,
    enum: ['en-casa', 'perdida', 'encontrada'], // Usamos guiones, no espacios
    default: 'en-casa' // Usamos guiones, no espacios
  },
  // ------------------------------------
  
  ultimaUbicacion: {
    type: { type: String, enum: ['Point'] },
    coordinates: { type: [Number] }
  },
  fechaPerdida: { type: Date },
  recompensa: { type: Number, default: 0 },
  fechaEncontrada: { type: Date } 


}, { timestamps: true });

mascotaSchema.index({ ultimaUbicacion: '2dsphere' });

module.exports = mongoose.model('Mascota', mascotaSchema);