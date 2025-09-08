import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, FlatList, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Dados de exemplo para categorias (agora com 4 itens para o layout 2x2)
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

export default function HomeScreen() {
  const router = useRouter();

  function handleMenu() {
    // Alterado para abrir o menu em vez de mostrar alerta
    router.push('/home/menu');
  }

  function handleUser() {
    alert("Perfil do usuário clicado! 👤");
  }

  function handleNotifications() {
    alert("Notificações clicadas! 🔔");
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
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Adicionar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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
          <TouchableOpacity onPress={handleNotifications} style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color="#126b1a" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleUser} style={styles.iconButton}>
            <Ionicons name="person-circle-outline" size={28} color="#126b1a" />
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTEÚDO */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* BANNER */}
        <View style={styles.bannerContainer}>
          <Image 
            source={require('../../assets/images/bemvindos.png')}
            style={styles.bannerImage}
            resizeMode="contain"
          />
        </View>

        {/* CATEGORIAS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorias</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity key={category.id} style={styles.categoryCard}>
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
            onPress={() => router.push('/(tabs)/explore')}
          >
            <Text style={styles.exploreButtonText}>Ver Todos os Produtos</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const { width } = Dimensions.get('window');
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
    paddingTop: 15,
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
  },
  bannerImage: {
    width: '100%',
    height: 150,
    maxHeight: 200,
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
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: categoryCardSize,
    height: categoryCardSize,
    justifyContent: 'center',
    marginBottom: 15,
    shadowColor: '#000',
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
});