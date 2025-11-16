const { DataTypes, Sequelize } = require ('sequelize');
const  db = require ('../config/db');

  const Favorito = db.define('Favorito',{
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    cliente_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    produto_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  });

  module.exports = Favorito;
