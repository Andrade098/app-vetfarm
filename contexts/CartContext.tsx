// contexts/CartContext.tsx - VERSÃO COMPLETA CORRIGIDA
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

interface Product {
  id: string;
  nome: string;
  preco: string;
  descricao: string;
  icone: string;
  imagem?: any;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  toggleCart: (product: Product) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  pontosGanhos: number;
  descontoFidelidade: number;
  descontoAplicado: boolean;
  calcularPontos: (valorTotal: number) => number;
  aplicarDescontoFidelidade: (descontoPercentual: number) => void;
  removerDescontoFidelidade: () => void;
  calcularTotalComDesconto: () => number;
  getTotalPontosUsuario: () => number;
  calcularTotalCarrinho: () => number;
  setPontosGanhos: (pontos: number) => void;
  // 🔥 NOVAS FUNÇÕES DE PERSISTÊNCIA
  carregarCarrinho: () => Promise<void>;
  salvarCarrinho: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [pontosGanhos, setPontosGanhos] = useState(0);
  const [descontoFidelidade, setDescontoFidelidade] = useState(0);
  const [descontoAplicado, setDescontoAplicado] = useState(false);
  const { user } = useAuth();

  // 🔥 FUNÇÃO PARA CARREGAR CARRINHO DO ASYNCSTORAGE
  const carregarCarrinho = async () => {
    try {
      console.log('📦 Carregando carrinho do AsyncStorage...');
      const carrinhoSalvo = await AsyncStorage.getItem('@carrinho');
      if (carrinhoSalvo) {
        const carrinhoParseado = JSON.parse(carrinhoSalvo);
        setCart(carrinhoParseado);
        console.log('✅ Carrinho carregado:', carrinhoParseado.length, 'itens');
        
        // Recalcular pontos baseado no carrinho carregado
        if (carrinhoParseado.length > 0) {
          const total = calcularTotalCarrinho();
          const pontos = calcularPontos(total);
          setPontosGanhos(pontos);
        }
      } else {
        console.log('📦 Nenhum carrinho salvo encontrado');
      }
    } catch (error) {
      console.error('❌ Erro ao carregar carrinho:', error);
    }
  };

  // 🔥 FUNÇÃO PARA SALVAR CARRINHO NO ASYNCSTORAGE
  const salvarCarrinho = async () => {
    try {
      console.log('💾 Salvando carrinho no AsyncStorage...', cart.length, 'itens');
      await AsyncStorage.setItem('@carrinho', JSON.stringify(cart));
      console.log('✅ Carrinho salvo com sucesso');
    } catch (error) {
      console.error('❌ Erro ao salvar carrinho:', error);
    }
  };

  // 🔥 EFFECT PARA CARREGAR CARRINHO QUANDO O APP INICIA
  useEffect(() => {
    carregarCarrinho();
  }, []);

  // 🔥 EFFECT PARA SALVAR CARRINHO SEMPRE QUE ELE MUDAR
  useEffect(() => {
    if (cart.length > 0) {
      salvarCarrinho();
    }
  }, [cart]);

  // ⭐⭐ FUNÇÃO PARA CONVERTER PREÇO BRASILEIRO
  const converterPrecoBrasileiro = (precoString: string): number => {
    if (!precoString) return 0;
    
    console.log('🔍 Preço original:', precoString);
    
    let precoProcessado = precoString.trim();
    
    // Remove "R$" e espaços
    if (precoProcessado.includes('R$')) {
      precoProcessado = precoProcessado.replace('R$', '').trim();
    }
    
    // Verifica se tem vírgula (formato brasileiro)
    if (precoProcessado.includes(',')) {
      // Formato: "600,00" ou "1.500,00"
      if (precoProcessado.includes('.')) {
        // Formato com ponto de milhar: "1.500,00"
        // Remove pontos de milhar e substitui vírgula por ponto
        precoProcessado = precoProcessado.replace(/\./g, '').replace(',', '.');
      } else {
        // Formato simples: "600,00" -> substitui vírgula por ponto
        precoProcessado = precoProcessado.replace(',', '.');
      }
    }
    
    const precoNumerico = parseFloat(precoProcessado);
    const precoValido = isNaN(precoNumerico) ? 0 : precoNumerico;
    
    console.log('💰 Preço processado:', precoString, '->', precoValido);
    return precoValido;
  };

