import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function MenuScreen() {
  const router = useRouter();

  const menuItems = [
    { id: '1', title: 'Resumo da conta', icon: 'person-outline', screen: 'account' },
    { id: '2', title: 'Meus pedidos', icon: 'cart-outline', screen: 'orders' },
    { id: '3', title: 'Meus dados', icon: 'id-card-outline', screen: 'profile' },
    { id: '4', title: 'Meus endereços', icon: 'location-outline', screen: 'addresses' },
    { id: '5', title: 'Favoritos', icon: 'heart-outline', screen: 'favorites' },
    { id: '6', title: 'Alterar senha', icon: 'lock-closed-outline', screen: 'change-password' },
    { id: '7', title: 'Sair', icon: 'log-out-outline', screen: 'logout', isDestructive: true },
  ];

  const handleMenuItemPress = (screen: string) => {
    if (screen === 'logout') {
      // Lógica para logout
      alert('Sair da conta');
      router.replace('/');
    } else {
      router.push(`/home/${screen}`);
    }
  };

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
            <Text style={styles.profileName}>João da Silva</Text>
            <Text style={styles.profileEmail}>joao@email.com</Text>
          </View>
        </View>

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
    width: 34, // Para manter o alinhamento com a tela anterior
  },
  content: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
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
  },
  menuList: {
    backgroundColor: '#fff',
    marginBottom: 20,
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