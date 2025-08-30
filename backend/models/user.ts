import dbPromise from '../database/connection';
import bcrypt from 'bcrypt';

// Inicializa a tabela (executar uma vez)
(async () => {
  const db = await dbPromise;
  await db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      telefone TEXT,
      password TEXT
    )
  `);
})();

// Funções CRUD
export const createUser = async (name: string, email: string, telefone: string, password: string) => {
  const db = await dbPromise;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.run(
      'INSERT INTO users (name, email, telefone, password) VALUES (?, ?, ?, ?)',
      [name, email, telefone, hashedPassword]
    );
  } catch (err: any) {
    if (err.code === 'SQLITE_CONSTRAINT') {
      throw new Error('Email já cadastrado');
    }
    throw err;
  }
};

export const getUserByEmail = async (email: string) => {
  const db = await dbPromise;
  return db.get('SELECT * FROM users WHERE email = ?', [email]);
};
