const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      tlsAllowInvalidCertificates: true
    });
    console.log('✅ Conexión a MongoDB exitosa');
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Falló la conexión:', err);
  }
};

testConnection();
