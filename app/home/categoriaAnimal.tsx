import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';

// Dados simulados para as categorias
const categories = [
  {
    id: '1',
    title: 'Bovinos',
    description: 'Produtos especializados para gado de corte e leite',
    icon: '🐄',
    color: '#4CAF50',
  },
  {
    id: '2',
    title: 'Ovinos',
    description: 'Cuidados especiais para carneiros e ovelhas',
    icon: '🐑',
    color: '#4CAF50',
  },
  {
    id: '3',
    title: 'Suínos',
    description: 'Produtos para criação de porcos',
    icon: '🐖',
    color: '#4CAF50',
  },
  {
    id: '4',
    title: 'Equinos',
    description: 'Cuidados completos para cavalos',
    icon: '🐎',
    color: '#4CAF50',
  },
  {
    id: '5',
    title: 'Aves',
    description: 'Produtos para galinhas, frangos e aves caipiras',
    icon: '🐔',
    color: '#4CAF50',
  },
  {
    id: '6',
    title: 'Peixe',
    description: 'Produtos para piscicultura e aquicultura',
    icon: '🐟',
    color: '#4CAF50',
  },
];

export default function ProductsPage() {
  const router = useRouter();
  const params = useLocalSearchParams(); // ADICIONEI ESTA LINHA

  const handleAnimalPress = (animalId: string, animalNome: string) => {
    // Navegar para a tela de produtos da categoria
    router.push({
      pathname: '/home/categoriaProduto',
      params: { 
        categoriaId: params.categoriaId,
        categoriaNome: params.categoriaNome,
        animalId: animalId,
        animalNome: animalNome
      }
    });
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: params.categoriaNome || 'Produtos Veterinários', // TÍTULO DINÂMICO
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
        }} 
      />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {params.categoriaNome || 'Categoria'} para Animais
          </Text>
          <Text style={styles.headerSubtitle}>
            Selecione um animal para ver os produtos disponíveis
          </Text>
        </View>

        {categories.map((category) => (
          <TouchableOpacity 
            key={category.id} 
            style={[styles.categoryCard, { borderLeftColor: category.color }]}
            onPress={() => handleAnimalPress(category.id, category.title)} // CORRIGIDO: passa id e nome
          >
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryTitle}>{category.title}</Text>
            </View>
            <Text style={styles.categoryDescription}>{category.description}</Text>
          </TouchableOpacity>
        ))}
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Entre em contato para mais informações</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  categoryCard: {
    backgroundColor: 'white',
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
});