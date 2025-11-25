import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Partner {
  id: number;
  nome: string;
  cidade: string;
  telefone: string;
  email: string;
  endereco?: string;
  descricao?: string;
  bairro?: string;
  estado?: string;
  cep?: string;
  tipo: 'matriz' | 'filial';
}

export default function ListarParceirosScreen() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<number | null>(null);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Buscar parceiros do banco de dados - APENAS FILIAIS
  const fetchPartners = async () => {
  try {
    console.log('🔍 Buscando farmácias filiais do banco de dados...');
    
    const userDataString = await AsyncStorage.getItem('userData');
    console.log('📦 userData do AsyncStorage:', userDataString);
    
    if (!userDataString) {
      throw new Error('Dados do usuário não encontrados');
    }

    const userData = JSON.parse(userDataString);
    const token = await AsyncStorage.getItem('userToken');
    
    console.log('🔑 Token encontrado:', token ? 'SIM' : 'NÃO');
    console.log('👤 Tipo do usuário:', userData.tipo);
    console.log('🏢 Farmácia logada é matriz?', userData.tipo === 'matriz');
    
    if (!token) {
      throw new Error('Token não encontrado');
    }

    // ⭐⭐ CORREÇÃO: USE O IP DA REDE ⭐⭐
    const response = await fetch('http://192.168.0.2:3000/api/farmacias/parceiros/todos', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 Status da resposta:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro da API:', errorText);
      throw new Error(`Erro HTTP: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('📊 Dados BRUTOS recebidos da API:', data);
    
    // ✅ MAPEAR CAMPOS - APENAS OS QUE EXISTEM
    const filiaisMapeadas = data.map((farmacia: any) => {
      return {
        id: farmacia.id,
        nome: farmacia.nome,
        cidade: farmacia.cidade || '',
        telefone: farmacia.telefone || '',
        email: farmacia.email,
        endereco: farmacia.endereco || '',
        descricao: farmacia.descricao || '',
        bairro: farmacia.bairro || '',
        estado: farmacia.estado || '',
        cep: farmacia.cep || '',
        tipo: farmacia.tipo
      };
    });

    console.log('✅ Farmácias mapeadas:', filiaisMapeadas.length);
    console.log('📋 Lista de filiais:', filiaisMapeadas);
    
    setPartners(filiaisMapeadas);
    
    // ⭐⭐ DEBUG: VERIFICAR ESTADO ATUALIZADO ⭐⭐
    console.log('🔄 Estado partners atualizado:', filiaisMapeadas.length);

  } catch (error) {
    console.error('❌ Erro ao buscar farmácias filiais:', error);
    Alert.alert('Erro', 'Não foi possível carregar a lista de farmácias filiais');
    setPartners([]);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

  // Carregar parceiros quando a tela abrir
  useEffect(() => {
    fetchPartners();
  }, []);

  // Função para atualizar a lista
  const handleRefresh = () => {
    setRefreshing(true);
    fetchPartners();
  };

  const filteredPartners = partners.filter(partner =>
    partner.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (text: string) => {
    setSearchTerm(text);
  };

  const selectPartner = (partnerId: number) => {
    setSelectedPartner(partnerId === selectedPartner ? null : partnerId);
  };

  const handleEditPartner = () => {
  if (!selectedPartner) {
    Alert.alert('Atenção', 'Selecione uma farmácia filial para editar');
    return;
  }

  console.log('🔍 DEBUG COMPLETO:');
  console.log('   - ID:', selectedPartner);
  console.log('   - Tipo:', typeof selectedPartner);
  console.log('   - Router disponível:', !!router);
  
  // ⭐⭐ TENTE TODAS AS OPÇÕES ⭐⭐
  try {
    console.log('🔄 Tentando router.push...');
    router.push(`/adm/editarParceiro?id=${selectedPartner}`);
    
    setTimeout(() => {
      console.log('🔄 Tentando router.navigate...');
      router.navigate(`/adm/editarParceiro?id=${selectedPartner}`);
    }, 500);
    
  } catch (error) {
    console.error('❌ Erro no router:', error);
  }
};

  const getSelectedPartner = () => {
    return partners.find(partner => partner.id === selectedPartner);
  };

  const getTipoText = (tipo: string) => {
    return tipo === 'matriz' ? 'Matriz' : 'Filial';
  };

  // Tela de carregamento
  if (loading) {
    return (
      <View style={styles.container}>
        <Stack.Screen 
          options={{
            title: 'Farmácias Filiais',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 20,
            },
          }} 
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Carregando farmácias filiais...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Farmácias Filiais',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
        }} 
      />

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#3498db']}
            tintColor="#3498db"
          />
        }
      >
        {/* Barra de Pesquisa */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#7f8c8d" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar farmácia filial por nome, cidade ou email..."
              value={searchTerm}
              onChangeText={handleSearch}
            />
            {searchTerm.length > 0 && (
              <TouchableOpacity onPress={() => setSearchTerm('')}>
                <Ionicons name="close-circle" size={20} color="#7f8c8d" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Informação sobre filiais */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color="#3498db" />
          <Text style={styles.infoText}>
            Mostrando apenas farmácias filiais
          </Text>
        </View>

        {/* Botão de Atualizar */}
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Ionicons name="refresh" size={20} color="#3498db" />
          <Text style={styles.refreshButtonText}>Atualizar Lista</Text>
        </TouchableOpacity>

        {/* Lista de Farmácias Filiais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {filteredPartners.length} farmácia{filteredPartners.length !== 1 ? 's' : ''} filial{filteredPartners.length !== 1 ? 's' : ''} {filteredPartners.length === 0 ? 'encontrada' : 'encontradas'}
          </Text>

          {filteredPartners.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="business-outline" size={48} color="#bdc3c7" />
              <Text style={styles.emptyStateText}>
                {searchTerm ? 'Nenhuma farmácia filial encontrada' : 'Nenhuma farmácia filial cadastrada'}
              </Text>
              <Text style={styles.emptyStateSubtext}>
                {searchTerm 
                  ? 'Tente buscar por outro termo ou verifique a ortografia'
                  : 'Clique em "Adicionar Parceiro" para cadastrar uma nova farmácia filial'
                }
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
              >
                {/* Ícone no lugar da imagem */}
                <View style={styles.partnerIcon}>
                  <Ionicons name="business" size={32} color="#3498db" />
                </View>
                
                <View style={styles.partnerInfo}>
                  <View style={styles.partnerHeader}>
                    <Text style={styles.partnerName} numberOfLines={1}>
                      {partner.nome}
                    </Text>
                  </View>
                  
                  <View style={styles.typeBadge}>
                    <Ionicons name="storefront" size={10} color="#3498db" />
                    <Text style={styles.typeText}>Farmácia Filial</Text>
                  </View>
                  
                  <Text style={styles.partnerCity}>
                    <Ionicons name="location" size={12} color="#7f8c8d" /> 
                    {partner.cidade} - {partner.estado}
                  </Text>
                  
                  <Text style={styles.partnerEmail} numberOfLines={1}>
                    <Ionicons name="mail" size={12} color="#7f8c8d" /> {partner.email}
                  </Text>
                  
                  <Text style={styles.partnerPhone}>
                    <Ionicons name="call" size={12} color="#7f8c8d" /> {partner.telefone}
                  </Text>
                  
                  {partner.bairro && (
                    <Text style={styles.partnerNeighborhood}>
                      <Ionicons name="navigate" size={12} color="#7f8c8d" /> {partner.bairro}
                    </Text>
                  )}
                  
                  {partner.descricao && (
                    <Text style={styles.partnerDescription} numberOfLines={2}>
                      {partner.descricao}
                    </Text>
                  )}
                </View>

                <View style={styles.selectionIndicator}>
                  {selectedPartner === partner.id ? (
                    <Ionicons name="checkmark-circle" size={24} color="#3498db" />
                  ) : (
                    <Ionicons name="radio-button-off" size={24} color="#bdc3c7" />
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Farmácia Filial Selecionada */}
        {selectedPartner && (
          <View style={styles.selectedSection}>
            <Text style={styles.sectionTitle}>Farmácia Filial Selecionada</Text>
            <View style={styles.selectedPartner}>
              <View style={styles.selectedPartnerIcon}>
                <Ionicons name="business" size={40} color="#3498db" />
              </View>
              
              <View style={styles.selectedPartnerInfo}>
                <View style={styles.selectedPartnerHeader}>
                  <Text style={styles.selectedPartnerName}>{getSelectedPartner()?.nome}</Text>
                </View>
                
                <View style={styles.selectedTypeBadge}>
                  <Ionicons name="storefront" size={12} color="white" />
                  <Text style={styles.selectedTypeText}>Farmácia Filial</Text>
                </View>
                
                <Text style={styles.selectedPartnerCity}>
                  <Ionicons name="location" size={14} color="#7f8c8d" /> {getSelectedPartner()?.cidade} - {getSelectedPartner()?.estado}
                </Text>
                
                <Text style={styles.selectedPartnerEmail}>
                  <Ionicons name="mail" size={14} color="#7f8c8d" /> {getSelectedPartner()?.email}
                </Text>
                
                <Text style={styles.selectedPartnerPhone}>
                  <Ionicons name="call" size={14} color="#7f8c8d" /> {getSelectedPartner()?.telefone}
                </Text>

                {getSelectedPartner()?.bairro && (
                  <Text style={styles.selectedPartnerNeighborhood}>
                    <Ionicons name="navigate" size={14} color="#7f8c8d" /> {getSelectedPartner()?.bairro}
                  </Text>
                )}

                {getSelectedPartner()?.endereco && (
                  <Text style={styles.selectedPartnerAddress}>
                    <Ionicons name="home" size={14} color="#7f8c8d" /> {getSelectedPartner()?.endereco}
                  </Text>
                )}

                {getSelectedPartner()?.descricao && (
                  <Text style={styles.selectedPartnerDescription}>
                    {getSelectedPartner()?.descricao}
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Botão de Edição */}
        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={[
              styles.editButton,
              !selectedPartner && styles.editButtonDisabled
            ]}
            onPress={handleEditPartner}
            disabled={!selectedPartner}
          >
            <Ionicons name="create" size={20} color="white" />
            <Text style={styles.editButtonText}>Editar Farmácia Filial Selecionada</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => router.push('/adm')}
          >
            <Text style={styles.cancelButtonText}>Voltar</Text>
          </TouchableOpacity>
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
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f4fd',
    padding: 12,
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  infoText: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 12,
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3498db',
  },
  refreshButtonText: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
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
    lineHeight: 20,
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
  partnerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#3498db',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  typeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  partnerCity: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  partnerEmail: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  partnerPhone: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  partnerNeighborhood: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  partnerDescription: {
    fontSize: 11,
    color: '#7f8c8d',
    fontStyle: 'italic',
    marginTop: 4,
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
  selectedPartnerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  selectedPartnerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  selectedTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#3498db',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 6,
  },
  selectedTypeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  selectedPartnerCity: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  selectedPartnerEmail: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  selectedPartnerPhone: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  selectedPartnerNeighborhood: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  selectedPartnerAddress: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  selectedPartnerDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
    marginTop: 6,
  },
  actionSection: {
    backgroundColor: 'white',
    padding: 20,
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  editButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  editButtonText: {
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
});