import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Dados de exemplo para produtos por categoria e animal
const produtosPorCategoria = {
  'Vacinas-Bovinos': [
    {
      id: '1',
      nome: 'Vacina Febre Aftosa',
      preco: 'R$ 89,90',
      descricao: 'Proteção contra febre aftosa - dose única',
      // imagem: require('../../assets/images/produtos/vacina-aftosa.png'),
      icone: '💉'
    },
    {
      id: '2',
      nome: 'Vacina Brucelose',
      preco: 'R$ 67,50',
      descricao: 'Prevenção contra brucelose bovina',
      // imagem: require('../../assets/images/produtos/vacina-brucelose.png'),
      icone: '💉'
    },
    {
      id: '3',
      nome: 'Vacina Raiva',
      preco: 'R$ 95,00',
      descricao: 'Proteção contra raiva animal',
      // imagem: require('../../assets/images/produtos/vacina-raiva.png'),
      icone: '💉'
    },
    {
      id: '4',
      nome: 'Vacina Clostridiose',
      preco: 'R$ 78,90',
      descricao: 'Combate a doenças clostridiais',
      // imagem: require('../../assets/images/produtos/vacina-clostridiose.png'),
      icone: '💉'
    },
  ],
  'Vacinas-Suínos': [
    {
      id: '1',
      nome: 'Vacina Peste Suína',
      preco: 'R$ 75,90',
      descricao: 'Proteção contra peste suína clássica',
      // imagem: require('../../assets/images/produtos/vacina-peste-suina.png'),
      icone: '💉'
    },
    {
      id: '2',
      nome: 'Vacina Rinite Atrófica',
      preco: 'R$ 82,50',
      descricao: 'Prevenção contra rinite atrófica',
      // imagem: require('../../assets/images/produtos/vacina-rinite.png'),
      icone: '💉'
    },
  ],
  'Antiparasitários-Bovinos': [
    {
      id: '1',
      nome: 'Vermífugo Bovino Plus',
      preco: 'R$ 45,90',
      descricao: 'Vermífugo de amplo espectro',
      // imagem: require('../../assets/images/produtos/vermifugo-bovino.png'),
      icone: '🐛'
    },
    {
      id: '2',
      nome: 'Ivermectina Injetável',
      preco: 'R$ 38,50',
      descricao: 'Controle de parasitas internos e externos',
      // imagem: require('../../assets/images/produtos/ivermectina.png'),
      icone: '🐛'
    },
  ],
  'Suplementos-Bovinos': [
    {
      id: '1',
      nome: 'Suplemento Mineral Bovino',
      preco: 'R$ 149,90',
      descricao: 'Suplemento mineral completo para bovinos',
      // imagem: require('../../assets/images/produtos/suplemento-mineral.png'),
      icone: '💊'
    },
    {
      id: '2',
      nome: 'Vitamina A-D-E',
      preco: 'R$ 67,80',
      descricao: 'Complexo vitamínico essencial',
      // imagem: require('../../assets/images/produtos/vitamina-ade.png'),
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

  // Gera a chave para buscar os produtos
  const chaveProdutos = `${categoriaNome}-${animalNome}`;
  const produtos = produtosPorCategoria[chaveProdutos] || [];

  const renderProduto = ({ item }) => (
    <TouchableOpacity style={styles.produtoCard}>
      <View style={styles.produtoImagemContainer}>
        {/* ÁREA PARA IMAGEM - COMENTADA */}
        {/* <Image
          source={item.imagem}
          style={styles.produtoImagem}
          resizeMode="contain"
        /> */}
        
        {/* ÍCONE TEMPORÁRIO */}
        <Text style={styles.produtoIcone}>{item.icone}</Text>
      </View>
      
      <View style={styles.produtoInfo}>
        <Text style={styles.produtoNome}>{item.nome}</Text>
        <Text style={styles.produtoDescricao}>{item.descricao}</Text>
        <Text style={styles.produtoPreco}>{item.preco}</Text>
        
        <TouchableOpacity style={styles.adicionarButton}>
          <Text style={styles.adicionarButtonText}>+ Adicionar</Text>
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
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  produtoImagem: {
    width: '80%',
    height: '80%',
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
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  adicionarButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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