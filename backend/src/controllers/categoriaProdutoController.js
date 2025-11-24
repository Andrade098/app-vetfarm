// controllers/categoriaProdutoController.js
const produtoService = require('../services/produtoService');

/**
 * Controller para buscar produtos filtrados
 */
const getProdutosFiltrados = async (req, res) => {
  try {
    const { categoriaId, animal, page = 1, limit = 20 } = req.query;
    
    console.log(`🎯 [Controller] Recebida requisição: Categoria ${categoriaId}, Animal ${animal}`);

    // Validações
    if (!categoriaId || !animal) {
      return res.status(400).json({
        success: false,
        message: 'Parâmetros obrigatórios: categoriaId e animal',
        details: 'Exemplo: /api/categoria-produto/produtos?categoriaId=1&animal=Bovinos'
      });
    }

    if (isNaN(categoriaId)) {
      return res.status(400).json({
        success: false,
        message: 'categoriaId deve ser um número'
      });
    }

    const resultado = await produtoService.getProdutosFiltrados({
      categoriaId: parseInt(categoriaId),
      animal: animal.trim(),
      page: parseInt(page),
      limit: parseInt(limit)
    });

    // Resposta de sucesso
    res.status(200).json({
      success: true,
      message: `Encontrados ${resultado.total} produtos`,
      data: resultado
    });

  } catch (error) {
    console.error('❌ [Controller] Erro em getProdutosFiltrados:', error);
    
    // Respostas específicas para diferentes erros
    if (error.message.includes('não encontrada') || error.message.includes('não encontrado')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao buscar produtos',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Controller para buscar informações da categoria e animal
 */
const getInfoCategoriaAnimal = async (req, res) => {
  try {
    const { categoriaId, animal } = req.params;
    
    console.log(`🔍 [Controller] Buscando info: Categoria ${categoriaId}, Animal ${animal}`);

    if (!categoriaId || !animal) {
      return res.status(400).json({
        success: false,
        message: 'categoriaId e animal são obrigatórios'
      });
    }

    if (isNaN(categoriaId)) {
      return res.status(400).json({
        success: false,
        message: 'categoriaId deve ser um número'
      });
    }

    const info = await produtoService.getInfoCategoriaAnimal(
      parseInt(categoriaId), 
      animal.trim()
    );

    res.status(200).json({
      success: true,
      message: 'Informações encontradas com sucesso',
      data: info
    });

  } catch (error) {
    console.error('❌ [Controller] Erro em getInfoCategoriaAnimal:', error);
    
    if (error.message.includes('não encontrada') || error.message.includes('não encontrado')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno ao buscar informações',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Controller para produtos em destaque (opcional)
 */
const getProdutosDestaque = async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    
    const produtos = await produtoService.getProdutosDestaque(parseInt(limit));

    res.status(200).json({
      success: true,
      message: `Encontrados ${produtos.length} produtos em destaque`,
      data: produtos
    });

  } catch (error) {
    console.error('❌ [Controller] Erro em getProdutosDestaque:', error);
    
    res.status(500).json({
      success: false,
      message: 'Erro interno ao buscar produtos em destaque',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getProdutosFiltrados,
  getInfoCategoriaAnimal,
  getProdutosDestaque
};