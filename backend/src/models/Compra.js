// JS Compra.js - ARQUIVO COMPLETO
const { DataTypes, Sequelize } = require ('sequelize');
const  db = require ('../config/db');

const Compra = db.define('Compra',{
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
    allowNull: false,
  },
  cliente_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  farmacia_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  data_compra: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  valor_total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  pontos_ganhos: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  // ⭐⭐ NOVO CAMPO PARA DESCONTO APLICADO ⭐⭐
  desconto_fidelidade_aplicado: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  },
  forma_pagamento_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
  },
});

module.exports = Compra;