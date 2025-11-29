// contexts/FidelidadeContext.tsx - VERSÃO COMPLETA ATUALIZADA
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

type FidelidadeContextType = {
  pontos: number;
  carregarPontos: () => Promise<void>;
  adicionarPontos: (novosPontos: number) => Promise<void>;
  getPontosAtuais: () => number;
  limparPontos: () => Promise<void>;
  // 🔥 NOVAS FUNÇÕES PARA CUPOM AUTOMÁTICO
  verificarEConcederCupom: (valorCompra: number) => Promise<{ concedido: boolean; desconto: number }>;
  usarCupomDesconto: () => Promise<void>;
  temCupomDisponivel: () => boolean;
};

const FidelidadeContext = createContext<FidelidadeContextType | undefined>(undefined);

export const useFidelidade = () => {
  const context = useContext(FidelidadeContext);
  if (!context) {
    throw new Error('useFidelidade deve ser usado dentro de FidelidadeProvider');
  }
  return context;
};

export const FidelidadeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pontos, setPontos] = useState(0);
  const { user, atualizarCupomDesconto } = useAuth();

  const carregarPontos = async () => {
    try {
      console.log('🎯 Carregando pontos do AsyncStorage...');
      
      const pontosSalvos = await AsyncStorage.getItem('@pontos_fidelidade');
      
      if (pontosSalvos) {
        const pontosNumero = parseInt(pontosSalvos);
        console.log('✅ Pontos carregados:', pontosNumero);
        setPontos(pontosNumero);
      } else {
        console.log('📭 Nenhum ponto salvo encontrado, iniciando com 0');
        setPontos(0);
        await AsyncStorage.setItem('@pontos_fidelidade', '0');
      }
      
    } catch (error) {
      console.error('❌ Erro ao carregar pontos:', error);
      setPontos(0);
    }
  };

  const adicionarPontos = async (novosPontos: number) => {
    try {
      console.log('🎯 Adicionando pontos:', novosPontos);
      
      const total = pontos + novosPontos;
      setPontos(total);
      await AsyncStorage.setItem('@pontos_fidelidade', total.toString());
      
      console.log('✅ Pontos atualizados:', total);
      
    } catch (error) {
      console.error('❌ Erro ao salvar pontos:', error);
    }
  };

  // 🔥 FUNÇÃO PARA VERIFICAR E CONCEDER CUPOM AUTOMATICAMENTE
  const verificarEConcederCupom = async (valorCompra: number): Promise<{ concedido: boolean; desconto: number }> => {
    try {
      console.log('🎫 Verificando se concede cupom para compra de:', valorCompra);
      
      // 🔥 REGRA: COMPRAS ACIMA DE R$ 500,00 GANHAM CUPOM DE 10%
      if (valorCompra > 500) {
        const desconto = 10; // 10% de desconto
        const dataExpiracao = new Date();
        dataExpiracao.setDate(dataExpiracao.getDate() + 30); // Válido por 30 dias
        
        console.log('🎫🎉 Cupom concedido! Desconto de', desconto + '%');
        
        // Atualiza no AuthContext (usuário)
        await atualizarCupomDesconto(desconto, dataExpiracao.toISOString());
        
        return { concedido: true, desconto };
      }
      
      console.log('🎫 Compra abaixo de R$ 500,00 - sem cupom');
      return { concedido: false, desconto: 0 };
      
    } catch (error) {
      console.error('❌ Erro ao verificar cupom:', error);
      return { concedido: false, desconto: 0 };
    }
  };

  // 🔥 FUNÇÃO PARA USAR O CUPOM (QUANDO ELE É APLICADO NA PRÓXIMA COMPRA)
  const usarCupomDesconto = async (): Promise<void> => {
    try {
      console.log('🎫 Usando cupom de desconto...');
      
      // Zera o cupom após uso
      await atualizarCupomDesconto(0, null);
      
      console.log('✅ Cupom utilizado e removido');
      
    } catch (error) {
      console.error('❌ Erro ao usar cupom:', error);
    }
  };

  // 🔥 FUNÇÃO PARA VERIFICAR SE TEM CUPOM DISPONÍVEL
  const temCupomDisponivel = (): boolean => {
    if (!user || !user.desconto_proxima_compra || user.desconto_proxima_compra <= 0) {
      return false;
    }
    
    // Verifica se o cupom não expirou
    if (user.data_expiracao_desconto) {
      const dataExpiracao = new Date(user.data_expiracao_desconto);
      const hoje = new Date();
      return dataExpiracao > hoje;
    }
    
    return true;
  };

  const getPontosAtuais = () => pontos;

  const limparPontos = async () => {
    try {
      setPontos(0);
      await AsyncStorage.setItem('@pontos_fidelidade', '0');
      console.log('🗑️ Pontos zerados');
    } catch (error) {
      console.error('❌ Erro ao limpar pontos:', error);
    }
  };

  useEffect(() => {
    carregarPontos();
  }, []);

  return (
    <FidelidadeContext.Provider value={{
      pontos,
      carregarPontos,
      adicionarPontos,
      getPontosAtuais,
      limparPontos,
      // 🔥 NOVAS FUNÇÕES EXPORTADAS
      verificarEConcederCupom,
      usarCupomDesconto,
      temCupomDisponivel
    }}>
      {children}
    </FidelidadeContext.Provider>
  );
};