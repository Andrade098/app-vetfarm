const Cliente = require('../models/Cliente');
const bcrypt = require('bcrypt');

console.log('✅ clienteService.js carregado com sucesso!');

module.exports = {
  async criarCliente(dados) {
    try {
      console.log('🎯🎯🎯 CHEGOU NO SERVICE CRIAR CLIENTE! 🎯🎯🎯');
      console.log('📦 DADOS RECEBIDOS NO SERVICE:', JSON.stringify(dados, null, 2));

      const {
        nome,
        sobrenome,
        cpf,
        telefone,
        email,
        senha,
        data_nascimento
      } = dados;

      console.log('🔍 DADOS RECEBIDOS NO SERVICE:');
      console.log('  - nome:', nome);
      console.log('  - sobrenome:', sobrenome);
      console.log('  - cpf:', cpf);
      console.log('  - telefone:', telefone);
      console.log('  - email:', email);
      console.log('  - senha:', senha ? '***' : 'FALTANDO');
      console.log('  - data_nascimento:', data_nascimento);

      // Validação básica
      if (!nome || !sobrenome || !cpf || !telefone || !email || !senha || !data_nascimento) {
        console.log('❌ CAMPOS OBRIGATÓRIOS FALTANDO!');
        throw { status: 400, message: "Preencha todos os campos obrigatórios!" };
      }

      if (senha.length < 6) {
        console.log('❌ SENHA MUITO CURTA!');
        throw { status: 400, message: "A senha deve ter pelo menos 6 caracteres!" };
      }

      console.log('🔍 VERIFICANDO SE EMAIL JÁ EXISTE...');
      const emailExistente = await Cliente.findOne({ where: { email } });
      if (emailExistente) {
        console.log('❌ EMAIL JÁ CADASTRADO:', email);
        throw { status: 400, message: "E-mail já cadastrado!" };
      }

      console.log('🔍 VERIFICANDO SE CPF JÁ EXISTE...');
      const cpfExistente = await Cliente.findOne({ where: { cpf } });
      if (cpfExistente) {
        console.log('❌ CPF JÁ CADASTRADO:', cpf);
        throw { status: 400, message: "CPF já cadastrado!" };
      }

      console.log('🔐 CRIPTOGRAFANDO SENHA...');
      const senhaHash = await bcrypt.hash(senha, 10);

      console.log('💾 SALVANDO NO BANCO DE DADOS...');

      // ⭐⭐ TRY/CATCH ESPECÍFICO PARA A CRIAÇÃO ⭐⭐
      let novoCliente;
      try {
        novoCliente = await Cliente.create({
          nome: nome.trim(),
          sobrenome: sobrenome.trim(),
          cpf: cpf.trim(), // ⭐⭐ ACEITA CPF SEM FORMATAÇÃO
          telefone: telefone.trim(),
          email: email.trim().toLowerCase(),
          senha: senhaHash,
          data_nascimento: data_nascimento
        });
      } catch (error) {
        console.error('❌ ERRO AO CRIAR NO BANCO:');
        console.error('  - Nome do erro:', error.name);
        console.error('  - Mensagem:', error.message);
        console.error('  - Erros de validação:', error.errors);

        if (error.name === 'SequelizeValidationError') {
          const mensagens = error.errors.map(err => err.message).join(', ');
          throw { status: 400, message: `Erro de validação: ${mensagens}` };
        }

        throw { status: 500, message: `Erro ao salvar no banco: ${error.message}` };
      }

      console.log('✅ CLIENTE CRIADO NO BANCO! ID:', novoCliente.id);
      console.log('📊 DADOS SALVOS:', {
        id: novoCliente.id,
        nome: novoCliente.nome,
        email: novoCliente.email,
        cpf: novoCliente.cpf
      });

      return {
        message: "Usuário cadastrado com sucesso!",
        usuario: {
          id: novoCliente.id,
          nome: novoCliente.nome,
          sobrenome: novoCliente.sobrenome,
          email: novoCliente.email,
          cpf: novoCliente.cpf,
          telefone: novoCliente.telefone,
          data_nascimento: novoCliente.data_nascimento
        }
      };

    } catch (error) {
      console.error('❌ ERRO NO SERVICE CRIAR CLIENTE:');
      console.error('  - Tipo:', error.name);
      console.error('  - Mensagem:', error.message);
      console.error('  - Stack:', error.stack);
      throw error;
    }
  },

  async buscarPorId(id) {
    console.log('🔍 SERVICE - Buscando cliente por ID:', id);
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      throw { status: 404, message: 'Cliente não encontrado' };
    }
    return cliente;
  },

  async buscarPorEmail(email) {
    console.log('🔍 SERVICE - Buscando cliente por email:', email);
    
    const cliente = await Cliente.findOne({ 
        where: { email },
        attributes: [
            'id', 
            'nome', 
            'sobrenome', // ⭐⭐ INCLUA EXPLICITAMENTE
            'email', 
            'telefone', 
            'cpf', 
            'data_nascimento', 
            'senha', // ⭐⭐ NECESSÁRIO PARA COMPARAÇÃO
            
        ]
    });
    
    console.log('🔍 SERVICE - Cliente encontrado:', {
        id: cliente?.id,
        nome: cliente?.nome,
        sobrenome: cliente?.sobrenome, // ⭐⭐ VERIFIQUE AQUI
        email: cliente?.email,
        temSobrenome: !!cliente?.sobrenome
    });
    
    if (!cliente) {
        throw { status: 404, message: 'Cliente não encontrado' };
    }
    
    return cliente;
},

  async atualizarCliente(id, dados) {
    console.log('✏️ SERVICE - Atualizando cliente ID:', id);
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      throw { status: 404, message: 'Cliente não encontrado' };
    }

    const {
      nome,
      sobrenome,
      cpf,
      telefone,
      email,
      senha,
      data_nascimento
    } = dados;

    let senhaHash = cliente.senha;
    if (senha) {
      if (senha.length < 6) {
        throw { status: 400, message: "A senha deve ter pelo menos 6 caracteres!" };
      }
      senhaHash = await bcrypt.hash(senha, 10);
    }

    await cliente.update({
      nome: nome ?? cliente.nome,
      sobrenome: sobrenome ?? cliente.sobrenome,
      cpf: cpf ?? cliente.cpf,
      telefone: telefone ?? cliente.telefone,
      email: email ?? cliente.email,
      senha: senha ? senhaHash : cliente.senha,
      data_nascimento: data_nascimento ?? cliente.data_nascimento
    });

    return {
      message: "Dados atualizados com sucesso!",
      usuario: {
        id: cliente.id,
        nome: cliente.nome,
        sobrenome: cliente.sobrenome,
        email: cliente.email
      }
    };
  },

  async listarTodos() {
    console.log('📋 SERVICE - Listando todos os clientes');
    return await Cliente.findAll();
  }
};