import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, FlatList, Dimensions, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext'; // ⭐⭐ IMPORTE O AUTH CONTEXT

// Dados de exemplo para categorias
const categories = [
  { id: '1', name: 'Vacinas', icon: '💉' },
  { id: '2', name: 'Suplementos', icon: '🌱' },
  { id: '3', name: 'Medicamentos', icon: '💊' },
  { id: '4', name: 'Acessórios', icon: '🐎' },
];

// Dados de exemplo para produtos
const featuredProducts = [
  {
    id: '1',
    name: 'Vacina Febre Aftosa',
    price: 'R$ 89,90',
    category: 'Vacinas',
    image: require('../../assets/images/produtos/vacina.png'),
  },
  {
    id: '2',
    name: 'Suplemento Animais',
    price: 'R$ 149,90',
    category: 'Suplementos',
    image: require('../../assets/images/produtos/suplemento.png'),
  },
  {
    id: '3',
    name: 'Vermífugo Bovino',
    price: 'R$ 45,90',
    category: 'Medicamentos',
    image: require('../../assets/images/produtos/vermifugo.png'),
  },
  {
    id: '4',
    name: 'Cela Equina',
    price: 'R$ 289,90',
    category: 'Acessórios',
    image: require('../../assets/images/produtos/celaesquina.png'),
  },
];

