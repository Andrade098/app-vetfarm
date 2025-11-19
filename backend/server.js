const app = require("./app");
require('dotenv').config();
const express = require('express');
const sequelize = require('./src/config/db');
const PORT = process.env.PORT || 3000;
const popularCategorias = require('./src/scripts/popularCategorias');

sequelize.sync({ alter: true })
  .then(() => {
   console.log('✅ Banco sincronizado');
    
    // Popular categorias após sincronizar o banco
    return popularCategorias();
  })
  .then(() => {
    console.log('✅ Categorias populadas com sucesso');
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Erro ao sincronizar banco', err);
  });