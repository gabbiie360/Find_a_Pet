// backend/middleware/verifyAdmin.js
const verifyToken = require('./verifyToken');

const verifyAdmin = (req, res, next) => {
  // Primero, usamos el middleware de token para verificar la sesión
  verifyToken(req, res, () => {
    // Si el token es válido, req.user estará disponible
    if (req.user && req.user.rol === 'admin') {
      // Si el rol es 'admin', permite continuar
      next();
    } else {
      // Si no es admin, deniega el acceso
      res.status(403).json({ msg: 'Acceso denegado. Se requiere rol de administrador.' });
    }
  });
};

module.exports = verifyAdmin;