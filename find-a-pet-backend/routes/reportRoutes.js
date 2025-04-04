const express = require('express');
const router = express.Router();
const { createReport } = require('../controllers/reportController');
const verifyToken = require('../middleware/verifyToken');

// Protected route to create a report
router.post('/create', verifyToken, createReport);

module.exports = router;
