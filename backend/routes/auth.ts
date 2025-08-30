import express from 'express';
import { createUser, getUserByEmail } from '../models/user';
import bcrypt from 'bcrypt';

const router = express.Router();

// Cadastro
router.post('/register', async (req, res) => {
  const { name, email, telefone, password } = req.body;
  try {
    await createUser(name, email, telefone, password);
    res.json({ message: 'Usuário criado com sucesso!' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await getUserByEmail(email);
  if (!user) return res.status(400).json({ error: 'Usuário não encontrado' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: 'Senha incorreta' });

  res.json({ message: 'Login bem-sucedido', user: { id: user.id, name: user.name, telefone: user.telefone } });
});

// Recuperar senha (simulado)
router.post('/recover', async (req, res) => {
  const { email } = req.body;
  const user = await getUserByEmail(email);
  if (!user) return res.status(400).json({ error: 'Email não cadastrado' });

  // Aqui você enviaria email com token de recuperação
  res.json({ message: 'Pedido de recuperação enviado (simulado)' });
});

export default router;
