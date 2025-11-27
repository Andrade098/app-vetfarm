// contexts/FidelidadeContext.tsx - COMPLETO
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type FidelidadeContextType = {
  pontos: number;
  carregarPontos: () => Promise<void>;
  adicionarPontos: (novosPontos: number) => Promise<void>;
  getPontosAtuais: () => number;
  limparPontos: () => Promise<void>;
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
      limparPontos
    }}>
      {children}
    </FidelidadeContext.Provider>
  );
};