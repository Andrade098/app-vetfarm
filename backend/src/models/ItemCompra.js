const { DataTypes, Sequelize } = require ('sequelize');
const  db = require ('../config/db');

const ItemCompra = db.define('ItemCompra',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    compra_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    produto_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    quantidade: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    preco_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
});

module.exports = ItemCompra;