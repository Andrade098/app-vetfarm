import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

// Dados de exemplo para categorias
const categories = [
  { id: '1', name: 'Vacinas 🐄', icon: '💉' },
  { id: '2', name: 'Suplementos 🌱', icon: '🥛' },
  { id: '3', name: 'Medicamentos 💊', icon: '❤️' },
  { id: '4', name: 'Acessórios 🐎', icon: '🧰' },
  { id: '5', name: 'Rações 🥕', icon: '🌾' },
  { id: '6', name: 'Ferramentas 🔧', icon: '⚒️' },
];

// Dados de exemplo para produtos - COM CAMINHO CORRETO
const featuredProducts = [
  { 
    id: '1', 
    name: 'Vacina Febre Aftosa', 
    price: 'R$ 89,90', 
    category: 'Vacinas',
    image: require('../../assets/images/produtos/vacina.png'), // ← 2 pontos apenas
    type: 'image'
  },
  { 
    id: '2', 
    name: 'Suplemento Mineral', 
    price: 'R$ 149,90', 
    category: 'Suplementos',
    emoji: '🌱',
    type: 'emoji'
  },
  { 
    id: '3', 
    name: 'Vermífugo Bovino', 
    price: 'R$ 45,90', 
    category: 'Medicamentos',
    emoji: '💊',
    type: 'emoji'
  },
  { 
    id: '4', 
    name: 'Cela Equina', 
    price: 'R$ 289,90', 
    category: 'Acessórios',
    emoji: '🐎',
    type: 'emoji'
  },
];

export default function HomeScreen() {
  const router = useRouter();

  const renderCategory = ({ item }) => (
    <TouchableOpacity style={styles.categoryCard}>
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }) => (
    <TouchableOpacity style={styles.productCard}>
      {item.type === 'image' ? (
        <Image 
          source={item.image} 
          style={styles.productImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.productImagePlaceholder}>
          <Text style={styles.productEmoji}>{item.emoji}</Text>
        </View>
      )}
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bem-vindo à VetFarm! 🐄</Text>
        <Text style={styles.subtitle}>Seu agromarketplace delivery</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Categorias */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorias</Text>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Produtos Recomendados */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Produtos Recomendados</Text>
          <FlatList
            data={featuredProducts}
            renderItem={renderProduct}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={styles.productsGrid}
            contentContainerStyle={styles.productsList}
          />
        </View>

        {/* Botão para Explorar */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#126b1a',
    padding: 20,
    paddingTop: 50,
  },
  welcomeText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  categoriesList: {
    paddingRight: 15,
  },
  categoryCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 10,
    width: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  categoryName: {
    fontSize: 12,
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
  productImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
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