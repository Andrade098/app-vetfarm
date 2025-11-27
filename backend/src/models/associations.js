// src/models/associations.js - VERSÃO SIMPLIFICADA
const Produto = require('./Produto');
const Categoria = require('./Categoria');
const Subcategoria = require('./Subcategoria');
const Farmacia = require('./Farmacia');
const FarmaciaProduto = require('./FarmaciaProduto');
const Cliente = require('./Cliente');
const Endereco = require('./Endereco');

// ❌ REMOVIDOS (AGORA SÃO LOCAIS NO MOBILE):
// const Pedido = require('./Pedido');
// const ItemCompra = require('./ItemCompra');

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

// ✅ ASSOCIAÇÕES MANTIDAS (ESSENCIAIS)

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

// ❌❌❌ ASSOCIAÇÕES REMOVIDAS (AGORA SÃO LOCAIS NO MOBILE):

// ❌ Cliente tem muitos Pedidos (REMOVER)
// Cliente.hasMany(Pedido, {
//   foreignKey: 'usuario_id',
//   as: 'pedidos'
// });

// ❌ Pedido pertence a um Cliente (REMOVER)
// Pedido.belongsTo(Cliente, {
//   foreignKey: 'usuario_id',
//   as: 'cliente'
// });

// ❌ Pedido tem muitos ItensCompra (REMOVER)
// Pedido.hasMany(ItemCompra, {
//   foreignKey: 'compra_id',
//   as: 'itens'
// });

// ❌ ItemCompra pertence a um Pedido (REMOVER)
// ItemCompra.belongsTo(Pedido, {
//   foreignKey: 'compra_id',
//   as: 'pedido'
// });

// ❌ ItemCompra pertence a um Produto (REMOVER)
// ItemCompra.belongsTo(Produto, {
//   foreignKey: 'produto_id',
//   as: 'produto'
// });

// ❌ Produto tem muitos ItemCompra (REMOVER)
// Produto.hasMany(ItemCompra, {
//   foreignKey: 'produto_id',
//   as: 'itensCompra'
// });

// ❌ Pedido pertence a uma Farmacia (REMOVER)
// Pedido.belongsTo(Farmacia, {
//   foreignKey: 'farmacia_id',
//   as: 'farmacia'
// });

// ❌ Farmacia tem muitos Pedidos (REMOVER)
// Farmacia.hasMany(Pedido, {
//   foreignKey: 'farmacia_id',
//   as: 'pedidos'
// });

console.log('✅ Todas as associações carregadas com sucesso!');
console.log('🎯 PEDIDOS E FIDELIDADE: Agora gerenciados localmente no mobile');

module.exports = {
  Produto,
  Categoria,
  Subcategoria,
  Farmacia,
  FarmaciaProduto,
  Cliente,
  Endereco
  // ❌ REMOVIDOS:
  // Pedido,
  // ItemCompra
};