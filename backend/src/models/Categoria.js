const { DataTypes, Sequelize } = require ('sequelize');
const  db = require ('../config/db');

// Definição do model
  const Categoria = db.define ('Categoria',{
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  nome: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  categoria_pai_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
  },
});

module.exports = Categoria;
