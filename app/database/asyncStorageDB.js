import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = '@vetfarm_users';

// Adicionar usuário
export const addUser = async (nome, email, telefone, senha) => {
  try {
    const usersJSON = await AsyncStorage.getItem(USERS_KEY);
    const users = usersJSON ? JSON.parse(usersJSON) : [];

    // Verificar se email já existe
    const userExists = users.find(user => user.email === email);
    if (userExists) {
      throw new Error('Email já cadastrado');
    }

    // Adicionar novo usuário
    const newUser = {
      id: Date.now().toString(),
      nome,
      email,
      telefone,
      senha,
      created_at: new Date().toISOString()
    };

    users.push(newUser);
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));

    console.log('✅ Usuário cadastrado:', newUser.email);
    return newUser.id;
  } catch (error) {
    console.error('❌ Erro ao cadastrar:', error);
    throw error;
  }
};

// Buscar por email
export const getUserByEmail = async (email) => {
  try {
    const usersJSON = await AsyncStorage.getItem(USERS_KEY);
    const users = usersJSON ? JSON.parse(usersJSON) : [];

    const user = users.find(user => user.email === email);
    if (user) {
      console.log('✅ Usuário encontrado:', user.email);
      return user;
    } else {
      console.log('ℹ️ Usuário não encontrado');
      return null;
    }
  } catch (error) {
    console.error('❌ Erro ao buscar:', error);
    throw error;
  }
};

// Login
export const loginUser = async (email, senha) => {
  try {
    const usersJSON = await AsyncStorage.getItem(USERS_KEY);
    const users = usersJSON ? JSON.parse(usersJSON) : [];

    const user = users.find(user => user.email === email && user.senha === senha);
    if (user) {
      console.log('✅ Login realizado:', user.email);
      return user;
    } else {
      console.log('❌ Login falhou');
      return null;
    }
  } catch (error) {
    console.error('❌ Erro no login:', error);
    throw error;
  }
};

// Inicialização automática - cria o array se não existir
(async () => {
  try {
    const users = await AsyncStorage.getItem(USERS_KEY);
    if (!users) {
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify([]));
      console.log('✅ Banco de dados inicializado!');
    }
  } catch (error) {
    console.error('❌ Erro ao inicializar banco:', error);
  }
})();