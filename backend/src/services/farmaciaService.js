const Farmacia = require('../models/Farmacia');
const bcrypt = require('bcrypt');

module.exports = {
    async criarFarmacia(dados) {
        const { nome, email, senha, tipo } = dados;

        // Verifica email duplicado
        const existe = await Farmacia.findOne({ where: { email } });
        if (existe) {
            throw { status: 400, message: 'Email já está em uso por outra farmácia' };
        }

        // Criptografia da senha
        const senhaHash = await bcrypt.hash(senha, 10);

        const novaFarmacia = await Farmacia.create({
            ...dados,
            senha: senhaHash,
            tipo: tipo || 'filial'
        });

        return novaFarmacia;
    },

    async listarFarmacias() {
        return await Farmacia.findAll();
    },

    async listarFiliais() {
        return await Farmacia.findAll({
            where: { tipo: 'filial' }
        });
    },

    async buscarPorId(id) {
        const farmacia = await Farmacia.findByPk(id);
        if (!farmacia) {
            throw { status: 404, message: "Farmácia não encontrada" };
        }
        return farmacia;
    },

    async buscarPorEmail(email) {
        const farmacia = await Farmacia.findOne({ where: { email } });
        if (!farmacia) {
            throw { status: 404, message: "Farmácia não encontrada" };
        }
        return farmacia;
    },

    async atualizarFarmacia(id, dados) {
        const farmacia = await Farmacia.findByPk(id);
        if (!farmacia) {
            throw { status: 404, message: "Farmácia não encontrada" };
        }

        // Impedir que filial vire matriz via atualização
        if (dados.tipo && farmacia.tipo === 'filial' && dados.tipo === 'matriz') {
            throw { status: 403, message: "Filial não pode se tornar matriz" };
        }

        // Se atualizar senha
        if (dados.senha) {
            dados.senha = await bcrypt.hash(dados.senha, 10);
        }

        await farmacia.update(dados);
        return farmacia;
    },

    async deletarFarmacia(id) {
        const farmacia = await Farmacia.findByPk(id);
        if (!farmacia) {
            throw { status: 404, message: "Farmácia não encontrada" };
        }

        // Impedir exclusão de matriz
        if (farmacia.tipo === 'matriz') {
            throw { status: 403, message: "Não é possível excluir uma farmácia matriz" };
        }

        await farmacia.destroy();
        return true;
    }
};