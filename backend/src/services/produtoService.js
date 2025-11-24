// services/produtoService.js - VERSÃO CORRIGIDA COM preco_venda
const sequelize = require('../config/db');

class ProdutoService {
  
  async getProdutosFiltrados(filtros = {}) {
    try {
      const { categoriaId, animal, page = 1, limit = 20 } = filtros;
      const offset = (page - 1) * limit;

      // ✅ QUERY COM preco_venda CORRETO
      const query = `
        SELECT DISTINCT
          p.id,
          p.nome,
          p.descricao,
          p.imagens,
          c.nome as categoria_nome,
          s.nome as animal,
          fp.preco_venda,        -- ✅ CORRIGIDO: preco_venda
          fp.estoque,
          f.nome as farmacia_nome,
          f.endereco as farmacia_endereco
        FROM farmacia_produtos fp
        INNER JOIN produtos p ON fp.produto_id = p.id
        INNER JOIN categorias c ON p.categoria_id = c.id
        INNER JOIN subcategorias s ON p.subcategoria_id = s.id
        INNER JOIN farmacia f ON fp.farmacia_id = f.id
        WHERE fp.estoque > 0 
          AND p.categoria_id = :categoriaId
          AND s.nome = :animal
        ORDER BY p.nome
        LIMIT :limit OFFSET :offset
      `;

      const produtos = await sequelize.query(query, {
        replacements: { categoriaId, animal, limit, offset },
        type: sequelize.QueryTypes.SELECT
      });

      // ✅ MONTAR RESPOSTA COM preco_venda
      // services/produtoService.js - Garantir que preço seja número
const produtosAgrupados = produtos.reduce((acc, row) => {
  if (!acc[row.id]) {
    acc[row.id] = {
      id: row.id,
      nome: row.nome,
      descricao: row.descricao,
      imagem: row.imagens,
      Categoria: {
        nome: row.categoria_nome,
      },
      Subcategoria: {
        nome: row.animal
      },
      FarmaciaProdutos: []
    };
  }
  
  // ✅ GARANTIR que preço seja número
  const precoNumerico = parseFloat(row.preco_venda) || 0;
  
  acc[row.id].FarmaciaProdutos.push({
    preco: precoNumerico,  // ✅ AGORA É NÚMERO
    estoque: parseInt(row.estoque) || 0, // ✅ Garantir que estoque seja número
    Farmacia: {
      nome: row.farmacia_nome,
      endereco: row.farmacia_endereco
    }
  });
  
  return acc;
}, {});

      const produtosArray = Object.values(produtosAgrupados);

      console.log(`✅ [ProdutoService] ${produtosArray.length} produtos para ${animal}`);

      return {
        produtos: produtosArray,
        total: produtosArray.length,
        totalPages: Math.ceil(produtosArray.length / limit),
        currentPage: parseInt(page),
        filtrosAplicados: { categoriaId, animal }
      };

    } catch (error) {
      console.error('❌ [ProdutoService] Erro:', error);
      throw error;
    }
  }

  async getInfoCategoriaAnimal(categoriaId, animal) {
    try {
      const query = `
        SELECT 
          c.nome as categoria_nome,
          c.descricao as categoria_descricao
        FROM categorias c
        WHERE c.id = :categoriaId
      `;

      const [categoria] = await sequelize.query(query, {
        replacements: { categoriaId },
        type: sequelize.QueryTypes.SELECT
      });

      if (!categoria) {
        throw new Error('Categoria não encontrada');
      }

      // ✅ CONTAGEM COM preco_venda CORRETO
      const countQuery = `
        SELECT COUNT(DISTINCT p.id) as total
        FROM farmacia_produtos fp
        INNER JOIN produtos p ON fp.produto_id = p.id
        INNER JOIN subcategorias s ON p.subcategoria_id = s.id
        WHERE fp.estoque > 0 
          AND p.categoria_id = :categoriaId
          AND s.nome = :animal
      `;

      const [result] = await sequelize.query(countQuery, {
        replacements: { categoriaId, animal },
        type: sequelize.QueryTypes.SELECT
      });

      return {
        categoria: {
          id: categoriaId,
          nome: categoria.categoria_nome,
          descricao: categoria.categoria_descricao,
        },
        animal: animal,
        totalProdutos: result.total,
        descricao: `${categoria.categoria_nome} para ${animal}`
      };

    } catch (error) {
      console.error('❌ [ProdutoService] Erro:', error);
      throw error;
    }
  }
}

module.exports = new ProdutoService();