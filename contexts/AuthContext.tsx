import React, { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  id: string;
  nome: string;
  sobrenome: string;
  email: string;
  telefone: string;
  cpf: string;
  data_nascimento: string;
  tipo: string;
}

interface AuthContextData {
  user: User | null;
  userToken: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);

  const login = (userData: User, token: string) => {
    console.log('🔐 Login no AuthContext - Token:', token);
    setUser(userData);
    setUserToken(token);
  };

  const logout = () => {
    setUser(null);
    setUserToken(null);
  };

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      console.log('🔐 Tentando alterar senha...');
      console.log('User:', user);
      console.log('UserToken:', userToken);

      if (!user || !userToken) {
        console.log('❌ Usuário não autenticado');
        return { success: false, message: 'Usuário não autenticado' };
      }

      // ⭐⭐ MESMO IP DO LOGIN - IMPORTANTE PARA ANDROID ⭐⭐
      const API_URL = 'http://192.168.0.6:3000';

      const response = await fetch(`${API_URL}/api/clientes/alterar-senha`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          senhaAtual: currentPassword,
          novaSenha: newPassword,
          usuarioId: user.id
        }),
      });

      const data = await response.json();
      console.log('📡 Resposta da API:', data);

      if (response.ok) {
        return { success: true, message: data.message || 'Senha alterada com sucesso!' };
      } else {
        return { success: false, message: data.error || 'Erro ao alterar senha' };
      }
    } catch (error) {
      console.error('❌ Erro ao alterar senha:', error);
      return { success: false, message: 'Erro de conexão com o servidor. Verifique se o servidor está rodando.' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, userToken, login, logout, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);