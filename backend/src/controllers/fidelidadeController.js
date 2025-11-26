// controllers/fidelidadeController.js
const pedidoService = require('../services/pedidoService');
const { Pedido, ItemCompra, Produto, Cliente } = require('../models/associations');
// ✅ CORREÇÃO: Importar Op diretamente do sequelize
const { Op } = require('sequelize');

module.exports = {
  // 💰 VER SALDO DE PONTOS E BENEFÍCIOS
  async verSaldo(req, res) {
    try {
      const { cliente_id } = req.params;
      
      console.log('💰 Buscando saldo para cliente:', cliente_id);
      
      const beneficios = await pedidoService.verificarBeneficios(cliente_id);
      
      console.log('✅ Saldo encontrado:', beneficios);
      
      res.json({
        success: true,
        ...beneficios
      });
      
    } catch (error) {
      console.error('💥 Erro ao ver saldo:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // 📜 HISTÓRICO DE GANHO DE PONTOS
  async historicoPontos(req, res) {
    try {
      const { cliente_id } = req.params;
      
      console.log('📊 Buscando histórico para cliente:', cliente_id);
      
      // Buscar pedidos onde ganhou pontos
      const pedidosComPontos = await Pedido.findAll({
        where: { 
          usuario_id: cliente_id,
          pontos_ganhos: { [Op.gt]: 0 }
        },
        include: [{
          model: ItemCompra,
          as: 'itens',
          include: [{
            model: Produto,
            as: 'produto',
            attributes: ['nome']
          }]
        }],
        attributes: ['id', 'valor_total', 'pontos_ganhos', 'data_pedido', 'createdAt'],
        order: [['createdAt', 'DESC']]
      });

      // Formatar dados para o frontend
      const historicoFormatado = pedidosComPontos.map(pedido => {
        // Pegar o nome do primeiro produto como descrição
        const primeiroProduto = pedido.itens?.[0]?.produto?.nome || 'Produtos diversos';
        
        return {
          id: pedido.id.toString(),
          data: pedido.data_pedido 
            ? new Date(pedido.data_pedido).toISOString()
            : new Date(pedido.createdAt).toISOString(),
          descricao: `Compra - ${primeiroProduto}`,
          valor: parseFloat(pedido.valor_total) || 0,
          pontos: pedido.pontos_ganhos,
          tipo: 'ganho'
        };
      });

      console.log(`✅ Histórico encontrado: ${historicoFormatado.length} transações`);

      res.json({
        success: true,
        historico: historicoFormatado,
        total: historicoFormatado.length
      });
      
    } catch (error) {
      console.error('💥 Erro ao buscar histórico:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // 🏆 VERIFICAR PRÊMIO DO VETERINÁRIO
  async verificarPremio(req, res) {
    try {
      const { cliente_id } = req.params;
      
      const cliente = await Cliente.findByPk(cliente_id);
      if (!cliente) throw new Error('Cliente não encontrado');
      
      const premioLiberado = cliente.pontos_fidelidade >= 1000;
      const pontosFaltantes = Math.max(0, 1000 - cliente.pontos_fidelidade);
      
      res.json({
        success: true,
        premioLiberado,
        pontosAtuais: cliente.pontos_fidelidade,
        pontosFaltantes,
        progresso: ((cliente.pontos_fidelidade / 1000) * 100).toFixed(1) + '%',
        premio: 'Visitação gratuita do veterinário parceiro'
      });
      
    } catch (error) {
      console.error('💥 Erro ao verificar prêmio:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // 🎁 RESGATAR PRÊMIO DO VETERINÁRIO
  async resgatarPremio(req, res) {
    try {
      const { cliente_id } = req.params;
      
      const cliente = await Cliente.findByPk(cliente_id);
      if (!cliente) throw new Error('Cliente não encontrado');
      
      if (cliente.pontos_fidelidade < 1000) {
        return res.status(400).json({
          success: false,
          error: 'Pontos insuficientes. Faltam ' + (1000 - cliente.pontos_fidelidade) + ' pontos para resgatar o prêmio.'
        });
      }
      
      // Zera os pontos (ou debita 1000 pontos se quiser manter o restante)
      const pontosAntigos = cliente.pontos_fidelidade;
      cliente.pontos_fidelidade = 0;
      
      await cliente.save();
      
      res.json({
        success: true,
        message: 'Prêmio resgatado com sucesso! Visitação gratuita do veterinário liberada.',
        pontosUtilizados: 1000,
        pontosAntigos,
        pontosAtuais: cliente.pontos_fidelidade,
        premio: 'Visitação gratuita do veterinário parceiro'
      });
      
    } catch (error) {
      console.error('💥 Erro ao resgatar prêmio:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // ℹ️ REGRAS DO PROGRAMA DE FIDELIDADE
  async regras(req, res) {
    try {
      const regras = {
        escalaPontos: [
          { valor: 'R$ 500+', pontos: 50, desconto: '20% próxima compra' },
          { valor: 'R$ 350-499', pontos: 35, desconto: '10% próxima compra' },
          { valor: 'R$ 250-349', pontos: 20, desconto: '-' },
          { valor: 'R$ 100-249', pontos: 10, desconto: '-' },
          { valor: 'Abaixo R$ 100', pontos: '1 ponto a cada R$ 10', desconto: '-' }
        ],
        meta: {
          pontosNecessarios: 1000,
          premio: 'Visitação gratuita do veterinário parceiro',
          descricao: 'Acumule 1.000 pontos e ganhe uma visitação gratuita'
        },
        observacoes: [
          'Pontos são creditados quando o pedido é entregue',
          'Descontos são válidos por 30 dias',
          'Prêmio pode ser resgatado uma vez'
        ]
      };
      
      res.json({
        success: true,
        ...regras
      });
      
    } catch (error) {
      console.error('💥 Erro ao buscar regras:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
};