// Dados de exemplo para notificações
const notificationsData = [
  { id: '1', title: 'Pedido enviado', message: 'Seu pedido #123 foi enviado', time: '5 min', read: false },
  { id: '2', title: 'Promoção especial', message: '20% off em medicamentos', time: '1 hora', read: false },
  { id: '3', title: 'Produto disponível', message: 'Vacina aftosa está disponível', time: '2 horas', read: true },
  { id: '4', title: 'Pagamento aprovado', message: 'Seu pagamento foi aprovado com sucesso', time: '3 horas', read: true },
  { id: '5', title: 'Produto em promoção', message: 'Ração premium com 15% de desconto', time: '5 horas', read: false },
  { id: '6', title: 'Entrega realizada', message: 'Seu pedido #122 foi entregue', time: '1 dia', read: true },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth(); // ⭐⭐ USE OS DADOS DO USUÁRIO
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [notifications, setNotifications] = useState(notificationsData);
  const [cartItems, setCartItems] = useState([]);

  function handleMenu() {
    router.push('/home/menu');
  }

  function handleCart() {
    setShowCart(!showCart);
  }

  function handleNotifications() {
    setShowNotifications(!showNotifications);
  }

  function handleNotificationPress(notification: any) {
    setNotifications(notifications.map(n =>
      n.id === notification.id ? { ...n, read: true } : n
    ));
    setShowNotifications(false);
    alert(`Notificação: ${notification.title}`);
  }

  // Função para adicionar produto ao carrinho
  function handleAddToCart(product: any) {
    const existingItem = cartItems.find(item => item.id === product.id);

    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }

    alert(`${product.name} adicionado ao carrinho!`);
  }

  // Função para remover produto do carrinho
  function handleRemoveFromCart(productId: string) {
    setCartItems(cartItems.filter(item => item.id !== productId));
  }

  // Função para aumentar quantidade
  function handleIncreaseQuantity(productId: string) {
    setCartItems(cartItems.map(item =>
      item.id === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
  }

  // Função para diminuir quantidade
  function handleDecreaseQuantity(productId: string) {
    setCartItems(cartItems.map(item =>
      item.id === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    ));
  }

  // Calcular total do carrinho
  function calculateTotal() {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace('R$ ', '').replace(',', '.'));
      return total + (price * item.quantity);
    }, 0).toFixed(2).replace('.', ',');
  }

  // Função para navegar para categoriaAnimal
  function handleCategoryPress(categoryId: string, categoryName: string) {
    router.push({
      pathname: '/home/categoriaAnimal',
      params: {
        categoriaId: categoryId,
        categoriaNome: categoryName
      }
    });
  }

  // Função para o "Ver mais" das categorias
  function handleViewAllCategories() {
    router.push('/home/categoria');
  }

  // Função para finalizar compra - navega para a tela de finalização
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

  const renderProduct = ({ item }) => (
    <TouchableOpacity style={styles.productCard}>
      <View style={styles.productImagePlaceholder}>
        {item.image ? (
          <Image
            source={item.image}
            style={styles.productImage}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.productEmoji}>{item.emoji}</Text>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productCategory}>{item.category}</Text>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAddToCart(item)}
        >
          <Text style={styles.addButtonText}>+ Adicionar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Renderizar item do carrinho
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
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleMenu} style={styles.menuButton}>
          <Ionicons name="menu" size={28} color="#126b1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>VetFarm</Text>
        <View style={styles.headerRight}>
          <View style={styles.notificationContainer}>
            <TouchableOpacity onPress={handleNotifications} style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={24} color="#126b1a" />
              {notifications.some(n => !n.read) && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.badgeText}>
                    {notifications.filter(n => !n.read).length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
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

      {/* MODAL PARA NOTIFICAÇÕES */}
      <Modal
        visible={showNotifications}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowNotifications(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowNotifications(false)}
        >
          <View style={styles.notificationsDropdown}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>Notificações</Text>
              <Text style={styles.notificationCount}>
                {notifications.length} {notifications.length === 1 ? 'notificação' : 'notificações'}
              </Text>
            </View>

            <ScrollView
              style={styles.notificationsList}
              showsVerticalScrollIndicator={true}
            >
              {notifications.map((notification) => (
                <TouchableOpacity
                  key={notification.id}
                  style={[
                    styles.notificationItem,
                    !notification.read && styles.unreadNotification
                  ]}
                  onPress={() => handleNotificationPress(notification)}
                >
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    <Text style={styles.notificationMessage} numberOfLines={2}>
                      {notification.message}
                    </Text>
                    <Text style={styles.notificationTime}>{notification.time}</Text>
                  </View>
                  {!notification.read && (
                    <View style={styles.unreadDot} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.seeAllButton}
              onPress={() => setShowNotifications(false)}
            >
              <Text style={styles.seeAllText}>Fechar notificações</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* MODAL PARA CARRINHO - VERSÃO MELHORADA */}
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

      {/* CONTEÚDO */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* BANNER - COM MENSAGEM PERSONALIZADA */}
        <View style={styles.bannerContainer}>
          <Image
            source={require('../../assets/images/bemvindos.png')}
            style={styles.bannerImage}
            resizeMode="contain"
          />
          {/* ⭐⭐ MENSAGEM DE BOAS-VINDAS PERSONALIZADA ⭐⭐ */}
          {user && (
            <View style={styles.welcomeMessage}>
              <Text style={styles.welcomeText}>Bem-vindo, {user.nome}! 👋</Text>
            </View>
          )}
        </View>

        {/* CATEGORIAS */}
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

        {/* PRODUTOS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Produtos Recomendados</Text>
          <FlatList
            data={featuredProducts}
            renderItem={renderProduct}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={styles.productsGrid}
            contentContainerStyle={styles.productsList}
            scrollEnabled={false}
          />
        </View>

        {/* BOTÃO VER TODOS */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => router.push('/home/produtos')}
          >
            <Text style={styles.exploreButtonText}>Ver Todos os Produtos</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

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
  content: {
    flex: 1,
  },
  bannerContainer: {
    alignItems: 'center',
    padding: 2,
    backgroundColor: '#fff',
    position: 'relative', // ⭐⭐ PARA POSICIONAR A MENSAGEM
  },
  bannerImage: {
    width: '100%',
    height: 150,
    maxHeight: 200,
  },
  // ⭐⭐ NOVOS ESTILOS PARA A MENSAGEM DE BOAS-VINDAS ⭐⭐
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
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
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#126b1a',
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#126b1a',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  exploreButton: {
    backgroundColor: '#126b1a',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  exploreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#126b1a',
  },
  // ESTILOS PARA NOTIFICAÇÕES
  notificationContainer: {
    position: 'relative',
  },
  cartContainer: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff3b30',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1001,
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
  notificationsDropdown: {
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
  notificationCount: {
    fontSize: 12,
    color: '#666',
  },
  cartCount: {
    fontSize: 12,
    color: '#666',
  },
  notificationsList: {
    maxHeight: height * 0.7 - 120,
  },
  cartList: {
    maxHeight: height * 0.7 - 180,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
    alignItems: 'flex-start',
  },
  unreadNotification: {
    backgroundColor: '#f8f9fa',
  },
  notificationContent: {
    flex: 1,
    marginRight: 8,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    lineHeight: 16,
  },
  notificationTime: {
    fontSize: 11,
    color: '#999',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#126b1a',
    marginTop: 4,
  },
  seeAllButton: {
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  seeAllText: {
    color: '#126b1a',
    fontWeight: 'bold',
    fontSize: 14,
  },
  // ESTILOS PARA CARRINHO
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
});