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
  especie: { type: String, required: true }, // 'Perro', 'Gato', etc.
  raza: { type: String },
  edad: { type: Number },
  colores: [String],
  descripcion: { type: String, required: true },
  fotos: [String], // Un array de URLs a las imágenes
  
  // --- CAMPOS PARA CUANDO SE PIERDE ---
  estado: {
    type: String,
    enum: ['en casa', 'perdida', 'encontrada'],
    default: 'en casa'
  },
  ultimaUbicacion: { // Formato GeoJSON para búsquedas por mapa
    type: { type: String, enum: ['Point'] },
    coordinates: { type: [Number] } // [longitud, latitud]
  },
  fechaPerdida: { type: Date },
  recompensa: { type: Number, default: 0 },
  fechaEncontrada: { type: Date } 


}, { timestamps: true }); // Añade createdAt y updatedAt automáticamente

// Índice geoespacial para buscar mascotas por cercanía
mascotaSchema.index({ ultimaUbicacion: '2dsphere' });

module.exports = mongoose.model('Mascota', mascotaSchema);