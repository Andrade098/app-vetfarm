const LoginService = require('../services/LoginService');

class LoginController {
  async login(req, res) {
    const { email, senha } = req.body;

    try {
      const resultado = await LoginService.login(email, senha);
      return res.json({
        mensagem: "Login efetuado com sucesso",
        ...resultado
      });

    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  }
}

module.exports = new LoginController();
