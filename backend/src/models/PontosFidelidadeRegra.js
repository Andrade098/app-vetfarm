const { DataTypes, Sequelize } = require ('sequelize');
const  db = require ('../config/db');


const PontosFidelidadeRegra = db.define('PontosFidelidadeRegra',{
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    valor_min: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    valor_max: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    pontos_fixos: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
});

module.exports = PontosFidelidadeRegra;
