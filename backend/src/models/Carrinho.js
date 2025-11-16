const { DataTypes, Sequelize } = require ('sequelize');
const  db = require ('../config/db');

// Definição do model com os campos
const Carrinho = db.define('Carrinho',{
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  cliente_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  produto_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  quantidade: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 1,
  },
});

 module.exports = Carrinho;
