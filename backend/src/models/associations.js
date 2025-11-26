// src/models/associations.js
const Produto = require('./Produto');
const Categoria = require('./Categoria');
const Subcategoria = require('./Subcategoria');
const Farmacia = require('./Farmacia');
const FarmaciaProduto = require('./FarmaciaProduto');
const Cliente = require('./Cliente');
const Pedido = require('./Pedido');
const Endereco = require('./Endereco');
const ItemCompra = require('./ItemCompra');

// ✅ REMOVER esta linha - não é necessária aqui
// const db = require('../../config/db');

// ASSOCIAÇÕES EXISTENTES (Categoria, Subcategoria, Produto)
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

// NOVAS ASSOCIAÇÕES PARA farmacia_produtos
// Farmacia tem muitos Produtos através da tabela farmacia_produtos
Farmacia.belongsToMany(Produto, {
  through: FarmaciaProduto,
  foreignKey: 'farmacia_id',
  otherKey: 'produto_id',
  as: 'produtos'
});

// Produto pertence a muitas Farmácias através da tabela farmacia_produtos
Produto.belongsToMany(Farmacia, {
  through: FarmaciaProduto,
  foreignKey: 'produto_id',
  otherKey: 'farmacia_id',
  as: 'farmacias'
});

// Associações diretas com a tabela de junção (opcional, mas útil)
Farmacia.hasMany(FarmaciaProduto, {
  foreignKey: 'farmacia_id',
  as: 'farmaciaProdutos'
});

Produto.hasMany(FarmaciaProduto, {
  foreignKey: 'produto_id',
  as: 'farmaciaProdutos'
});

FarmaciaProduto.belongsTo(Farmacia, {
  foreignKey: 'farmacia_id',
  as: 'farmacia'
});

FarmaciaProduto.belongsTo(Produto, {
  foreignKey: 'produto_id',
  as: 'produto'
});

// ✅ ASSOCIAÇÕES EXISTENTES PARA PEDIDOS E ENDEREÇOS

// Cliente tem muitos Pedidos
Cliente.hasMany(Pedido, {
  foreignKey: 'usuario_id',
  as: 'pedidos'
});

// Pedido pertence a um Cliente
Pedido.belongsTo(Cliente, {
  foreignKey: 'usuario_id',
  as: 'cliente'
});

// Cliente tem muitos Endereços
Cliente.hasMany(Endereco, {
  foreignKey: 'usuario_id',
  as: 'enderecos'
});

// Endereço pertence a um Cliente
Endereco.belongsTo(Cliente, {
  foreignKey: 'usuario_id',
  as: 'cliente'
});

// ✅ ASSOCIAÇÕES DO SEU AMIGO (INTEGRADAS)

// Pedido tem muitos ItensCompra
Pedido.hasMany(ItemCompra, {
  foreignKey: 'compra_id',
  as: 'itens'
});

// ItemCompra pertence a um Pedido
ItemCompra.belongsTo(Pedido, {
  foreignKey: 'compra_id',
  as: 'pedido'
});

// ItemCompra pertence a um Produto
ItemCompra.belongsTo(Produto, {
  foreignKey: 'produto_id',
  as: 'produto'
});

// ✅ ASSOCIAÇÕES ADICIONAIS (PARA COMPLETAR)

// Produto tem muitos ItemCompra (opcional)
Produto.hasMany(ItemCompra, {
  foreignKey: 'produto_id',
  as: 'itensCompra'
});

// Pedido pertence a uma Farmacia (se necessário)
Pedido.belongsTo(Farmacia, {
  foreignKey: 'farmacia_id',
  as: 'farmacia'
});

// Farmacia tem muitos Pedidos (se necessário)
Farmacia.hasMany(Pedido, {
  foreignKey: 'farmacia_id',
  as: 'pedidos'
});

console.log('✅ Todas as associações carregadas com sucesso!');

module.exports = {
  Produto,
  Categoria,
  Subcategoria,
  Farmacia,
  FarmaciaProduto,
  Cliente,
  Pedido,
  Endereco,
  ItemCompra
};