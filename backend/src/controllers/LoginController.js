const LoginService = require('../services/LoginService');

console.log('✅ LoginController.js carregado!');

class LoginController {
  async login(req, res) {
    const { email, senha } = req.body;

    console.log('🔐 CONTROLLER - Recebendo tentativa de login:');
    console.log('  - Email:', email);
    console.log('  - Senha:', senha ? '***' : 'FALTANDO');

    try {
      if (!email || !senha) {
        console.log('❌ Dados incompletos no login');
        return res.status(400).json({
          success: false,
          error: "E-mail e senha são obrigatórios!"
        });
      }

      const resultado = await LoginService.login(email, senha);

      console.log('✅ Login realizado com sucesso para:', resultado.email);

      return res.json({
        success: true,
        mensagem: "Login efetuado com sucesso",
        ...resultado
      });

    } catch (error) {
      console.error('❌ ERRO NO LOGIN CONTROLLER:', error.message);
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new LoginController();