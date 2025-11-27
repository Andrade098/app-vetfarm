import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  fetchUserData: () => Promise<void>;
  verificarToken: () => Promise<boolean>; // 🔥 NOVA FUNÇÃO ADICIONADA
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ⭐⭐ MESMO IP DO LOGIN - IMPORTANTE PARA ANDROID ⭐⭐
  const API_URL = 'http://192.168.0.2:3000';

  // ⭐⭐ CARREGAR DADOS DO ASYNCSTORAGE QUANDO O APP INICIA ⭐⭐
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        console.log('🔍 AuthContext - Carregando dados do AsyncStorage...');
        
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedUser = await AsyncStorage.getItem('userData');
        
        console.log('🔍 Token no AsyncStorage:', storedToken ? 'EXISTE' : 'NÃO EXISTE');
        console.log('🔍 UserData no AsyncStorage:', storedUser ? 'EXISTE' : 'NÃO EXISTE');
        
        if (storedToken && storedUser) {
          const userData = JSON.parse(storedUser);
          console.log('✅ AuthContext - Dados carregados:', userData);
          
          setUser(userData);
          setUserToken(storedToken);
        } else {
          console.log('ℹ️ AuthContext - Nenhum dado salvo encontrado');
        }
      } catch (error) {
        console.error('❌ Erro ao carregar dados do AsyncStorage:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStoredData();
  }, []);

  // 🔥 NOVA FUNÇÃO PARA VERIFICAR SE O TOKEN AINDA É VÁLIDO
  const verificarToken = async (): Promise<boolean> => {
    try {
      if (!userToken) {
        console.log('❌ Nenhum token disponível para verificar');
        return false;
      }

      console.log('🔐 Verificando validade do token...');
      
      const response = await fetch(`${API_URL}/api/clientes/verificar-token`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });

      console.log('📡 Status da verificação:', response.status);

      if (response.ok) {
        console.log('✅ Token válido');
        return true;
      } else {
        console.log('❌ Token inválido ou expirado');
        
        // 🔥 SE O TOKEN ESTIVER INVÁLIDO, FAZ LOGOUT AUTOMÁTICO
        if (response.status === 401) {
          console.log('🔒 Token expirado, fazendo logout automático...');
          await logout();
        }
        return false;
      }
    } catch (error) {
      console.error('❌ Erro ao verificar token:', error);
      return false;
    }
  };

  // ⭐⭐ NOVA FUNÇÃO PARA BUSCAR DADOS ATUALIZADOS DO USUÁRIO
  const fetchUserData = async (): Promise<void> => {
    try {
      if (!userToken) {
        console.log('❌ Token não disponível para buscar dados do usuário');
        return;
      }

      console.log('🔍 Buscando dados atualizados do usuário...');
      
      const response = await fetch(`${API_URL}/api/clientes/perfil`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('✅ Dados atualizados do usuário:', userData);
        
        // ⭐⭐ ATUALIZAR O CONTEXTO E O ASYNCSTORAGE
        setUser(userData.usuario);
        await AsyncStorage.setItem('userData', JSON.stringify(userData.usuario));
        
      } else {
        console.log('❌ Erro ao buscar dados do usuário:', response.status);
        
        // 🔥 SE DER ERRO 401, O TOKEN PODE ESTAR INVÁLIDO
        if (response.status === 401) {
          console.log('🔒 Token pode estar expirado durante fetchUserData');
          await verificarToken(); // 🔥 VERIFICA O TOKEN
        }
      }
    } catch (error) {
      console.error('❌ Erro ao buscar dados do usuário:', error);
    }
  };

  const login = async (userData: User, token: string) => {
    console.log('🔐 Login no AuthContext - Dados recebidos:', userData);
    console.log('🔐 Login no AuthContext - Sobrenome recebido:', userData.sobrenome);
    
    // ⭐⭐ VERIFIQUE SE O USERDATA TEM SOBRENOME
    if (!userData.sobrenome) {
        console.warn('⚠️ AVISO: userData não tem sobrenome! Campos recebidos:', Object.keys(userData));
    }
    
    // Salva no contexto
    setUser(userData);
    setUserToken(token);
    
    // Salva no AsyncStorage
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
    
    console.log('✅ Dados salvos no AuthContext e AsyncStorage');
    console.log('✅ Sobrenome salvo:', userData.sobrenome);
  };

  const logout = async () => {
    // ⭐⭐ LIMPAR CONTEXTO E ASYNCSTORAGE
    setUser(null);
    setUserToken(null);
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    
    console.log('✅ Logout realizado - dados removidos');
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

      // 🔥 OPICIONAL: VERIFICA SE O TOKEN AINDA É VÁLIDO ANTES DE TENTAR ALTERAR SENHA
      const tokenValido = await verificarToken();
      if (!tokenValido) {
        return { success: false, message: 'Sessão expirada. Faça login novamente.' };
      }

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
    <AuthContext.Provider value={{ 
      user, 
      userToken, 
      login, 
      logout, 
      updatePassword, 
      fetchUserData,
      verificarToken, // 🔥 AGORA ESTÁ DISPONÍVEL NO CONTEXTO
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);