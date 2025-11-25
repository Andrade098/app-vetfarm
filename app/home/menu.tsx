import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { usePedidos } from '../../contexts/PedidoContext';

export default function MenuScreen() {
  const router = useRouter();
  const { user, logout, fetchUserData, loading: authLoading } = useAuth();
  const { pedidos, carregarPedidos, loading: pedidosLoading } = usePedidos();
  const [loading, setLoading] = useState(true);

  // Buscar dados atualizados quando a tela abre
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchUserData(),
          carregarPedidos()
        ]);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Debug para verificar os dados
  useEffect(() => {
    console.log('🔍 Dados do usuário no MenuScreen:', user);
    console.log('🔍 Pedidos carregados:', pedidos.length);
  }, [user, pedidos]);

  const menuItems = [
    { id: '1', title: 'Resumo da conta', icon: 'person-outline', screen: 'resumoconta' },
    { id: '2', title: 'Meus pedidos', icon: 'cart-outline', screen: 'meuspedidos' },
    { id: '3', title: 'Meus dados', icon: 'id-card-outline', screen: 'meusdados' },
    { id: '4', title: 'Meus endereços', icon: 'location-outline', screen: 'meusenderecos' },
    { id: '5', title: 'Favoritos', icon: 'heart-outline', screen: 'favoritos' },
    { id: '6', title: 'Alterar senha', icon: 'lock-closed-outline', screen: 'alterarsenha' },
    { id: '7', title: 'Sair', icon: 'log-out-outline', screen: 'logout', isDestructive: true },
  ];

  const handleMenuItemPress = (screen: string) => {
    if (screen === 'logout') {
      Alert.alert(
        'Sair',
        'Tem certeza que deseja sair?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Sair',
            style: 'destructive',
            onPress: () => {
              logout();
              router.replace('/');
            },
          },
        ]
      );
    } else {
      router.push(`/home/${screen}`);
    }
  };

  // Função para formatar o nome completo
  const getFullName = () => {
    if (!user) return 'Usuário';
    if (user.nome && user.sobrenome) {
      return `${user.nome} ${user.sobrenome}`;
    }
    return user.nome || 'Usuário';
  };

  // Função para formatar o tipo de usuário
  const getUserType = () => {
    if (!user) return 'Tipo de usuário';
    if (user.tipo === 'cliente') return 'Cliente';
    if (user.tipo === 'farmacia') return 'Farmácia';
    return user.tipo || 'Tipo de usuário';
  };

  // Mostrar loading enquanto carrega
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#126b1a" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#126b1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Menu</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        {/* Perfil do usuário */}
        <View style={styles.profileSection}>
          <Image
            source={require('../../assets/images/logovetfarm.png')}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {getFullName()}
            </Text>
            <Text style={styles.profileEmail}>
              {user?.email || 'email@exemplo.com'}
            </Text>
            <Text style={styles.profileType}>
              {getUserType()}
            </Text>
          </View>
        </View>

        {/* ✅ REMOVIDA A SEÇÃO DE PEDIDOS RECENTES */}

        {/* Itens do menu */}
        <View style={styles.menuList}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                item.isDestructive && styles.destructiveItem
              ]}
              onPress={() => handleMenuItemPress(item.screen)}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name={item.icon as any}
                  size={22}
                  color={item.isDestructive ? '#ff3b30' : '#126b1a'}
                />
                <Text style={[
                  styles.menuItemText,
                  item.isDestructive && styles.destructiveText
                ]}>
                  {item.title}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={item.isDestructive ? '#ff3b30' : '#666'}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Informações do app */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>VetFarm v1.0.0</Text>
          <Text style={styles.appCopyright}>© 2025 VetFarm - Todos os direitos reservados</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingTop: 40,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#126b1a',
  },
  headerRight: {
    width: 34,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  profileType: {
    fontSize: 12,
    color: '#126b1a',
    fontWeight: '500',
  },
  menuList: {
    backgroundColor: '#fff',
    marginBottom: 20,
    marginHorizontal: 15,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  destructiveItem: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 10,
  },
  destructiveText: {
    color: '#ff3b30',
  },
  appInfo: {
    alignItems: 'center',
    padding: 20,
  },
  appVersion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  appCopyright: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});