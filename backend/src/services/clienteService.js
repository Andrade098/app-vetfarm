const Cliente = require('../models/Cliente');
const bcrypt = require('bcrypt');

module.exports = {
    async criarCliente(dados) {
        const { nome, email, senha } = dados;

        // Verifica se já existe
        const existe = await Cliente.findOne({ where: { email } });
        if (existe) {
            throw { status: 400, message: 'Email já cadastrado' };
        }

        // Criptografa senha
        const senhaHash = await bcrypt.hash(senha, 10);

        const novoCliente = await Cliente.create({
            nome,
            email,
            senha: senhaHash
        });

        return novoCliente;
    },

    async listarClientes() {
        return await Cliente.findAll();
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

        if (dados.senha) {
            dados.senha = await bcrypt.hash(dados.senha, 10);
        }

        await cliente.update(dados);
        return cliente;
    },
};
