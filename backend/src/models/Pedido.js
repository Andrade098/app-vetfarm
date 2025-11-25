const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Pedido = db.define('Pedido', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  usuario_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  numero_pedido: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  codigo_rastreio: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  status: {
    type: DataTypes.ENUM('pendente', 'processando', 'enviado', 'entregue', 'cancelado'),
    allowNull: false,
    defaultValue: 'pendente'
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  endereco_entrega: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  forma_pagamento: {
    type: DataTypes.STRING,
    allowNull: false
  },
  itens: {
    type: DataTypes.TEXT, // JSON string com os itens do pedido
    allowNull: false
  },
  data_entrega_prevista: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'pedidos',
  timestamps: true,
});

module.exports = Pedido;