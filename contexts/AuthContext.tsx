// contexts/AuthContext.tsx - VERSÃO COMPLETA ATUALIZADA
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
  // 🔥 NOVOS CAMPOS PARA O CUPOM AUTOMÁTICO
  desconto_proxima_compra: number;
  data_expiracao_desconto: string | null;
  pontos_fidelidade: number;
}

interface AuthContextData {
  user: User | null;
  userToken: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  fetchUserData: () => Promise<void>;
  verificarToken: () => Promise<boolean>;
  // 🔥 NOVA FUNÇÃO PARA ATUALIZAR O CUPOM
  atualizarCupomDesconto: (desconto: number, dataExpiracao: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://192.168.0.2:3000';

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
        
        setUser(userData.usuario);
        await AsyncStorage.setItem('userData', JSON.stringify(userData.usuario));
        
      } else {
        console.log('❌ Erro ao buscar dados do usuário:', response.status);
        
        if (response.status === 401) {
          console.log('🔒 Token pode estar expirado durante fetchUserData');
          await verificarToken();
        }
      }
    } catch (error) {
      console.error('❌ Erro ao buscar dados do usuário:', error);
    }
  };

  // 🔥 NOVA FUNÇÃO PARA ATUALIZAR O CUPOM DE DESCONTO
  const atualizarCupomDesconto = async (desconto: number, dataExpiracao: string): Promise<void> => {
    try {
      if (!user) return;

      console.log('🎫 Atualizando cupom de desconto:', { desconto, dataExpiracao });
      
      const userAtualizado = {
        ...user,
        desconto_proxima_compra: desconto,
        data_expiracao_desconto: dataExpiracao
      };

      setUser(userAtualizado);
      await AsyncStorage.setItem('userData', JSON.stringify(userAtualizado));
      
      console.log('✅ Cupom de desconto atualizado localmente');
    } catch (error) {
      console.error('❌ Erro ao atualizar cupom:', error);
    }
  };

  const login = async (userData: User, token: string) => {
    console.log('🔐 Login no AuthContext - Dados recebidos:', userData);
    
    // 🔥 GARANTIR QUE OS CAMPOS DO CUPOM EXISTAM
    const userCompleto = {
      ...userData,
      desconto_proxima_compra: userData.desconto_proxima_compra || 0,
      data_expiracao_desconto: userData.data_expiracao_desconto || null,
      pontos_fidelidade: userData.pontos_fidelidade || 0
    };
    
    setUser(userCompleto);
    setUserToken(token);
    
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userData', JSON.stringify(userCompleto));
    
    console.log('✅ Dados salvos no AuthContext e AsyncStorage');
  };

  const logout = async () => {
    setUser(null);
    setUserToken(null);
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    
    console.log('✅ Logout realizado - dados removidos');
  };

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      console.log('🔐 Tentando alterar senha...');

      if (!user || !userToken) {
        console.log('❌ Usuário não autenticado');
        return { success: false, message: 'Usuário não autenticado' };
      }

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
      verificarToken,
      atualizarCupomDesconto, // 🔥 NOVA FUNÇÃO
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);