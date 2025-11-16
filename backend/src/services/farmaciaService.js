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
            nome,
            email,
            senha: senhaHash,
            tipo: tipo || 'parceira'  // padrão: parceira  
        });

        return novaFarmacia;
    },

    async listarFarmacias() {
        return await Farmacia.findAll();
    },

    async buscarPorId(id) {
        const farmacia = await Farmacia.findByPk(id);
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

        await farmacia.destroy();
        return true;
    }
};
