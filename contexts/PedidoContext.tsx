import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.0.2:3000';

export type ItemPedido = {
  id: string;
  name: string;
  price: string;
  quantity: number;
  image?: any;
};

export type Pedido = {
  id: string;
  numero_pedido: string;
  codigo_rastreio: string;
  status: 'pendente' | 'processando' | 'enviado' | 'entregue' | 'cancelado';
  total: string;
  endereco_entrega: any;
  forma_pagamento: string;
  itens: ItemPedido[];
  data_entrega_prevista: string;
  createdAt: string;
  updatedAt: string;
};

type PedidoContextType = {
  pedidos: Pedido[];
  carregarPedidos: () => Promise<void>;
  criarPedido: (pedidoData: Omit<Pedido, 'id' | 'createdAt' | 'updatedAt'>) => Promise<any>;
  loading: boolean;
};

const PedidoContext = createContext<PedidoContextType | undefined>(undefined);

export const usePedidos = () => {
  const context = useContext(PedidoContext);
  if (!context) {
    throw new Error('usePedidos deve ser usado dentro de PedidoProvider');
  }
  return context;
};

export const PedidoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(false);

  // Carregar pedidos da API
  const carregarPedidos = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        console.log('❌ Token não encontrado');
        return;
      }

      console.log('📦 Carregando pedidos da API...');
      
      const response = await fetch(`${API_URL}/api/pedidos`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Pedidos carregados:', data.length);
        setPedidos(data);
      } else {
        console.log('❌ Erro ao carregar pedidos da API:', response.status);
        // Em caso de erro, carregar pedidos mock para teste
        setPedidos([]);
      }
      
    } catch (error) {
      console.error('❌ Erro ao carregar pedidos:', error);
      // Em caso de erro, carregar pedidos mock para teste
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  // Criar novo pedido
  const criarPedido = async (pedidoData: Omit<Pedido, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        throw new Error('Token não encontrado');
      }

      console.log('📦 Enviando pedido para API:', pedidoData);

      const response = await fetch(`${API_URL}/api/pedidos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedidoData),
      });

      if (response.ok) {
        const novoPedido = await response.json();
        console.log('✅ Pedido criado com sucesso:', novoPedido);
        
        // Adicionar o novo pedido à lista local
        setPedidos(prev => [novoPedido, ...prev]);
        
        return novoPedido;
      } else {
        const errorText = await response.text();
        console.log('❌ Erro ao criar pedido:', response.status, errorText);
        throw new Error(`Erro ao criar pedido: ${response.status}`);
      }
      
    } catch (error) {
      console.error('❌ Erro ao criar pedido:', error);
      
      // 🔥 FALLBACK: Se a API falhar, criar pedido localmente para teste
      console.log('🔄 Criando pedido localmente (fallback)...');
      
      const pedidoFallback: Pedido = {
        id: Date.now().toString(),
        numero_pedido: pedidoData.numero_pedido,
        codigo_rastreio: pedidoData.codigo_rastreio,
        status: 'pendente',
        total: pedidoData.total,
        endereco_entrega: pedidoData.endereco_entrega,
        forma_pagamento: pedidoData.forma_pagamento,
        itens: pedidoData.itens,
        data_entrega_prevista: pedidoData.data_entrega_prevista,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setPedidos(prev => [pedidoFallback, ...prev]);
      
      return pedidoFallback;
    }
  };

  // Carregar pedidos quando o provider é montado
  useEffect(() => {
    carregarPedidos();
  }, []);

  return (
    <PedidoContext.Provider value={{
      pedidos,
      carregarPedidos,
      criarPedido,
      loading
    }}>
      {children}
    </PedidoContext.Provider>
  );
};