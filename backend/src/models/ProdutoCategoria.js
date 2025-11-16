const { DataTypes, Sequelize } = require ('sequelize');
const  db = require ('../config/db');

const ProdutoCategoria = db.define('ProdutoCategoria',{
    produto_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
    },
    categoria_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
    },
});

module.exports = ProdutoCategoria;
