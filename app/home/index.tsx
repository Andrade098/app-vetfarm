import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, FlatList, Dimensions, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

// Dados de exemplo para categorias
const categories = [
  { id: '1', name: 'Vacinas', icon: '💉' },
  { id: '2', name: 'Suplementos', icon: '🌱' },
  { id: '3', name: 'Medicamentos', icon: '💊' },
  { id: '4', name: 'Acessórios', icon: '🐎' },
];

// ⭐⭐ TODOS OS PRODUTOS DE TODAS AS CATEGORIAS ⭐⭐
const allProducts = [
  // 🐄 BOVINOS
  {
    id: '1',
    name: 'Vacina Brucelose B19',
    price: 'R$ 89,90',
    category: 'Vacinas',
    animal: 'Bovinos',
    image: require('../../assets/images/produtos/vacina-brucelose.png'),
  },
  {
    id: '2',
    name: 'Vacina Febre Aftosa',
    price: 'R$ 67,50',
    category: 'Vacinas',
    animal: 'Bovinos',
    image: require('../../assets/images/produtos/vacina.png'),
  },
  {
    id: '3',
    name: 'Vacina Raiva',
    price: 'R$ 95,00',
    category: 'Vacinas',
    animal: 'Bovinos',
    image: require('../../assets/images/produtos/vacina-raiva.png'),
  },
  {
    id: '4',
    name: 'Vacina Clostridiose',
    price: 'R$ 78,90',
    category: 'Vacinas',
    animal: 'Bovinos',
    image: require('../../assets/images/produtos/vacina-clostridiose.png'),
  },
  {
    id: '5',
    name: 'Ivermectina 1%',
    price: 'R$ 45,90',
    category: 'Medicamentos',
    animal: 'Bovinos',
    image: require('../../assets/images/produtos/ivermectina.png'),
  },
  {
    id: '6',
    name: 'Albendazol 10%',
    price: 'R$ 38,50',
    category: 'Medicamentos',
    animal: 'Bovinos',
    image: require('../../assets/images/produtos/albendazol.png'),
  },
  {
    id: '7',
    name: 'Brinco de Identificação Bovino',
    price: 'R$ 12,90',
    category: 'Acessórios',
    animal: 'Bovinos',
    image: require('../../assets/images/produtos/brinco-bovino.png'),
  },
  {
    id: '8',
    name: 'Aplicador de Brincos',
    price: 'R$ 89,00',
    category: 'Acessórios',
    animal: 'Bovinos',
    image: require('../../assets/images/produtos/aplicador-brinco.png'),
  },
  {
    id: '9',
    name: 'Núcleo Mineral para Gado de Corte',
    price: 'R$ 149,90',
    category: 'Suplementos',
    animal: 'Bovinos',
    image: require('../../assets/images/produtos/suplemento-mineral.png'),
  },
  {
    id: '10',
    name: 'Vitamina A-D-E',
    price: 'R$ 67,80',
    category: 'Suplementos',
    animal: 'Bovinos',
    image: require('../../assets/images/produtos/vitamina-ade.png'),
  },

  // 🐑 OVINOS
  {
    id: '11',
    name: 'Vacina Clostridial (Covexin 10)',
    price: 'R$ 82,50',
    category: 'Vacinas',
    animal: 'Ovinos',
    image: require('../../assets/images/produtos/vacina-clostridial.png'),
  },
  {
    id: '12',
    name: 'Albendazol 10%',
    price: 'R$ 42,90',
    category: 'Medicamentos',
    animal: 'Ovinos',
    image: require('../../assets/images/produtos/albendazol-ovino.png'),
  },
  {
    id: '13',
    name: 'Tesoura para Tosa de Lã',
    price: 'R$ 35,00',
    category: 'Acessórios',
    animal: 'Ovinos',
    image: require('../../assets/images/produtos/tesoura-tosa.png'),
  },
  {
    id: '14',
    name: 'Sal Mineral para Ovinos',
    price: 'R$ 79,90',
    category: 'Suplementos',
    animal: 'Ovinos',
    image: require('../../assets/images/produtos/sal-mineral-ovino.png'),
  },

  // 🐖 SUÍNOS
  {
    id: '15',
    name: 'Vacina Peste Suína',
    price: 'R$ 75,90',
    category: 'Vacinas',
    animal: 'Suínos',
    image: require('../../assets/images/produtos/vacina-peste-suina.png'),
  },
  {
    id: '16',
    name: 'Vacina Rinite Atrófica',
    price: 'R$ 82,50',
    category: 'Vacinas',
    animal: 'Suínos',
    image: require('../../assets/images/produtos/vacina-rinite.png'),
  },
  {
    id: '17',
    name: 'Enrofloxacina 10%',
    price: 'R$ 58,90',
    category: 'Medicamentos',
    animal: 'Suínos',
    image: require('../../assets/images/produtos/enrofloxacina.png'),
  },
  {
    id: '18',
    name: 'Bebedouro Tipo Nipple',
    price: 'R$ 24,90',
    category: 'Acessórios',
    animal: 'Suínos',
    image: require('../../assets/images/produtos/bebedouro-nipple.png'),
  },
  {
    id: '19',
    name: 'Premix Vitamínico para Suínos',
    price: 'R$ 129,90',
    category: 'Suplementos',
    animal: 'Suínos',
    image: require('../../assets/images/produtos/premix-suino.png'),
  },

  // 🐎 EQUINOS
  {
    id: '20',
    name: 'Vacina Antitetânica',
    price: 'R$ 65,00',
    category: 'Vacinas',
    animal: 'Equinos',
    image: require('../../assets/images/produtos/vacina-antitetanica.png'),
  },
  {
    id: '21',
    name: 'Pasta Vermífuga com Ivermectina',
    price: 'R$ 52,90',
    category: 'Medicamentos',
    animal: 'Equinos',
    image: require('../../assets/images/produtos/pasta-vermifuga.png'),
  },
  {
    id: '22',
    name: 'Cabeçada de Couro',
    price: 'R$ 89,90',
    category: 'Acessórios',
    animal: 'Equinos',
  },
  {
    id: '23',
    name: 'Suplemento Vitamínico-Mineral',
    price: 'R$ 139,90',
    category: 'Suplementos',
    animal: 'Equinos',
    image: require('../../assets/images/produtos/suplemento-equino.png'),
  },

  // 🐔 AVES
  {
    id: '24',
    name: 'Vacina contra Newcastle',
    price: 'R$ 48,90',
    category: 'Vacinas',
    animal: 'Aves',
    image: require('../../assets/images/produtos/vacina-newcastle.png'),
  },
  {
    id: '25',
    name: 'Oxitetraciclina Solúvel',
    price: 'R$ 32,50',
    category: 'Medicamentos',
    animal: 'Aves',
    image: require('../../assets/images/produtos/oxitetraciclina.png'),
  },
  {
    id: '26',
    name: 'Comedouro Automático para Aves',
    price: 'R$ 45,00',
    category: 'Acessórios',
    animal: 'Aves',
    image: require('../../assets/images/produtos/comedouro-aves.png'),
  },
  {
    id: '27',
    name: 'Complexo Vitamínico para Aves',
    price: 'R$ 39,90',
    category: 'Suplementos',
    animal: 'Aves',
    image: require('../../assets/images/produtos/vitaminas-aves.png'),
  },

  // 🐟 PEIXES
  {
    id: '28',
    name: 'Vacina contra Streptococcus',
    price: 'R$ 125,00',
    category: 'Vacinas',
    animal: 'Peixes',
  },
  {
    id: '29',
    name: 'Formalina',
    price: 'R$ 28,90',
    category: 'Medicamentos',
    animal: 'Peixes',
  },
  {
    id: '30',
    name: 'Rede de Manejo para Peixes',
    price: 'R$ 34,90',
    category: 'Acessórios',
    animal: 'Peixes',
  },
  {
    id: '31',
    name: 'Ração com Probióticos',
    price: 'R$ 89,90',
    category: 'Suplementos',
    animal: 'Peixes',
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
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [notifications, setNotifications] = useState(notificationsData);
  const [cartItems, setCartItems] = useState([]);
  // ⭐⭐ ESTADO DOS FAVORITOS
  const [favoritos, setFavoritos] = useState<string[]>([]);

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

  // ⭐⭐ FUNÇÃO PARA ADICIONAR/REMOVER DOS FAVORITOS
  const toggleFavorito = (productId: string) => {
    setFavoritos(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

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
      {/* ⭐⭐ BOTÃO FAVORITO NO CANTO SUPERIOR DIREITO */}
      <TouchableOpacity
        style={styles.favoritoButton}
        onPress={() => toggleFavorito(item.id)}
      >
        <Ionicons
          name={favoritos.includes(item.id) ? "heart" : "heart-outline"}
          size={20}
          color={favoritos.includes(item.id) ? "#ff3b30" : "#666"}
        />
      </TouchableOpacity>

      <View style={styles.productImagePlaceholder}>
        {item.image ? (
          <Image
            source={item.image}
            style={styles.productImage}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.productEmoji}>📦</Text>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productCategory}>{item.category} - {item.animal}</Text>
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

        {/* ⭐⭐ TODOS OS PRODUTOS - AGORA COM TODOS OS 31 PRODUTOS E BOTÃO DE FAVORITOS ⭐⭐ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nossos Produtos</Text>
          <Text style={styles.productsCount}>{allProducts.length} produtos disponíveis</Text>
          <FlatList
            data={allProducts}
            renderItem={renderProduct}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={styles.productsGrid}
            contentContainerStyle={styles.productsList}
            scrollEnabled={false}
          />
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
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
    position: 'relative', // ⭐⭐ PARA POSICIONAR O BOTÃO DE FAVORITO
  },
  // ⭐⭐ ESTILOS PARA O BOTÃO DE FAVORITO NO CANTO
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