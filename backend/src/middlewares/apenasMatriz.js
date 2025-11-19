module.exports = (req, res, next) => {
  if (req.user.tipo !== 'matriz') {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  next();
};