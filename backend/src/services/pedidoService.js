// services/pedidoService.js
const { Pedido, ItemCompra, Cliente, Produto, FarmaciaProduto, Sequelize } = require('../models/associations');
const db = require('../config/db');
// ✅ CORREÇÃO: Importar Op diretamente do Sequelize
const { Op } = require('sequelize');

class PedidoService {
  
  async criarPedido(dadosPedido) {
    const transaction = await db.transaction();
    
    try {
      const { 
        usuario_id, 
        farmacia_id, 
        itens, 
        endereco_entrega, 
        forma_pagamento, 
        data_entrega_prevista,
        usarDesconto = false 
      } = dadosPedido;
      
      // 1. BUSCAR CLIENTE
      const cliente = await Cliente.findByPk(usuario_id, { transaction });
      if (!cliente) throw new Error('Cliente não encontrado');

      // 2. GERAR NÚMERO DO PEDIDO
      const numeroPedido = 'PED' + Date.now();

      // 3. CALCULAR VALOR TOTAL
      let valorTotal = 0;
      const itensCompletos = [];
      
      for (const item of itens) {
        const farmaciaProduto = await FarmaciaProduto.findOne({
          where: { 
            farmacia_id: farmacia_id,
            produto_id: item.produto_id
          },
          transaction
        });
        
        if (!farmaciaProduto) throw new Error(`Produto não disponível na farmácia`);
        if (farmaciaProduto.estoque < item.quantidade) throw new Error(`Estoque insuficiente`);

        const subtotal = farmaciaProduto.preco_venda * item.quantidade;
        valorTotal += subtotal;
        
        itensCompletos.push({
          ...item,
          preco_unitario: farmaciaProduto.preco_venda,
          subtotal: subtotal
        });

        // RESERVAR ESTOQUE
        farmaciaProduto.estoque_reservado = (farmaciaProduto.estoque_reservado || 0) + item.quantidade;
        await farmaciaProduto.save({ transaction });
      }

      // 4. APLICAR DESCONTO
      let descontoAplicado = 0;
      let valorParaPontos = valorTotal;
      
      if (usarDesconto && cliente.desconto_proxima_compra > 0) {
        const descontoPercentual = cliente.desconto_proxima_compra;
        descontoAplicado = (valorTotal * descontoPercentual) / 100;
        valorTotal = Math.max(0, valorTotal - descontoAplicado);
        
        cliente.desconto_proxima_compra = 0;
        cliente.data_expiracao_desconto = null;
        await cliente.save({ transaction });
      }

      // 5. CALCULAR PONTOS
      const pontosGanhos = this.calcularPontos(valorParaPontos);
      const descontoFuturo = this.calcularDescontoFuturo(valorParaPontos);

      // 6. CRIAR PEDIDO
      const pedido = await Pedido.create({
        usuario_id,
        farmacia_id,
        numero_pedido: numeroPedido,
        codigo_rastreio: null,
        status: 'pendente',
        valor_total: valorTotal,
        pontos_ganhos: pontosGanhos,
        desconto_fidelidade_aplicado: descontoAplicado,
        endereco_entrega,
        forma_pagamento,
        data_entrega_prevista,
        data_pedido: new Date()
      }, { transaction });

      // 7. CRIAR ITENS
      await ItemCompra.bulkCreate(
        itensCompletos.map(item => ({
          compra_id: pedido.id,
          produto_id: item.produto_id,
          quantidade: item.quantidade,
          preco_unitario: item.preco_unitario
        })),
        { transaction }
      );

      await transaction.commit();

      return {
        pedido,
        itens: itensCompletos,
        pontosGanhos,
        descontoAplicado,
        descontoFuturo,
        valorOriginal: valorParaPontos,
        valorFinal: valorTotal,
        mensagem: 'Pontos serão creditados quando o pedido for entregue'
      };

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async atualizarStatus(pedido_id, novoStatus) {
    const transaction = await db.transaction();
    
    try {
      const pedido = await Pedido.findByPk(pedido_id, {
        include: [{
          model: Cliente,
          as: 'cliente'
        }, {
          model: ItemCompra,
          as: 'itens'
        }],
        transaction
      });

      if (!pedido) throw new Error('Pedido não encontrado');

      // LIBERAR PONTOS QUANDO ENTREGUE
      if (novoStatus === 'entregue' && pedido.status !== 'entregue') {
        const cliente = pedido.cliente;
        
        cliente.pontos_fidelidade += pedido.pontos_ganhos;
        
        const descontoFuturo = this.calcularDescontoFuturo(pedido.valor_total + pedido.desconto_fidelidade_aplicado);
        if (descontoFuturo > 0) {
          cliente.desconto_proxima_compra = descontoFuturo;
          cliente.data_expiracao_desconto = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        }

        await cliente.save({ transaction });

        // DEBITAR ESTOQUE
        for (const item of pedido.itens) {
          const farmaciaProduto = await FarmaciaProduto.findOne({
            where: {
              farmacia_id: pedido.farmacia_id,
              produto_id: item.produto_id
            },
            transaction
          });
          
          if (farmaciaProduto) {
            farmaciaProduto.estoque -= item.quantidade;
            farmaciaProduto.estoque_reservado = Math.max(0, (farmaciaProduto.estoque_reservado || 0) - item.quantidade);
            await farmaciaProduto.save({ transaction });
          }
        }
      }

      // CANCELAR: LIBERAR ESTOQUE
      if (novoStatus === 'cancelado' && pedido.status !== 'cancelado') {
        for (const item of pedido.itens) {
          const farmaciaProduto = await FarmaciaProduto.findOne({
            where: {
              farmacia_id: pedido.farmacia_id,
              produto_id: item.produto_id
            },
            transaction
          });
          
          if (farmaciaProduto) {
            farmaciaProduto.estoque_reservado = Math.max(0, (farmaciaProduto.estoque_reservado || 0) - item.quantidade);
            await farmaciaProduto.save({ transaction });
          }
        }
      }

      pedido.status = novoStatus;
      await pedido.save({ transaction });

      await transaction.commit();
      return pedido;

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async listarPedidosCliente(cliente_id) {
    return await Pedido.findAll({
      where: { usuario_id: cliente_id },
      include: [{
        model: ItemCompra,
        as: 'itens',
        include: [{
          model: Produto,
          as: 'produto'
        }]
      }],
      order: [['createdAt', 'DESC']]
    });
  }

  async obterPedidoCompleto(pedido_id) {
    return await Pedido.findByPk(pedido_id, {
      include: [
        {
          model: ItemCompra,
          as: 'itens',
          include: [{
            model: Produto,
            as: 'produto'
          }]
        },
        {
          model: Cliente,
          as: 'cliente'
        }
      ]
    });
  }

  async verificarBeneficios(cliente_id) {
    const cliente = await Cliente.findByPk(cliente_id);
    if (!cliente) throw new Error('Cliente não encontrado');

    const pontosParaMeta = Math.max(0, 1000 - cliente.pontos_fidelidade);
    const premioLiberado = cliente.pontos_fidelidade >= 1000;
    const progressoMeta = ((cliente.pontos_fidelidade / 1000) * 100).toFixed(1) + '%';

    return {
      pontosAtuais: cliente.pontos_fidelidade,
      descontoDisponivel: cliente.desconto_proxima_compra,
      dataExpiracaoDesconto: cliente.data_expiracao_desconto,
      pontosParaMeta,
      premioLiberado,
      progressoMeta
    };
  }

  // ✅ MÉTODO NOVO: Calcular pontos para preview (sem criar pedido)
  async calcularPontosPreview(dadosCalculo) {
    const { itens, farmacia_id, usarDesconto = false, cliente_id = null } = dadosCalculo;
    
    let valorTotal = 0;
    
    // Calcular valor total dos itens
    for (const item of itens) {
      const farmaciaProduto = await FarmaciaProduto.findOne({
        where: { 
          farmacia_id: farmacia_id,
          produto_id: item.produto_id
        }
      });
      
      if (!farmaciaProduto) throw new Error(`Produto não disponível na farmácia`);

      const subtotal = farmaciaProduto.preco_venda * item.quantidade;
      valorTotal += subtotal;
    }

    // Aplicar desconto se solicitado
    let valorParaPontos = valorTotal;
    let descontoAplicado = 0;

    if (usarDesconto && cliente_id) {
      const cliente = await Cliente.findByPk(cliente_id);
      if (cliente && cliente.desconto_proxima_compra > 0) {
        const descontoPercentual = cliente.desconto_proxima_compra;
        descontoAplicado = (valorTotal * descontoPercentual) / 100;
        valorTotal = Math.max(0, valorTotal - descontoAplicado);
      }
    }

    // Calcular pontos e benefícios futuros
    const pontosGanhos = this.calcularPontos(valorParaPontos);
    const descontoFuturo = this.calcularDescontoFuturo(valorParaPontos);

    return {
      valorOriginal: valorParaPontos,
      valorFinal: valorTotal,
      pontosGanhos,
      descontoAplicado,
      descontoFuturo,
      itensCount: itens.length
    };
  }

  calcularPontos(valorCompra) {
    if (valorCompra >= 500) return 50;
    if (valorCompra >= 350) return 35;
    if (valorCompra >= 250) return 20;
    if (valorCompra >= 100) return 10;
    return Math.floor(valorCompra / 10);
  }

  calcularDescontoFuturo(valorCompra) {
    if (valorCompra >= 500) return 20.00;
    if (valorCompra >= 350) return 10.00;
    return 0;
  }
}

module.exports = new PedidoService();