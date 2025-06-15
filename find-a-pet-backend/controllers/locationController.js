// backend/controllers/locationController.js
const Location = require('../models/Locations');

const getDepartmentsByCountry = async (req, res) => {
  try {
    const { country } = req.params;
    const location = await Location.findOne({ country });
    if (!location) {
      return res.status(404).json({ msg: 'No se encontró información para este país.' });
    }

    // Devuelve solo el objeto de departamentos
    res.json({ departments: location.departments });
  } catch (error) {
    console.error('Error al obtener ubicaciones:', error);
    res.status(500).json({ msg: 'Error del servidor.' });
  }
};

module.exports = {
  getDepartmentsByCountry
};
