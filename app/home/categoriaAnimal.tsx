import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView 
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';

// Dados dos animais - cores diferentes para cada um
const animais = [
  {
    id: '1',
    title: 'Bovinos',
    description: 'Produtos especializados para gado de corte e leite. Vacinas, suplementos e medicamentos específicos.',
    icon: '🐄',
    color: '#E91E63',
    gradient: ['#E91E63', '#C2185B'],
  },
  {
    id: '2',
    title: 'Ovinos',
    description: 'Cuidados especiais para carneiros e ovelhas. Antiparasitários e suplementos nutricionais.',
    icon: '🐑',
    color: '#9C27B0',
    gradient: ['#9C27B0', '#7B1FA2'],
  },
  {
    id: '3',
    title: 'Suínos',
    description: 'Produtos para criação de porcos. Antibióticos, vacinas e produtos de higiene específicos.',
    icon: '🐖',
    color: '#673AB7',
    gradient: ['#673AB7', '#512DA8'],
  },
  {
    id: '4',
    title: 'Equinos',
    description: 'Cuidados completos para cavalos. Suplementos articulares, vermífugos e produtos de beleza.',
    icon: '🐎',
    color: '#3F51B5',
    gradient: ['#3F51B5', '#303F9F'],
  },
  {
    id: '5',
    title: 'Aves',
    description: 'Produtos para galinhas, frangos e aves caipiras. Vacinas, rações e antibióticos aviários.',
    icon: '🐔',
    color: '#2196F3',
    gradient: ['#2196F3', '#1976D2'],
  },
  {
    id: '6',
    title: 'Peixes',
    description: 'Produtos para piscicultura e aquicultura. Ração específica, tratamento de água e medicamentos.',
    icon: '🐟',
    color: '#00BCD4',
    gradient: ['#00BCD4', '#0097A7'],
  },
];

export default function CategoriaAnimalPage() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const handleAnimalPress = (animalId: string, animalNome: string) => {
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

  const AnimalCard = ({ animal }) => (
    <TouchableOpacity 
      style={[styles.animalCard, { borderLeftColor: animal.color }]}
      onPress={() => handleAnimalPress(animal.id, animal.title)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={[styles.iconContainer, { backgroundColor: `${animal.color}20` }]}>
          <Text style={styles.animalIcon}>{animal.icon}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.animalTitle}>{animal.title}</Text>
          <Text style={styles.animalDescription}>{animal.description}</Text>
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
          title: params.categoriaNome?.toString() || 'Animais',
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
          {/* Header Informativo */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {params.categoriaNome?.toString() || 'Categoria'}
            </Text>
            <Text style={styles.headerSubtitle}>
              Selecione o tipo de animal para ver os produtos disponíveis
            </Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.badgeText}>
                {animais.length} tipos de animais
              </Text>
            </View>
          </View>

          {/* Grid de Animais */}
          <View style={styles.animalsGrid}>
            {animais.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
          </View>

          {/* Footer de Ajuda */}
          <View style={styles.footer}>
            <View style={styles.footerIcon}>
              <Text style={styles.footerIconText}>💡</Text>
            </View>
            <View style={styles.footerTextContainer}>
              <Text style={styles.footerTitle}>Não encontrou o animal?</Text>
              <Text style={styles.footerText}>
                Entre em contato conosco para produtos específicos
              </Text>
            </View>
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
    marginBottom: 16,
  },
  categoryBadge: {
    backgroundColor: '#4299E1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  animalsGrid: {
    padding: 16,
  },
  animalCard: {
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
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  animalIcon: {
    fontSize: 28,
  },
  textContainer: {
    flex: 1,
  },
  animalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 6,
  },
  animalDescription: {
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
    backgroundColor: '#FFF9C4',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFF59D',
  },
  footerIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFD54F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  footerIconText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  footerTextContainer: {
    flex: 1,
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5D4037',
    marginBottom: 4,
  },
  footerText: {
    fontSize: 14,
    color: '#8D6E63',
    lineHeight: 20,
  },
});

// Versão alternativa com GRID 2x2 (descomente se preferir)
/*
const stylesGrid = StyleSheet.create({
  animalsGrid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  animalCard: {
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
    alignItems: 'center',
  },
  cardContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  textContainer: {
    alignItems: 'center',
  },
  animalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 6,
    textAlign: 'center',
  },
  animalDescription: {
    fontSize: 12,
    color: '#718096',
    lineHeight: 16,
    textAlign: 'center',
  },
});
*/