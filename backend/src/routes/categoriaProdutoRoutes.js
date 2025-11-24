// routes/categoriaProdutoRoutes.js
const express = require('express');
const router = express.Router();
const categoriaProdutoController = require('../controllers/categoriaProdutoController');

console.log('✅ categoriaProdutoRoutes.js carregado!');

/**
 * @route GET /api/categoria-produto/produtos
 * @description Busca produtos filtrados por categoria e animal
 * @query {Number} categoriaId - ID da categoria
 * @query {String} animal - Nome do animal (Bovinos, Suínos, etc)
 * @query {Number} [page=1] - Página para paginação
 * @query {Number} [limit=20] - Limite de itens por página
 * @returns {Object} Lista de produtos e metadados de paginação
 * 
 * @example
 * GET /api/categoria-produto/produtos?categoriaId=1&animal=Bovinos&page=1&limit=10
 */
router.get('/produtos', categoriaProdutoController.getProdutosFiltrados);

/**
 * @route GET /api/categoria-produto/info/:categoriaId/:animal
 * @description Busca informações da categoria e animal para exibir no header
 * @param {Number} categoriaId - ID da categoria
 * @param {String} animal - Nome do animal
 * @returns {Object} Informações da categoria, animal e contagem de produtos
 * 
 * @example
 * GET /api/categoria-produto/info/1/Bovinos
 */
router.get('/info/:categoriaId/:animal', categoriaProdutoController.getInfoCategoriaAnimal);

/**
 * @route GET /api/categoria-produto/destaque
 * @description Busca produtos em destaque (opcional)
 * @query {Number} [limit=8] - Limite de produtos
 * @returns {Object} Lista de produtos em destaque
 * 
 * @example
 * GET /api/categoria-produto/destaque?limit=6
 */
router.get('/destaque', categoriaProdutoController.getProdutosDestaque);

/**
 * @route GET /api/categoria-produto/health
 * @description Health check da rota
 * @returns {Object} Status da API
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Categoria Produto API está funcionando!',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;