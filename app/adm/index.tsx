import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Dados iniciais das categorias (mantido para as estatísticas)
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
  }
];

export default function AdminPanel() {
  const [categories, setCategories] = useState(initialCategories);
  const router = useRouter();

  const stats = {
    totalProducts: categories.reduce((acc, cat) => acc + cat.products, 0),
    activeCategories: categories.filter(cat => cat.status === 'active').length,
    totalPartners: 15, // Adicionado estatística de parceiros
    activePartners: 12 // Adicionado estatística de parceiros ativos
  };

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
        <Text style={styles.subtitle}>Gerencie produtos e parceiros veterinários</Text>
      </View>

      <ScrollView style={styles.scrollView}>
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
            
            {/* Mensagem de atenção acima dos cards de parceiros */}
            <View style={styles.fullWidthWarning}>
              <Text style={styles.warningText}>ATENÇÃO! Estes dois cards abaixo (Parceiros e Parceiros ativos) só deve aparecer para a nossa farmacia, farmacias parceiras NAO DEVEM VER ISSO</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalPartners}</Text>
              <Text style={styles.statLabel}>Parceiros</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.activePartners}</Text>
              <Text style={styles.statLabel}>Parceiros Ativos</Text>
            </View>
          </View>

          {/* Seção Gerenciar Produtos */}
          <Text style={[styles.tabTitle, { marginTop: 20 }]}>Gerenciar Produtos</Text>

          <View style={styles.statsContainer}>
            {/* Botão Adicionar Produto */}
            <TouchableOpacity
              style={styles.statCard}
              onPress={() => router.push('/adm/adicionarProduto')}
            >
              <View style={styles.actionContent}>
                <Text style={styles.statNumber}>+</Text>
                <Text style={styles.statLabel}>Adicionar Produto</Text>
              </View>
            </TouchableOpacity>

            {/* Botão Editar Produto */}
            <TouchableOpacity style={styles.statCard} onPress={() => router.push('/adm/editarProduto')}>
              <View style={styles.actionContent}>
                <Text style={styles.statNumber}>✏️</Text>
                <Text style={styles.statLabel}>Editar Produto</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.statsContainer}>
            {/* Botão Excluir Produto */}
            <TouchableOpacity style={styles.statCard} onPress={() => router.push('/adm/excluirProduto')}>
              <View style={styles.actionContent}>
                <Ionicons name="trash" size={32} color="#e74c3c" style={styles.actionIcon} />
                <Text style={styles.statLabel}>Excluir Produto</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.emptyCard} />
          </View>

          {/* Seção Gerenciar Parceiros */}
          <Text style={[styles.tabTitle, { marginTop: 20 }]}>Gerenciar Parceiros</Text>
          <Text style={styles.warningSectionText}>ATENÇÃO! Esta parte (Gerenciar parceiros)só deve aparecer para a nossa farmacia, farmacias parceiras NAO DEVEM VER ISSO</Text>

          <View style={styles.statsContainer}>
            {/* Botão Adicionar Parceiro */}
            <TouchableOpacity style={styles.statCard} onPress={() => router.push('/adm/adicionarParceiro')}>
              <View style={styles.actionContent}>
                <Text style={styles.statNumber}>+</Text>
                <Text style={styles.statLabel}>Adicionar Parceiro</Text>
              </View>
            </TouchableOpacity>

            {/* Botão Editar Parceiro */}
            <TouchableOpacity style={styles.statCard} onPress={() => router.push('/adm/editarParceiro')}>
              <View style={styles.actionContent}>
                <Text style={styles.statNumber}>✏️</Text>
                <Text style={styles.statLabel}>Editar Parceiro</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.statsContainer}>
            {/* Botão Excluir Parceiro */}
            <TouchableOpacity style={styles.statCard} onPress={() => router.push('/adm/excluirParceiro')}>
              <View style={styles.actionContent}>
                <Ionicons name="trash" size={32} color="#e74c3c" style={styles.actionIcon} />
                <Text style={styles.statLabel}>Excluir Parceiro</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.emptyCard} />
          </View>
          </View>

          
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
    marginBottom: 15,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  emptyCard: {
    width: '48%',
    padding: 20,
    borderRadius: 10,
    opacity: 0,
  },
  actionContent: {
    alignItems: 'center',
  },
  actionIcon: {
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    fontWeight: '600',
  },
  fullWidthWarning: {
    width: '100%',
    backgroundColor: '#ffeaa7',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#fdcb6e',
    marginBottom: 10,
  },
  warningText: {
    fontSize: 12,
    color: '#e74c3c',
    textAlign: 'center',
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  warningSectionText: {
    fontSize: 12,
    color: '#e74c3c',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 15,
    fontStyle: 'italic',
    backgroundColor: '#ffeaa7',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#fdcb6e',
  },
});