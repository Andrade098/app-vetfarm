import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Dados simulados de farmácias parceiras
const mockPartners = [
  {
    id: 1,
    name: 'Farmácia Veterinária Central',
    category: 'Farmácia - Premium',
    address: 'Rua das Flores, 123 - Centro',
    city: 'São Paulo - SP',
    phone: '(11) 9999-9999',
    email: 'contato@farmaciacentral.com.br',
    rating: 4.8,
    productsCount: 45,
    image: 'https://via.placeholder.com/100',
    description: 'Farmácia especializada em produtos veterinários com entrega rápida'
  },
  {
    id: 2,
    name: 'DrogaVet Express',
    category: 'Farmácia - Express',
    address: 'Av. Principal, 456 - Jardim',
    city: 'Rio de Janeiro - RJ',
    phone: '(21) 8888-8888',
    email: 'sac@drogavet.com.br',
    rating: 4.5,
    productsCount: 32,
    image: 'https://via.placeholder.com/100',
    description: 'Atendimento 24h com entrega em toda região metropolitana'
  },
  {
    id: 3,
    name: 'VetFarm Parceira',
    category: 'Farmácia - Standard',
    address: 'Rua dos Animais, 789 - Zona Rural',
    city: 'Campinas - SP',
    phone: '(19) 7777-7777',
    email: 'vendas@vetfarm.com.br',
    rating: 4.2,
    productsCount: 28,
    image: 'https://via.placeholder.com/100',
    description: 'Especializada em produtos para grandes animais'
  },
  {
    id: 4,
    name: 'Farmácia do Campo',
    category: 'Farmácia - Rural',
    address: 'Estrada Rural, S/N - Fazenda',
    city: 'Ribeirão Preto - SP',
    phone: '(16) 6666-6666',
    email: 'campo@farmaciadocampo.com.br',
    rating: 4.7,
    productsCount: 38,
    image: 'https://via.placeholder.com/100',
    description: 'Atendimento especializado para produtores rurais'
  },
  {
    id: 5,
    name: 'PetVet Solutions',
    category: 'Farmácia - Pet',
    address: 'Alameda Pets, 321 - Pet Center',
    city: 'Belo Horizonte - MG',
    phone: '(31) 5555-5555',
    email: 'solutions@petvet.com.br',
    rating: 4.9,
    productsCount: 52,
    image: 'https://via.placeholder.com/100',
    description: 'Produtos de alta qualidade para pets e animais de produção'
  },
  {
    id: 6,
    name: 'AgroFarmácia Brasil',
    category: 'Farmácia - Agro',
    address: 'Rodovia BR-101, Km 205',
    city: 'Porto Alegre - RS',
    phone: '(51) 4444-4444',
    email: 'brasil@agrofarmacia.com.br',
    rating: 4.6,
    productsCount: 41,
    image: 'https://via.placeholder.com/100',
    description: 'Distribuidora autorizada dos principais laboratórios'
  }
];

export default function DeletePartnerScreen() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<number | null>(null);
  const [partners, setPartners] = useState(mockPartners);

  const filteredPartners = partners.filter(partner =>
    partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.category.toLowerCase().includes(searchTerm.toLowerCase())
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
      `Tem certeza que deseja excluir permanentemente a farmácia parceira "${partner?.name}"?\n\nEsta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => deletePartner(selectedPartner)
        }
      ]
    );
  };

  const deletePartner = (partnerId: number) => {
    // Simulando exclusão - na prática, você faria uma chamada API aqui
    setPartners(partners.filter(partner => partner.id !== partnerId));
    setSelectedPartner(null);
    
    Alert.alert('Sucesso', 'Farmácia parceira excluída com sucesso!');
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

      <ScrollView style={styles.scrollView}>
        {/* Barra de Pesquisa */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#7f8c8d" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar farmácia por nome, cidade ou categoria..."
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
                Tente buscar por outro termo ou verifique a ortografia
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
                <Image source={{ uri: partner.image }} style={styles.partnerImage} />
                
                <View style={styles.partnerInfo}>
                  <Text style={styles.partnerName} numberOfLines={1}>
                    {partner.name}
                  </Text>
                  <Text style={styles.partnerCategory}>{partner.category}</Text>
                  
                  {renderStars(partner.rating)}
                  
                  <View style={styles.partnerContact}>
                    <Ionicons name="location" size={12} color="#7f8c8d" />
                    <Text style={styles.partnerAddress} numberOfLines={1}>
                      {partner.address}, {partner.city}
                    </Text>
                  </View>
                  
                  <View style={styles.partnerContact}>
                    <Ionicons name="call" size={12} color="#7f8c8d" />
                    <Text style={styles.partnerPhone}>{partner.phone}</Text>
                  </View>

                  <Text style={styles.partnerDescription} numberOfLines={2}>
                    {partner.description}
                  </Text>
                  
                  <View style={styles.partnerDetails}>
                    <Text style={styles.productsCount}>
                      {partner.productsCount} produtos
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
              <Image source={{ uri: getSelectedPartner()?.image }} style={styles.selectedPartnerImage} />
              
              <View style={styles.selectedPartnerInfo}>
                <Text style={styles.selectedPartnerName}>{getSelectedPartner()?.name}</Text>
                <Text style={styles.selectedPartnerCategory}>{getSelectedPartner()?.category}</Text>
                
                {getSelectedPartner() && renderStars(getSelectedPartner().rating)}
                
                <View style={styles.selectedPartnerContact}>
                  <Ionicons name="location" size={14} color="#7f8c8d" />
                  <Text style={styles.selectedPartnerAddress}>
                    {getSelectedPartner()?.address}, {getSelectedPartner()?.city}
                  </Text>
                </View>
                
                <View style={styles.selectedPartnerContact}>
                  <Ionicons name="call" size={14} color="#7f8c8d" />
                  <Text style={styles.selectedPartnerPhone}>{getSelectedPartner()?.phone}</Text>
                </View>

                <View style={styles.selectedPartnerContact}>
                  <Ionicons name="mail" size={14} color="#7f8c8d" />
                  <Text style={styles.selectedPartnerEmail}>{getSelectedPartner()?.email}</Text>
                </View>

                <Text style={styles.selectedPartnerDescription}>
                  {getSelectedPartner()?.description}
                </Text>
                
                <View style={styles.selectedPartnerDetails}>
                  <Text style={styles.selectedProductsCount}>
                    {getSelectedPartner()?.productsCount} produtos cadastrados
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
              !selectedPartner && styles.deleteButtonDisabled
            ]}
            onPress={confirmDelete}
            disabled={!selectedPartner}
          >
            <Ionicons name="trash" size={20} color="white" />
            <Text style={styles.deleteButtonText}>Excluir Farmácia Parceira</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
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
});