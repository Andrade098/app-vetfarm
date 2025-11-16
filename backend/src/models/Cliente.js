const { DataTypes, Sequelize } = require ('sequelize');
const  db = require ('../config/db'); // ajuste conforme o caminho do seu arquivo db.ts

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
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cpf:  {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is:  /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, 
    }
  },
  telefone: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  data_nascimento: {
    type: DataTypes.DATE,
    allowNull: false,
  },

});

module.exports = Cliente;