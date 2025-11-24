// scripts/verificar-associations-detalhado.js
const Produto = require('../models/Produto');
const Categoria = require('../models/Categoria');
const Subcategoria = require('../models/Subcategoria');

async function verificarAssociationsDetalhado() {
  try {
    console.log('🔍 VERIFICANDO ASSOCIATIONS DETALHADAMENTE...\n');
    
    // Método 1: Verificar propriedades do modelo Produto
    console.log('📦 PROPRIEDADES DO MODELO PRODUTO:');
    console.log('- Associations:', Object.keys(Produto.associations || {}));
    
    if (Produto.associations) {
      console.log('\n🎯 DETALHES DAS ASSOCIATIONS:');
      Object.keys(Produto.associations).forEach(key => {
        const assoc = Produto.associations[key];
        console.log(`\n🔗 ${key}:`);
        console.log(`   - Alias: "${assoc.as}"`);
        console.log(`   - Type: ${assoc.associationType}`);
        console.log(`   - Model: ${assoc.target.name}`);
        console.log(`   - ForeignKey: ${assoc.foreignKey}`);
        console.log(`   - SourceKey: ${assoc.sourceKey}`);
      });
    }
    
    // Método 2: Verificar se há associações definidas nos models
    console.log('\n🏷️  VERIFICANDO DEFINITION DO PRODUTO:');
    console.log('- TableName:', Produto.tableName);
    console.log('- ModelName:', Produto.name);
    
    // Método 3: Tentar fazer uma query simples para ver a estrutura
    console.log('\n🧪 TESTANDO QUERY SIMPLES:');
    try {
      const produto = await Produto.findOne({
        attributes: ['id', 'nome', 'categoria_id', 'subcategoria_id'],
        raw: true
      });
      console.log('✅ Query simples funcionou:', produto ? 'Produto encontrado' : 'Nenhum produto');
    } catch (error) {
      console.log('❌ Erro na query simples:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

verificarAssociationsDetalhado();