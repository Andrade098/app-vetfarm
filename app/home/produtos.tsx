import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const products = [
  {
    id: 1,
    category: 'Medicamentos',
    name: 'Vermifugo Bovino',
    price: 45.90,
    animal: 'Bovino',
    icon: '💊'
  },
  {
    id: 2,
    category: 'Acessórios',
    name: 'Cela Equina',
    price: 289.90,
    animal: 'Equino',
    icon: '🏇'
  },
  {
    id: 3,
    category: 'Vacinas',
    name: 'Vacina Aftosa',
    price: 32.50,
    animal: 'Bovino',
    icon: '💉'
  },
];

export default function ProductsPage() {
  const [cart, setCart] = useState<number[]>([]);
  const [cartModalVisible, setCartModalVisible] = useState(false);

  const toggleCart = (productId: number) => {
    setCart(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const getCartItems = () => {
    return products.filter(product => cart.includes(product.id));
  };

  const getTotalPrice = () => {
    return getCartItems().reduce((total, item) => total + item.price, 0);
  };

  const CartModal = () => (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={cartModalVisible}
      onRequestClose={() => setCartModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        {/* Header do Modal */}
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Meu Carrinho</Text>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setCartModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>

        {/* Itens do Carrinho */}
        <View style={styles.cartContent}>
          <Text style={styles.itemsTitle}>Itens</Text>
          
          {getCartItems().length === 0 ? (
            // Carrinho vazio
            <View style={styles.emptyCart}>
              <Ionicons name="cart-outline" size={64} color="#bdc3c7" />
              <Text style={styles.emptyCartTitle}>Carrinho vazio</Text>
              <Text style={styles.emptyCartText}>Adicione produtos ao carrinho</Text>
            </View>
          ) : (
            // Lista de itens do carrinho
            <ScrollView style={styles.cartItems}>
              {getCartItems().map(item => (
                <View key={item.id} style={styles.cartItem}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemAnimal}>{item.animal}</Text>
                    <Text style={styles.itemPrice}>R$ {item.price.toFixed(2)}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => toggleCart(item.id)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#e74c3c" />
                  </TouchableOpacity>
                </View>
              ))}
              
              {/* Total */}
              <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Total: R$ {getTotalPrice().toFixed(2)}</Text>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Produtos',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
        }} 
      />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.storeName}>Produtos</Text>
        <TouchableOpacity 
          style={styles.cartButton}
          onPress={() => setCartModalVisible(true)}
        >
          {/* ÍCONE DO CARRINHO ATUALIZADO */}
          <View style={styles.cartIconContainer}>
            <Ionicons name="cart-outline" size={28} color="#126b1a" />
            {cart.length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {cart.reduce((total, productId) => {
                    const product = products.find(p => p.id === productId);
                    return total + 1; // Conta cada produto individualmente
                  }, 0)}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Lista de Produtos */}
      <ScrollView style={styles.productsContainer}>
        {products.map(product => (
          <View key={product.id} style={styles.productCard}>
            <Text style={styles.categoryText}>{product.category}</Text>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.animalText}>{product.animal}</Text>
            <Text style={styles.priceText}>R$ {product.price.toFixed(2)}</Text>
            
            <TouchableOpacity 
              style={[
                styles.addButton,
                cart.includes(product.id) && styles.addedButton
              ]}
              onPress={() => toggleCart(product.id)}
            >
              <Text style={[
                styles.addButtonText,
                cart.includes(product.id) && styles.addedButtonText
              ]}>
                {cart.includes(product.id) ? '✓ Adicionado' : '+ Adicionar'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
        
        <View style={styles.spacer} />
      </ScrollView>

      {/* Modal do Carrinho */}
      <CartModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  storeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#126b1a',
  },
  cartButton: {
    padding: 5,
  },
  cartIconContainer: {
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
  cartBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  productsContainer: {
    flex: 1,
    padding: 16,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  animalText: {
    fontSize: 14,
    color: '#95a5a6',
    marginBottom: 8,
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#126b1a',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#126b1a',
  },
  addedButton: {
    backgroundColor: 'white',
    borderColor: '#27ae60',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  addedButtonText: {
    color: '#27ae60',
  },
  spacer: {
    height: 20,
  },
  // Estilos do Modal do Carrinho
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '600',
  },
  cartContent: {
    flex: 1,
    padding: 20,
  },
  itemsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyCartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7f8c8d',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyCartText: {
    fontSize: 16,
    color: '#95a5a6',
    textAlign: 'center',
  },
  cartItems: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  itemAnimal: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  removeButton: {
    padding: 8,
  },
  totalContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    marginTop: 16,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'right',
  },
});