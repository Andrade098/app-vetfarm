const app = require("./app");
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const popularCategorias = require('./src/scripts/popularCategorias');

// ⭐⭐ IMPORTAR DO ARQUIVO CENTRAL ⭐⭐
const { sequelize, Farmacia, Categoria, Subcategoria, Produto, FarmaciaProduto } = require('./src/models');

// 🆕 FUNÇÃO PARA CRIAR FARMÁCIA PADRÃO COM DEBUG
async function criarFarmaciaPadrao() {
  try {
    console.log('🏥 Verificando farmácias no banco...');
    
    // Verificar se já existe alguma farmácia
    const farmaciasExistentes = await Farmacia.findAll();
    console.log(`🔍 Encontradas ${farmaciasExistentes.length} farmácia(s)`);
    
    if (farmaciasExistentes.length > 0) {
      console.log(`✅ Já existem farmácias no banco. Primeira ID:`, farmaciasExistentes[0].id);
      return farmaciasExistentes[0];
    }
    
    // Se não existir, criar uma farmácia padrão
    console.log('📝 Criando farmácia padrão...');
    const farmaciaPadrao = await Farmacia.create({
      nome: 'Farmácia Veterinária Principal',
      descricao: 'Farmácia especializada em produtos veterinários',
      email: 'contato@vetfarm.com',
      senha: 'senha123', // ⚠️ Mude depois
      endereco: 'Rua dos Animais, 123',
      bairro: 'Centro',
      telefone: '(11) 99999-9999',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-567',
      tipo: 'matriz'
    });
    
    console.log('✅ Farmácia padrão criada com ID:', farmaciaPadrao.id);
    return farmaciaPadrao;
    
  } catch (error) {
    console.error('💥 ERRO ao criar farmácia:', error.message);
    console.error('Stack:', error.stack);
    return null;
  }
}

async function syncDatabase() {
  try {
    console.log('🔄 Iniciando sincronização do banco...');
    
    // Autenticar primeiro
    await sequelize.authenticate();
    console.log('✅ Conexão com MySQL estabelecida');
    
    // 🆕 CRIAR FARMÁCIA PADRÃO ANTES DA SINCRONIZAÇÃO
    console.log('🔧 Criando farmácia padrão...');
    const farmacia = await criarFarmaciaPadrao();
    
    if (!farmacia) {
      console.log('⚠️ ATENÇÃO: Farmácia não foi criada. Tentando sincronizar mesmo assim...');
    } else {
      console.log('🎯 Farmácia disponível para referência:', farmacia.id);
    }
    
    // ⭐⭐ SINCRONIZAR COM FORCE FALSE E ALTER TRUE
    console.log('🔄 Sincronizando tabelas...');
    await sequelize.sync({ 
      alter: true,
      force: false // ⚠️ IMPORTANTE: não dropar tabelas existentes
    });
    console.log('🎉 Todas as tabelas sincronizadas com sucesso!');
    
    // Popular categorias
    await popularCategorias();
    console.log('✅ Categorias populadas com sucesso');
    
    // Iniciar servidor
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📱 Acesse: http://localhost:${PORT}`);
      console.log(`🌐 Acesse: http://192.168.0.2:${PORT}`);
      console.log(`📁 Uploads: http://192.168.0.2:${PORT}/uploads`);
    });
    
  } catch (error) {
    console.error('❌ Erro ao sincronizar banco:', error.message);
    console.error('Stack:', error.stack);
    
    // ⚠️ SOLUÇÃO ALTERNATIVA: Tentar sincronizar sem alter
    console.log('🔄 Tentando sincronização sem alter...');
    try {
      await sequelize.sync({ alter: false });
      console.log('✅ Sincronização sem alter funcionou!');
    } catch (error2) {
      console.error('❌ Sincronização sem alter também falhou:', error2.message);
    }
  }
}

// Executar sincronização
syncDatabase();