const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Subcategoria = db.define('Subcategoria', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  categoria_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  nome: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  tableName: 'subcategorias',
  timestamps: true
});

module.exports = Subcategoria;