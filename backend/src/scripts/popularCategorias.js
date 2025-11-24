const { Categoria, Subcategoria } = require('../models/associations');

const popularCategorias = async () => {
  try {
    // Verificar se já existem categorias para evitar duplicação
    const categoriasExistentes = await Categoria.count();
    
    if (categoriasExistentes > 0) {
      console.log('📊 Categorias já existem no banco, pulando população...');
      return;
    }

    console.log('📥 Populando categorias e subcategorias...');

    // Categorias (Tipos de Produto)
    const categorias = await Categoria.bulkCreate([
      { nome: 'Vacinas', descricao: 'Vacinas veterinárias para prevenção de doenças' },
      { nome: 'Higiene', descricao: 'Produtos para limpeza e desinfecção' },
      { nome: 'Suplementos', descricao: 'Suplementos nutricionais e vitamínicos' },
      { nome: 'Acessórios', descricao: 'Acessórios e equipamentos para animais' },
      { nome: 'Antiparasitários', descricao: 'Tratamento contra vermes e parasitas ' },
      { nome: 'Antibióticos', descricao: 'Tratamento de infecções bacterianas' },
      { nome: 'Nutrição', descricao: 'Ração enriquecida para animais' },
    ]);

    console.log(`✅ ${categorias.length} categorias criadas`);

    // Subcategorias (Animais) para cada categoria
    const subcategorias = [
      // ========== VACINAS ==========
      { categoria_id: categorias[0].id, nome: 'Bovinos', descricao: 'Vacinas para bovinos' },
      { categoria_id: categorias[0].id, nome: 'Suínos', descricao: 'Vacinas para suínos' },
      { categoria_id: categorias[0].id, nome: 'Ovinos', descricao: 'Vacinas para ovinos' },
      { categoria_id: categorias[0].id, nome: 'Peixes', descricao: 'Vacinas para peixes' },
      { categoria_id: categorias[0].id, nome: 'Aves', descricao: 'Vacinas para aves' },
      { categoria_id: categorias[0].id, nome: 'Equinos', descricao: 'Vacinas para equinos' },

      // ========== HIGIENE ==========
      { categoria_id: categorias[1].id, nome: 'Bovinos', descricao: 'Higiene para bovinos' },
      { categoria_id: categorias[1].id, nome: 'Suínos', descricao: 'Higiene para suínos' },
      { categoria_id: categorias[1].id, nome: 'Ovinos', descricao: 'Higiene para ovinos' },
      { categoria_id: categorias[1].id, nome: 'Peixes', descricao: 'Higiene para peixes' },
      { categoria_id: categorias[1].id, nome: 'Aves', descricao: 'Higiene para aves' },
      { categoria_id: categorias[1].id, nome: 'Equinos', descricao: 'Higiene para equinos' },

      // ========== SUPLEMENTOS ==========
      { categoria_id: categorias[2].id, nome: 'Bovinos', descricao: 'Suplementos para bovinos' },
      { categoria_id: categorias[2].id, nome: 'Suínos', descricao: 'Suplementos para suínos' },
      { categoria_id: categorias[2].id, nome: 'Ovinos', descricao: 'Suplementos para ovinos' },
      { categoria_id: categorias[2].id, nome: 'Peixes', descricao: 'Suplementos para peixes' },
      { categoria_id: categorias[2].id, nome: 'Aves', descricao: 'Suplementos para aves' },
      { categoria_id: categorias[2].id, nome: 'Equinos', descricao: 'Suplementos para equinos' },

      // ========== ACESSÓRIOS ==========
      { categoria_id: categorias[3].id, nome: 'Bovinos', descricao: 'Acessórios para bovinos' },
      { categoria_id: categorias[3].id, nome: 'Suínos', descricao: 'Acessórios para suínos' },
      { categoria_id: categorias[3].id, nome: 'Ovinos', descricao: 'Acessórios para ovinos' },
      { categoria_id: categorias[3].id, nome: 'Peixes', descricao: 'Acessórios para peixes' },
      { categoria_id: categorias[3].id, nome: 'Aves', descricao: 'Acessórios para aves' },
      { categoria_id: categorias[3].id, nome: 'Equinos', descricao: 'Acessórios para equinos' },

      // ============ Antiparasitários ===================
    
      { categoria_id: categorias[0].id, nome: 'Bovinos', descricao: 'Antiparasitários para bovinos' },
      { categoria_id: categorias[0].id, nome: 'Suínos', descricao: 'Antiparasitários para suínos' },
      { categoria_id: categorias[0].id, nome: 'Ovinos', descricao: 'Antiparasitários para ovinos' },
      { categoria_id: categorias[0].id, nome: 'Peixes', descricao: 'Antiparasitários para peixes' },
      { categoria_id: categorias[0].id, nome: 'Aves', descricao: 'Antiparasitários para aves' },
      { categoria_id: categorias[0].id, nome: 'Equinos', descricao: 'Antiparasitários para equinos' },

      // ================ Antibióticos ======================

      { categoria_id: categorias[0].id, nome: 'Bovinos', descricao: 'Antibióticos para bovinos' },
      { categoria_id: categorias[0].id, nome: 'Suínos', descricao: 'Antibióticos para suínos' },
      { categoria_id: categorias[0].id, nome: 'Ovinos', descricao: 'Antibióticos para ovinos' },
      { categoria_id: categorias[0].id, nome: 'Peixes', descricao: 'Antibióticos para peixes' },
      { categoria_id: categorias[0].id, nome: 'Aves', descricao: 'Antibióticos para aves' },
      { categoria_id: categorias[0].id, nome: 'Equinos', descricao: 'Antibióticos para equinos' },

      // ============= Nutrição ================

      { categoria_id: categorias[0].id, nome: 'Bovinos', descricao: 'Nutrição para bovinos' },
      { categoria_id: categorias[0].id, nome: 'Suínos', descricao: 'Nutrição para suínos' },
      { categoria_id: categorias[0].id, nome: 'Ovinos', descricao: 'Nutrição para ovinos' },
      { categoria_id: categorias[0].id, nome: 'Peixes', descricao: 'Nutrição para peixes' },
      { categoria_id: categorias[0].id, nome: 'Aves', descricao: 'Nutrição para aves' },
      { categoria_id: categorias[0].id, nome: 'Equinos', descricao: 'Nutrição para equinos' }
    ];

    await Subcategoria.bulkCreate(subcategorias);
    console.log(`✅ ${subcategorias.length} subcategorias criadas`);
    console.log('🎉 Todas as categorias e subcategorias foram populadas com sucesso!');

  } catch (error) {
    console.error('💥 Erro ao popular categorias:', error);
    // Não propaga o erro para não impedir o servidor de iniciar
  }
};

module.exports = popularCategorias;