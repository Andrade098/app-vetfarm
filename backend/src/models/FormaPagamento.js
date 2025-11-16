const { DataTypes, Sequelize } = require ('sequelize');
const  db = require ('../config/db');


const FormaPagamento = db.define('FormaPagamento',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    descricao: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
});

module.exports =  FormaPagamento;
