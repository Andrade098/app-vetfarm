const farmaciaService = require('../services/farmaciaService');

module.exports = {
    async criar(req, res) {
        try {
            const novaFarmacia = await farmaciaService.criarFarmacia(req.body);
            return res.status(201).json(novaFarmacia);
        } catch (err) {
            return res.status(err.status || 500).json({ error: err.message });
        }
    },

    async listar(req, res) {
        try {
            const farmacias = await farmaciaService.listarFarmacias();
            return res.json(farmacias);
        } catch (err) {
            return res.status(500).json({ error: "Erro ao listar farmácias" });
        }
    },

    async buscar(req, res) {
        try {
            const farmacia = await farmaciaService.buscarPorId(req.params.id);
            return res.json(farmacia);
        } catch (err) {
            return res.status(err.status || 500).json({ error: err.message });
        }
    },

    async atualizar(req, res) {
        try {
            const farmaciaAtualizada = await farmaciaService.atualizarFarmacia(req.params.id, req.body);
            return res.json(farmaciaAtualizada);
        } catch (err) {
            return res.status(err.status || 500).json({ error: err.message });
        }
    },

    async deletar(req, res) {
        try {
            await farmaciaService.deletarFarmacia(req.params.id);
            return res.json({ message: "Farmácia removida com sucesso" });
        } catch (err) {
            return res.status(err.status || 500).json({ error: err.message });
        }
    },

    // NOVAS FUNÇÕES PARA GERENCIAR PARCEIROS
    async listarParceiros(req, res) {
        try {
            const parceiros = await farmaciaService.listarFiliais();
            return res.json(parceiros);
        } catch (err) {
            return res.status(err.status || 500).json({ error: err.message });
        }
    },

    async adicionarParceiro(req, res) {
        try {
            const dadosParceiro = {
                ...req.body,
                tipo: 'filial'
            };
            const novoParceiro = await farmaciaService.criarFarmacia(dadosParceiro);
            return res.status(201).json(novoParceiro);
        } catch (err) {
            return res.status(err.status || 500).json({ error: err.message });
        }
    },

    async editarParceiro(req, res) {
        try {
            const parceiroAtualizado = await farmaciaService.atualizarFarmacia(req.params.id, req.body);
            return res.json(parceiroAtualizado);
        } catch (err) {
            return res.status(err.status || 500).json({ error: err.message });
        }
    },

    async excluirParceiro(req, res) {
        try {
            await farmaciaService.deletarFarmacia(req.params.id);
            return res.json({ message: "Parceiro removido com sucesso" });
        } catch (err) {
            return res.status(err.status || 500).json({ error: err.message });
        }
    },

    async verificarTipo(req, res) {
        try {
            const farmacia = await farmaciaService.buscarPorId(req.user.id);
            return res.json({ tipo: farmacia.tipo });
        } catch (err) {
            return res.status(err.status || 500).json({ error: err.message });
        }
    }
};