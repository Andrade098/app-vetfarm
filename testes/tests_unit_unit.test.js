const fs = require('fs');
const path = require('path');

function tryRequireSafe(relPath) {
  try {
    return require(path.join(__dirname, relPath));
  } catch (err) {
    return null;
  }
}

describe('Unit checks - arquivos e módulos existentes', () => {
  test('backend deve exportar app (Express instance) em algum entrypoint conhecido', () => {
    const candidates = [
      '../backend/app',
      '../backend/server',
      '../backend/index',
      '../backend/src/app',
      '../backend/src/server',
      '../backend/src/index'
    ];

    let mod = null;
    for (const rel of candidates) {
      mod = tryRequireSafe(rel);
      if (mod) break;
    }

    expect(mod).not.toBeNull();

    const app = mod && (mod.default ?? mod.app ?? mod.server ?? mod);
    expect(app).toBeDefined();

    const hasUse = !!(app && app.use) || typeof app === 'function';
    expect(hasUse).toBe(true);
  });

  test('produtoRoutes.js existe e exporta um router/módulo', () => {
    const mod = tryRequireSafe('../backend/src/routes/produtoRoutes');
    expect(mod).not.toBeNull();
  });

  test('clienteRoutes.js existe e exporta um router/módulo', () => {
    const mod = tryRequireSafe('../backend/src/routes/clienteRoutes');
    expect(mod).not.toBeNull();
  });

  test('farmaciaRoutes.js existe e exporta um router/módulo', () => {
    const mod = tryRequireSafe('../backend/src/routes/farmaciaRoutes');
    expect(mod).not.toBeNull();
  });

  test('farmaciaProdutoRoutes.js existe e exporta um router/módulo', () => {
    const mod = tryRequireSafe('../backend/src/routes/farmaciaProdutoRoutes');
    expect(mod).not.toBeNull();
  });

  test('categoriaProdutoRoutes.js existe e exporta um router/módulo', () => {
    const mod = tryRequireSafe('../backend/src/routes/categoriaProdutoRoutes');
    expect(mod).not.toBeNull();
  });

  test('upload.js existe e exporta um router/módulo', () => {
    const mod = tryRequireSafe('../backend/src/routes/upload');
    expect(mod).not.toBeNull();
  });

  test('pasta backend/uploads existe (app.js cria/usa essa pasta)', () => {
    const uploadsPath = path.join(__dirname, '../backend/uploads');
    const exists = fs.existsSync(uploadsPath);
    expect(exists).toBe(true);
  });

  test('package.json contém script start', () => {
    const pkgPath = path.join(__dirname, '../package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

    expect(pkg.scripts).toBeDefined();
    expect(pkg.scripts.start).toBeDefined();
  });

  test('backend/.env existe (verificar presença de arquivo de configuração)', () => {
    const envPath = path.join(__dirname, '../backend/.env');
    expect(fs.existsSync(envPath)).toBe(true);
  });
});

// Opcional: tentar fechar conexão com o banco após os testes
afterAll(async () => {
  try {
    const db = require('../backend/src/config/db');
    const sequelize = db.sequelize ?? db;

    if (sequelize && typeof sequelize.close === 'function') {
      await sequelize.close();
    }
  } catch (e) {
    // se não conseguir carregar, ignora – não falha os testes
  }
});
