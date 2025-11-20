const sequelize = require('../config/db');

// Importar todas as models
const Farmacia = require('./Farmacia');
const Categoria = require('./Categoria');
const Subcategoria = require('./Subcategoria');
const Produto = require('./Produto');
const FarmaciaProduto = require('./FarmaciaProduto');

// Importar e executar associações
require('./associations');

// Exportar tudo
module.exports = {
  sequelize,
  Farmacia,
  Categoria,
  Subcategoria,
  Produto,
  FarmaciaProduto
};