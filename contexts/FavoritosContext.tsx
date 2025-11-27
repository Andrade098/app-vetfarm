import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProdutoFavorito {
  id: string;
  produto_id: number;
  farmacia_id: number;
  nome: string;
  descricao: string;
  categoria: string;
  preco_venda: number;
  estoque: number;
  farmacia_nome: string;
  imagens: string[];
}

interface FavoritosContextData {
  favoritos: ProdutoFavorito[];
  adicionarFavorito: (produto: ProdutoFavorito) => void;
  removerFavorito: (produtoId: string) => void;
  toggleFavorito: (produto: ProdutoFavorito) => void;
  isFavorito: (produtoId: string) => boolean;
  carregarFavoritos: () => Promise<void>;
  limparFavoritos: () => void;
}

const FavoritosContext = createContext<FavoritosContextData>({} as FavoritosContextData);

export const FavoritosProvider = ({ children }: { children: ReactNode }) => {
  const [favoritos, setFavoritos] = useState<ProdutoFavorito[]>([]);

  // Carregar favoritos do AsyncStorage quando o app inicia
  useEffect(() => {
    carregarFavoritos();
  }, []);

  const carregarFavoritos = async () => {
    try {
      const favoritosStorage = await AsyncStorage.getItem('favoritos');
      if (favoritosStorage) {
        const favoritosArray = JSON.parse(favoritosStorage);
        setFavoritos(favoritosArray);
        console.log('❤️ Favoritos carregados:', favoritosArray.length, 'itens');
      }
    } catch (error) {
      console.error('❌ Erro ao carregar favoritos:', error);
    }
  };

  const salvarFavoritos = async (novosFavoritos: ProdutoFavorito[]) => {
    try {
      await AsyncStorage.setItem('favoritos', JSON.stringify(novosFavoritos));
    } catch (error) {
      console.error('❌ Erro ao salvar favoritos:', error);
    }
  };

  const adicionarFavorito = async (produto: ProdutoFavorito) => {
    try {
      const novoFavorito: ProdutoFavorito = {
        ...produto,
        id: `${produto.produto_id}_${produto.farmacia_id}`
      };

      const novosFavoritos = [...favoritos, novoFavorito];
      setFavoritos(novosFavoritos);
      await salvarFavoritos(novosFavoritos);
      
      console.log('✅ Produto adicionado aos favoritos:', produto.nome);
    } catch (error) {
      console.error('❌ Erro ao adicionar favorito:', error);
    }
  };

  const removerFavorito = async (produtoId: string) => {
    try {
      const novosFavoritos = favoritos.filter(item => item.id !== produtoId);
      setFavoritos(novosFavoritos);
      await salvarFavoritos(novosFavoritos);
      
      console.log('❌ Produto removido dos favoritos:', produtoId);
    } catch (error) {
      console.error('❌ Erro ao remover favorito:', error);
    }
  };

  const toggleFavorito = async (produto: ProdutoFavorito) => {
    const produtoId = `${produto.produto_id}_${produto.farmacia_id}`;
    
    if (isFavorito(produtoId)) {
      await removerFavorito(produtoId);
    } else {
      await adicionarFavorito(produto);
    }
  };

  const isFavorito = (produtoId: string): boolean => {
    return favoritos.some(item => item.id === produtoId);
  };

  const limparFavoritos = async () => {
    try {
      setFavoritos([]);
      await AsyncStorage.removeItem('favoritos');
      console.log('🧹 Todos os favoritos foram removidos');
    } catch (error) {
      console.error('❌ Erro ao limpar favoritos:', error);
    }
  };

  return (
    <FavoritosContext.Provider value={{
      favoritos,
      adicionarFavorito,
      removerFavorito,
      toggleFavorito,
      isFavorito,
      carregarFavoritos,
      limparFavoritos
    }}>
      {children}
    </FavoritosContext.Provider>
  );
};

export const useFavoritos = () => useContext(FavoritosContext);