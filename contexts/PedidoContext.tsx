// contexts/PedidoContext.tsx - VERSÃO SIMPLIFICADA LOCAL
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  pontos_ganhos: number;
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

  // 🔥 CARREGAR PEDIDOS DO ASYNCSTORAGE (LOCAL)
  const carregarPedidos = async () => {
    try {
      setLoading(true);
      console.log('📦 Carregando pedidos do AsyncStorage...');
      
      const pedidosSalvos = await AsyncStorage.getItem('@pedidos_app');
      
      if (pedidosSalvos) {
        const pedidosParseados = JSON.parse(pedidosSalvos);
        console.log('✅ Pedidos carregados do AsyncStorage:', pedidosParseados.length);
        setPedidos(pedidosParseados);
      } else {
        console.log('📭 Nenhum pedido salvo encontrado');
        setPedidos([]);
      }
      
    } catch (error) {
      console.error('❌ Erro ao carregar pedidos:', error);
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 CRIAR PEDIDO LOCAL (SEM API)
  const criarPedido = async (pedidoData: Omit<Pedido, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('📦 Criando pedido localmente...', pedidoData);

      const novoPedido: Pedido = {
        id: `pedido_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        numero_pedido: pedidoData.numero_pedido,
        codigo_rastreio: pedidoData.codigo_rastreio,
        status: 'pendente',
        total: pedidoData.total,
        endereco_entrega: pedidoData.endereco_entrega,
        forma_pagamento: pedidoData.forma_pagamento,
        itens: pedidoData.itens,
        data_entrega_prevista: pedidoData.data_entrega_prevista,
        pontos_ganhos: pedidoData.pontos_ganhos || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('✅ Pedido criado localmente:', novoPedido);

      // Salvar no AsyncStorage
      const novosPedidos = [novoPedido, ...pedidos];
      setPedidos(novosPedidos);
      await AsyncStorage.setItem('@pedidos_app', JSON.stringify(novosPedidos));

      return novoPedido;
      
    } catch (error) {
      console.error('❌ Erro ao criar pedido local:', error);
      throw error;
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