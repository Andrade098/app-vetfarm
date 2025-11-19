const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Produto = db.define('Produto', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true
  },
  categoria_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  subcategoria_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  // ❌ REMOVER preco - vai para FarmaciaProduto
  // ❌ REMOVER estoque - vai para FarmaciaProduto  
  // ❌ REMOVER farmacia_id - vai para FarmaciaProduto
  imagens: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  ativo: { // ✅ ADICIONAR campo para ativar/desativar produto
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'produtos',
  timestamps: true,
  createdAt: 'criado_em',
  updatedAt: 'atualizado_em'
});

module.exports = Produto;