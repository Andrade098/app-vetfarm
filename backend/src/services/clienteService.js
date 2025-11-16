const Cliente = require('../models/Cliente');
const bcrypt = require('bcrypt');

module.exports = {
  async criarCliente(dados) {
    const {
      nome,
      sobrenome,
      cpf,
      telefone,
      email,
      senha,
      confirmarSenha,
      data_nascimento
    } = dados;

    if (!nome || !sobrenome || !cpf || !telefone || !email || !senha || !confirmarSenha || !data_nascimento) {
      throw { status: 400, message: "Preencha todos os campos!" };
    }

    if (senha !== confirmarSenha) {
      throw { status: 400, message: "As senhas não coincidem!" };
    }

    if (senha.length < 6) {
      throw { status: 400, message: "A senha deve ter pelo menos 6 caracteres!" };
    }

    const emailExistente = await Cliente.findOne({ where: { email } });
    if (emailExistente) {
      throw { status: 400, message: "E-mail já cadastrado!" };
    }

    const cpfExistente = await Cliente.findOne({ where: { cpf } });
    if (cpfExistente) {
      throw { status: 400, message: "CPF já cadastrado!" };
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const novoCliente = await Cliente.create({
      nome,
      sobrenome,
      cpf,
      telefone,
      email,
      senha: senhaHash,
      data_nascimento
    });

    return {
      message: "Usuário cadastrado com sucesso!",
      usuario: {
        id: novoCliente.id,
        nome: novoCliente.nome,
        sobrenome: novoCliente.sobrenome,
        email: novoCliente.email
      }
    };
  },

  async buscarPorId(id) {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      throw { status: 404, message: 'Cliente não encontrado' };
    }
    return cliente;
  },

  async atualizarCliente(id, dados) {
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
    return await Cliente.findAll();
  }
};
