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



// Obtener todos los reportes
const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('creadoPor', 'nombre email ciudad') // opcional: incluye datos del usuario
      .sort({ fecha: -1 }); // ordena por fecha descendente

    res.status(200).json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al obtener los reportes' });
  }
};

// Obtener reportes del usuario autenticado
const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ creadoPor: req.user.id })
      .sort({ fecha: -1 });

    res.status(200).json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al obtener tus reportes' });
  }
};



module.exports = {
  createReport,
  getAllReports,
  getMyReports
};


