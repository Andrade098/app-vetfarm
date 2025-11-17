const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Acesso negado. Token não fornecido.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'segredo');
    req.user = decoded;
    next();
  } catch (error) {
    console.error('❌ ERRO NO MIDDLEWARE DE AUTENTICAÇÃO:', error);
    res.status(401).json({
      success: false,
      error: 'Token inválido ou expirado.'
    });
  }
};

module.exports = authMiddleware;