  // ⭐⭐ FUNÇÃO PARA CALCULAR TOTAL DO CARRINHO
  const calcularTotalCarrinho = (): number => {
    if (cart.length === 0) {
      console.log('🛒 Carrinho vazio - Total: R$ 0');
      return 0;
    }
    
    console.log('🛒 Itens no carrinho para cálculo de total:', cart.length);
    
    const totalCalculado = cart.reduce((acc: number, item: CartItem) => {
      // ⭐⭐ IMPORTANTE: Tenta ambos os campos (preco e price)
      const precoString = item.preco || item.price || '0';
      console.log(`🔍 Processando item: ${item.nome} - Preço: ${precoString}`);
      
      const precoValido = converterPrecoBrasileiro(precoString);
      const subtotal = precoValido * item.quantity;
      
      console.log(`📦 ${item.quantity}x ${item.nome}: R$ ${precoValido} = R$ ${subtotal}`);
      
      return acc + subtotal;
    }, 0);
    
    console.log('💰💰 TOTAL FINAL DO CARRINHO: R$', totalCalculado);
    return totalCalculado;
  };

  // ⭐⭐ FUNÇÃO PARA CALCULAR PONTOS
  const calcularPontos = (valorTotal: number): number => {
    console.log('🎯 CALCULANDO PONTOS PARA VALOR: R$', valorTotal);
    
    if (valorTotal >= 500) {
      console.log('✅ 50 pontos - Acima de R$ 500');
      return 50;
    }
    if (valorTotal >= 350) {
      console.log('✅ 35 pontos - Acima de R$ 350');
      return 35;
    }
    if (valorTotal >= 250) {
      console.log('✅ 20 pontos - Acima de R$ 250');
      return 20;
    }
    if (valorTotal >= 100) {
      console.log('✅ 10 pontos - Acima de R$ 100');
      return 10;
    }
    
    const pontos = Math.floor(valorTotal / 10);
    console.log('✅ Pontos padrão:', pontos, '- Abaixo de R$ 100');
    return pontos;
  };

  // ⭐⭐ FUNÇÃO PARA OBTER TOTAL DE PONTOS DO USUÁRIO
  const getTotalPontosUsuario = (): number => {
    const pontosUsuario = user?.pontos_fidelidade || 0;
    const total = pontosUsuario + pontosGanhos;
    console.log('🎯 Pontos usuário:', pontosUsuario, ' + Pontos ganhos:', pontosGanhos, ' = Total:', total);
    return total;
  };

  // ⭐⭐ FUNÇÃO PARA SETAR PONTOS GANHOS
  const setPontosGanhosContext = (pontos: number) => {
    console.log('🎯 Setando pontos ganhos:', pontos);
    setPontosGanhos(pontos);
  };

