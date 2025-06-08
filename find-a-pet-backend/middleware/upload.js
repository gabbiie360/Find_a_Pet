const multer = require('multer');

const storage = multer.memoryStorage(); // guarda en buffer
const upload = multer({ storage });

module.exports = upload;
