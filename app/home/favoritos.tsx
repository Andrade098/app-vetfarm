import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  FlatList,
  Alert 
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Dados de exemplo para produtos favoritos
const initialFavorites = [
  {
    id: '1',
    name: 'Vacina Febre Aftosa',
    price: 'R$ 89,90',
    category: 'Vacinas',
    image: require('../../assets/images/produtos/vacina.png'),
    inStock: true,
  },
  {
    id: '2',
    name: 'Suplemento Vitamínico',
    price: 'R$ 149,90',
    category: 'Suplementos',
    image: require('../../assets/images/produtos/suplemento.png'),
    inStock: true,
  },
  {
    id: '3',
    name: 'Vermífugo Bovino',
    price: 'R$ 45,90',
    category: 'Medicamentos',
    image: require('../../assets/images/produtos/vermifugo.png'),
    inStock: false,
  },
  {
    id: '4',
    name: 'Cela Equina Premium',
    price: 'R$ 289,90',
    category: 'Acessórios',
    image: require('../../assets/images/produtos/celaesquina.png'),
    inStock: true,
  },
];

export default function FavoritosScreen() {
  const router = useRouter();
  const [favorites, setFavorites] = useState(initialFavorites);

  // Função para remover item dos favoritos - CORRIGIDA
  const removeFromFavorites = (productId: string, productName: string) => {
    Alert.alert(
      'Remover dos favoritos',
      `Deseja remover "${productName}" dos favoritos?`,
      [
        { 
          text: 'Cancelar', 
          style: 'cancel',
          onPress: () => console.log('Cancelado')
        },
        { 
          text: 'Remover', 
          style: 'destructive',
          onPress: () => {
            const updatedFavorites = favorites.filter(item => item.id !== productId);
            setFavorites(updatedFavorites);
            
            // Feedback visual opcional
            if (updatedFavorites.length === 0) {
              // Se não houver mais favoritos, mostra mensagem
              setTimeout(() => {
                Alert.alert('Sucesso', 'Produto removido dos favoritos!');
              }, 300);
            }
          }
        },
      ],
      { cancelable: true } // Permite fechar clicando fora
    );
  };

  // Função alternativa mais simples (sem Alert)
  const removeFromFavoritesDirect = (productId: string) => {
    setFavorites(favorites.filter(item => item.id !== productId));
  };

  // Função para navegar para detalhes do produto
  const goToProductDetails = (product: any) => {
    Alert.alert('Detalhes', `Ver detalhes de ${product.name}`);
  };

  // Função para adicionar ao carrinho
  const addToCart = (product: any) => {
    Alert.alert('Sucesso', `${product.name} adicionado ao carrinho!`);
  };

  // Renderizar cada item favorito - CORRIGIDO
  const renderFavoriteItem = ({ item }: { item: any }) => (
    <View style={styles.favoriteCard}>
      <TouchableOpacity 
        style={styles.productInfo}
        onPress={() => goToProductDetails(item)}
      >
        <View style={styles.imageContainer}>
          {item.image ? (
            <Image
              source={item.image}
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
          <Text style={styles.productCategory}>{item.category}</Text>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.productPrice}>{item.price}</Text>
          
          <View style={styles.stockContainer}>
            <View style={[
              styles.stockIndicator, 
              { backgroundColor: item.inStock ? '#4CAF50' : '#f44336' }
            ]} />
            <Text style={[
              styles.stockText,
              { color: item.inStock ? '#4CAF50' : '#f44336' }
            ]}>
              {item.inStock ? 'Em estoque' : 'Fora de estoque'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[
            styles.cartButton,
            !item.inStock && styles.disabledButton
          ]}
          onPress={() => item.inStock && addToCart(item)}
          disabled={!item.inStock}
        >
          <Ionicons 
            name="cart-outline" 
            size={20} 
            color={item.inStock ? "white" : "#ccc"} 
          />
          <Text style={[
            styles.cartButtonText,
            !item.inStock && styles.disabledText
          ]}>
            {item.inStock ? 'Adicionar' : 'Indisponível'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => removeFromFavoritesDirect(item.id)}
          // Alternativa direta (sem confirmação):
          // onPress={() => removeFromFavoritesDirect(item.id)}
        >
          <Ionicons name="heart-dislike-outline" size={20} color="#f44336" />
          <Text style={styles.removeButtonText}>Remover</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Meus Favoritos',
          headerBackTitle: 'Voltar'
        }} 
      />

      {favorites.length === 0 ? (
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
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Meus Favoritos</Text>
            <Text style={styles.subtitle}>
              {favorites.length} {favorites.length === 1 ? 'item' : 'itens'} salvos
            </Text>
          </View>

          <FlatList
            data={favorites}
            renderItem={renderFavoriteItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
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
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  actionsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cartButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#126b1a',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#f5f5f5',
  },
  cartButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  disabledText: {
    color: '#ccc',
  },
  removeButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#f0f0f0',
  },
  removeButtonText: {
    color: '#f44336',
    fontWeight: 'bold',
    marginLeft: 6,
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