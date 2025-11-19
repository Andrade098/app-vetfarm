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

  // VERIFICAR SE É MATRIZ E CARREGAR PARCEIROS
  useEffect(() => {
    checkUserPermissions();
  }, []);

  const checkUserPermissions = async () => {
    try {
      setIsLoading(true);
      
      const token = await AsyncStorage.getItem('userToken');
      const userDataString = await AsyncStorage.getItem('userData');
      
      console.log('🔐 [DELETE] Token:', token ? `Presente (${token.length} chars)` : 'Ausente');
      console.log('👤 [DELETE] UserData:', userDataString);

      if (!token || !userDataString) {
        Alert.alert('Sessão Expirada', 'Por favor, faça login novamente.');
        setAccessDenied(true);
        return;
      }

      // ✅ USA OS DADOS DO USERDATA - NÃO PRECISA DA API
      const userData = JSON.parse(userDataString);
      console.log('✅ [DELETE] Tipo do usuário:', userData.tipo);
      
      const isUserMatriz = userData.tipo === 'matriz';
      setIsMatriz(isUserMatriz);
      
      if (!isUserMatriz) {
        console.log('❌ [DELETE] Usuário não é matriz');
        Alert.alert('Acesso Negado', 'Somente farmácias matriz podem excluir parceiros.');
        setAccessDenied(true);
      } else {
        console.log('✅ [DELETE] Usuário é matriz, carregando parceiros...');
        await loadPartners();
      }

    } catch (error) {
      console.error('💥 [DELETE] Erro ao verificar permissões:', error);
      Alert.alert('Erro', 'Não foi possível verificar suas permissões.');
      setAccessDenied(true);
    } finally {
      setIsLoading(false);
    }
  };

  // CARREGAR PARCEIROS DA API
  const loadPartners = async () => {
    try {
      console.log('🟡 [DELETE] Carregando parceiros...');
      
      const token = await AsyncStorage.getItem('userToken');
      console.log('🔐 Token para carregar parceiros:', token ? `Presente (${token.length} chars)` : 'Ausente');

      const endpoint = `${API_URL}/api/farmacias/parceiros/todos`;
      console.log('🌐 Endpoint:', endpoint);

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Status da resposta:', response.status);
      console.log('📡 OK:', response.ok);

      if (response.ok) {
        const partnersData = await response.json();
        console.log('✅ Parceiros carregados:', partnersData.length);
        setPartners(partnersData);
      } else if (response.status === 403) {
        console.log('❌ Acesso negado (403)');
        setAccessDenied(true);
        Alert.alert('Acesso Negado', 'Você não tem permissão para visualizar parceiros.');
      } else {
        const errorText = await response.text();
        console.log('❌ Erro ao carregar parceiros:', response.status, errorText);
        Alert.alert('Erro', 'Falha ao carregar parceiros.');
      }
    } catch (error) {
      console.error('💥 Erro ao carregar parceiros:', error);
      Alert.alert('Erro', 'Falha ao conectar com o servidor.');
    }
  };

  // EXCLUIR PARCEIRO
  // EXCLUIR PARCEIRO - VERSÃO COM DEBUG COMPLETO
