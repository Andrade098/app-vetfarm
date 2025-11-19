import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⭐⭐ CONSTANTE PARA IP DO SERVIDOR ⭐⭐
const API_URL = 'http://192.168.0.3:3000';

export default function DeletePartnerScreen() {
  const router = useRouter();
  
  // ESTADOS PARA PROTEÇÃO
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMatriz, setIsMatriz] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  // Estados existentes
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<number | null>(null);
  const [partners, setPartners] = useState<any[]>([]);
  
  
  // 🔍 🔍 🔍 DEBUG TEMPORÁRIO - ADICIONE ESTAS LINHAS 🔍 🔍 🔍
useEffect(() => {
  const checkToken = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const userData = await AsyncStorage.getItem('userData');
    console.log('🔍 [DELETE] Debug - Token:', token);
    console.log('🔍 [DELETE] Debug - UserData:', userData);
  };
  checkToken();
}, []);
// 🔍 🔍 🔍 FIM DO DEBUG 🔍 🔍 🔍

  // VERIFICAR SE É MATRIZ E CARREGAR PARCEIROS
  useEffect(() => {
    checkUserPermissions();
  }, []);

 const checkUserPermissions = async () => {
  try {
    setIsLoading(true);
    
    const token = await AsyncStorage.getItem('userToken');
    console.log('🔐 [DELETE] Token:', token ? `Presente (${token.length} chars)` : 'Ausente');
    
    if (!token) {
      Alert.alert('Sessão Expirada', 'Por favor, faça login novamente.');
      setAccessDenied(true);
      return;
    }

    // Tente diferentes endpoints
    const endpoints = [
      `${API_URL}/api/farmacia/auth/tipo`,
      `${API_URL}/api/farmacia/tipo`,
      `${API_URL}/api/auth/tipo`
    ];

    let response = null;
    let lastError = null;

    for (const endpoint of endpoints) {
      try {
        console.log('🔄 [DELETE] Tentando endpoint:', endpoint);
        response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) break;
        
        lastError = `Endpoint ${endpoint}: Status ${response.status}`;
        console.log(`❌ [DELETE] ${lastError}`);
      } catch (error) {
        lastError = `Endpoint ${endpoint}: ${error.message}`;
        console.log(`❌ [DELETE] ${lastError}`);
      }
    }

    if (response && response.ok) {
      const data = await response.json();
      console.log('✅ [DELETE] Resposta da API:', data);
      
      const userType = data.tipo || data.userType || data.role;
      console.log('👤 [DELETE] Tipo identificado:', userType);
      
      setIsMatriz(userType === 'matriz');
      
      if (userType !== 'matriz') {
        Alert.alert('Acesso Negado', 'Somente farmácias matriz podem excluir parceiros.');
        setAccessDenied(true);
      } else {
        await loadPartners(); // ⚠️ MANTENHA esta linha se existir
      }
    } else {
      throw new Error(lastError || 'Falha em todos os endpoints');
    }

  } catch (error) {
    console.error('💥 [DELETE] Erro crítico:', error);
    
    // Fallback para desenvolvimento
    if (__DEV__) {
      console.log('🔧 [DELETE] Modo desenvolvimento: Permitindo acesso');
      setIsMatriz(true);
      await loadPartners(); // ⚠️ MANTENHA se existir
    } else {
      Alert.alert('Erro', 'Não foi possível verificar suas permissões.');
      setAccessDenied(true);
    }
  } finally {
    setIsLoading(false);
  }
};

  // CARREGAR PARCEIROS DA API
  const loadPartners = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/api/farmacias/parceiros/todos`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const partnersData = await response.json();
        setPartners(partnersData);
      } else if (response.status === 403) {
        setAccessDenied(true);
        Alert.alert('Acesso Negado', 'Você não tem permissão para visualizar parceiros.');
      } else {
        Alert.alert('Erro', 'Falha ao carregar parceiros.');
      }
    } catch (error) {
      console.error('Erro ao carregar parceiros:', error);
      Alert.alert('Erro', 'Falha ao conectar com o servidor.');
    }
  };

  // EXCLUIR PARCEIRO
  const deletePartner = async (partnerId: number) => {
    try {
      setIsDeleting(true);
      
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/api/farmacias/parceiros/${partnerId}/excluir`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Remove da lista local
        setPartners(partners.filter(partner => partner.id !== partnerId));
        setSelectedPartner(null);
        
        Alert.alert('Sucesso', 'Farmácia parceira excluída com sucesso!');
      } else if (response.status === 403) {
        Alert.alert('Acesso Negado', 'Você não tem permissão para excluir parceiros.');
        setAccessDenied(true);
      } else if (response.status === 404) {
        Alert.alert('Erro', 'Farmácia parceira não encontrada.');
      } else {
        const errorData = await response.json();
        Alert.alert('Erro', errorData.error || 'Erro ao excluir parceiro');
      }
    } catch (error) {
      console.error('Erro ao excluir parceiro:', error);
      Alert.alert('Erro', 'Falha ao conectar com o servidor');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredPartners = partners.filter(partner =>
    partner.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (partner.categoria && partner.categoria.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSearch = (text: string) => {
    setSearchTerm(text);
  };

  const selectPartner = (partnerId: number) => {
    setSelectedPartner(partnerId === selectedPartner ? null : partnerId);
  };

  const confirmDelete = () => {
    if (!selectedPartner) {
      Alert.alert('Atenção', 'Selecione uma farmácia parceira para excluir');
      return;
    }

    const partner = partners.find(p => p.id === selectedPartner);
    
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir permanentemente a farmácia parceira "${partner?.nome}"?\n\n⚠️  Esta ação não pode ser desfeita.\n📦 Todos os produtos associados serão removidos.\n🚫 O acesso ao sistema será revogado.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir Permanentemente', 
          style: 'destructive',
          onPress: () => deletePartner(selectedPartner)
        }
      ]
    );
  };

  const getSelectedPartner = () => {
    return partners.find(partner => partner.id === selectedPartner);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={i} name="star" size={16} color="#FFD700" />);
    }

    if (hasHalfStar) {
      stars.push(<Ionicons key="half" name="star-half" size={16} color="#FFD700" />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Ionicons key={`empty-${i}`} name="star-outline" size={16} color="#FFD700" />);
    }

    return (
      <View style={styles.ratingContainer}>
        {stars}
        <Text style={styles.ratingText}>({rating})</Text>
      </View>
    );
  };

  // TELA DE CARREGAMENTO
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Carregando parceiros...</Text>
      </View>
    );
  }

  // TELA DE ACESSO NEGADO
  if (accessDenied) {
    return (
      <View style={styles.deniedContainer}>
        <Ionicons name="lock-closed" size={64} color="#e74c3c" />
        <Text style={styles.deniedTitle}>Acesso Negado</Text>
        <Text style={styles.deniedText}>
          Somente farmácias matriz podem excluir parceiros.
        </Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Excluir Parceiro',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
        }} 
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Barra de Pesquisa */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#7f8c8d" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar farmácia por nome, cidade ou categoria..."
              value={searchTerm}
              onChangeText={handleSearch}
              placeholderTextColor="#999"
            />
            {searchTerm.length > 0 && (
              <TouchableOpacity onPress={() => setSearchTerm('')}>
                <Ionicons name="close-circle" size={20} color="#7f8c8d" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Lista de Farmácias Parceiras */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {filteredPartners.length} farmácia{filteredPartners.length !== 1 ? 's' : ''} parceira{filteredPartners.length !== 1 ? 's' : ''} encontrada{filteredPartners.length !== 1 ? 's' : ''}
          </Text>

          {filteredPartners.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="business-outline" size={48} color="#bdc3c7" />
              <Text style={styles.emptyStateText}>Nenhuma farmácia encontrada</Text>
              <Text style={styles.emptyStateSubtext}>
                {searchTerm ? 'Tente buscar por outro termo ou verifique a ortografia' : 'Não há farmácias parceiras cadastradas'}
              </Text>
            </View>
          ) : (
            filteredPartners.map(partner => (
              <TouchableOpacity
                key={partner.id}
                style={[
                  styles.partnerCard,
                  selectedPartner === partner.id && styles.selectedPartnerCard
                ]}
                onPress={() => selectPartner(partner.id)}
                disabled={isDeleting}
              >
                <Image 
                  source={{ uri: partner.imagem || 'https://via.placeholder.com/100' }} 
                  style={styles.partnerImage}
                  defaultSource={{ uri: 'https://via.placeholder.com/100' }}
                />
                
                <View style={styles.partnerInfo}>
                  <Text style={styles.partnerName} numberOfLines={1}>
                    {partner.nome}
                  </Text>
                  <Text style={styles.partnerCategory}>{partner.categoria || 'Farmácia Parceira'}</Text>
                  
                  {partner.rating && renderStars(partner.rating)}
                  
                  <View style={styles.partnerContact}>
                    <Ionicons name="location" size={12} color="#7f8c8d" />
                    <Text style={styles.partnerAddress} numberOfLines={1}>
                      {partner.endereco}, {partner.cidade}
                    </Text>
                  </View>
                  
                  <View style={styles.partnerContact}>
                    <Ionicons name="call" size={12} color="#7f8c8d" />
                    <Text style={styles.partnerPhone}>{partner.telefone}</Text>
                  </View>

                  <Text style={styles.partnerDescription} numberOfLines={2}>
                    {partner.descricao}
                  </Text>
                  
                  <View style={styles.partnerDetails}>
                    <Text style={styles.productsCount}>
                      {partner.produtosCount || 0} produtos
                    </Text>
                    <Text style={styles.partnerEmail} numberOfLines={1}>
                      {partner.email}
                    </Text>
                  </View>
                </View>

                <View style={styles.selectionIndicator}>
                  {selectedPartner === partner.id ? (
                    <Ionicons name="checkmark-circle" size={24} color="#2ecc71" />
                  ) : (
                    <Ionicons name="radio-button-off" size={24} color="#bdc3c7" />
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Farmácia Selecionada */}
        {selectedPartner && (
          <View style={styles.selectedSection}>
            <Text style={styles.sectionTitle}>Farmácia Selecionada para Exclusão</Text>
            <View style={styles.selectedPartner}>
              <Image 
                source={{ uri: getSelectedPartner()?.imagem || 'https://via.placeholder.com/100' }} 
                style={styles.selectedPartnerImage}
                defaultSource={{ uri: 'https://via.placeholder.com/100' }}
              />
              
              <View style={styles.selectedPartnerInfo}>
                <Text style={styles.selectedPartnerName}>{getSelectedPartner()?.nome}</Text>
                <Text style={styles.selectedPartnerCategory}>{getSelectedPartner()?.categoria || 'Farmácia Parceira'}</Text>
                
                {getSelectedPartner()?.rating && renderStars(getSelectedPartner().rating)}
                
                <View style={styles.selectedPartnerContact}>
                  <Ionicons name="location" size={14} color="#7f8c8d" />
                  <Text style={styles.selectedPartnerAddress}>
                    {getSelectedPartner()?.endereco}, {getSelectedPartner()?.cidade}
                  </Text>
                </View>
                
                <View style={styles.selectedPartnerContact}>
                  <Ionicons name="call" size={14} color="#7f8c8d" />
                  <Text style={styles.selectedPartnerPhone}>{getSelectedPartner()?.telefone}</Text>
                </View>

                <View style={styles.selectedPartnerContact}>
                  <Ionicons name="mail" size={14} color="#7f8c8d" />
                  <Text style={styles.selectedPartnerEmail}>{getSelectedPartner()?.email}</Text>
                </View>

                <Text style={styles.selectedPartnerDescription}>
                  {getSelectedPartner()?.descricao}
                </Text>
                
                <View style={styles.selectedPartnerDetails}>
                  <Text style={styles.selectedProductsCount}>
                    {getSelectedPartner()?.produtosCount || 0} produtos cadastrados
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Botão de Exclusão */}
        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={[
              styles.deleteButton,
              (!selectedPartner || isDeleting) && styles.deleteButtonDisabled
            ]}
            onPress={confirmDelete}
            disabled={!selectedPartner || isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="trash" size={20} color="white" />
            )}
            <Text style={styles.deleteButtonText}>
              {isDeleting ? 'Excluindo...' : 'Excluir Farmácia Parceira'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.cancelButton, isDeleting && styles.cancelButtonDisabled]}
            onPress={() => router.back()}
            disabled={isDeleting}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>

        {/* Espaço extra no final */}
        <View style={styles.bottomSpacer} />
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
  searchSection: {
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f2f6',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
  },
  section: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7f8c8d',
    marginTop: 10,
    marginBottom: 5,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#bdc3c7',
    textAlign: 'center',
  },
  partnerCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedPartnerCard: {
    borderColor: '#3498db',
    backgroundColor: '#e8f4fd',
  },
  partnerImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#ecf0f1',
  },
  partnerInfo: {
    flex: 1,
    marginLeft: 15,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  partnerCategory: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginLeft: 5,
  },
  partnerContact: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  partnerAddress: {
    fontSize: 11,
    color: '#7f8c8d',
    marginLeft: 4,
    flex: 1,
  },
  partnerPhone: {
    fontSize: 11,
    color: '#7f8c8d',
    marginLeft: 4,
  },
  partnerDescription: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  partnerDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productsCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#27ae60',
  },
  partnerEmail: {
    fontSize: 11,
    color: '#7f8c8d',
    flex: 1,
    marginLeft: 10,
  },
  selectionIndicator: {
    justifyContent: 'center',
    marginLeft: 10,
  },
  selectedSection: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
  },
  selectedPartner: {
    flexDirection: 'row',
    backgroundColor: '#e8f4fd',
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#3498db',
  },
  selectedPartnerImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#ecf0f1',
  },
  selectedPartnerInfo: {
    flex: 1,
    marginLeft: 15,
  },
  selectedPartnerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  selectedPartnerCategory: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 6,
  },
  selectedPartnerContact: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  selectedPartnerAddress: {
    fontSize: 13,
    color: '#7f8c8d',
    marginLeft: 6,
    flex: 1,
  },
  selectedPartnerPhone: {
    fontSize: 13,
    color: '#7f8c8d',
    marginLeft: 6,
  },
  selectedPartnerEmail: {
    fontSize: 13,
    color: '#7f8c8d',
    marginLeft: 6,
  },
  selectedPartnerDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  selectedPartnerDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedProductsCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  actionSection: {
    backgroundColor: 'white',
    padding: 20,
  },
  deleteButton: {
    flexDirection: 'row',
    backgroundColor: '#e74c3c',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  deleteButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cancelButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  cancelButtonText: {
    color: '#7f8c8d',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 10,
  },
  deniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  deniedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginTop: 20,
    marginBottom: 10,
  },
  deniedText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 30,
  },
  backButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});