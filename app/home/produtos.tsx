import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, FlatList, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Dados de exemplo para produtos por categoria e animal
const produtosPorCategoria = {
  // 🐄 BOVINOS
  'Vacinas-Bovinos': [
    {
      id: '1',
      nome: 'Vacina Brucelose B19',
      preco: 'R$ 89,90',
      descricao: 'Proteção contra brucelose bovina',
      imagem: require('../../assets/images/produtos/vacina-brucelose.png'),
      icone: '💉'
    },
    {
      id: '2',
      nome: 'Vacina Febre Aftosa',
      preco: 'R$ 67,50',
      descricao: 'Proteção contra febre aftosa',
      imagem: require('../../assets/images/produtos/vacina.png'),
      icone: '💉'
    },
    {
      id: '3',
      nome: 'Vacina Raiva',
      preco: 'R$ 95,00',
      descricao: 'Proteção contra raiva animal',
      imagem: require('../../assets/images/produtos/vacina-raiva.png'),
      icone: '💉'
    },
    {
      id: '4',
      nome: 'Vacina Clostridiose',
      preco: 'R$ 78,90',
      descricao: 'Combate a doenças clostridiais',
      imagem: require('../../assets/images/produtos/vacina-clostridiose.png'),
      icone: '💉'
    },
  ],
  'Medicamentos-Bovinos': [
    {
      id: '5',
      nome: 'Ivermectina 1%',
      preco: 'R$ 45,90',
      descricao: 'Antiparasitário de amplo espectro',
      imagem: require('../../assets/images/produtos/ivermectina.png'),
      icone: '💊'
    },
    {
      id: '6',
      nome: 'Albendazol 10%',
      preco: 'R$ 38,50',
      descricao: 'Vermífugo para bovinos',
      imagem: require('../../assets/images/produtos/albendazol.png'),
      icone: '💊'
    },
  ],
  'Acessórios-Bovinos': [
    {
      id: '7',
      nome: 'Brinco de Identificação Bovino',
      preco: 'R$ 12,90',
      descricao: 'Brinco plástico numerado para identificação',
      imagem: require('../../assets/images/produtos/brinco-bovino.png'),
      icone: '🏷️'
    },
    {
      id: '8',
      nome: 'Aplicador de Brincos',
      preco: 'R$ 89,00',
      descricao: 'Aplicador profissional para brincos',
      imagem: require('../../assets/images/produtos/aplicador-brinco.png'),
      icone: '🔧'
    },
  ],
  'Suplementos-Bovinos': [
    {
      id: '9',
      nome: 'Núcleo Mineral para Gado de Corte',
      preco: 'R$ 149,90',
      descricao: 'Suplemento mineral completo para bovinos',
      imagem: require('../../assets/images/produtos/suplemento-mineral.png'),
      icone: '💊'
    },
    {
      id: '10',
      nome: 'Vitamina A-D-E',
      preco: 'R$ 67,80',
      descricao: 'Complexo vitamínico essencial',
      imagem: require('../../assets/images/produtos/vitamina-ade.png'),
      icone: '💊'
    },
  ],

  // 🐑 OVINOS
  'Vacinas-Ovinos': [
    {
      id: '11',
      nome: 'Vacina Clostridial (Covexin 10)',
      preco: 'R$ 82,50',
      descricao: 'Proteção contra doenças clostridiais',
      imagem: require('../../assets/images/produtos/vacina-clostridial.png'),
      icone: '💉'
    },
  ],
  'Medicamentos-Ovinos': [
    {
      id: '12',
      nome: 'Albendazol 10%',
      preco: 'R$ 42,90',
      descricao: 'Vermífugo para ovinos',
      imagem: require('../../assets/images/produtos/albendazol-ovino.png'),
      icone: '💊'
    },
  ],
  'Acessórios-Ovinos': [
    {
      id: '13',
      nome: 'Tesoura para Tosa de Lã',
      preco: 'R$ 35,00',
      descricao: 'Tesoura profissional para tosa de ovinos',
      imagem: require('../../assets/images/produtos/tesoura-tosa.png'),
      icone: '✂️'
    },
  ],
  'Suplementos-Ovinos': [
    {
      id: '14',
      nome: 'Sal Mineral para Ovinos',
      preco: 'R$ 79,90',
      descricao: 'Suplemento mineral específico para ovinos',
      imagem: require('../../assets/images/produtos/sal-mineral-ovino.png'),
      icone: '💊'
    },
  ],

  // 🐖 SUÍNOS
  'Vacinas-Suínos': [
    {
      id: '15',
      nome: 'Vacina Peste Suína',
      preco: 'R$ 75,90',
      descricao: 'Proteção contra peste suína clássica',
      imagem: require('../../assets/images/produtos/vacina-peste-suina.png'),
      icone: '💉'
    },
    {
      id: '16',
      nome: 'Vacina Rinite Atrófica',
      preco: 'R$ 82,50',
      descricao: 'Prevenção contra rinite atrófica',
      imagem: require('../../assets/images/produtos/vacina-rinite.png'),
      icone: '💉'
    },
    
  ],
  'Medicamentos-Suínos': [
    {
      id: '17',
      nome: 'Enrofloxacina 10%',
      preco: 'R$ 58,90',
      descricao: 'Antibiótico para infecções bacterianas',
      imagem: require('../../assets/images/produtos/enrofloxacina.png'),
      icone: '💊'
    },
  ],
  'Acessórios-Suínos': [
    {
      id: '18',
      nome: 'Bebedouro Tipo Nipple',
      preco: 'R$ 24,90',
      descricao: 'Bebedouro automático para suínos',
      imagem: require('../../assets/images/produtos/bebedouro-nipple.png'),
      icone: '🚰'
    },
  ],
  'Suplementos-Suínos': [
    {
      id: '19',
      nome: 'Premix Vitamínico para Suínos',
      preco: 'R$ 129,90',
      descricao: 'Complexo vitamínico para suínos',
      imagem: require('../../assets/images/produtos/premix-suino.png'),
      icone: '💊'
    },
  ],

  // 🐎 EQUINOS
  'Vacinas-Equinos': [
    {
      id: '20',
      nome: 'Vacina Antitetânica',
      preco: 'R$ 65,00',
      descricao: 'Proteção contra tétano em equinos',
      imagem: require('../../assets/images/produtos/vacina-antitetanica.png'),
      icone: '💉'
    },
  ],
  'Medicamentos-Equinos': [
    {
      id: '21',
      nome: 'Pasta Vermífuga com Ivermectina',
      preco: 'R$ 52,90',
      descricao: 'Vermífugo em pasta para equinos',
      imagem: require('../../assets/images/produtos/pasta-vermifuga.png'),
      icone: '💊'
    },
  ],
  'Acessórios-Equinos': [
    {
      id: '22',
      nome: 'Cabeçada de Couro',
      preco: 'R$ 89,90',
      descricao: 'Cabeçada profissional em couro legítimo',
      icone: '🎠'
    },
  ],
  'Suplementos-Equinos': [
    {
      id: '23',
      nome: 'Suplemento Vitamínico-Mineral',
      preco: 'R$ 139,90',
      descricao: 'Suplemento completo para equinos',
      imagem: require('../../assets/images/produtos/suplemento-equino.png'),
      icone: '💊'
    },
  ],

  // 🐔 AVES
  'Vacinas-Aves': [
    {
      id: '24',
      nome: 'Vacina contra Newcastle',
      preco: 'R$ 48,90',
      descricao: 'Proteção contra doença de Newcastle',
      imagem: require('../../assets/images/produtos/vacina-newcastle.png'),
      icone: '💉'
    },
  ],
  'Medicamentos-Aves': [
    {
      id: '25',
      nome: 'Oxitetraciclina Solúvel',
      preco: 'R$ 32,50',
      descricao: 'Antibiótico de amplo espectro para aves',
      imagem: require('../../assets/images/produtos/oxitetraciclina.png'),
      icone: '💊'
    },
  ],
  'Acessórios-Aves': [
    {
      id: '26',
      nome: 'Comedouro Automático para Aves',
      preco: 'R$ 45,00',
      descricao: 'Comedouro automático para granjas',
      imagem: require('../../assets/images/produtos/comedouro-aves.png'),
      icone: '🍽️'
    },
  ],
  'Suplementos-Aves': [
    {
      id: '27',
      nome: 'Complexo Vitamínico para Aves',
      preco: 'R$ 39,90',
      descricao: 'Vitaminas essenciais para aves',
      imagem: require('../../assets/images/produtos/vitaminas-aves.png'),
      icone: '💊'
    },
  ],

  // 🐟 PEIXES
  'Vacinas-Peixes': [
    {
      id: '28',
      nome: 'Vacina contra Streptococcus',
      preco: 'R$ 125,00',
      descricao: 'Proteção contra streptococcus em peixes',
      icone: '💉'
    },
  ],
  'Medicamentos-Peixes': [
    {
      id: '29',
      nome: 'Formalina',
      preco: 'R$ 28,90',
      descricao: 'Tratamento antiparasitário para aquicultura',
      icone: '💊'
    },
  ],
  'Acessórios-Peixes': [
    {
      id: '30',
      nome: 'Rede de Manejo para Peixes',
      preco: 'R$ 34,90',
      descricao: 'Rede profissional para manejo de peixes',
      icone: '🎣'
    },
  ],
  'Suplementos-Peixes': [
    {
      id: '31',
      nome: 'Ração com Probióticos',
      preco: 'R$ 89,90',
      descricao: 'Ração enriquecida para peixes',
      icone: '💊'
    },
  ],
};

