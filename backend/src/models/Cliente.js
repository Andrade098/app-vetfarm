const { DataTypes } = require('sequelize');
const db = require('../config/db'); // ajuste conforme seu caminho

const Cliente = db.define('Cliente', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sobrenome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      is: /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, // formato 000.000.000-00
    }
  },
  telefone: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  data_nascimento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
}, {
  tableName: 'clientes',
  timestamps: false,
});

module.exports = Cliente;
