const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Verifica se existe o header Authorization
  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  // Formato esperado: "Bearer token-aqui"
  const [, token] = authHeader.split(' ');

  if (!token) {
    return res.status(401).json({ error: 'Token inválido ou ausente' });
  }

  try {
    // Verifica e decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Salva no req.user -> ESSENCIAL
    req.user = decoded;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
