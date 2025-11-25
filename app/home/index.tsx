import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, FlatList, Dimensions, Modal, ActivityIndicator, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⭐⭐ CONSTANTE PARA IP DO SERVIDOR ⭐⭐
const API_URL = 'http://192.168.0.2:3000';

// Dados de exemplo para categorias
const categories = [
  { id: '1', name: 'Vacinas', icon: '💉' },
  { id: '2', name: 'Suplementos', icon: '🌱' },
  { id: '3', name: 'Medicamentos', icon: '💊' },
  { id: '4', name: 'Acessórios', icon: '🐎' },
];

// Interface para o produto da API
interface Produto {
  produto_id: number;
  nome: string;
  descricao: string;
  categoria: string;
  imagens: string[];
  farmacia_id: number;
  farmacia_nome: string;
  preco_venda: number;
  estoque: number;
}

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  
  // ⭐⭐ NOVOS ESTADOS PARA PRODUTOS REAIS ⭐⭐
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // ⭐⭐ ESTADO PARA PESQUISA ⭐⭐
  const [pesquisa, setPesquisa] = useState('');
  const [mostrarPesquisa, setMostrarPesquisa] = useState(false);

  // ⭐⭐ CARREGAR PRODUTOS REAIS DA API ⭐⭐
  useEffect(() => {
    loadProdutos();
  }, []);

  // ⭐⭐ FILTRAR PRODUTOS QUANDO A PESQUISA MUDAR ⭐⭐
  useEffect(() => {
    if (pesquisa.trim() === '') {
      setProdutosFiltrados(produtos);
    } else {
      const termo = pesquisa.toLowerCase().trim();
      const filtrados = produtos.filter(produto =>
        produto.nome.toLowerCase().includes(termo) ||
        produto.descricao.toLowerCase().includes(termo) ||
        produto.categoria.toLowerCase().includes(termo) ||
        produto.farmacia_nome.toLowerCase().includes(termo)
      );
      setProdutosFiltrados(filtrados);
    }
  }, [pesquisa, produtos]);

  // ⭐⭐ CARREGAR PRODUTOS REAIS DA API ⭐⭐
  const loadProdutos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      console.log('📡 Buscando produtos de TODAS as farmácias...');
      
      // ✅ USE A NOVA ROTA /loja
      const response = await fetch(`${API_URL}/api/farmacia-produtos/loja`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📡 Status da resposta:', response.status);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Não autorizado - faça login novamente');
        }
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Produtos carregados de TODAS as farmácias:', data.length);
      
      // ✅ AGORA VAI MOSTRAR PRODUTOS DE TODAS AS FARMÁCIAS
      setProdutos(data);
      setProdutosFiltrados(data);
      
    } catch (error) {
      console.error('❌ Erro ao carregar produtos:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ⭐⭐ FUNÇÃO PARA OBTER IMAGEM DO PRODUTO ⭐⭐
  const getProductImage = (imagens: string[]) => {
    if (!imagens || imagens.length === 0) {
      return null;
    }

    try {
      let imageUrl = imagens[0];
      
      // Parsear se for string JSON
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
        imageUrl = `${API_URL}${imageUrl}`;
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

  // ⭐⭐ FUNÇÃO PARA FORMATAR PREÇO ⭐⭐
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  // Funções existentes (mantidas)
  function handleMenu() {
    router.push('/home/menu');
  }

  function handleCart() {
    setShowCart(!showCart);
  }

  // ⭐⭐ FUNÇÃO PARA TOGGLE DA PESQUISA ⭐⭐
  function handlePesquisa() {
    setMostrarPesquisa(!mostrarPesquisa);
    if (mostrarPesquisa) {
      setPesquisa(''); // Limpa a pesquisa quando fechar
    }
  }

  // Função para adicionar produto ao carrinho (atualizada para produtos reais)
  function handleAddToCart(product: Produto) {
    const productWithId = {
      ...product,
      id: `${product.produto_id}_${product.farmacia_id}`, // ID único
      price: formatPrice(product.preco_venda),
      name: product.nome,
      category: product.categoria,
      image: getProductImage(product.imagens)
    };

    const existingItem = cartItems.find(item => item.id === productWithId.id);

    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === productWithId.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...productWithId, quantity: 1 }]);
    }

    alert(`${product.nome} adicionado ao carrinho!`);
  }

  const toggleFavorito = (productId: string) => {
    setFavoritos(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Funções do carrinho (mantidas)
  function handleRemoveFromCart(productId: string) {
    setCartItems(cartItems.filter(item => item.id !== productId));
  }

  function handleIncreaseQuantity(productId: string) {
    setCartItems(cartItems.map(item =>
      item.id === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
  }

  function handleDecreaseQuantity(productId: string) {
    setCartItems(cartItems.map(item =>
      item.id === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    ));
  }

  // ⭐⭐ CORREÇÃO DA FUNÇÃO calculateTotal ⭐⭐
  function calculateTotal() {
    const total = cartItems.reduce((total, item) => {
      // Extrair o valor numérico do preço formatado
      let precoString = item.price;
      
      // Remover "R$ " se existir
      if (precoString.includes('R$')) {
        precoString = precoString.replace('R$', '').trim();
      }
      
      // Substituir vírgula por ponto e converter para número
      const precoNumerico = parseFloat(
        precoString.replace('.', '').replace(',', '.')
      );
      
      // Se for NaN, usar 0
      const precoValido = isNaN(precoNumerico) ? 0 : precoNumerico;
      
      return total + (precoValido * item.quantity);
    }, 0);
    
    // Formatar para o padrão brasileiro
    return total.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function handleCategoryPress(categoryId: string, categoryName: string) {
    router.push({
      pathname: '/home/categoriaAnimal',
      params: {
        categoriaId: categoryId,
        categoriaNome: categoryName
      }
    });
  }

  function handleViewAllCategories() {
    router.push('/home/categoria');
  }

  function handleCheckout() {
  setShowCart(false);
  router.push({
    pathname: '/home/finalizacompra',
    params: {
      cartItems: JSON.stringify(cartItems),
      total: calculateTotal()
    }
  });
}

  // ⭐⭐ RENDERIZAR PRODUTO REAL ⭐⭐
  const renderProduct = ({ item }: { item: Produto }) => {
    const productUniqueId = `${item.produto_id}_${item.farmacia_id}`;
    const imageSource = getProductImage(item.imagens);
    
    return (
      <TouchableOpacity style={styles.productCard}>
        {/* BOTÃO FAVORITO */}
        <TouchableOpacity
          style={styles.favoritoButton}
          onPress={() => toggleFavorito(productUniqueId)}
        >
          <Ionicons
            name={favoritos.includes(productUniqueId) ? "heart" : "heart-outline"}
            size={20}
            color={favoritos.includes(productUniqueId) ? "#ff3b30" : "#666"}
          />
        </TouchableOpacity>

        <View style={styles.productImagePlaceholder}>
          {imageSource ? (
            <Image
              source={imageSource}
              style={styles.productImage}
              resizeMode="cover"
              onError={(e) => console.log('Erro ao carregar imagem:', e.nativeEvent.error)}
            />
          ) : (
            <Text style={styles.productEmoji}>📦</Text>
          )}
        </View>
        
        <View style={styles.productInfo}>
          <Text style={styles.productCategory}>
            {item.categoria} - {item.farmacia_nome}
          </Text>
          <Text style={styles.productName} numberOfLines={2}>
            {item.nome}
          </Text>
          <Text style={styles.productPrice}>
            {formatPrice(item.preco_venda)}
          </Text>
          
          {/* Indicador de estoque */}
          <Text style={[
            styles.estoqueText,
            { color: item.estoque > 0 ? '#27ae60' : '#e74c3c' }
          ]}>
            {item.estoque > 0 ? `${item.estoque} em estoque` : 'Fora de estoque'}
          </Text>
          
          <TouchableOpacity
            style={[
              styles.addButton,
              item.estoque === 0 && styles.addButtonDisabled
            ]}
            onPress={() => handleAddToCart(item)}
            disabled={item.estoque === 0}
          >
            <Text style={styles.addButtonText}>
              {item.estoque > 0 ? '+ Adicionar' : 'Sem estoque'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // Renderizar item do carrinho (mantido)
  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <View style={styles.cartItemImage}>
        {item.image ? (
          <Image
            source={item.image}
            style={styles.cartProductImage}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.cartProductEmoji}>📦</Text>
        )}
      </View>

      <View style={styles.cartItemDetails}>
        <Text style={styles.cartItemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.cartItemPrice}>{item.price}</Text>

        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleDecreaseQuantity(item.id)}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>

          <Text style={styles.quantityText}>{item.quantity}</Text>

          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleIncreaseQuantity(item.id)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFromCart(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color="#ff3b30" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.fullContainer}>
      {/* HEADER (atualizado) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleMenu} style={styles.menuButton}>
          <Ionicons name="menu" size={28} color="#126b1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>VetFarm</Text>
        <View style={styles.headerRight}>
          {/* ⭐⭐ L U P A  D E  P E S Q U I S A ⭐⭐ */}
          <View style={styles.pesquisaContainer}>
            {mostrarPesquisa ? (
              <View style={styles.pesquisaInputContainer}>
                <TextInput
                  style={styles.pesquisaInput}
                  placeholder="Buscar produtos..."
                  value={pesquisa}
                  onChangeText={setPesquisa}
                  autoFocus={true}
                  placeholderTextColor="#999"
                />
                <TouchableOpacity 
                  style={styles.pesquisaCloseButton}
                  onPress={handlePesquisa}
                >
                  <Ionicons name="close" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={handlePesquisa} style={styles.iconButton}>
                <Ionicons name="search" size={24} color="#126b1a" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.cartContainer}>
            <TouchableOpacity onPress={handleCart} style={styles.iconButton}>
              <Ionicons name="cart-outline" size={28} color="#126b1a" />
              {cartItems.length > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.badgeText}>
                    {cartItems.reduce((total, item) => total + item.quantity, 0)}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* MODAL DO CARRINHO (mantido) */}
      <Modal
        visible={showCart}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCart(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCart(false)}
        >
          <View style={styles.cartDropdown}>
            <View style={styles.dropdownHeader}>
              <View style={styles.headerTop}>
                <Text style={styles.dropdownTitle}>Meu Carrinho</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowCart(false)}
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              <Text style={styles.cartCount}>
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'}
              </Text>
            </View>

            {cartItems.length === 0 ? (
              <View style={styles.emptyCart}>
                <Ionicons name="cart-outline" size={60} color="#ccc" />
                <Text style={styles.emptyCartText}>Carrinho vazio</Text>
                <Text style={styles.emptyCartSubtext}>Adicione produtos ao carrinho</Text>
                <TouchableOpacity
                  style={styles.fecharButton}
                  onPress={() => setShowCart(false)}
                >
                  <Text style={styles.fecharButtonText}>Fechar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <FlatList
                  data={cartItems}
                  renderItem={renderCartItem}
                  keyExtractor={item => item.id}
                  style={styles.cartList}
                  showsVerticalScrollIndicator={true}
                />

                <View style={styles.cartFooter}>
                  <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total:</Text>
                    <Text style={styles.totalPrice}>R$ {calculateTotal()}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.checkoutButton}
                    onPress={handleCheckout}
                  >
                    <Text style={styles.checkoutButtonText}>Finalizar Compra</Text>
                  </TouchableOpacity>

                  <View style={styles.cartActions}>
                    <TouchableOpacity
                      style={styles.clearCartButton}
                      onPress={() => setCartItems([])}
                    >
                      <Text style={styles.clearCartText}>Limpar </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.fecharButton}
                      onPress={() => setShowCart(false)}
                    >
                      <Text style={styles.fecharButtonText}>Fechar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* CONTEÚDO PRINCIPAL */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* BANNER */}
        <View style={styles.bannerContainer}>
          <Image
            source={require('../../assets/images/bemvindos.png')}
            style={styles.bannerImage}
            resizeMode="contain"
          />
          {user && (
            <View style={styles.welcomeMessage}>
              <Text style={styles.welcomeText}>Bem-vindo, {user.nome}! 👋</Text>
            </View>
          )}
        </View>

        {/* CATEGORIAS (mantido) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categorias</Text>
            <TouchableOpacity onPress={handleViewAllCategories}>
              <Text style={styles.viewAllText}>Ver mais →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(category.id, category.name)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ⭐⭐ NOSSOS PRODUTOS - AGORA COM DADOS REAIS E PESQUISA ⭐⭐ */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {pesquisa ? `Resultados para "${pesquisa}"` : 'Nossos Produtos'}
            </Text>
            <TouchableOpacity onPress={loadProdutos}>
              <Ionicons name="refresh" size={20} color="#126b1a" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#126b1a" />
              <Text style={styles.loadingText}>Carregando produtos...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={48} color="#e74c3c" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={loadProdutos}>
                <Text style={styles.retryButtonText}>Tentar Novamente</Text>
              </TouchableOpacity>
            </View>
          ) : produtosFiltrados.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color="#bdc3c7" />
              <Text style={styles.emptyText}>
                {pesquisa ? 'Nenhum produto encontrado' : 'Nenhum produto disponível'}
              </Text>
              <Text style={styles.emptySubtext}>
                {pesquisa ? 'Tente buscar com outros termos' : 'Tente novamente mais tarde'}
              </Text>
              {pesquisa && (
                <TouchableOpacity 
                  style={styles.retryButton} 
                  onPress={() => setPesquisa('')}
                >
                  <Text style={styles.retryButtonText}>Limpar Busca</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <>
              <Text style={styles.productsCount}>
                {produtosFiltrados.length} produto{produtosFiltrados.length !== 1 ? 's' : ''} {pesquisa ? 'encontrado' : 'disponível'}{produtosFiltrados.length !== 1 ? 's' : ''}
              </Text>
              <FlatList
                data={produtosFiltrados}
                renderItem={renderProduct}
                keyExtractor={item => `${item.produto_id}_${item.farmacia_id}`}
                numColumns={2}
                columnWrapperStyle={styles.productsGrid}
                contentContainerStyle={styles.productsList}
                scrollEnabled={false}
              />
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

// ESTILOS (mantenha os mesmos estilos que você já tem)
const { width, height } = Dimensions.get('window');
const categoryCardSize = (width - 60) / 2;

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 40,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#126b1a',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconButton: {
    padding: 5,
  },
  // ⭐⭐ ESTILOS PARA A PESQUISA ⭐⭐
  pesquisaContainer: {
    position: 'relative',
  },
  pesquisaInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f2f6',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 200,
  },
  pesquisaInput: {
    flex: 1,
    fontSize: 14,
    color: '#2c3e50',
    padding: 0,
    marginRight: 8,
  },
  pesquisaCloseButton: {
    padding: 2,
  },
  content: {
    flex: 1,
  },
  bannerContainer: {
    alignItems: 'center',
    padding: 2,
    backgroundColor: '#fff',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: 150,
    maxHeight: 200,
  },
  welcomeMessage: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  welcomeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#126b1a',
  },
  section: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  productsCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    backgroundColor: '#daeed4ff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: categoryCardSize,
    height: categoryCardSize,
    justifyContent: 'center',
    marginBottom: 15,
    shadowColor: '#000000ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  productsList: {
    paddingBottom: 20,
  },
  productsGrid: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '48%',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    position: 'relative',
  },
  favoritoButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  productImagePlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  productEmoji: {
    fontSize: 40,
  },
  productInfo: {
    padding: 10,
  },
  productCategory: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  },
  productName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#126b1a',
    marginBottom: 4,
  },
  estoqueText: {
    fontSize: 10,
    fontWeight: '500',
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#126b1a',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  addButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#126b1a',
  },
  cartContainer: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#126b1a',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1001,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 80,
    paddingRight: 10,
  },
  cartDropdown: {
    width: width * 0.85,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    maxHeight: height * 0.7,
  },
  dropdownHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  closeButton: {
    padding: 4,
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cartCount: {
    fontSize: 12,
    color: '#666',
  },
  cartList: {
    maxHeight: height * 0.7 - 180,
  },
  emptyCart: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyCartSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  cartItemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cartProductImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  cartProductEmoji: {
    fontSize: 20,
  },
  cartItemDetails: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#126b1a',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    padding: 8,
  },
  cartFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#126b1a',
  },
  checkoutButton: {
    backgroundColor: '#126b1a',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  clearCartButton: {
    backgroundColor: '#ff3b30',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  clearCartText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  fecharButton: {
    backgroundColor: '#95a5a6',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  fecharButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  // ⭐⭐ NOVOS ESTILOS PARA CARREGAMENTO E ERRO ⭐⭐
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#126b1a',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});