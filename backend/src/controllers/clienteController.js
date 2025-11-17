console.log('✅ clienteController.js carregado com sucesso!');

const clienteService = require('../services/clienteService');
const { Op } = require('sequelize'); // ⭐⭐ IMPORTE O OP PARA COMPARAÇÕES

exports.criar = async (req, res) => {
  try {
    console.log('🎯🎯🎯 CHEGOU NO CONTROLLER CRIAR! 🎯🎯🎯');
    console.log('📦 BODY COMPLETO RECEBIDO:', JSON.stringify(req.body, null, 2));

    const { nome, sobrenome, cpf, telefone, email, data_nascimento, senha } = req.body;

    console.log('🔍 DADOS RECEBIDOS NO CONTROLLER:');
    console.log('  - nome:', nome);
    console.log('  - sobrenome:', sobrenome);
    console.log('  - cpf:', cpf);
    console.log('  - telefone:', telefone);
    console.log('  - email:', email);
    console.log('  - data_nascimento:', data_nascimento);
    console.log('  - senha:', senha ? '***' : 'FALTANDO');

    // Validação básica no controller
    if (!nome || !sobrenome || !cpf || !telefone || !email || !data_nascimento || !senha) {
      console.log('❌ CAMPOS OBRIGATÓRIOS FALTANDO NO CONTROLLER!');
      return res.status(400).json({
        success: false,
        error: "Preencha todos os campos obrigatórios!"
      });
    }

    if (senha.length < 6) {
      console.log('❌ SENHA MUITO CURTA NO CONTROLLER!');
      return res.status(400).json({
        success: false,
        error: "A senha deve ter pelo menos 6 caracteres!"
      });
    }

    // ⭐⭐ CHAME O SERVICE CORRETAMENTE ⭐⭐
    console.log('🚀 Chamando clienteService.criarCliente...');
    const resultado = await clienteService.criarCliente({
      nome,
      sobrenome,
      cpf,
      telefone,
      email,
      senha,
      data_nascimento
    });

    console.log('✅ SERVICE RETORNOU SUCESSO:', resultado);

    res.status(201).json({
      success: true,
      message: resultado.message,
      cliente: resultado.usuario
    });

  } catch (error) {
    console.error('❌ ERRO NO CONTROLLER:');
    console.error('  - Status:', error.status);
    console.error('  - Mensagem:', error.message);
    console.error('  - Stack:', error.stack);

    res.status(error.status || 500).json({
      success: false,
      error: error.message || 'Erro interno do servidor'
    });
  }
};

// ⭐⭐ NOVO MÉTODO: ATUALIZAR MEUS DADOS ⭐⭐
exports.atualizarMeusDados = async (req, res) => {
  try {
    const userId = req.user.id; // Pegando do token JWT
    const { nome, sobrenome, email, telefone, data_nascimento } = req.body;

    console.log('✏️ CONTROLLER - Atualizando dados do usuário ID:', userId);
    console.log('📦 DADOS PARA ATUALIZAR:', req.body);

    // Validações básicas
    if (!nome || !email) {
      return res.status(400).json({
        success: false,
        error: "Nome e e-mail são obrigatórios!"
      });
    }

    // Busca o cliente
    const Cliente = require('../models/Cliente'); // ⭐⭐ IMPORTE O MODEL
    const cliente = await Cliente.findByPk(userId);
    if (!cliente) {
      return res.status(404).json({
        success: false,
        error: "Cliente não encontrado!"
      });
    }

    // Verifica se email já existe (em outro usuário)
    if (email !== cliente.email) {
      const emailExistente = await Cliente.findOne({
        where: {
          email,
          id: { [Op.ne]: userId } // ID diferente do usuário atual
        }
      });

      if (emailExistente) {
        return res.status(400).json({
          success: false,
          error: "Este e-mail já está em uso por outro usuário!"
        });
      }
    }

    // Atualiza os dados
    await cliente.update({
      nome,
      sobrenome,
      email,
      telefone,
      data_nascimento
    });

    console.log('✅ Dados atualizados com sucesso para o usuário:', userId);

    res.json({
      success: true,
      message: "Dados atualizados com sucesso!",
      usuario: {
        id: cliente.id,
        nome: cliente.nome,
        sobrenome: cliente.sobrenome,
        email: cliente.email,
        telefone: cliente.telefone,
        data_nascimento: cliente.data_nascimento
      }
    });

  } catch (error) {
    console.error('❌ ERRO AO ATUALIZAR DADOS:', error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor"
    });
  }
};

// ⭐⭐ FUNÇÕES ADICIONAIS ⭐⭐
exports.listar = async (req, res) => {
  try {
    console.log('📋 CONTROLLER - Listando todos os clientes');
    const clientes = await clienteService.listarTodos();

    console.log(`✅ Retornando ${clientes.length} clientes`);
    res.json({
      success: true,
      data: clientes
    });

  } catch (error) {
    console.error('❌ Erro ao listar clientes:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

exports.buscar = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 CONTROLLER - Buscando cliente ID: ${id}`);

    const cliente = await clienteService.buscarPorId(id);

    console.log('✅ Cliente encontrado:', cliente ? 'SIM' : 'NÃO');
    res.json({
      success: true,
      data: cliente
    });

  } catch (error) {
    console.error('❌ Erro ao buscar cliente:', error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message
    });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`✏️ CONTROLLER - Atualizando cliente ID: ${id}`);
    console.log('📦 DADOS PARA ATUALIZAR:', req.body);

    const resultado = await clienteService.atualizarCliente(id, req.body);

    console.log('✅ Cliente atualizado com sucesso');
    res.json({
      success: true,
      message: resultado.message,
      data: resultado.usuario
    });

  } catch (error) {
    console.error('❌ Erro ao atualizar cliente:', error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message
    });
  }
};