const Report = require('../models/Report');

// --- CREAR UN NUEVO REPORTE (CORREGIDO) ---
const createReport = async (req, res) => {
  try {
    // Tomamos todos los campos del body y añadimos el ID del usuario
    const reportData = { ...req.body, creadoPor: req.user.id };

    const newReport = new Report(reportData);
    await newReport.save();
    
    res.status(201).json({ msg: 'Reporte creado exitosamente', report: newReport });

  } catch (err) {
    console.error("Error en createReport:", err);
    // Manejo de errores de validación de Mongoose
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: 'Datos inválidos', errors: err.errors });
    }
    res.status(500).json({ msg: 'Error del servidor al crear el reporte' });
  }
};

// --- OBTENER TODOS LOS REPORTES PÚBLICOS (SIN CAMBIOS) ---
const getAllReports = async (req, res) => {
  try {
    const { tipo, ciudad, especie } = req.query;
    let filtro = {};
    if (tipo) filtro.tipo = tipo;
    if (ciudad) filtro.ciudad = { $regex: ciudad, $options: 'i' }; // Búsqueda insensible a mayúsculas
    if (especie) filtro.especie = especie;

    const reports = await Report.find(filtro)
      .populate('creadoPor', 'nombre') // Solo trae el nombre del creador
      .sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (err) {
    console.error("Error en getAllReports:", err);
    res.status(500).json({ msg: 'Error al obtener los reportes' });
  }
};

// --- OBTENER LOS REPORTES DEL USUARIO AUTENTICADO (SIN CAMBIOS) ---
const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ creadoPor: req.user.id })
      .sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (err) {
    console.error("Error en getMyReports:", err);
    res.status(500).json({ msg: 'Error al obtener tus reportes' });
  }
};

// --- ACTUALIZAR UN REPORTE EXISTENTE (CORREGIDO) ---
const updateReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ msg: 'Reporte no encontrado' });
    }

    // Verificar que el usuario es el dueño del reporte
    if (report.creadoPor.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'No autorizado para editar este reporte' });
    }

    // Lógica flexible y segura para actualizar el reporte
    // $set actualiza solo los campos que vienen en req.body
    const updatedReport = await Report.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true, context: 'query' }
    );

    res.status(200).json({ msg: 'Reporte actualizado exitosamente', reporte: updatedReport });
  } catch (err) {
    console.error("Error en updateReport:", err);
    if (err.name === 'ValidationError') {
        return res.status(400).json({ msg: 'Datos inválidos', errors: err.errors });
    }
    res.status(500).json({ msg: 'Error al actualizar el reporte' });
  }
};

// --- ELIMINAR UN REPORTE (SIN CAMBIOS) ---
const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ msg: 'Reporte no encontrado' });
    }
    if (report.creadoPor.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'No autorizado para eliminar este reporte' });
    }
    await Report.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: 'Reporte eliminado exitosamente' });
  } catch (err) {
    console.error("Error en deleteReport:", err);
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