require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const testRoutes = require('./routes/testRoutes');
const reportRoutes = require('./routes/reportRoutes');





const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/reports', reportRoutes);

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  tlsAllowInvalidCertificates: true,
  serverApi: { version: '1', strict: true, deprecationErrors: true }
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error al conectar a MongoDB:', err));





// Ruta base
app.get('/', (req, res) => {
  res.send('API de Find a Pet funcionando 🐾');
});

// Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