  // ⭐⭐ FUNÇÕES DO CARRINHO (ATUALIZADAS PARA SALVAR AUTOMATICAMENTE)
  const addToCart = (product: Product) => {
    console.log('🛒 ADICIONANDO AO CARRINHO:', product);
    console.log('🔍 PRODUTO COMPLETO:', JSON.stringify(product, null, 2));
    
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      let newCart;
      
      if (existingItem) {
        newCart = prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCart = [...prev, { ...product, quantity: 1 }];
      }
      
      console.log('🛒 NOVO CARRINHO:', newCart);
      console.log('🛒 QUANTIDADE DE ITENS:', newCart.length);
      
      return newCart;
    });
  };

  const removeFromCart = (productId: string) => {
    console.log('🗑️ REMOVENDO DO CARRINHO:', productId);
    setCart(prev => {
      const newCart = prev.filter(item => item.id !== productId);
      console.log('🗑️ Produto removido. Novo carrinho:', newCart);
      return newCart;
    });
  };

  const toggleCart = (product: Product) => {
    console.log('🔁 TOGGLING CARRINHO:', product);
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      let newCart;
      
      if (existingItem) {
        newCart = prev.filter(item => item.id !== product.id);
      } else {
        newCart = [...prev, { ...product, quantity: 1 }];
      }
      
      console.log('🔁 Novo carrinho (toggle):', newCart);
      return newCart;
    });
  };

  const clearCart = async () => {
    console.log('🗑️ LIMPANDO CARRINHO COMPLETAMENTE');
    setCart([]);
    setPontosGanhos(0);
    setDescontoFidelidade(0);
    setDescontoAplicado(false);
    
    // 🔥 TAMBÉM LIMPA O ASYNCSTORAGE
    try {
      await AsyncStorage.removeItem('@carrinho');
      console.log('✅ Carrinho removido do AsyncStorage');
    } catch (error) {
      console.error('❌ Erro ao limpar carrinho do AsyncStorage:', error);
    }
  };

  const getTotalItems = (): number => {
    const total = cart.reduce((total, item) => total + item.quantity, 0);
    console.log('📊 Total de itens no carrinho:', total);
    return total;
  };

  // 🔥🔥🔥 FUNÇÃO CORRIGIDA - APLICAR DESCONTO FIDELIDADE
  const aplicarDescontoFidelidade = (descontoPercentual: number) => {
    console.log('🎯🎯🎯 APLICANDO DESCONTO NO CART CONTEXT 🎯🎯🎯');
    console.log('📊 descontoPercentual recebido:', descontoPercentual);
    
    const valorTotal = calcularTotalCarrinho();
    console.log('💰 valorTotal calculado:', valorTotal);
    
    // 🔥 CALCULA O DESCONTO CORRETAMENTE
    const desconto = (valorTotal * descontoPercentual) / 100;
    console.log('💸 desconto calculado:', desconto);
    
    setDescontoFidelidade(desconto);
    setDescontoAplicado(true);
    
    // Recalcular pontos SEM o desconto (mantém a lógica original)
    const novosPontos = calcularPontos(valorTotal);
    setPontosGanhos(novosPontos);
    
    console.log('✅✅✅ DESCONTO APLICADO NO CONTEXT ✅✅✅');
    console.log('💵 Valor do desconto:', desconto);
    console.log('🎯 Pontos mantidos:', novosPontos);
    console.log('🎯🎯🎯 FIM DEBUG DESCONTO 🎯🎯🎯');
  };

  const removerDescontoFidelidade = () => {
    console.log('🎯 REMOVENDO DESCONTO');
    setDescontoFidelidade(0);
    setDescontoAplicado(false);
    
    const valorTotal = calcularTotalCarrinho();
    const novosPontos = calcularPontos(valorTotal);
    setPontosGanhos(novosPontos);
    
    console.log('🎯 Desconto removido. Pontos atualizados:', novosPontos);
  };

  // 🔥🔥🔥 FUNÇÃO CORRIGIDA - CALCULAR TOTAL COM DESCONTO
  const calcularTotalComDesconto = (): number => {
    const total = calcularTotalCarrinho();
    const totalComDesconto = Math.max(0, total - descontoFidelidade);
    
    console.log('💰💰💰 CALCULANDO TOTAL COM DESCONTO 💰💰💰');
    console.log('📦 Total sem desconto:', total);
    console.log('💸 Desconto a aplicar:', descontoFidelidade);
    console.log('💵 Total com desconto:', totalComDesconto);
    console.log('💰💰💰 FIM CÁLCULO TOTAL 💰💰💰');
    
    return totalComDesconto;
  };

  // ⭐⭐ EFFECT PRINCIPAL - CALCULAR PONTOS SEMPRE QUE O CARRINHO MUDAR
  useEffect(() => {
    console.log('🔄🔄🔄 EFEITO: Carrinho mudou, recalculando pontos...');
    console.log('📦 Itens no carrinho para cálculo:', cart);
    
    if (cart.length === 0) {
      console.log('🛒 Carrinho vazio - Zerando pontos');
      setPontosGanhos(0);
      return;
    }
    
    const total = calcularTotalCarrinho();
    console.log('💰 Total para cálculo de pontos:', total);
    
    const pontos = calcularPontos(total);
    console.log('🎯 Pontos calculados:', pontos);
    
    setPontosGanhos(pontos);
  }, [cart]); // ⭐⭐ SÓ DEPENDE DO CARRINHO

  // ⭐⭐ EFFECT PARA DEBUG COMPLETO
  useEffect(() => {
    console.log('🛒🛒🛒 DEBUG CARRINHO COMPLETO 🛒🛒🛒');
    console.log('📦 Itens no carrinho:', cart);
    console.log('📊 Total de itens:', getTotalItems());
    console.log('💰 Total calculado:', calcularTotalCarrinho());
    console.log('🎯 Pontos ganhos:', pontosGanhos);
    console.log('💸 Desconto aplicado:', descontoAplicado);
    console.log('💵 Valor desconto:', descontoFidelidade);
    console.log('💳 Total com desconto:', calcularTotalComDesconto());
    console.log('🛒🛒🛒 FIM DEBUG 🛒🛒🛒');
  }, [cart, pontosGanhos, descontoAplicado, descontoFidelidade]);

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    toggleCart,
    clearCart,
    getTotalItems,
    pontosGanhos,
    descontoFidelidade,
    descontoAplicado,
    calcularPontos,
    aplicarDescontoFidelidade,
    removerDescontoFidelidade,
    calcularTotalComDesconto,
    getTotalPontosUsuario,
    calcularTotalCarrinho,
    setPontosGanhos: setPontosGanhosContext,
    // 🔥 NOVAS FUNÇÕES
    carregarCarrinho,
    salvarCarrinho
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};