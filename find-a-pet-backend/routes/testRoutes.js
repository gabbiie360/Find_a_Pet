const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

// Ruta protegida de prueba
router.get('/perfil', verifyToken, (req, res) => {
  res.json({
    msg: 'Ruta protegida accedida correctamente ✅',
    usuario: req.user
  });
});

module.exports = router;
