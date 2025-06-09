const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // 1. Busca el token en la cabecera 'Authorization'
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer TOKEN"

  // 2. Si no hay token, deniega el acceso
  if (!token) {
    return res.status(403).json({ msg: 'Acceso denegado. Se requiere un token.' });
  }

  // 3. Intenta verificar el token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // Si el token es inválido o ha expirado
      return res.status(401).json({ msg: 'Token no válido o expirado.' });
    }
    // 4. Si el token es válido, adjunta los datos del usuario (id, rol) a la petición
    // para que el siguiente controlador pueda usarlo.
    req.user = decoded; 
    next(); // Permite que la petición continúe a la ruta protegida
  });
};

module.exports = verifyToken;