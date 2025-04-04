const Report = require('../models/Report');

const createReport = async (req, res) => {
  try {
    const { tipo, descripcion, ciudad } = req.body;

    const newReport = new Report({
      tipo,
      descripcion,
      ciudad,
      creadoPor: req.user.id
    });

    await newReport.save();
    res.status(201).json({ msg: 'Reporte creado exitosamente' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al crear el reporte' });
  }
};

module.exports = { createReport };
