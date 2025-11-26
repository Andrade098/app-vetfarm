// controllers/pedidoController.js
const pedidoService = require('../services/pedidoService');

module.exports = {
  async criar(req, res) {
    try {
      console.log('📦 Recebendo solicitação de pedido:', req.body);
      const resultado = await pedidoService.criarPedido(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Pedido criado com sucesso!',
        ...resultado
      });
      
    } catch (error) {
      console.error('💥 Erro ao criar pedido:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  async listarPorCliente(req, res) {
    try {
      const { cliente_id } = req.params;
      const pedidos = await pedidoService.listarPedidosCliente(cliente_id);
      
      // ✅ CALCULAR PONTOS TOTAIS DO CLIENTE
      const beneficios = await pedidoService.verificarBeneficios(cliente_id);
      
      res.json({
        success: true,
        pedidos,
        total: pedidos.length,
        fidelidade: beneficios // ✅ INCLUI INFORMAÇÕES DE FIDELIDADE
      });
      
    } catch (error) {
      console.error('💥 Erro ao listar pedidos:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  async obterDetalhes(req, res) {
    try {
      const { pedido_id } = req.params;
      const pedido = await pedidoService.obterPedidoCompleto(pedido_id);
      
      res.json({
        success: true,
        pedido,
        // ✅ INCLUI MENSAGEM SOBRE PONTOS
        mensagemPontos: pedido ? `Este pedido gerou ${pedido.pontos_ganhos} pontos` : null
      });
      
    } catch (error) {
      console.error('💥 Erro ao obter pedido:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  async atualizarStatus(req, res) {
    try {
      const { pedido_id } = req.params;
      const { status } = req.body;
      
      console.log(`🔄 Atualizando pedido ${pedido_id} para status: ${status}`);
      const pedido = await pedidoService.atualizarStatus(pedido_id, status);
      
      res.json({
        success: true,
        message: `Status do pedido atualizado para: ${status}`,
        pedido
      });
      
    } catch (error) {
      console.error('💥 Erro ao atualizar status:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // ✅ NOVO MÉTODO: Calcular pontos antes de finalizar compra
  async calcularPontosPreview(req, res) {
    try {
      console.log('🧮 Calculando preview de pontos:', req.body);
      const resultado = await pedidoService.calcularPontosPreview(req.body);
      
      res.json({
        success: true,
        message: 'Cálculo de pontos realizado com sucesso',
        ...resultado
      });
      
    } catch (error) {
      console.error('💥 Erro ao calcular pontos:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // ✅ NOVO MÉTODO: Verificar benefícios do cliente
  async verificarBeneficios(req, res) {
    try {
      const { cliente_id } = req.params;
      const beneficios = await pedidoService.verificarBeneficios(cliente_id);
      
      res.json({
        success: true,
        ...beneficios
      });
      
    } catch (error) {
      console.error('💥 Erro ao verificar benefícios:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
};