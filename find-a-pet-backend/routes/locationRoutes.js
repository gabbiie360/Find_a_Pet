// backend/routes/locationRoutes.js
const express = require('express');
const router = express.Router();
const { getDepartmentsByCountry } = require('../controllers/locationController');

// GET /api/locations/Honduras
router.get('/:country', getDepartmentsByCountry);

module.exports = router;
