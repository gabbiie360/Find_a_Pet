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

const Report = require('../models/Report');

const updateReport = async (req, res) => {
  try {
    const reportId = req.params.id;

    // Buscar el reporte
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ msg: 'Reporte no encontrado' });
    }

    // Verificar que el reporte pertenece al usuario
    if (report.creadoPor.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'No autorizado para editar este reporte' });
    }

    // Actualizar campos permitidos
    const camposPermitidos = ['tipo', 'descripcion', 'ciudad'];
    camposPermitidos.forEach(campo => {
      if (req.body[campo]) {
        report[campo] = req.body[campo];
      }
    });

    await report.save();
    res.status(200).json({ msg: 'Reporte actualizado exitosamente', reporte: report });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al actualizar el reporte' });
  }
};

const deleteReport = async (req, res) => {
  try {
    const reportId = req.params.id;

    // Buscar el reporte
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ msg: 'Reporte no encontrado' });
    }

    // Verificar que el reporte pertenece al usuario
    if (report.creadoPor.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'No autorizado para eliminar este reporte' });
    }

    await Report.findByIdAndDelete(reportId);
    res.status(200).json({ msg: 'Reporte eliminado exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al eliminar el reporte' });
  }
};



module.exports = {
  createReport,
  getAllReports,
  getMyReports,
  updateReport,
  deleteReport
};


