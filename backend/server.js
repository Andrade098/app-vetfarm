const app = require("./src/app");
require('dotenv').config();
const express = require('express');
const sequelize = require('./src/config/db');
const PORT = process.env.PORT || 3000;


sequelize.sync({ alter: true })
  .then(() => {
    console.log('Banco sincronizado');
    app.listen(PORT,'0.0.0.0', () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erro ao sincronizar banco', err);
  });
