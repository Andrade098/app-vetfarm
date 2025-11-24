const Categoria  = require('../models/Categoria');
const Subcategoria  = require('../models/Subcategoria');
const Produto  = require('../models/Produto');
async function backupDados() {
  const categorias = await Categoria.findAll({ raw: true });
  const subcategorias = await Subcategoria.findAll({ raw: true });
  
  const backup = {
    timestamp: new Date().toISOString(),
    categorias,
    subcategorias
  };
  
  require('fs').writeFileSync(
    `backup-categorias-${Date.now()}.json`,
    JSON.stringify(backup, null, 2)
  );
  console.log('📦 Backup criado: backup-categorias-[timestamp].json');
}

// scripts/atualizarCategoriasSubcategorias.js

async function atualizarCategoriasSubcategorias() {
  console.log('🔄 INICIANDO ATUALIZAÇÃO COMPLETA...\n');
  
  try {
    // ============================================
    // 1. 📦 BACKUP E VERIFICAÇÃO INICIAL
    // ============================================
    console.log('1. 📦 VERIFICANDO ESTADO ATUAL...');
    
    // Buscar categoria "Medicamentos" (que será renomeada)
    const categoriaMedicamentos = await Categoria.findOne({
      where: { nome: 'Medicamentos' }
    });
    
    if (!categoriaMedicamentos) {
      console.log('   ❌ Categoria "Medicamentos" não encontrada!');
      console.log('   💡 Categorias existentes:');
      const todasCategorias = await Categoria.findAll();
      todasCategorias.forEach(cat => {
        console.log(`      - ${cat.nome} (ID: ${cat.id})`);
      });
      return;
    }
    
    console.log(`   ✅ Categoria "Medicamentos" encontrada: ID ${categoriaMedicamentos.id}`);
    
    // Verificar impacto
    const produtosCount = await Produto.count({
      where: { categoria_id: categoriaMedicamentos.id }
    });
    
    const subcategoriasCount = await Subcategoria.count({
      where: { categoria_id: categoriaMedicamentos.id }
    });
    
    console.log(`   📊 Impacto: ${produtosCount} produtos e ${subcategoriasCount} subcategorias`);
    
    // ============================================
    // 2. 🔄 ATUALIZAR CATEGORIA "MEDICAMENTOS" → "HIGIENE"
    // ============================================
    console.log('\n2. 🔄 ATUALIZANDO CATEGORIA...');
    
    await Categoria.update(
      { 
        nome: 'Higiene', 
        descricao: 'Produtos para limpeza e desinfecção' 
      },
      { where: { id: categoriaMedicamentos.id } }
    );
    
    console.log('   ✅ "Medicamentos" → "Higiene"');
    
    // ============================================
    // 3. ➕ ADICIONAR NOVAS CATEGORIAS
    // ============================================
    console.log('\n3. ➕ ADICIONANDO NOVAS CATEGORIAS...');
    
    const novasCategorias = [
      { nome: 'Antiparasitários', descricao: 'Tratamento contra vermes e parasitas' },
      { nome: 'Antibióticos', descricao: 'Tratamento de infecções bacterianas' },
      { nome: 'Nutrição', descricao: 'Ração enriquecida para animais' }
    ];
    
    const categoriasCriadas = [];
    
    for (const catData of novasCategorias) {
      const [categoria, created] = await Categoria.findOrCreate({
        where: { nome: catData.nome },
        defaults: catData
      });
      
      categoriasCriadas.push(categoria);
      console.log(`   ${created ? '✅ Criada' : '⚠️  Já existe'}: ${catData.nome} (ID: ${categoria.id})`);
    }
    
    // ============================================
    // 4. 🔄 ATUALIZAR SUBCATEGORIAS DA HIGIENE
    // ============================================
    console.log('\n4. 🔄 ATUALIZANDO SUBCATEGORIAS DA HIGIENE...');
    
    const especies = ['Bovinos', 'Suínos', 'Ovinos', 'Peixes', 'Aves', 'Equinos'];
    
    for (const especie of especies) {
      const subcatAtualizada = await Subcategoria.update(
        { descricao: `Higiene para ${especie.toLowerCase()}` },
        { 
          where: { 
            categoria_id: categoriaMedicamentos.id, // ID da categoria Higiene (ex-Medicamentos)
            nome: especie 
          } 
        }
      );
      
      if (subcatAtualizada[0] > 0) {
        console.log(`   ✅ Higiene ${especie} - descrição atualizada`);
      }
    }
    
    // ============================================
    // 5. ➕ ADICIONAR NOVAS SUBCATEGORIAS
    // ============================================
    console.log('\n5. ➕ ADICIONANDO NOVAS SUBCATEGORIAS...');
    
    // Mapear categorias pelos nomes para pegar os IDs corretos
    const categoriaAntiparasitarios = await Categoria.findOne({ where: { nome: 'Antiparasitários' } });
    const categoriaAntibioticos = await Categoria.findOne({ where: { nome: 'Antibióticos' } });
    const categoriaNutricao = await Categoria.findOne({ where: { nome: 'Nutrição' } });
    
    const novasSubcategorias = [
      // Antiparasitários
      { categoria_id: categoriaAntiparasitarios.id, nome: 'Bovinos', descricao: 'Antiparasitários para bovinos' },
      { categoria_id: categoriaAntiparasitarios.id, nome: 'Suínos', descricao: 'Antiparasitários para suínos' },
      { categoria_id: categoriaAntiparasitarios.id, nome: 'Ovinos', descricao: 'Antiparasitários para ovinos' },
      { categoria_id: categoriaAntiparasitarios.id, nome: 'Peixes', descricao: 'Antiparasitários para peixes' },
      { categoria_id: categoriaAntiparasitarios.id, nome: 'Aves', descricao: 'Antiparasitários para aves' },
      { categoria_id: categoriaAntiparasitarios.id, nome: 'Equinos', descricao: 'Antiparasitários para equinos' },
      
      // Antibióticos
      { categoria_id: categoriaAntibioticos.id, nome: 'Bovinos', descricao: 'Antibióticos para bovinos' },
      { categoria_id: categoriaAntibioticos.id, nome: 'Suínos', descricao: 'Antibióticos para suínos' },
      { categoria_id: categoriaAntibioticos.id, nome: 'Ovinos', descricao: 'Antibióticos para ovinos' },
      { categoria_id: categoriaAntibioticos.id, nome: 'Peixes', descricao: 'Antibióticos para peixes' },
      { categoria_id: categoriaAntibioticos.id, nome: 'Aves', descricao: 'Antibióticos para aves' },
      { categoria_id: categoriaAntibioticos.id, nome: 'Equinos', descricao: 'Antibióticos para equinos' },
      
      // Nutrição
      { categoria_id: categoriaNutricao.id, nome: 'Bovinos', descricao: 'Nutrição para bovinos' },
      { categoria_id: categoriaNutricao.id, nome: 'Suínos', descricao: 'Nutrição para suínos' },
      { categoria_id: categoriaNutricao.id, nome: 'Ovinos', descricao: 'Nutrição para ovinos' },
      { categoria_id: categoriaNutricao.id, nome: 'Peixes', descricao: 'Nutrição para peixes' },
      { categoria_id: categoriaNutricao.id, nome: 'Aves', descricao: 'Nutrição para aves' },
      { categoria_id: categoriaNutricao.id, nome: 'Equinos', descricao: 'Nutrição para equinos' }
    ];
    
    let subcategoriasCriadas = 0;
    
    for (const subcatData of novasSubcategorias) {
      const [subcategoria, created] = await Subcategoria.findOrCreate({
        where: { 
          categoria_id: subcatData.categoria_id,
          nome: subcatData.nome
        },
        defaults: subcatData
      });
      
      if (created) {
        subcategoriasCriadas++;
        console.log(`   ✅ ${subcatData.descricao}`);
      }
    }
    
    // ============================================
    // 6. ✅ RELATÓRIO FINAL
    // ============================================
    console.log('\n6. 📊 RELATÓRIO FINAL:');
    console.log('   🎉 ATUALIZAÇÕES REALIZADAS:');
    console.log(`      • Categoria atualizada: 1 (Medicamentos → Higiene)`);
    console.log(`      • Categorias criadas: ${categoriasCriadas.length}`);
    console.log(`      • Subcategorias criadas: ${subcategoriasCriadas}`);
    console.log(`      • Produtos preservados: ${produtosCount}`);
    console.log('\n   📋 CATEGORIAS DISPONÍVEIS:');
    
    const categoriasFinais = await Categoria.findAll({ order: [['nome', 'ASC']] });
    categoriasFinais.forEach(cat => {
      console.log(`      • ${cat.nome} - ${cat.descricao}`);
    });
    
    console.log('\n🔄 ATUALIZAÇÃO CONCLUÍDA COM SUCESSO! 🎉');
    
  } catch (error) {
    console.error('\n❌ ERRO DURANTE A ATUALIZAÇÃO:', error);
    console.log('💡 Dica: Verifique se os nomes das categorias estão corretos');
  }
}

// Executar o script
atualizarCategoriasSubcategorias();