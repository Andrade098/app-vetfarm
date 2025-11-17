const Cliente = require('../models/Cliente');
const Farmacia = require('../models/Farmacia');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

console.log('✅ LoginService.js carregado!');

class LoginService {
  async login(email, senha) {
    try {
      console.log('🔐 SERVICE - Tentativa de login:', email);
      console.log('🔐 Senha fornecida:', senha ? '***' : 'FALTANDO');

      // 1. Verifica se é cliente
      let user = await Cliente.findOne({ where: { email } });
      let tipo = 'cliente';

      console.log('🔍 Buscando cliente...', user ? 'ENCONTRADO' : 'NÃO ENCONTRADO');

      // 2. Se não é cliente, tenta buscar como farmácia
      if (!user) {
        console.log('🔍 Buscando farmácia...');
        user = await Farmacia.findOne({ where: { email } });

        if (user) {
          tipo = user.tipo; // pode ser 'comum' ou 'matriz'
          console.log('🏥 Farmácia encontrada, tipo:', tipo);
        }
      }

      // 3. Se não achou em tabela nenhuma
      if (!user) {
        console.log('❌ Usuário não encontrado em nenhuma tabela');
        throw new Error('Usuário não encontrado');
      }

      console.log('✅ Usuário encontrado:', {
        id: user.id,
        tipo: tipo,
        nome: user.nome,
        sobrenome: user.sobrenome, // ⭐⭐ ADICIONADO
        telefone: user.telefone,
        cpf: user.cpf,
        data_nascimento: user.data_nascimento,
        temHash: user.senha.startsWith('$2b$') ? 'SIM (bcrypt)' : 'NÃO (texto)'
      });

      // 4. VALIDA SENHA CORRETAMENTE
      console.log('🔐 Validando senha...');

      let senhaValida = false;

      // Se a senha no banco começa com $2b$ (formato bcrypt)
      if (user.senha.startsWith('$2b$')) {
        console.log('🔄 Usando bcrypt para comparar...');
        senhaValida = await bcrypt.compare(senha, user.senha);
      } else {
        console.log('🔓 Usando comparação direta (senha sem hash)...');
        senhaValida = (senha === user.senha);
      }

      console.log('✅ Senha válida?', senhaValida);

      if (!senhaValida) {
        console.log('❌ Senha incorreta');
        throw new Error('Senha incorreta');
      }

      // 5. Cria token JWT
      console.log('🎫 Gerando token JWT...');
      const token = jwt.sign(
        {
          id: user.id,
          tipo: tipo,
        },
        process.env.JWT_SECRET || 'segredo',
        { expiresIn: '8h' }
      );

      console.log('✅ LOGIN BEM-SUCEDIDO!');
      return {
        id: user.id,
        tipo,
        token,
        nome: user.nome,
        sobrenome: user.sobrenome, // ⭐⭐ ADICIONADO
        email: user.email,
        telefone: user.telefone,
        cpf: user.cpf,
        data_nascimento: user.data_nascimento
      };

    } catch (error) {
      console.error('❌ ERRO NO LOGIN SERVICE:', error.message);
      throw error;
    }
  }
}

module.exports = new LoginService();