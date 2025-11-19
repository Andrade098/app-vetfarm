import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal, ActivityIndicator } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⭐⭐ CONSTANTE PARA IP DO SERVIDOR ⭐⭐
const API_URL = 'http://192.168.0.3:3000';

const states = [
  { label: 'Acre', value: 'AC' },
  { label: 'Alagoas', value: 'AL' },
  { label: 'Amapá', value: 'AP' },
  { label: 'Amazonas', value: 'AM' },
  { label: 'Bahia', value: 'BA' },
  { label: 'Ceará', value: 'CE' },
  { label: 'Distrito Federal', value: 'DF' },
  { label: 'Espírito Santo', value: 'ES' },
  { label: 'Goiás', value: 'GO' },
  { label: 'Maranhão', value: 'MA' },
  { label: 'Mato Grosso', value: 'MT' },
  { label: 'Mato Grosso do Sul', value: 'MS' },
  { label: 'Minas Gerais', value: 'MG' },
  { label: 'Pará', value: 'PA' },
  { label: 'Paraíba', value: 'PB' },
  { label: 'Paraná', value: 'PR' },
  { label: 'Pernambuco', value: 'PE' },
  { label: 'Piauí', value: 'PI' },
  { label: 'Rio de Janeiro', value: 'RJ' },
  { label: 'Rio Grande do Norte', value: 'RN' },
  { label: 'Rio Grande do Sul', value: 'RS' },
  { label: 'Rondônia', value: 'RO' },
  { label: 'Roraima', value: 'RR' },
  { label: 'Santa Catarina', value: 'SC' },
  { label: 'São Paulo', value: 'SP' },
  { label: 'Sergipe', value: 'SE' },
  { label: 'Tocantins', value: 'TO' }
];

export default function EditPartnerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const partnerId = params.id ? parseInt(params.id as string) : null;

   // 🔍 DEBUG - Adicione estas linhas:
  console.log('🔍 [EDIT] Params recebidos:', params);
  console.log('🔍 [EDIT] partnerId:', partnerId);
  console.log('🔍 [EDIT] Tipo do partnerId:', typeof partnerId);

  // ESTADOS PARA PROTEÇÃO
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isMatriz, setIsMatriz] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  // Estados existentes
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    endereco: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    telefone: '',
    email: ''
  });
  const [showStates, setShowStates] = useState(false);
  
  
  // 🔍 🔍 🔍 DEBUG TEMPORÁRIO - ADICIONE ESTAS LINHAS 🔍 🔍 🔍
