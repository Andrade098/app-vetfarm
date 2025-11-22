import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [isMatriz, setIsMatriz] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Administrador');
  const router = useRouter();

  // ✅ VERIFICAR TIPO DA FARMÁCIA AO CARREGAR - CORRIGIDO
  useEffect(() => {
    checkUserType();
  }, []);

  const checkUserType = async () => {
    try {
      setLoading(true);
      
      console.log('🔍 VERIFICANDO STORAGE PARA TIPO...');
      
      // ⭐⭐ CORREÇÃO: Ler diretamente do AsyncStorage em vez de fazer HTTP request
      const userDataString = await AsyncStorage.getItem('userData');
      const farmaciaTipo = await AsyncStorage.getItem('farmaciaTipo');
      
      console.log('📦 DADOS DO STORAGE:');
      console.log('   - userData:', userDataString);
      console.log('   - farmaciaTipo:', farmaciaTipo);

      if (!userDataString) {
        console.log('❌ USERDATA NÃO ENCONTRADO');
        setLoading(false);
        return;
      }

      const userData = JSON.parse(userDataString);
      console.log('👤 DADOS DO USUÁRIO PARSED:', userData);
      
      // ⭐⭐ CORREÇÃO: Verificar o tipo do userData
      const tipo = userData.tipo || farmaciaTipo;
      console.log('🏢 TIPO ENCONTRADO:', tipo);
      
      setIsMatriz(tipo === 'matriz');
      setUserName(userData.nome || 'Administrador');
      
      console.log('✅ TIPO DEFINIDO:', tipo === 'matriz' ? 'MATRIZ' : 'FILIAL');

    } catch (error) {
      console.error('❌ ERRO AO VERIFICAR TIPO:', error);
      Alert.alert('Erro', 'Falha ao verificar permissões');
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalProducts: categories.reduce((acc, cat) => acc + cat.products, 0),
    activeCategories: categories.filter(cat => cat.status === 'active').length,
    totalPartners: 15,
    activePartners: 12
  };

  // ✅ TELA DE CARREGAMENTO
  if (loading) {
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
        <View style={styles.loadingContainer}>
          <Ionicons name="refresh" size={40} color="#3498db" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </View>
    );
  }

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
        <Text style={styles.welcome}>Bem-vindo, {userName}</Text>
        <Text style={styles.subtitle}>
          {isMatriz ? 'Gerencie produtos e parceiros veterinários' : 'Gerencie seus produtos veterinários'}
        </Text>
        
        {/* ✅ BADGE MOSTRANDO O TIPO DA FARMÁCIA */}
        <View style={[
          styles.typeBadge, 
          isMatriz ? styles.matrizBadge : styles.filialBadge
        ]}>
          <Ionicons 
            name={isMatriz ? "business" : "storefront"} 
            size={16} 
            color="white" 
          />
          <Text style={styles.typeBadgeText}>
            {isMatriz ? 'Farmácia Matriz' : 'Farmácia Parceira'}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.tabContent}>

          {/* Seção Gerenciar Produtos - ✅ VISÍVEL PARA TODAS AS FARMÁCIAS */}
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
            <TouchableOpacity style={styles.statCard} onPress={() => router.push('/adm/listarProduto')}>
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

          {/* ✅ Seção Gerenciar Parceiros - APENAS PARA MATRIZ */}
          {isMatriz && (
            <>
              <Text style={[styles.tabTitle, { marginTop: 20 }]}>Gerenciar Parceiros</Text>
              
              <View style={styles.statsContainer}>
                {/* Botão Adicionar Parceiro */}
                <TouchableOpacity style={styles.statCard} onPress={() => router.push('/adm/adicionarParceiro')}>
                  <View style={styles.actionContent}>
                    <Ionicons name="business" size={32} color="#3498db" style={styles.actionIcon} />
                    <Text style={styles.statLabel}>Adicionar Parceiro</Text>
                  </View>
                </TouchableOpacity>

                {/* Botão Editar Parceiro */}
                <TouchableOpacity style={styles.statCard} onPress={() => router.push('/adm/listarParceiro')}>
                  <View style={styles.actionContent}>
                    <Ionicons name="create" size={32} color="#f39c12" style={styles.actionIcon} />
                    <Text style={styles.statLabel}>Editar Parceiro</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.statsContainer}>
                {/* Botão Excluir Parceiro */}
                <TouchableOpacity style={styles.statCard} onPress={() => router.push('/adm/excluirParceiro')}>
                  <View style={styles.actionContent}>
                    <Ionicons name="trash" size={32} color="#e74c3c" style={styles.actionIcon} />
                    <Text style={styles.statLabel}>Excluir Parceiro</Text>
                  </View>
                </TouchableOpacity>
              </View></>
          )}

          {/* ✅ MENSAGEM PARA FARMÁCIAS FILIAIS */}
          {!isMatriz && (
            <View style={styles.filialMessage}>
              <Ionicons name="storefront" size={48} color="#bdc3c7" />
              <Text style={styles.filialMessageTitle}>Farmácia Parceira</Text>
              <Text style={styles.filialMessageText}>
                Você está logado como farmácia parceira. 
                Acesse as funcionalidades de produtos para gerenciar seu catálogo.
              </Text>
            </View>
          )}

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
    marginBottom: 10,
  },
  // ✅ NOVOS ESTILOS PARA BADGE DE TIPO
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 5,
  },
  matrizBadge: {
    backgroundColor: '#27ae60',
  },
  filialBadge: {
    backgroundColor: '#3498db',
  },
  typeBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
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
  // ✅ NOVOS ESTILOS PARA MENSAGEM DE FILIAL
  filialMessage: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  filialMessageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 10,
    marginBottom: 5,
  },
  filialMessageText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
  },
  // ✅ ESTILOS DE LOADING
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7f8c8d',
  },
});