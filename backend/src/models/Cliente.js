// JS Cliente.js - ARQUIVO COMPLETO ATUALIZADO
const { DataTypes } = require('sequelize');
const db = require('../config/db');

console.log('✅ Model Cliente.js carregado!');

const Cliente = db.define('Cliente', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  sobrenome: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [11, 14]
    }
  },
  telefone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 100]
    }
  },
  data_nascimento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true
    }
  },
  // ⭐⭐ NOVOS CAMPOS PARA FIDELIDADE - ADICIONADOS AQUI ⭐⭐
  pontos_fidelidade: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  desconto_proxima_compra: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0,
    allowNull: false
  },
  data_expiracao_desconto: {
    type: DataTypes.DATE,
    allowNull: true
  }
  // ⭐⭐ FIM DOS NOVOS CAMPOS ⭐⭐
}, {
  tableName: 'clientes',
  timestamps: false,
});

// ⭐⭐ ADICIONE ESTE MÉTODO PARA VERIFICAR ERROS DE VALIDAÇÃO ⭐⭐
Cliente.sync({ force: false })
  .then(() => {
    console.log('✅ Tabela Cliente verificada/criada com sucesso!');
  })
  .catch(error => {
    console.error('❌ ERRO AO SINCRONIZAR TABELA CLIENTE:', error.message);
    console.error('🔍 Detalhes do erro:', error);
  });

module.exports = Cliente;