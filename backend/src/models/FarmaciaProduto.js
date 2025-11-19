const { DataTypes, Sequelize } = require('sequelize');
const db = require('../config/db');

const FarmaciaProduto = db.define('FarmaciaProduto', {
    farmacia_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        references: { // ✅ ADICIONAR REFERÊNCIA
            model: 'Farmacias', // ou o nome do seu model Farmácia
            key: 'id'
        },
        onDelete: 'CASCADE', // ✅ IMPORTANTE: deleta relação se farmácia/produto for deletado
        onUpdate: 'CASCADE'
    },
    produto_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        references: { // ✅ ADICIONAR REFERÊNCIA
            model: 'Produtos', // ou o nome do seu model Produto
            key: 'id'
        },
        onDelete: 'CASCADE', // ✅ IMPORTANTE
        onUpdate: 'CASCADE'
    },
    estoque: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: { // ✅ VALIDAÇÃO OPCIONAL
            min: 0 // estoque não pode ser negativo
        }
    },
    preco_venda: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: { // ✅ VALIDAÇÃO OPCIONAL
            min: 0 // preço não pode ser negativo
        }
    },
}, {
    // ✅ CONFIGURAÇÕES ADICIONAIS RECOMENDADAS
    tableName: 'farmacia_produtos', // nome da tabela no banco
    timestamps: true, // ✅ ADICIONAR created_at e updated_at
    indexes: [
        // ✅ ÍNDICES PARA MELHOR PERFORMANCE
        {
            unique: true,
            fields: ['farmacia_id', 'produto_id'] // já é chave primária, mas reforça
        },
        {
            fields: ['farmacia_id'] // para buscas por farmácia
        },
        {
            fields: ['produto_id'] // para buscas por produto
        }
    ]
});

module.exports = FarmaciaProduto;