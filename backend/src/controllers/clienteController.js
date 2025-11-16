const clienteService = require('../services/clienteService');

module.exports = {
  async criar(req, res) {
    try {
      const novoCliente = await clienteService.criarCliente(req.body);
      return res.status(201).json(novoCliente);
    } catch (err) {
      console.error(err);
      return res.status(err.status || 500).json({ error: err.message });
    }
  },

  async buscar(req, res) {
    try {
      const cliente = await clienteService.buscarPorId(req.params.id);
      return res.json(cliente);
    } catch (err) {
      console.error(err);
      return res.status(err.status || 500).json({ error: err.message });
    }
  },

  async atualizar(req, res) {
    try {
      const clienteAtualizado = await clienteService.atualizarCliente(req.params.id, req.body);
      return res.json(clienteAtualizado);
    } catch (err) {
      console.error(err);
      return res.status(err.status || 500).json({ error: err.message });
    }
  },

  async listar(req, res) {
    try {
      const clientes = await clienteService.listarTodos();
      return res.json(clientes);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao listar clientes" });
    }
  }
};