export default function CategoriaProdutoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const categoriaNome = params.categoriaNome;
  const animalNome = params.animalNome;

  // ESTADO DO CARRINHO - igual ao da produtos.tsx
  const [cart, setCart] = useState<string[]>([]);
  const [cartModalVisible, setCartModalVisible] = useState(false);

  // FUNÇÃO TOGGLE CART - igual ao da produtos.tsx
  const toggleCart = (productId: string) => {
    setCart(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const getCartItems = () => {
    const chaveProdutos = `${categoriaNome}-${animalNome}`;
    const produtos = produtosPorCategoria[chaveProdutos] || [];
    return produtos.filter(product => cart.includes(product.id));
  };

  const getTotalPrice = () => {
    return getCartItems().reduce((total, item) => {
      // Converte "R$ 89,90" para 89.90
      const precoNumerico = parseFloat(item.preco.replace('R$ ', '').replace(',', '.'));
      return total + precoNumerico;
    }, 0);
  };

  // MODAL DO CARRINHO - igual ao da produtos.tsx
  const CartModal = () => (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={cartModalVisible}
      onRequestClose={() => setCartModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Meu Carrinho</Text>
          <TouchableOpacity 
            onPress={() => setCartModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cartContent}>
          <Text style={styles.itemsTitle}>Itens</Text>
          
          {getCartItems().length === 0 ? (
            <View style={styles.emptyCart}>
              <Ionicons name="cart-outline" size={64} color="#bdc3c7" />
              <Text style={styles.emptyCartTitle}>Carrinho vazio</Text>
              <Text style={styles.emptyCartText}>Adicione produtos ao carrinho</Text>
            </View>
          ) : (
            <ScrollView style={styles.cartItems}>
              {getCartItems().map(item => (
                <View key={item.id} style={styles.cartItem}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.nome}</Text>
                    <Text style={styles.itemAnimal}>{animalNome}</Text>
                    <Text style={styles.itemPrice}>{item.preco}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => toggleCart(item.id)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#e74c3c" />
                  </TouchableOpacity>
                </View>
              ))}
              
              <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Total: R$ {getTotalPrice().toFixed(2)}</Text>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );

  const chaveProdutos = `${categoriaNome}-${animalNome}`;
  const produtos = produtosPorCategoria[chaveProdutos] || [];

  const renderProduto = ({ item }) => (
    <TouchableOpacity style={styles.produtoCard}>
      <View style={styles.produtoImagemContainer}>
        {item.imagem ? (
          <Image
            source={item.imagem}
            style={styles.produtoImagem}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.iconeContainer}>
            <Text style={styles.produtoIcone}>{item.icone}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.produtoInfo}>
        <Text style={styles.produtoNome}>{item.nome}</Text>
        <Text style={styles.produtoDescricao}>{item.descricao}</Text>
        <Text style={styles.produtoPreco}>{item.preco}</Text>
        
        {/* BOTÃO ADICIONAR - FUNCIONANDO IGUAL AO DA produtos.tsx */}
        <TouchableOpacity 
          style={[
            styles.adicionarButton,
            cart.includes(item.id) && styles.adicionarButtonAdded
          ]}
          onPress={() => toggleCart(item.id)}
        >
          <Text style={[
            styles.adicionarButtonText,
            cart.includes(item.id) && styles.adicionarButtonTextAdded
          ]}>
            {cart.includes(item.id) ? '✓ Adicionado' : '+ Adicionar'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: `${categoriaNome} - ${animalNome}`,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
        }} 
      />
      
      {/* HEADER COM CARRINHO - igual ao da produtos.tsx */}
      <View style={styles.header}>
        <View>
          <Text style={styles.storeName}>{categoriaNome} - {animalNome}</Text>
          <Text style={styles.subtitulo}>{produtos.length} produtos encontrados</Text>
        </View>
        <TouchableOpacity 
          style={styles.cartButton}
          onPress={() => setCartModalVisible(true)}
        >
          <View style={styles.cartIconContainer}>
            <Ionicons name="cart-outline" size={28} color="#126b1a" />
            {cart.length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cart.length}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Lista de Produtos */}
        {produtos.length > 0 ? (
          <FlatList
            data={produtos}
            renderItem={renderProduto}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.listaProdutos}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="alert-circle-outline" size={60} color="#ccc" />
            <Text style={styles.emptyStateText}>Nenhum produto encontrado</Text>
            <Text style={styles.emptyStateSubtext}>
              Não há produtos de {categoriaNome.toLowerCase()} para {animalNome.toLowerCase()} no momento.
            </Text>
          </View>
        )}

        <TouchableOpacity 
          style={styles.voltarButton}
          onPress={() => router.back()}
        >
          <Text style={styles.voltarButtonText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* MODAL DO CARRINHO */}
      <CartModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  // HEADER estilo da produtos.tsx
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
  storeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#126b1a',
  },
  subtitulo: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
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
  content: {
    flex: 1,
    padding: 15,
  },
  listaProdutos: {
    paddingBottom: 20,
  },
  produtoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    flexDirection: 'row',
  },
  produtoImagemContainer: {
    width: 100,
    height: 120,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  produtoImagem: {
    width: '120%',
    height: '120%',
  },
  iconeContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  produtoIcone: {
    fontSize: 40,
  },
  produtoInfo: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
  },
  produtoNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  produtoDescricao: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    lineHeight: 16,
  },
  produtoPreco: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#126b1a',
    marginBottom: 10,
  },
  adicionarButton: {
    backgroundColor: '#126b1a',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#126b1a',
  },
  adicionarButtonAdded: {
    backgroundColor: 'white',
    borderColor: '#27ae60',
  },
  adicionarButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  adicionarButtonTextAdded: {
    color: '#27ae60',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  voltarButton: {
    backgroundColor: '#95a5a6',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  voltarButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // ESTILOS DO MODAL (da produtos.tsx)
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