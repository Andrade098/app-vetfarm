const { DataTypes, Sequelize } = require ('sequelize');
const  db = require ('../config/db');

const FarmaciaProduto = db.define('FarmaciaProduto',{
    farmacia_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
    },
    produto_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
    },
    estoque: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    preco_venda: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },

  });

 module.exports = FarmaciaProduto;
