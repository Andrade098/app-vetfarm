const Cliente = require('../models/Cliente');
const Farmacia = require('../models/Farmacia');
const jwt = require('jsonwebtoken');

class LoginService {
  async login(email, senha) {
    // 1. Verifica se é cliente
    let user = await Cliente.findOne({ where: { email } });
    let tipo = 'cliente';

    // 2. Se não é cliente, tenta buscar como farmácia
    if (!user) {
      user = await Farmacia.findOne({ where: { email } });

      if (user) {
        tipo = user.tipo; // pode ser 'comum' ou 'matriz'
      }
    }

    // 3. Se não achou em tabela nenhuma
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // 4. Valida senha (por enquanto sem bcrypt)
    if (senha !== user.senha) {
      throw new Error('Senha incorreta');
    }

    // 5. Cria token JWT
    const token = jwt.sign(
      {
        id: user.id,
        tipo: tipo,
      },
      process.env.JWT_SECRET || 'segredo',
      { expiresIn: '8h' }
    );

    return {
      id: user.id,
      tipo,
      token,
    };
  }
}

module.exports = new LoginService();
