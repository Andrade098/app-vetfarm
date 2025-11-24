import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  SafeAreaView 
} from 'react-native';
import { Stack, useRouter } from 'expo-router';

// Dados atualizados das categorias (com base nas suas mudanças)
const categories = [
  {
    id: 1,
    title: 'Vacinas',
    description: 'Proteção essencial para o rebanho. Previnem doenças como brucelose, febre aftosa e raiva.',
    icon: '💉',
    color: '#4CAF50',
    gradient: ['#4CAF50', '#45a049'],
  },
  {
    id: 5,
    title: 'Antiparasitários',
    description: 'Combate eficaz contra vermes e parasitas. Melhoram a absorção de nutrientes.',
    icon: '🐛',
    color: '#FF9800',
    gradient: ['#FF9800', '#F57C00'],
  },
  {
    id: 3,
    title: 'Suplementos',
    description: 'Fortalecimento nutricional. Vitaminas, minerais e aminoácidos essenciais.',
    icon: '💊',
    color: '#2196F3',
    gradient: ['#2196F3', '#1976D2'],
  },
  {
    id: 6,
    title: 'Antibióticos',
    description: 'Tratamento de infecções bacterianas. Auxiliam na recuperação de animais.',
    icon: '🦠',
    color: '#F44336',
    gradient: ['#F44336', '#D32F2F'],
  },
  {
    id: 7,
    title: 'Nutrição',
    description: 'Alimentação balanceada. Rações enriquecidas para desenvolvimento saudável.',
    icon: '🌾',
    color: '#9C27B0',
    gradient: ['#9C27B0', '#7B1FA2'],
  },
  {
    id: 2,
    title: 'Higiene',
    description: 'Produtos para limpeza e desinfecção. Previnem doenças no rebanho.',
    icon: '🧼',
    color: '#00BCD4',
    gradient: ['#00BCD4', '#0097A7'],
  },
  {
    id: 4,
    title: 'Acessórios',
    description: 'Itens práticos para o manejo diário e equipamentos veterinários.',
    icon: '🛒',
    color: '#795548',
    gradient: ['#795548', '#5D4037'],
  },
];

export default function ProductsPage() {
  const router = useRouter();

  const handleCategoryPress = (categoryId: number, categoryTitle: string) => {
    router.push({
      pathname: '/home/categoriaAnimal',
      params: { 
        categoriaId: categoryId.toString(),
        categoriaNome: categoryTitle
      }
    });
  };

  const CategoryCard = ({ category }) => (
    <TouchableOpacity 
      style={[styles.categoryCard, { borderLeftColor: category.color }]}
      onPress={() => handleCategoryPress(category.id, category.title)}
      activeOpacity={0.7}
    >
      <View style={styles.categoryHeader}>
        <View style={[styles.iconContainer, { backgroundColor: `${category.color}20` }]}>
          <Text style={styles.categoryIcon}>{category.icon}</Text>
        </View>
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryTitle}>{category.title}</Text>
          <Text style={styles.categoryDescription}>{category.description}</Text>
        </View>
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>→</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Produtos Veterinários',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
            color: '#2D3748',
          },
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }} 
      />
      
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header Melhorado */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Categorias de Produtos</Text>
            <Text style={styles.headerSubtitle}>
              Selecione uma categoria para explorar os produtos disponíveis
            </Text>
          </View>

          {/* Grid de Categorias */}
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </View>

          {/* Footer Informativo */}
          <View style={styles.footer}>
            <View style={styles.footerIcon}>
              <Text style={styles.footerIconText}>📞</Text>
            </View>
            <Text style={styles.footerText}>
              Precisa de ajuda?{'\n'}
              <Text style={styles.footerContact}>Entre em contato conosco</Text>
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    padding: 24,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    color: '#1A202C',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 22,
  },
  categoriesGrid: {
    padding: 16,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginVertical: 8,
    borderRadius: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F7FAFC',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryIcon: {
    fontSize: 28,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 6,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 20,
  },
  arrowContainer: {
    padding: 8,
  },
  arrow: {
    fontSize: 20,
    color: '#A0AEC0',
    fontWeight: '300',
  },
  footer: {
    backgroundColor: '#F7FAFC',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  footerIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4299E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  footerIconText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  footerText: {
    flex: 1,
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 20,
  },
  footerContact: {
    fontWeight: '600',
    color: '#2B6CB0',
  },
});

// Versão alternativa com GRID 2x2 (descomente se preferir)
/*
const stylesGrid = StyleSheet.create({
  categoriesGrid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F7FAFC',
  },
  categoryHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryInfo: {
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 6,
    textAlign: 'center',
  },
  categoryDescription: {
    fontSize: 12,
    color: '#718096',
    lineHeight: 16,
    textAlign: 'center',
  },
});
*/