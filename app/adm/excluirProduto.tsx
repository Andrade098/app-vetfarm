import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Dados simulados de produtos
const mockProducts = [
  {
    id: 1,
    name: 'Vacina contra Febre Aftosa',
    category: 'Bovinos - Vacinas',
    price: 89.90,
    stock: 24,
    image: 'https://via.placeholder.com/100',
    description: 'Vacina para prevenção da febre aftosa em bovinos'
  },
  {
    id: 2,
    name: 'Vermífugo para Ovinos',
    category: 'Ovinos - Antiparasitários',
    price: 45.50,
    stock: 18,
    image: 'https://via.placeholder.com/100',
    description: 'Vermífugo específico para ovinos'
  },
  {
    id: 3,
    name: 'Ração para Aves Caipiras',
    category: 'Aves - Nutrição',
    price: 120.00,
    stock: 32,
    image: 'https://via.placeholder.com/100',
    description: 'Ração balanceada para aves caipiras'
  },
  {
    id: 4,
    name: 'Shampoo Antiséptico',
    category: 'Todos - Higiene',
    price: 28.90,
    stock: 15,
    image: 'https://via.placeholder.com/100',
    description: 'Shampoo para higiene animal'
  },
  {
    id: 5,
    name: 'Antibiótico Broad Spectrum',
    category: 'Todos - Antibióticos',
    price: 75.00,
    stock: 28,
    image: 'https://via.placeholder.com/100',
    description: 'Antibiótico de amplo espectro'
  },
  {
    id: 6,
    name: 'Brinco Identificador',
    category: 'Bovinos - Acessórios',
    price: 2.50,
    stock: 200,
    image: 'https://via.placeholder.com/100',
    description: 'Brinco para identificação animal'
  }
];

export default function DeleteProductScreen() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [products, setProducts] = useState(mockProducts);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (text: string) => {
    setSearchTerm(text);
  };

  const selectProduct = (productId: number) => {
    setSelectedProduct(productId === selectedProduct ? null : productId);
  };

  const confirmDelete = () => {
    if (!selectedProduct) {
      Alert.alert('Atenção', 'Selecione um produto para excluir');
      return;
    }

    const product = products.find(p => p.id === selectedProduct);
    
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir permanentemente o produto "${product?.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => deleteProduct(selectedProduct)
        }
      ]
    );
  };

  const deleteProduct = (productId: number) => {
    // Simulando exclusão - na prática, você faria uma chamada API aqui
    setProducts(products.filter(product => product.id !== productId));
    setSelectedProduct(null);
    
    Alert.alert('Sucesso', 'Produto excluído com sucesso!');
  };

  const getSelectedProduct = () => {
    return products.find(product => product.id === selectedProduct);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Excluir Produto',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
        }} 
      />

      <ScrollView style={styles.scrollView}>
        {/* Barra de Pesquisa */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#7f8c8d" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar produto por nome ou categoria..."
              value={searchTerm}
              onChangeText={handleSearch}
            />
            {searchTerm.length > 0 && (
              <TouchableOpacity onPress={() => setSearchTerm('')}>
                <Ionicons name="close-circle" size={20} color="#7f8c8d" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Lista de Produtos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
          </Text>

          {filteredProducts.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-off" size={48} color="#bdc3c7" />
              <Text style={styles.emptyStateText}>Nenhum produto encontrado</Text>
              <Text style={styles.emptyStateSubtext}>
                Tente buscar por outro termo ou verifique a ortografia
              </Text>
            </View>
          ) : (
            filteredProducts.map(product => (
              <TouchableOpacity
                key={product.id}
                style={[
                  styles.productCard,
                  selectedProduct === product.id && styles.selectedProductCard
                ]}
                onPress={() => selectProduct(product.id)}
              >
                <Image source={{ uri: product.image }} style={styles.productImage} />
                
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={1}>
                    {product.name}
                  </Text>
                  <Text style={styles.productCategory}>{product.category}</Text>
                  <Text style={styles.productDescription} numberOfLines={2}>
                    {product.description}
                  </Text>
                  
                  <View style={styles.productDetails}>
                    <Text style={styles.productPrice}>R$ {product.price.toFixed(2)}</Text>
                    <Text style={styles.productStock}>{product.stock} em estoque</Text>
                  </View>
                </View>

                <View style={styles.selectionIndicator}>
                  {selectedProduct === product.id ? (
                    <Ionicons name="checkmark-circle" size={24} color="#2ecc71" />
                  ) : (
                    <Ionicons name="radio-button-off" size={24} color="#bdc3c7" />
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Produto Selecionado */}
        {selectedProduct && (
          <View style={styles.selectedSection}>
            <Text style={styles.sectionTitle}>Produto Selecionado</Text>
            <View style={styles.selectedProduct}>
              <Image source={{ uri: getSelectedProduct()?.image }} style={styles.selectedProductImage} />
              
              <View style={styles.selectedProductInfo}>
                <Text style={styles.selectedProductName}>{getSelectedProduct()?.name}</Text>
                <Text style={styles.selectedProductCategory}>{getSelectedProduct()?.category}</Text>
                <Text style={styles.selectedProductDescription}>{getSelectedProduct()?.description}</Text>
                
                <View style={styles.selectedProductDetails}>
                  <Text style={styles.selectedProductPrice}>
                    R$ {getSelectedProduct()?.price.toFixed(2)}
                  </Text>
                  <Text style={styles.selectedProductStock}>
                    {getSelectedProduct()?.stock} unidades
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Botão de Exclusão */}
        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={[
              styles.deleteButton,
              !selectedProduct && styles.deleteButtonDisabled
            ]}
            onPress={confirmDelete}
            disabled={!selectedProduct}
          >
            <Ionicons name="trash" size={20} color="white" />
            <Text style={styles.deleteButtonText}>Excluir Produto Selecionado</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
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
  scrollView: {
    flex: 1,
  },
  searchSection: {
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f2f6',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
  },
  section: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7f8c8d',
    marginTop: 10,
    marginBottom: 5,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#bdc3c7',
    textAlign: 'center',
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedProductCard: {
    borderColor: '#3498db',
    backgroundColor: '#e8f4fd',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#ecf0f1',
  },
  productInfo: {
    flex: 1,
    marginLeft: 15,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  productStock: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  selectionIndicator: {
    justifyContent: 'center',
    marginLeft: 10,
  },
  selectedSection: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
  },
  selectedProduct: {
    flexDirection: 'row',
    backgroundColor: '#e8f4fd',
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#3498db',
  },
  selectedProductImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#ecf0f1',
  },
  selectedProductInfo: {
    flex: 1,
    marginLeft: 15,
  },
  selectedProductName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  selectedProductCategory: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  selectedProductDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  selectedProductDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedProductPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  selectedProductStock: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  actionSection: {
    backgroundColor: 'white',
    padding: 20,
  },
  deleteButton: {
    flexDirection: 'row',
    backgroundColor: '#e74c3c',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  deleteButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cancelButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  cancelButtonText: {
    color: '#7f8c8d',
    fontSize: 16,
    fontWeight: '600',
  },
});