useEffect(() => {
  const checkToken = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const userData = await AsyncStorage.getItem('userData');
    console.log('🔍 [EDIT] Debug - Token:', token);
    console.log('🔍 [EDIT] Debug - UserData:', userData);
  };
  checkToken();
}, []);
// 🔍 🔍 🔍 FIM DO DEBUG 🔍 🔍 🔍

  // VERIFICAR SE É MATRIZ E CARREGAR DADOS
  useEffect(() => {
    checkUserPermissions();
  }, []);

  const checkUserPermissions = async () => {
  try {
    setIsLoading(true);
    
    const token = await AsyncStorage.getItem('userToken');
    const userDataString = await AsyncStorage.getItem('userData');
    
    console.log('🔐 [EDIT] Token:', token ? `Presente (${token.length} chars)` : 'Ausente');
    console.log('👤 [EDIT] UserData:', userDataString);

    if (!token || !userDataString) {
      Alert.alert('Sessão Expirada', 'Por favor, faça login novamente.');
      setAccessDenied(true);
      return;
    }

    // ✅ USA OS DADOS DO USERDATA - NÃO PRECISA DA API
    const userData = JSON.parse(userDataString);
    console.log('✅ [EDIT] Tipo do usuário:', userData.tipo);
    
    const isUserMatriz = userData.tipo === 'matriz';
    setIsMatriz(isUserMatriz);
    
    if (!isUserMatriz) {
      console.log('❌ [EDIT] Usuário não é matriz');
      Alert.alert('Acesso Negado', 'Somente farmácias matriz podem editar parceiros.');
      setAccessDenied(true);
    } else {
      console.log('✅ [EDIT] Usuário é matriz, carregando dados...');
      await loadPartnerData();
    }

  } catch (error) {
    console.error('💥 [EDIT] Erro ao verificar permissões:', error);
    Alert.alert('Erro', 'Não foi possível verificar suas permissões.');
    setAccessDenied(true);
  } finally {
    setIsLoading(false);
  }
};

  // CARREGAR DADOS DO PARCEIRO
 const loadPartnerData = async () => {
  try {
    if (!partnerId) {
      console.log('❌ ID do parceiro não encontrado');
      Alert.alert('Erro', 'ID do parceiro não encontrado');
      router.push('/listarParceiro');
      return;
    }

    console.log('🟡 Carregando dados do parceiro ID:', partnerId);

    const token = await AsyncStorage.getItem('userToken');
    console.log('🔐 Token:', token ? `Presente (${token.length} chars)` : 'Ausente');

    // ✅✅✅ CORREÇÃO: Use o endpoint de listar parceiros para carregar os dados
    const endpoint = `${API_URL}/api/farmacias/parceiros/todos`;
    console.log('🌐 Endpoint para carregar dados:', endpoint);

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
      const parceiros = await response.json();
      console.log('✅ Lista de parceiros recebida:', parceiros);
      
      // Encontrar o parceiro específico pelo ID
      const partnerData = parceiros.find((p: any) => p.id === partnerId);
      
      if (partnerData) {
        console.log('✅ Dados do parceiro encontrado:', partnerData);
        
        setFormData({
          nome: partnerData.nome || '',
          descricao: partnerData.descricao || '',
          endereco: partnerData.endereco || '',
          bairro: partnerData.bairro || '',
          cidade: partnerData.cidade || '',
          estado: partnerData.estado || '',
          cep: partnerData.cep || '',
          telefone: partnerData.telefone || '',
          email: partnerData.email || ''
        });
        
        console.log('✅ Formulário preenchido com sucesso');
      } else {
        console.log('❌ Parceiro não encontrado na lista');
        Alert.alert('Erro', 'Farmácia parceira não encontrada.');
        router.push('/listarParceiro');
      }
      
    } else if (response.status === 403) {
      console.log('❌ Acesso negado (403)');
      setAccessDenied(true);
      Alert.alert('Acesso Negado', 'Você não tem permissão para visualizar parceiros.');
    } else {
      const errorText = await response.text();
      console.log('❌ Erro desconhecido:', response.status, errorText);
      Alert.alert('Erro', `Falha ao carregar dados: ${response.status}`);
    }
  } catch (error) {
    console.error('💥 Erro ao carregar dados:', error);
    Alert.alert('Erro', 'Falha ao conectar com o servidor.');
  }
};

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const selectState = (value: string) => {
    handleInputChange('estado', value);
    setShowStates(false);
  };

  const formatPhone = (text: string) => {
    const numbers = text.replace(/\D/g, '');
    
    if (numbers.length === 0) return '';
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const formatZipCode = (text: string) => {
    const numbers = text.replace(/\D/g, '');
    
    if (numbers.length === 0) return '';
    if (numbers.length <= 5) return numbers;
    
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhone(text);
    handleInputChange('telefone', formatted);
  };

  const handleZipCodeChange = (text: string) => {
    const formatted = formatZipCode(text);
    handleInputChange('cep', formatted);
  };

  const validateForm = () => {
    const requiredFields = ['nome', 'endereco', 'cidade', 'estado', 'telefone', 'email'];
    const emptyFields = requiredFields.filter(field => !formData[field as keyof typeof formData].trim());
    
    if (emptyFields.length > 0) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios (*)');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Erro', 'Digite um email válido');
      return false;
    }

    const phoneNumbers = formData.telefone.replace(/\D/g, '');
    if (phoneNumbers.length < 10) {
      Alert.alert('Erro', 'Digite um telefone válido com DDD');
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
  console.log('🟡 [DEBUG] === BOTÃO SALVAR CLICADO ===');
  console.log('🟡 [DEBUG] Validando formulário...');
  
  if (!validateForm()) {
    console.log('❌ [DEBUG] Formulário inválido - validação falhou');
    return;
  }

  console.log('✅ [DEBUG] Formulário válido - mostrando confirmação...');
  
console.log('🟡 [DEBUG] Chamando submitChanges diretamente (sem confirmação)...');
  submitChanges();

  /*
  Alert.alert(
    'Confirmar Alterações',
    'Deseja salvar as alterações nesta farmácia parceira?',
    [
      { 
        text: 'Cancelar', 
        style: 'cancel',
        onPress: () => console.log('❌ [DEBUG] Usuário cancelou a edição')
      },
      { 
        text: 'Salvar', 
        onPress: () => {
          console.log('✅ [DEBUG] Usuário confirmou - chamando submitChanges()');
          submitChanges();
        }
      }
    ]
  );*/
};

  const submitChanges = async () => {
  try {
    setIsSaving(true);
    
    console.log('🔍 [DEBUG] === INICIANDO SUBMIT CHANGES ===');
    
    const token = await AsyncStorage.getItem('userToken');
    console.log('🔐 [DEBUG] Token:', token ? `Presente (${token.substring(0, 20)}...` : 'AUSENTE');
    
    if (!token) {
      Alert.alert('Erro', 'Token de autenticação não encontrado');
      return;
    }

    const partnerData = {
      nome: formData.nome.trim(),
      descricao: formData.descricao.trim(),
      endereco: formData.endereco.trim(),
      bairro: formData.bairro.trim(),
      cidade: formData.cidade.trim(),
      estado: formData.estado,
      cep: formData.cep.replace(/\D/g, ''),
      telefone: formData.telefone.replace(/\D/g, ''),
      email: formData.email.trim().toLowerCase()
    };

    console.log('📝 [DEBUG] Dados a serem enviados:', JSON.stringify(partnerData, null, 2));
    console.log('🆔 [DEBUG] Partner ID:', partnerId);

    // ✅ Endpoint correto baseado nas suas rotas
    const endpoint = `${API_URL}/api/farmacias/parceiros/${partnerId}/editar`;
    console.log('🌐 [DEBUG] Endpoint:', endpoint);

    console.log('🟡 [DEBUG] Fazendo requisição PUT...');
    
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(partnerData),
    });

    console.log('📡 [DEBUG] Resposta recebida - Status:', response.status);
    console.log('📡 [DEBUG] Resposta OK:', response.ok);

    // Tentar ler a resposta independente do status
    let responseBody;
    try {
      responseBody = await response.text();
      console.log('📄 [DEBUG] Corpo da resposta:', responseBody);
      
      // Tentar parsear como JSON se possível
      if (responseBody) {
        try {
          const jsonResponse = JSON.parse(responseBody);
          console.log('📄 [DEBUG] Resposta JSON:', jsonResponse);
        } catch (e) {
          console.log('📄 [DEBUG] Resposta não é JSON');
        }
      }
    } catch (e) {
      console.log('❌ [DEBUG] Erro ao ler resposta:', e);
    }

    if (response.ok) {
      console.log('✅ [DEBUG] ATUALIZAÇÃO BEM-SUCEDIDA!');
      Alert.alert(
        'Sucesso', 
        'Farmácia parceira atualizada com sucesso!',
        [{ text: 'OK', onPress: () => router.push('/listarParceiro') }] // ✅ ALTERADO
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
        Alert.alert('Acesso Negado', 'Você não tem permissão para editar parceiros');
        setAccessDenied(true);
        break;
      case 404:
        Alert.alert('Erro', 'Farmácia parceira não encontrada');
        break;
      case 500:
        Alert.alert('Erro', 'Erro interno do servidor');
        break;
      default:
        Alert.alert('Erro', `Erro ${response.status} ao atualizar parceiro`);
    }

  } catch (error) {
    console.error('💥 [DEBUG] Erro na requisição:', error);
    Alert.alert('Erro', 'Falha ao conectar com o servidor: ' + (error.message || 'Verifique sua conexão de internet'));
  } finally {
    console.log('🔍 [DEBUG] === FINALIZANDO SUBMIT CHANGES ===');
    setIsSaving(false);
  }
};
  const getStateLabel = () => {
    const state = states.find(state => state.value === formData.estado);
    return state ? state.label : 'Selecione o estado';
  };

  // TELA DE CARREGAMENTO
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Carregando dados...</Text>
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
          Somente farmácias matriz podem editar parceiros.
        </Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.push('/listarParceiro')} // ✅ ALTERADO
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
          title: 'Editar Parceiro',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
        }} 
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Cabeçalho com ID do parceiro */}
        <View style={styles.headerSection}>
          <Text style={styles.partnerId}>ID: #{partnerId}</Text>
          <Text style={styles.lastUpdate}>Editando farmácia parceira</Text>
        </View>

        {/* Informações Básicas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Básicas</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome da Farmácia *</Text>
            <TextInput
              style={styles.input}
              value={formData.nome}
              onChangeText={(text) => handleInputChange('nome', text)}
              placeholder="Ex: Farmácia Veterinária Central"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.descricao}
              onChangeText={(text) => handleInputChange('descricao', text)}
              placeholder="Descreva os serviços e especialidades da farmácia..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Endereço */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Endereço</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Endereço *</Text>
            <TextInput
              style={styles.input}
              value={formData.endereco}
              onChangeText={(text) => handleInputChange('endereco', text)}
              placeholder="Ex: Rua das Flores, 123"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Bairro</Text>
              <TextInput
                style={styles.input}
                value={formData.bairro}
                onChangeText={(text) => handleInputChange('bairro', text)}
                placeholder="Ex: Centro"
                placeholderTextColor="#999"
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Cidade *</Text>
              <TextInput
                style={styles.input}
                value={formData.cidade}
                onChangeText={(text) => handleInputChange('cidade', text)}
                placeholder="Ex: São Paulo"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Estado *</Text>
              <TouchableOpacity 
                style={styles.selectContainer}
                onPress={() => setShowStates(true)}
              >
                <Text style={[
                  styles.selectText,
                  !formData.estado && { color: '#999' }
                ]}>
                  {getStateLabel()}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#7f8c8d" />
              </TouchableOpacity>
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>CEP</Text>
              <TextInput
                style={styles.input}
                value={formData.cep}
                onChangeText={handleZipCodeChange}
                placeholder="00000-000"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={9}
              />
            </View>
          </View>
        </View>

        {/* Contato */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contato</Text>
          
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Telefone *</Text>
              <TextInput
                style={styles.input}
                value={formData.telefone}
                onChangeText={handlePhoneChange}
                placeholder="(00) 00000-0000"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                maxLength={15}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                placeholder="contato@exemplo.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>
        </View>

        {/* Botões de Ação */}
        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={[
              styles.saveButton, 
              (isSaving || !formData.nome || !formData.endereco || !formData.cidade || !formData.estado || !formData.telefone || !formData.email) && styles.saveButtonDisabled
            ]} 
            onPress={handleSubmit}
            disabled={isSaving || !formData.nome || !formData.endereco || !formData.cidade || !formData.estado || !formData.telefone || !formData.email}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="save" size={20} color="white" />
            )}
            <Text style={styles.saveButtonText}>
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => router.push('/adm/listarParceiro')} // ✅ ALTERADO
            disabled={isSaving}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal para Estados */}
      <Modal
        visible={showStates}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowStates(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione o Estado</Text>
              <TouchableOpacity onPress={() => setShowStates(false)}>
                <Ionicons name="close" size={24} color="#7f8c8d" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScrollView}>
              {states.map((state) => (
                <TouchableOpacity
                  key={state.value}
                  style={styles.modalOption}
                  onPress={() => selectState(state.value)}
                >
                  <Text style={styles.modalOptionText}>{state.label}</Text>
                  {formData.estado === state.value && (
                    <Ionicons name="checkmark" size={20} color="#3498db" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ... (os estyles permanecem os mesmos)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  scrollView: {
    flex: 1,
  },
  headerSection: {
    backgroundColor: 'white',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  partnerId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  lastUpdate: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 10,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#2c3e50',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'white',
  },
  selectText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  actionSection: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 10,
    marginHorizontal: 10,
    marginBottom: 20,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  saveButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  saveButtonText: {
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
    backgroundColor: 'white',
  },
  cancelButtonText: {
    color: '#7f8c8d',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  modalScrollView: {
    maxHeight: 400,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#2c3e50',
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
    lineHeight: 22,
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