const deletePartner = async (partnerId: number) => {
  try {
    setIsDeleting(true);
    
    console.log('🔍 [DELETE] === INICIANDO EXCLUSÃO ===');
    console.log('🆔 [DELETE] Partner ID:', partnerId);
    console.log('📋 [DELETE] Tipo do ID:', typeof partnerId);
    
    const token = await AsyncStorage.getItem('userToken');
    console.log('🔐 [DELETE] Token:', token ? `Presente (${token.substring(0, 20)}...` : 'AUSENTE');
    
    if (!token) {
      Alert.alert('Erro', 'Token de autenticação não encontrado');
      return;
    }

    // ✅ Endpoint correto baseado nas suas rotas
    const endpoint = `${API_URL}/api/farmacias/parceiros/${partnerId}/excluir`;
    console.log('🌐 [DELETE] Endpoint COMPLETO:', endpoint);

    console.log('🟡 [DELETE] Fazendo requisição DELETE...');
    
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 [DELETE] Resposta recebida - Status:', response.status);
    console.log('📡 [DELETE] Resposta OK:', response.ok);

    // Tentar ler a resposta independente do status
    let responseBody;
    try {
      responseBody = await response.text();
      console.log('📄 [DELETE] Corpo da resposta:', responseBody);
      
      // Tentar parsear como JSON se possível
      if (responseBody) {
        try {
          const jsonResponse = JSON.parse(responseBody);
          console.log('📄 [DELETE] Resposta JSON:', jsonResponse);
        } catch (e) {
          console.log('📄 [DELETE] Resposta não é JSON');
        }
      }
    } catch (e) {
      console.log('❌ [DELETE] Erro ao ler resposta:', e);
    }

    if (response.ok) {
      console.log('✅ [DELETE] EXCLUSÃO BEM-SUCEDIDA!');
      
      // Remove da lista local
      const updatedPartners = partners.filter(partner => partner.id !== partnerId);
      console.log('🔄 [DELETE] Lista atualizada:', updatedPartners.length, 'parceiros');
      
      setPartners(updatedPartners);
      setSelectedPartner(null);
      
      Alert.alert(
        'Sucesso', 
        'Farmácia parceira excluída com sucesso!',
        [{ text: 'OK' }]
      );
      return;
    }

    // Tratamento de erros específicos
    switch (response.status) {
      case 400:
        Alert.alert('Erro', 'Dados inválidos enviados para o servidor');
        break;
      case 401:
        Alert.alert('Sessão Expirada', 'Por favor, faça login novamente');
        router.push('/login');
        break;
      case 403:
        Alert.alert('Acesso Negado', 'Você não tem permissão para excluir parceiros');
        setAccessDenied(true);
        break;
      case 404:
        Alert.alert('Erro', 'Farmácia parceira não encontrada');
        break;
      case 500:
        Alert.alert('Erro', 'Erro interno do servidor');
        break;
      default:
        Alert.alert('Erro', `Erro ${response.status} ao excluir parceiro`);
    }

  } catch (error) {
    console.error('💥 [DELETE] Erro na requisição:', error);
    Alert.alert('Erro', 'Falha ao conectar com o servidor: ' + (error.message || 'Verifique sua conexão de internet'));
  } finally {
    console.log('🔍 [DELETE] === FINALIZANDO EXCLUSÃO ===');
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
  
  console.log('🟡 [DELETE] Chamando deletePartner DIRETAMENTE (sem confirmação)');
  console.log('🟡 [DELETE] Parceiro:', partner?.nome);
  console.log('🟡 [DELETE] ID:', selectedPartner);
  
  // ⚠️ TESTE DIRETO - REMOVA O ALERT TEMPORARIAMENTE
  deletePartner(selectedPartner);
};

  const getSelectedPartner = () => {
    return partners.find(partner => partner.id === selectedPartner);
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
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.backButtonText}>Voltar para Início</Text>
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
                <View style={styles.partnerIcon}>
                  <Ionicons name="business" size={32} color="#3498db" />
                </View>
                
                <View style={styles.partnerInfo}>
                  <Text style={styles.partnerName} numberOfLines={1}>
                    {partner.nome}
                  </Text>
                  <Text style={styles.partnerCategory}>{partner.categoria || 'Farmácia Parceira'}</Text>
                  
                  <View style={styles.partnerContact}>
                    <Ionicons name="location" size={12} color="#7f8c8d" />
                    <Text style={styles.partnerAddress} numberOfLines={1}>
                      {partner.cidade}, {partner.estado}
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
              <View style={styles.selectedPartnerIcon}>
                <Ionicons name="business" size={40} color="#3498db" />
              </View>
              
              <View style={styles.selectedPartnerInfo}>
                <Text style={styles.selectedPartnerName}>{getSelectedPartner()?.nome}</Text>
                <Text style={styles.selectedPartnerCategory}>{getSelectedPartner()?.categoria || 'Farmácia Parceira'}</Text>
                
                <View style={styles.selectedPartnerContact}>
                  <Ionicons name="location" size={14} color="#7f8c8d" />
                  <Text style={styles.selectedPartnerAddress}>
                    {getSelectedPartner()?.cidade}, {getSelectedPartner()?.estado}
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
              </View>
            </View>
          </View>
        )}

        {/* Botão de Exclusão */}
        {/* Botão de Exclusão - VERSÃO DEBUG */}
<View style={styles.actionSection}>
  <TouchableOpacity 
    style={[
      styles.deleteButton,
      (!selectedPartner || isDeleting) && styles.deleteButtonDisabled
    ]}
    onPress={() => {
      console.log('🎯 [DELETE] === BOTÃO EXCLUIR CLICADO ===');
      console.log('🎯 [DELETE] selectedPartner:', selectedPartner);
      console.log('🎯 [DELETE] isDeleting:', isDeleting);
      console.log('🎯 [DELETE] Botão habilitado?', !(!selectedPartner || isDeleting));
      confirmDelete();
    }}
    disabled={!selectedPartner || isDeleting}
  >
    {isDeleting ? (
      <ActivityIndicator size="small" color="white" />
    ) : (
      <Ionicons name="trash" size={20} color="white" />
    )}
    <Text style={styles.deleteButtonText}>
      {isDeleting ? 'Excluindo...' : `Excluir (${selectedPartner ? 'Habilitado' : 'Desabilitado'})`}
    </Text>
  </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.cancelButton, isDeleting && styles.cancelButtonDisabled]}
            onPress={() => router.push('/adm')}
            disabled={isDeleting}
          >
            <Text style={styles.cancelButtonText}>Voltar para Início</Text>
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
  partnerIcon: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
    alignItems: 'center',
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
  partnerEmail: {
    fontSize: 11,
    color: '#7f8c8d',
    flex: 1,
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
  selectedPartnerIcon: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
    alignItems: 'center',
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
  bottomSpacer: {
    height: 20,
  },
});