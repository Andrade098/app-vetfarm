import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.0.2:3000';

type Endereco = {
  id: string;
  apelido: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  principal: boolean;
};

type EnderecoContextType = {
  enderecos: Endereco[];
  enderecoPrincipal: Endereco | null;
  carregarEnderecos: () => Promise<void>;
  adicionarEndereco: (endereco: Omit<Endereco, 'id'>) => Promise<void>;
  removerEndereco: (id: string) => Promise<void>;
  definirPrincipal: (id: string) => Promise<void>;
  loading: boolean;
};

const EnderecoContext = createContext<EnderecoContextType | undefined>(undefined);

export const useEnderecos = () => {
  const context = useContext(EnderecoContext);
  if (!context) {
    throw new Error('useEnderecos deve ser usado dentro de EnderecoProvider');
  }
  return context;
};

export const EnderecoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [enderecoPrincipal, setEnderecoPrincipal] = useState<Endereco | null>(null);
  const [loading, setLoading] = useState(false);

  // Carregar endereços da API
  const carregarEnderecos = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        console.log('Token não encontrado, usando dados locais');
        // Usar dados locais como fallback
        return;
      }

      const response = await fetch(`${API_URL}/api/enderecos`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEnderecos(data);
        
        // Encontrar endereço principal
        const principal = data.find((e: Endereco) => e.principal) || null;
        setEnderecoPrincipal(principal);
      } else {
        console.log('Erro ao carregar endereços da API, usando dados locais');
      }
      
    } catch (error) {
      console.error('Erro ao carregar endereços:', error);
    } finally {
      setLoading(false);
    }
  };

  const adicionarEndereco = async (novoEndereco: Omit<Endereco, 'id'>) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      
      // Se tiver token, tenta salvar na API
      if (token) {
        const response = await fetch(`${API_URL}/api/enderecos`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(novoEndereco),
        });

        if (response.ok) {
          // Recarrega a lista de endereços da API
          await carregarEnderecos();
          return;
        }
      }

      // Fallback: salvar localmente
      const enderecoComId = {
        ...novoEndereco,
        id: Date.now().toString()
      };
      
      setEnderecos(prev => {
        const novosEnderecos = [...prev, enderecoComId];
        
        // Se for principal, atualiza o endereço principal
        if (novoEndereco.principal) {
          setEnderecoPrincipal(enderecoComId);
        }
        
        return novosEnderecos;
      });
      
    } catch (error) {
      console.error('Erro ao adicionar endereço:', error);
      throw error;
    }
  };

  const removerEndereco = async (id: string) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      
      if (token) {
        const response = await fetch(`${API_URL}/api/enderecos/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          await carregarEnderecos();
          return;
        }
      }

      // Fallback: remover localmente
      setEnderecos(prev => {
        const novosEnderecos = prev.filter(e => e.id !== id);
        
        // Se estava removendo o endereço principal, atualiza
        if (enderecoPrincipal?.id === id) {
          const novoPrincipal = novosEnderecos.find(e => e.principal) || null;
          setEnderecoPrincipal(novoPrincipal);
        }
        
        return novosEnderecos;
      });
      
    } catch (error) {
      console.error('Erro ao remover endereço:', error);
      throw error;
    }
  };

  const definirPrincipal = async (id: string) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      
      if (token) {
        const response = await fetch(`${API_URL}/api/enderecos/${id}/principal`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          await carregarEnderecos();
          return;
        }
      }

      // Fallback: definir principal localmente
      setEnderecos(prev => {
        const novosEnderecos = prev.map(e => ({
          ...e,
          principal: e.id === id
        }));
        
        const novoPrincipal = novosEnderecos.find(e => e.id === id) || null;
        setEnderecoPrincipal(novoPrincipal);
        
        return novosEnderecos;
      });
      
    } catch (error) {
      console.error('Erro ao definir endereço principal:', error);
      throw error;
    }
  };

  // Carregar endereços quando o provider é montado
  useEffect(() => {
    carregarEnderecos();
  }, []);

  return (
    <EnderecoContext.Provider value={{
      enderecos,
      enderecoPrincipal,
      carregarEnderecos,
      adicionarEndereco,
      removerEndereco,
      definirPrincipal,
      loading
    }}>
      {children}
    </EnderecoContext.Provider>
  );
};