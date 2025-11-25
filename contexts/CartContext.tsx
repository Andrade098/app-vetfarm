// contexts/CartContext.tsx - ARQUIVO COMPLETO CORRIGIDO
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [pontosGanhos, setPontosGanhos] = useState(0);
  const [descontoFidelidade, setDescontoFidelidade] = useState(0);
  const [descontoAplicado, setDescontoAplicado] = useState(false);
  const { user } = useAuth();

  // ⭐⭐ FUNÇÃO MELHORADA PARA CONVERTER PREÇO BRASILEIRO
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
    // Se não tem vírgula nem ponto, assume que já é número (formato "600")
    
    const precoNumerico = parseFloat(precoProcessado);
    const precoValido = isNaN(precoNumerico) ? 0 : precoNumerico;
    
    console.log('💰 Preço processado:', precoString, '->', precoValido);
    return precoValido;
  };

  // ⭐⭐ FUNÇÃO CORRIGIDA PARA CALCULAR TOTAL DO CARRINHO
  const calcularTotalCarrinho = (): number => {
    if (cart.length === 0) {
      console.log('🛒 Carrinho vazio - Total: R$ 0');
      return 0;
    }
    
    console.log('🛒 Itens no carrinho:', cart.length);
    
    const totalCalculado = cart.reduce((acc: number, item: CartItem) => {
      // ⭐⭐ IMPORTANTE: Tenta ambos os campos (preco e price)
      const precoValido = converterPrecoBrasileiro(item.preco || item.price || '0');
      const subtotal = precoValido * item.quantity;
      
      console.log(`📦 ${item.quantity}x ${item.nome}: R$ ${precoValido} = R$ ${subtotal}`);
      
      return acc + subtotal;
    }, 0);
    
    console.log('💰💰 TOTAL FINAL DO CARRINHO: R$', totalCalculado);
    return totalCalculado;
  };

  // ⭐⭐ FUNÇÃO CORRIGIDA PARA CALCULAR PONTOS
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

  // Funções do carrinho
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const toggleCart = (product: Product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.filter(item => item.id !== product.id);
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const clearCart = () => {
    setCart([]);
    setPontosGanhos(0);
    setDescontoFidelidade(0);
    setDescontoAplicado(false);
    console.log('🗑️ Carrinho limpo');
  };

  const getTotalItems = (): number => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const aplicarDescontoFidelidade = (descontoPercentual: number) => {
    const valorTotal = calcularTotalCarrinho();
    const desconto = (valorTotal * descontoPercentual) / 100;
    setDescontoFidelidade(desconto);
    setDescontoAplicado(true);
    
    // Recalcular pontos SEM o desconto
    const novosPontos = calcularPontos(valorTotal);
    setPontosGanhos(novosPontos);
    
    console.log('🎯 Desconto aplicado:', descontoPercentual + '%', 'Valor: R$', desconto, 'Pontos mantidos:', novosPontos);
  };

  const removerDescontoFidelidade = () => {
    setDescontoFidelidade(0);
    setDescontoAplicado(false);
    
    const valorTotal = calcularTotalCarrinho();
    const novosPontos = calcularPontos(valorTotal);
    setPontosGanhos(novosPontos);
    
    console.log('🎯 Desconto removido. Pontos atualizados:', novosPontos);
  };

  const calcularTotalComDesconto = (): number => {
    const total = calcularTotalCarrinho();
    const totalComDesconto = Math.max(0, total - descontoFidelidade);
    console.log('💰 Total com desconto: R$', totalComDesconto, '(Original: R$', total, 'Desconto: R$', descontoFidelidade + ')');
    return totalComDesconto;
  };

  // ⭐⭐ EFFECT PRINCIPAL - CALCULAR PONTOS SEMPRE QUE O CARRINHO MUDAR
  useEffect(() => {
    console.log('🔄 EFEITO: Carrinho mudou, recalculando pontos...');
    const total = calcularTotalCarrinho();
    const pontos = calcularPontos(total);
    setPontosGanhos(pontos);
    console.log('🔄 Pontos atualizados:', pontos, 'para total: R$', total);
  }, [cart]); // ⭐⭐ SÓ DEPENDE DO CARRINHO

  // Effect para debug
  useEffect(() => {
    console.log('📊 ESTADO ATUAL DO CART CONTEXT:', {
      itensNoCarrinho: cart.length,
      totalItens: getTotalItems(),
      totalCarrinho: calcularTotalCarrinho(),
      pontosGanhos: pontosGanhos,
      descontoAplicado: descontoAplicado,
      valorDesconto: descontoFidelidade
    });
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
    calcularTotalCarrinho
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