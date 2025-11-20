const app = require("./app");
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const popularCategorias = require('./src/scripts/popularCategorias');

// ⭐⭐ IMPORTAR DO ARQUIVO CENTRAL ⭐⭐
const { sequelize, Farmacia, Categoria, Subcategoria, Produto, FarmaciaProduto } = require('./src/models');

async function syncDatabase() {
  try {
    console.log('🔄 Iniciando sincronização do banco...');
    
    // Autenticar primeiro
    await sequelize.authenticate();
    console.log('✅ Conexão com MySQL estabelecida');
    
    // ⭐⭐ SINCRONIZAR TODAS DE UMA VEZ ⭐⭐
    await sequelize.sync({ alter: true });
    console.log('🎉 Todas as tabelas sincronizadas com sucesso!');
    
    // Popular categorias
    await popularCategorias();
    console.log('✅ Categorias populadas com sucesso');
    
    // TESTE RÁPIDO: Verificar se as associações estão funcionando
    console.log('🔍 Verificando associações...');
    console.log('Farmacia associations:', Object.keys(Farmacia.associations));
    console.log('Produto associations:', Object.keys(Produto.associations));
    
    // Iniciar servidor
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📱 Acesse: http://localhost:${PORT}`);
    });
    
  } catch (error) {
    console.error('❌ Erro ao sincronizar banco:', error);
  }
}

// Executar sincronização
syncDatabase();