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

// MIDDLEWARE PARA VERIFICAR SE É MATRIZ
const isMatriz = (req, res, next) => {
  try {
    if (req.user.tipo !== 'matriz') {
      return res.status(403).json({
        success: false,
        error: 'Acesso negado. Somente farmácias matriz podem acessar esta funcionalidade.'
      });
    }
    
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false,
      error: 'Erro ao verificar permissões.' 
    });
  }
};

// MIDDLEWARE ESPECÍFICO PARA FARMÁCIAS
const authFarmacia = (req, res, next) => {
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
    req.farmacia = decoded;
    
    next();
  } catch (error) {
    console.error('❌ ERRO NA AUTENTICAÇÃO DA FARMÁCIA:', error);
    res.status(401).json({
      success: false,
      error: 'Token inválido ou expirado.'
    });
  }
};

module.exports = { 
  authMiddleware, 
  isMatriz, 
  authFarmacia 
};