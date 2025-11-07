import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, FlatList } from 'react-native';
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
  
  const categoriaId = params.categoriaId;
  const categoriaNome = params.categoriaNome;
  const animalNome = params.animalNome;
  const animalId = params.animalId;

  // Estado do carrinho
  const [cart, setCart] = useState<string[]>([]);

  // Função para adicionar/remover do carrinho
  const toggleCart = (productId: string) => {
    setCart(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Gera a chave para buscar os produtos
  const chaveProdutos = `${categoriaNome}-${animalNome}`;
  const produtos = produtosPorCategoria[chaveProdutos] || [];

  const renderProduto = ({ item }) => (
    <TouchableOpacity style={styles.produtoCard}>
      <View style={styles.produtoImagemContainer}>
        {/* IMAGEM DO PRODUTO - SÓ MOSTRA SE TIVER IMAGEM */}
        {item.imagem ? (
          <Image
            source={item.imagem}
            style={styles.produtoImagem}
            resizeMode="contain"
          />
        ) : (
          // ÍCONE PARA PRODUTOS SEM IMAGEM
          <View style={styles.iconeContainer}>
            <Text style={styles.produtoIcone}>{item.icone}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.produtoInfo}>
        <Text style={styles.produtoNome}>{item.nome}</Text>
        <Text style={styles.produtoDescricao}>{item.descricao}</Text>
        <Text style={styles.produtoPreco}>{item.preco}</Text>
        
        {/* BOTÃO ADICIONAR AO CARRINHO - CORRIGIDO */}
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
      
      <ScrollView style={styles.content}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.titulo}>
            {categoriaNome} para {animalNome}
          </Text>
          <Text style={styles.subtitulo}>
            {produtos.length} produtos encontrados
          </Text>
        </View>

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

        {/* Botão Voltar */}
        <TouchableOpacity 
          style={styles.voltarButton}
          onPress={() => router.back()}
        >
          <Text style={styles.voltarButtonText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitulo: {
    fontSize: 14,
    color: '#666',
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
});