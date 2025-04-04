const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Verificar si se envió el token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ msg: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adjuntar datos del usuario a la request
    req.user = decoded;

    // Continuar con la siguiente función
    next();

  } catch (err) {
    console.error(err);
    return res.status(403).json({ msg: 'Token inválido o expirado' });
  }
};

module.exports = verifyToken;
