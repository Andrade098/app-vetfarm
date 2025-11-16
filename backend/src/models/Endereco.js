const { DataTypes, Sequelize } = require ('sequelize');
const  db = require ('../config/db'); // ajuste conforme o caminho do seu arquivo db.ts

const Endereco = db.define('Endereco', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true
    
  },
  usuario_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  apelido: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  logradouro: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  numero: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  complemento:  {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cidade: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
  },
   cep: {
    type: DataTypes.STRING,
    allowNull: false,
  },
   principal: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
},

});

module.exports = Endereco;