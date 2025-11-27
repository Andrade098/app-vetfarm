import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  FlatList,
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFavoritos } from '../../contexts/FavoritosContext';

export default function FavoritosScreen() {
  const router = useRouter();
  const { 
    favoritos, 
    removerFavorito, 
    limparFavoritos 
  } = useFavoritos();

  // 🔥 FUNÇÃO PARA OBTER IMAGEM DO PRODUTO
  const getProductImage = (imagens: string[]) => {
    if (!imagens || imagens.length === 0) {
      return null;
    }

    try {
      let imageUrl = imagens[0];
      
      if (typeof imageUrl === 'string' && imageUrl.startsWith('[')) {
        try {
          const parsedImages = JSON.parse(imageUrl);
          imageUrl = Array.isArray(parsedImages) && parsedImages.length > 0 ? parsedImages[0] : null;
        } catch (parseError) {
          console.log('❌ Erro ao parsear JSON de imagens:', parseError);
          return null;
        }
      }

      if (!imageUrl || typeof imageUrl !== 'string') {
        return null;
      }

      // Corrigir URLs problemáticas
      if (imageUrl.includes('flacalhost')) {
        imageUrl = imageUrl.replace('flacalhost', 'localhost');
      }
      if (imageUrl.includes('lobshttp')) {
        imageUrl = imageUrl.replace('lobshttp', 'http');
      }

      // Se for URL relativa, adicionar base URL
      if (imageUrl.startsWith('/uploads/')) {
        imageUrl = `http://192.168.0.2:3000${imageUrl}`;
      }

      // Se for Base64, usar diretamente
      if (imageUrl.startsWith('data:image')) {
        return { uri: imageUrl };
      }

      // Verificar se é uma URL válida
      if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return { uri: imageUrl };
      }

      console.log('❌ URL de imagem inválida:', imageUrl);
      return null;

    } catch (error) {
      console.error('❌ Erro ao processar imagem:', error);
      return null;
    }
  };

  // 🔥 FUNÇÃO PARA FORMATAR PREÇO
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  // 🔥 FUNÇÃO PARA REMOVER ITEM DOS FAVORITOS
  const removeFromFavorites = (productId: string, productName: string) => {
    Alert.alert(
      'Remover dos favoritos',
      `Deseja remover "${productName}" dos favoritos?`,
      [
        { 
          text: 'Cancelar', 
          style: 'cancel',
        },
        { 
          text: 'Remover', 
          style: 'destructive',
          onPress: () => {
            removerFavorito(productId);
          }
        },
      ],
      { cancelable: true }
    );
  };

  // 🔥 FUNÇÃO PARA LIMPAR TODOS OS FAVORITOS
  const handleClearAllFavorites = () => {
    if (favoritos.length === 0) return;
    
    Alert.alert(
      'Limpar todos os favoritos',
      `Deseja remover todos os ${favoritos.length} itens dos favoritos?`,
      [
        { 
          text: 'Cancelar', 
          style: 'cancel' 
        },
        { 
          text: 'Limpar Tudo', 
          style: 'destructive',
          onPress: () => {
            limparFavoritos();
            Alert.alert('Sucesso', 'Todos os favoritos foram removidos!');
          }
        },
      ]
    );
  };

  // 🔥 RENDERIZAR CADA ITEM FAVORITO (SEM BOTÃO DE CARRINHO)
  const renderFavoriteItem = ({ item }: { item: any }) => {
    const imageSource = getProductImage(item.imagens);
    
    return (
      <View style={styles.favoriteCard}>
        <View style={styles.productInfo}>
          <View style={styles.imageContainer}>
            {imageSource ? (
              <Image
                source={imageSource}
                style={styles.productImage}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="image-outline" size={32} color="#ccc" />
              </View>
            )}
          </View>

          <View style={styles.productDetails}>
            <Text style={styles.productCategory}>{item.categoria}</Text>
            <Text style={styles.productName} numberOfLines={2}>{item.nome}</Text>
            <Text style={styles.productPrice}>{formatPrice(item.preco_venda)}</Text>
            
            <View style={styles.stockContainer}>
              <View style={[
                styles.stockIndicator, 
                { backgroundColor: item.estoque > 0 ? '#4CAF50' : '#f44336' }
              ]} />
              <Text style={[
                styles.stockText,
                { color: item.estoque > 0 ? '#4CAF50' : '#f44336' }
              ]}>
                {item.estoque > 0 ? `${item.estoque} em estoque` : 'Fora de estoque'}
              </Text>
            </View>

            <Text style={styles.farmaciaText}>
              Farmácia: {item.farmacia_nome}
            </Text>
          </View>
        </View>

        {/* 🔥🔥🔥 REMOVIDO O BOTÃO DE CARRINHO - AGORA SÓ TEM REMOVER */}
        <TouchableOpacity 
          style={styles.removeButtonSingle}
          onPress={() => removeFromFavorites(item.id, item.nome)}
        >
          <Ionicons name="heart-dislike-outline" size={20} color="#f44336" />
          <Text style={styles.removeButtonText}>Remover dos favoritos</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER PERSONALIZADO - igual ao resumo da conta */}
      <View style={styles.customHeader}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#126b1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Favoritos</Text>
        <View style={styles.headerRight} />
      </View>

      {favoritos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>Nenhum favorito</Text>
          <Text style={styles.emptyText}>
            Você ainda não adicionou nenhum produto aos favoritos.
          </Text>
          <TouchableOpacity 
            style={styles.exploreButton}
            onPress={() => router.push('/home')}
          >
            <Text style={styles.exploreButtonText}>Explorar Produtos</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.content}>
          {/* INFO BAR - só mostra quando tem favoritos */}
          <View style={styles.infoBar}>
            <Text style={styles.itemCount}>
              {favoritos.length} {favoritos.length === 1 ? 'item salvo' : 'itens salvos'}
            </Text>
            <TouchableOpacity 
              style={styles.clearAllButton}
              onPress={handleClearAllFavorites}
            >
              <Text style={styles.clearAllText}>Limpar Todos</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={favoritos}
            renderItem={renderFavoriteItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  // 🔥 CUSTOM HEADER - igual ao resumo da conta
  customHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 50, // 🔥 PADDING DE 50 CONFORME PEDIDO
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#126b1a',
  },
  headerRight: {
    width: 34,
  },
  content: {
    flex: 1,
  },
  // 🔥 INFO BAR - só aparece quando tem favoritos
  infoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  itemCount: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  clearAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ffebee',
    borderRadius: 6,
  },
  clearAllText: {
    fontSize: 14,
    color: '#f44336',
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
  },
  favoriteCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: 'hidden',
  },
  productInfo: {
    flexDirection: 'row',
    padding: 16,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#126b1a',
    marginBottom: 8,
  },
  farmaciaText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  stockIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  stockText: {
    fontSize: 12,
    fontWeight: '500',
  },
  // 🔥🔥🔥 BOTÃO ÚNICO DE REMOVER (SEM CARRINHO)
  removeButtonSingle: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  removeButtonText: {
    color: '#f44336',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#f8f9fa',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: '#126b1a',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});