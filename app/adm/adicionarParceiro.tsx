import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image, Modal, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⭐⭐ CONSTANTE PARA IP DO SERVIDOR ⭐⭐
const API_URL = 'http://192.168.0.2:3000';

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

export default function AddPartnerScreen() {
  const router = useRouter();
  
  // ESTADOS PARA PROTEÇÃO
  const [isLoading, setIsLoading] = useState(true);
  // 🔍 Debug temporário - REMOVA depois
useEffect(() => {
  const checkToken = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const userData = await AsyncStorage.getItem('userData');
    console.log('🔍 Debug - Token:', token);
    console.log('🔍 Debug - UserData:', userData);
  };
  checkToken();
}, []);
  const [isMatriz, setIsMatriz] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  // Estados existentes
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    endereco: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    telefone: '',
    email: '',
    senha: '',
    confirmPassword: ''
  });
  const [showStates, setShowStates] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 🔍 🔍 🔍 DEBUG TEMPORÁRIO - ADICIONE ESTAS LINHAS 🔍 🔍 🔍
useEffect(() => {
  const checkToken = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const userData = await AsyncStorage.getItem('userData');
    console.log('🔍 [ADD] Debug - Token:', token);
    console.log('🔍 [ADD] Debug - UserData:', userData);
  };
  checkToken();
}, []);
// 🔍 🔍 🔍 FIM DO DEBUG 🔍 🔍 🔍

  // VERIFICAR SE É MATRIZ AO CARREGAR A TELA
  useEffect(() => {
    checkUserType();
  }, []);

  const checkUserType = async () => {
  try {
    setIsLoading(true);
    
    const token = await AsyncStorage.getItem('userToken');
    const userDataString = await AsyncStorage.getItem('userData');
    
    console.log('🔐 Token:', token ? `Presente (${token.length} chars)` : 'Ausente');
    console.log('👤 UserData:', userDataString);

    if (!token || !userDataString) {
      Alert.alert('Sessão Expirada', 'Por favor, faça login novamente.');
      setAccessDenied(true);
      return;
    }

    // ✅ USA OS DADOS DO USERDATA - NÃO PRECISA DA API
    const userData = JSON.parse(userDataString);
    console.log('✅ Tipo do usuário:', userData.tipo);
    
    const isUserMatriz = userData.tipo === 'matriz';
    setIsMatriz(isUserMatriz);
    
    if (!isUserMatriz) {
      Alert.alert('Acesso Negado', 'Somente farmácias matriz podem adicionar parceiros.');
      setAccessDenied(true);
    }
    // Se for matriz, o acesso é permitido automaticamente

  } catch (error) {
    console.error('💥 Erro ao verificar permissões:', error);
    Alert.alert('Erro', 'Não foi possível verificar suas permissões.');
    setAccessDenied(true);
  } finally {
    setIsLoading(false);
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
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
  };

  const formatZipCode = (text: string) => {
    const numbers = text.replace(/\D/g, '');
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhone(text);
    handleInputChange('telefone', formatted);
  };

  const handleZipCodeChange = (text: string) => {
    const formatted = formatZipCode(text);
    handleInputChange('cep', formatted);
  };

  const handleSubmit = () => {
  console.log('🟡 1. handleSubmit foi chamado');
  
  // Validações
  if (!formData.nome || !formData.endereco || !formData.cidade || !formData.estado || !formData.telefone || !formData.email || !formData.senha) {
    console.log('❌ Campos obrigatórios faltando');
    console.log('📋 Campos:', {
      nome: formData.nome,
      endereco: formData.endereco,
      cidade: formData.cidade,
      estado: formData.estado,
      telefone: formData.telefone,
      email: formData.email,
      senha: formData.senha ? 'preenchida' : 'vazia'
    });
    Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    console.log('❌ Email inválido:', formData.email);
    Alert.alert('Erro', 'Digite um email válido');
    return;
  }

  if (formData.senha.length < 6) {
    console.log('❌ Senha muito curta:', formData.senha.length);
    Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
    return;
  }

  if (formData.senha !== formData.confirmPassword) {
    console.log('❌ Senhas não coincidem');
    Alert.alert('Erro', 'As senhas não coincidem');
    return;
  }

  console.log('✅ 2. Todas as validações passaram');
  console.log('📤 3. Chamando submitPartner...');

  submitPartner();
};

 const submitPartner = async () => {
  try {
    console.log('🟡 4. submitPartner iniciado');
    setIsLoading(true);
    
    const token = await AsyncStorage.getItem('userToken');
    const { confirmPassword, ...partnerData } = formData;
    
    console.log('📤 5. Dados sendo enviados:', partnerData);
    console.log('🔐 6. Token:', token ? `Presente (${token.length} chars)` : 'Ausente');

    const response = await fetch(`${API_URL}/api/farmacias/parceiros/novo`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(partnerData),
    });

    console.log('📡 7. Status da resposta:', response.status);
    console.log('📡 8. OK:', response.ok);

    if (response.ok) {
      console.log('✅ 9. Sucesso! Farmácia adicionada');
      Alert.alert('Sucesso', 'Farmácia parceira adicionada com sucesso!');
      router.back();
    } else {
      const errorText = await response.text();
      console.log('❌ 10. Erro no servidor:', response.status, errorText);
      Alert.alert('Erro', errorText || `Erro ${response.status} ao adicionar parceiro`);
    }
  } catch (error) {
    console.error('💥 11. Erro catch:', error);
    Alert.alert('Erro', `Falha ao conectar com o servidor: ${error.message}`);
  } finally {
    console.log('🟡 12. Finalizando submitPartner');
    setIsLoading(false);
  }
};

  const getStateLabel = () => {
    return states.find(state => state.value === formData.estado)?.label || 'Selecione o estado';
  };

  // TELA DE CARREGAMENTO

