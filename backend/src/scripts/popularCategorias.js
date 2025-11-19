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
      { nome: 'Medicamentos', descricao: 'Medicamentos veterinários diversos' },
      { nome: 'Suplementos', descricao: 'Suplementos nutricionais e vitamínicos' },
      { nome: 'Acessórios', descricao: 'Acessórios e equipamentos para animais' }
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

      // ========== MEDICAMENTOS ==========
      { categoria_id: categorias[1].id, nome: 'Bovinos', descricao: 'Medicamentos para bovinos' },
      { categoria_id: categorias[1].id, nome: 'Suínos', descricao: 'Medicamentos para suínos' },
      { categoria_id: categorias[1].id, nome: 'Ovinos', descricao: 'Medicamentos para ovinos' },
      { categoria_id: categorias[1].id, nome: 'Peixes', descricao: 'Medicamentos para peixes' },
      { categoria_id: categorias[1].id, nome: 'Aves', descricao: 'Medicamentos para aves' },
      { categoria_id: categorias[1].id, nome: 'Equinos', descricao: 'Medicamentos para equinos' },

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
      { categoria_id: categorias[3].id, nome: 'Equinos', descricao: 'Acessórios para equinos' }
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