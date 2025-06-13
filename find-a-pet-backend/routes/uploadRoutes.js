// backend/routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });

// POST /api/upload -> Sube un archivo y devuelve la URL
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: 'No se subió ningún archivo' });
  }
  res.status(200).json({ secure_url: req.file.path });
});

module.exports = router;