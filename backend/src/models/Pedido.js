// models/Pedido.js
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
  farmacia_id: {
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
    allowNull: true, // Mantido como true (pode ser nulo inicialmente)
    unique: true
  },
  status: {
    type: DataTypes.ENUM('pendente', 'processando', 'enviado', 'entregue', 'cancelado'),
    allowNull: false,
    defaultValue: 'pendente'
  },
  valor_total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  pontos_ganhos: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  desconto_fidelidade_aplicado: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  endereco_entrega: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  forma_pagamento: {
    type: DataTypes.STRING,
    allowNull: false
  },
  data_entrega_prevista: {
    type: DataTypes.DATE,
    allowNull: false
  }
  // REMOVI o campo 'itens' pois você já tem uma tabela ItemCompra separada
}, {
  tableName: 'pedidos',
  timestamps: true,
});

module.exports = Pedido;