// TELA DE CARREGAMENTO
if (isLoading) {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#3498db" />
      <Text style={styles.loadingText}>Verificando permissões...</Text>
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
          Somente farmácias matriz podem acessar esta funcionalidade.
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
          title: 'Adicionar Parceiro',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
        }} 
      />

      <ScrollView style={styles.scrollView}>
      
    

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
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.descricao}
              onChangeText={(text) => handleInputChange('descricao', text)}
              placeholder="Descreva os serviços e especialidades da farmácia..."
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
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Cidade *</Text>
              <TextInput
                style={styles.input}
                value={formData.cidade}
                onChangeText={(text) => handleInputChange('cidade', text)}
                placeholder="Ex: São Paulo"
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
                <Text style={styles.selectText}>
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
                keyboardType="phone-pad"
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                placeholder="contato@exemplo.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>
        </View>

        {/* Credenciais de Acesso */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Credenciais de Acesso</Text>
          <Text style={styles.sectionSubtitle}>Estas credenciais serão usadas para acessar o sistema</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email de Acesso *</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha *</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                value={formData.senha}
                onChangeText={(text) => handleInputChange('senha', text)}
                placeholder="Digite sua senha"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? "eye-off" : "eye"} 
                  size={20} 
                  color="#7f8c8d" 
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.passwordHint}>A senha deve ter pelo menos 6 caracteres</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmar Senha *</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                value={formData.confirmPassword}
                onChangeText={(text) => handleInputChange('confirmPassword', text)}
                placeholder="Confirme sua senha"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons 
                  name={showConfirmPassword ? "eye-off" : "eye"} 
                  size={20} 
                  color="#7f8c8d" 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Botão de Submit */}
        <TouchableOpacity 
  style={[styles.submitButton, isLoading && styles.submitButtonDisabled]} 
  onPress={() => {
    console.log('🟢 BOTÃO CLICADO!');
    handleSubmit();
  }}
  disabled={isLoading}
>
  {isLoading ? (
    <Text style={styles.submitButtonText}>Adicionando...</Text>
  ) : (
    <Text style={styles.submitButtonText}>Adicionar Farmácia Parceira</Text>
  )}
</TouchableOpacity>
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
            <ScrollView>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 15,
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
  sectionSubtitle: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 15,
  },
  imagesContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#ecf0f1',
  },
  removeImageButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: '#3498db',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
  },
  addImageText: {
    fontSize: 12,
    color: '#3498db',
    marginTop: 5,
    textAlign: 'center',
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
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
    zIndex: 1,
  },
  passwordHint: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: '#2ecc71',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: '#95a5a6',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
    maxHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#2c3e50',
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