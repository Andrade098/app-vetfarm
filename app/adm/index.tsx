import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Dados iniciais das categorias
const initialCategories = [
  {
    id: 1,
    title: 'Vacinas',
    description: 'Proteção essencial para o rebanho. Previnem doenças como brucelose, febre aftosa e raiva, garantindo animais saudáveis e produtivos.',
    products: 24,
    status: 'active'
  },
  {
    id: 2,
    title: 'Antiparasitários',
    description: 'Combate eficaz contra vermes e parasitas. Protegem carneiros, cabras e outros animais, melhorando a absorção de nutrientes.',
    products: 18,
    status: 'active'
  },
  {
    id: 3,
    title: 'Suplementos',
    description: 'Fortalecimento nutricional para porcos e outros animais. Vitaminas, minerais e aminoácidos que melhoram a imunidade.',
    products: 32,
    status: 'active'
  },
  {
    id: 4,
    title: 'Antibióticos',
    description: 'Tratamento de infecções bacterianas. Auxiliam na recuperação de animais doentes, garantindo saúde e bem-estar.',
    products: 15,
    status: 'active'
  },
  {
    id: 5,
    title: 'Nutrição',
    description: 'Alimentação balanceada para aves e outros animais. Rações enriquecidas que garantem desenvolvimento saudável.',
    products: 28,
    status: 'active'
  },
  {
    id: 6,
    title: 'Higiene',
    description: 'Produtos para limpeza e desinfecção de instalações e animais. Previnem doenças e garantem ambiente saudável.',
    products: 21,
    status: 'active'
  },
  {
    id: 7,
    title: 'Acessórios',
    description: 'Itens práticos para o manejo diário. Equipamentos de aplicação de medicamentos e materiais para cuidado animal.',
    products: 36,
    status: 'active'
  }
];

export default function AdminPanel() {
  const [categories, setCategories] = useState(initialCategories);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [newCategory, setNewCategory] = useState({ title: '', description: '' });

  const stats = {
    totalProducts: categories.reduce((acc, cat) => acc + cat.products, 0),
    activeCategories: categories.filter(cat => cat.status === 'active').length,
    outOfStock: 12, // Simulado
    pendingOrders: 5 // Simulado
  };

  const handleAddCategory = () => {
    if (!newCategory.title || !newCategory.description) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    const newCat = {
      id: categories.length + 1,
      title: newCategory.title,
      description: newCategory.description,
      products: 0,
      status: 'active'
    };

    setCategories([...categories, newCat]);
    setNewCategory({ title: '', description: '' });
    Alert.alert('Sucesso', 'Categoria adicionada com sucesso!');
  };

  const toggleCategoryStatus = (id: number) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, status: cat.status === 'active' ? 'inactive' : 'active' } : cat
    ));
  };

  const renderDashboard = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Visão Geral</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalProducts}</Text>
          <Text style={styles.statLabel}>Produtos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.activeCategories}</Text>
          <Text style={styles.statLabel}>Categorias Ativas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.outOfStock}</Text>
          <Text style={styles.statLabel}>Fora de Estoque</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.pendingOrders}</Text>
          <Text style={styles.statLabel}>Pedidos Pendentes</Text>
        </View>
      </View>

      <Text style={[styles.tabTitle, { marginTop: 20 }]}>Categorias</Text>
      <ScrollView style={styles.categoriesList}>
        {categories.map(category => (
          <View key={category.id} style={styles.categoryItem}>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>{category.title}</Text>
              <Text style={styles.categoryDescription} numberOfLines={2}>{category.description}</Text>
              <Text style={styles.productCount}>{category.products} produtos</Text>
            </View>
            <TouchableOpacity 
              style={[styles.statusButton, category.status === 'active' ? styles.activeButton : styles.inactiveButton]}
              onPress={() => toggleCategoryStatus(category.id)}
            >
              <Text style={styles.statusText}>{category.status === 'active' ? 'Ativo' : 'Inativo'}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderAddCategory = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Adicionar Nova Categoria</Text>
      
      <View style={styles.form}>
        <Text style={styles.label}>Nome da Categoria</Text>
        <TextInput
          style={styles.input}
          value={newCategory.title}
          onChangeText={(text) => setNewCategory({...newCategory, title: text})}
          placeholder="Ex: Medicamentos"
        />
        
        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={newCategory.description}
          onChangeText={(text) => setNewCategory({...newCategory, description: text})}
          placeholder="Descreva esta categoria..."
          multiline
          numberOfLines={3}
        />
        
        <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
          <Text style={styles.addButtonText}>Adicionar Categoria</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Painel Administrativo',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
        }} 
      />
      
      <View style={styles.header}>
        <Text style={styles.welcome}>Bem-vindo, Administrador</Text>
        <Text style={styles.subtitle}>Gerencie seus produtos veterinários</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'dashboard' && styles.activeTab]}
          onPress={() => setActiveTab('dashboard')}
        >
          <Ionicons name="grid" size={20} color={activeTab === 'dashboard' ? '#fff' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'dashboard' && styles.activeTabText]}>Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'add' && styles.activeTab]}
          onPress={() => setActiveTab('add')}
        >
          <Ionicons name="add-circle" size={20} color={activeTab === 'add' ? '#fff' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'add' && styles.activeTabText]}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'dashboard' ? renderDashboard() : renderAddCategory()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  welcome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#3498db',
    borderBottomWidth: 3,
    borderBottomColor: '#2980b9',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: 'white',
  },
  tabContent: {
    flex: 1,
    padding: 15,
  },
  tabTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2c3e50',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  categoriesList: {
    flex: 1,
  },
  categoryItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryInfo: {
    flex: 1,
    marginRight: 10,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  categoryDescription: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  productCount: {
    fontSize: 11,
    color: '#3498db',
    fontWeight: '500',
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  activeButton: {
    backgroundColor: '#2ecc71',
  },
  inactiveButton: {
    backgroundColor: '#e74c3c',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2c3e50',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
    fontSize: 14,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});