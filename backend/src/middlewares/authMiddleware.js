const jwt = require('jsonwebtoken');

// ✅ MIDDLEWARE ÚNICO E CONSISTENTE
const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    console.log('🔐 [AUTH] Token recebido:', token ? `Presente (${token.length} chars)` : 'AUSENTE');

    if (!token) {
      console.log('❌ [AUTH] Token não fornecido');
      return res.status(401).json({
        success: false,
        error: 'Acesso negado. Token não fornecido.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'segredo_temporario');
    console.log('✅ [AUTH] Token decodificado:', decoded);
    
    // ✅ PADRONIZAR: sempre usar req.user
    req.user = decoded;
    req.farmaciaId = decoded.id; // ← manter compatibilidade
    
    next();
  } catch (error) {
    console.error('❌ ERRO NO MIDDLEWARE DE AUTENTICAÇÃO:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Token inválido.'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false, 
        error: 'Token expirado.'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Erro na autenticação.'
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

module.exports = { 
  authMiddleware, 
  isMatriz
  // ❌ REMOVER authFarmacia - usar apenas authMiddleware
};