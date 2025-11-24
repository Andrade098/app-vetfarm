// gere-hash.js
const bcrypt = require('bcrypt');

async function gerarHash() {
  const hash = await bcrypt.hash('123456', 10);
  console.log('🔐 NOVO HASH PARA 123456:');
  console.log(hash);
}

gerarHash();