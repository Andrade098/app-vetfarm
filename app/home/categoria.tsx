import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';

// Dados simulados para as categorias
const categories = [
  {
    id: 1,
    title: 'Vacinas',
    description: 'Proteção essencial para o rebanho. Previnem doenças como brucelose, febre aftosa e raiva, garantindo animais saudáveis e produtivos.',
    icon: '💉',
    color: '#4CAF50',
  },
  {
    id: 2,
    title: 'Antiparasitários',
    description: 'Combate eficaz contra vermes e parasitas. Protegem carneiros, cabras e outros animais, melhorando a absorção de nutrientes e o desenvolvimento.',
    icon: '🐛',
    color: '#FF9800',
  },
  {
    id: 3,
    title: 'Suplementos',
    description: 'Fortalecimento nutricional para porcos e outros animais. Vitaminas, minerais e aminoácidos que melhoram a imunidade e o crescimento.',
    icon: '💊',
    color: '#2196F3',
  },
  {
    id: 4,
    title: 'Antibióticos',
    description: 'Tratamento de infecções bacterianas. Auxiliam na recuperação de animais doentes, garantindo saúde e bem-estar.',
    icon: '🦠',
    color: '#F44336',
  },
  {
    id: 5,
    title: 'Nutrição',
    description: 'Alimentação balanceada para aves e outros animais. Rações enriquecidas e suplementos que garantem desenvolvimento saudável e alta produtividade.',
    icon: '🌾',
    color: '#9C27B0',
  },
  {
    id: 6,
    title: 'Higiene',
    description: 'Produtos para limpeza e desinfecção de instalações e animais. Previnem doenças e garantem um ambiente saudável para o rebanho.',
    icon: '🧼',
    color: '#00BCD4',
  },
  {
    id: 7,
    title: 'Acessórios',
    description: 'Itens práticos para o manejo diário. Desde equipamentos de aplicação de medicamentos até materiais para organização e cuidado animal.',
    icon: '🛒',
    color: '#795548',
  },
];

export default function ProductsPage() {
  const router = useRouter();

  const handleCategoryPress = (categoryId: number, categoryTitle: string) => {
    // Navegar para a tela categoriaAnimal.tsx passando os parâmetros
    router.push({
      pathname: '/home/categoriaAnimal',
      params: { 
        categoriaId: categoryId.toString(),
        categoriaNome: categoryTitle
      }
    });
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Produtos Veterinários',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
        }} 
      />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Categorias de Produtos</Text>
          <Text style={styles.headerSubtitle}>Selecione uma categoria para ver os produtos disponíveis</Text>
        </View>

        {categories.map((category) => (
          <TouchableOpacity 
            key={category.id} 
            style={[styles.categoryCard, { borderLeftColor: category.color }]}
            onPress={() => handleCategoryPress(category.id, category.title)}
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