const Produto = require('./Produto');
const Categoria = require('./Categoria');
const Subcategoria = require('./Subcategoria');

// Produto pertence a uma Categoria (Tipo de Produto)
Produto.belongsTo(Categoria, {
  foreignKey: 'categoria_id',
  as: 'categoria'
});

// Produto pertence a uma Subcategoria (Animal)
Produto.belongsTo(Subcategoria, {
  foreignKey: 'subcategoria_id',
  as: 'subcategoria'
});

// Categoria (Tipo de Produto) tem muitas Subcategorias (Animais)
Categoria.hasMany(Subcategoria, {
  foreignKey: 'categoria_id',
  as: 'subcategorias'
});

// Subcategoria (Animal) pertence a uma Categoria (Tipo de Produto)
Subcategoria.belongsTo(Categoria, {
  foreignKey: 'categoria_id',
  as: 'categoria'
});

// Categoria tem muitos Produtos
Categoria.hasMany(Produto, {
  foreignKey: 'categoria_id',
  as: 'produtos'
});

// Subcategoria tem muitos Produtos
Subcategoria.hasMany(Produto, {
  foreignKey: 'subcategoria_id',
  as: 'produtos'
});

module.exports = {
  Produto,
  Categoria,
  Subcategoria
};