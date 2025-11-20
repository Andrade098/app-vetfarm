import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image, Modal, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.0.3:3000';

export default function AddProductScreen() {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [farmId, setFarmId] = useState<number | null>(null);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [subcategorias, setSubcategorias] = useState<any[]>([]);
  const [images, setImages] = useState<string[]>([]);
  
  // ✅ ESTADOS SEPARADOS: Produto geral + Farmácia-produto
  const [produtoData, setProdutoData] = useState({
    nome: '',
    categoria_id: '',
    subcategoria_id: '',
    descricao: '',
    imagens: []
  });

  const [farmaciaProdutoData, setFarmaciaProdutoData] = useState({
    preco_venda: '',
    estoque: '0'
  });

  const [showCategorias, setShowCategorias] = useState(false);
  const [showSubcategorias, setShowSubcategorias] = useState(false);

  // CARREGAR DADOS DA FARMÁCIA E CATEGORIAS
  // 📍 ADICIONE ISSO JUNTO AOS SEUS OUTROS USEEFFECTS:
// CARREGAR DADOS DA FARMÁCIA E CATEGORIAS
useEffect(() => {
  console.log('🔄 [ADD PRODUCT] useEffect executando...');
  loadFarmData();
  fetchCategorias();
}, []);


  const loadFarmData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      
      if (!userDataString) {
        Alert.alert('Erro', 'Dados do usuário não encontrados. Faça login novamente.');
        router.back();
        return;
      }

      const userData = JSON.parse(userDataString);
      console.log('🏪 [ADD PRODUCT] Farmácia logada:', userData);
      setFarmId(userData.id);
      
    } catch (error) {
      console.error('💥 Erro ao carregar dados da farmácia:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados da farmácia.');
    }
  };

  const fetchCategorias = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    
    console.log('🔐 [FETCH CATEGORIAS] Token:', token);
    console.log('🌐 [FETCH CATEGORIAS] URL:', `${API_URL}/api/produtos/categorias`);
    
    const response = await fetch(`${API_URL}/api/produtos/categorias`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    console.log('📡 [FETCH CATEGORIAS] Status:', response.status);
    console.log('📡 [FETCH CATEGORIAS] OK:', response.ok);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ [FETCH CATEGORIAS] Dados recebidos:', data);
      console.log('✅ [FETCH CATEGORIAS] Número de categorias:', data.categorias?.length);
      setCategorias(data.categorias);
    } else {
      const errorText = await response.text();
      console.log('❌ [FETCH CATEGORIAS] Erro:', response.status, errorText);
      Alert.alert('Erro', 'Não foi possível carregar as categorias');
    }
  } catch (error) {
    console.error('💥 [FETCH CATEGORIAS] Erro catch:', error);
    Alert.alert('Erro', 'Falha ao conectar com o servidor');
  }
};

  const fetchSubcategorias = async (categoriaId: number) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/api/produtos/subcategorias/${categoriaId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('🐾 Subcategorias carregadas:', data.subcategorias);
        setSubcategorias(data.subcategorias);
      } else {
        console.log('❌ Erro ao carregar subcategorias:', response.status);
        Alert.alert('Erro', 'Não foi possível carregar os animais');
      }
    } catch (error) {
      console.error('💥 Erro ao buscar subcategorias:', error);
      Alert.alert('Erro', 'Falha ao conectar com o servidor');
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria para adicionar imagens.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImages([...images, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem');
    }
  };

  const removeImage = (index: number) => {
    Alert.alert(
      'Remover Imagem',
      'Deseja remover esta imagem?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Remover', 
          style: 'destructive',
          onPress: () => {
            const newImages = images.filter((_, i) => i !== index);
            setImages(newImages);
          }
        }
      ]
    );
  };

  const handleProdutoChange = (field: string, value: string) => {
    setProdutoData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFarmaciaProdutoChange = (field: string, value: string) => {
    setFarmaciaProdutoData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const selectCategoria = (categoriaId: string) => {
    const id = parseInt(categoriaId);
    handleProdutoChange('categoria_id', categoriaId);
    setShowCategorias(false);
    
    // Limpar subcategoria selecionada e carregar novas subcategorias
    handleProdutoChange('subcategoria_id', '');
    setSubcategorias([]);
    
    if (id) {
      fetchSubcategorias(id);
    }
  };

  const selectSubcategoria = (subcategoriaId: string) => {
    handleProdutoChange('subcategoria_id', subcategoriaId);
    setShowSubcategorias(false);
  };

  const validateForm = () => {
    // ✅ Validar dados do produto
    if (!produtoData.nome.trim() || !produtoData.categoria_id || !produtoData.subcategoria_id) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios do produto');
      return false;
    }

    // ✅ Validar dados da farmácia-produto
    if (!farmaciaProdutoData.preco_venda) {
      Alert.alert('Erro', 'Digite o preço do produto');
      return false;
    }

    const price = parseFloat(farmaciaProdutoData.preco_venda.replace(',', '.'));
    if (isNaN(price) || price <= 0) {
      Alert.alert('Erro', 'Digite um preço válido');
      return false;
    }

    if (farmaciaProdutoData.estoque && (isNaN(parseInt(farmaciaProdutoData.estoque)) || parseInt(farmaciaProdutoData.estoque) < 0)) {
      Alert.alert('Erro', 'Digite um valor válido para o estoque');
      return false;
    }

    return true;
  };

  // ✅ NOVO FLUXO: Criar produto E vincular à farmácia
  const handleSubmit = async () => {
    console.log('🟡 [ADD PRODUCT] Iniciando processo de criação...');
    
    if (!validateForm()) {
      return;
    }

    if (images.length === 0) {
      Alert.alert(
        'Atenção', 
        'Deseja continuar sem adicionar imagens?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Continuar', onPress: createProductAndLink }
        ]
      );
      return;
    }

    createProductAndLink();
  };

  const createProductAndLink = async () => {
  try {
    setIsLoading(true);
    
    const token = await AsyncStorage.getItem('userToken');
    
    if (!token || !farmId) {
      Alert.alert('Erro', 'Dados de autenticação não encontrados');
      return;
    }

    // ✅ PASSO 1: Criar produto geral
    console.log('📤 [STEP 1] Criando produto geral em /api/produtos...');
    
    const productData = {
      nome: produtoData.nome.trim(),
      descricao: produtoData.descricao.trim(),
      categoria_id: parseInt(produtoData.categoria_id),
      subcategoria_id: parseInt(produtoData.subcategoria_id),
      imagens: images
    };

    const createResponse = await fetch(`${API_URL}/api/produtos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.log('❌ [STEP 1] Erro ao criar produto:', createResponse.status, errorText);
      Alert.alert('Erro', errorText || `Erro ${createResponse.status} ao criar produto`);
      return;
    }

    const createdProduct = await createResponse.json();
    console.log('✅ [STEP 1] Produto criado com ID:', createdProduct.produto.id);

    // ✅ PASSO 2: Vincular à farmácia - ⭐⭐ MUDANÇA AQUI ⭐⭐
    console.log('📤 [STEP 2] Vinculando produto em /api/farmacia-produtos...');
    
    const linkData = {
      farmacia_id: farmId,
      produto_id: createdProduct.produto.id,
      preco_venda: farmaciaProdutoData.preco_venda.replace(',', '.'),
      estoque: farmaciaProdutoData.estoque ? parseInt(farmaciaProdutoData.estoque) : 0
    };

    console.log('📤 [STEP 2] Dados do vínculo:', linkData);

    // ⭐⭐ MUDANÇA CRÍTICA: /produtos/farmacia → /farmacia-produtos
    const linkResponse = await fetch(`${API_URL}/api/farmacia-produtos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(linkData),
    });

    if (!linkResponse.ok) {
      const errorText = await linkResponse.text();
      console.log('❌ [STEP 2] Erro ao vincular produto:', linkResponse.status, errorText);
      
      if (linkResponse.status === 400) {
        Alert.alert('Atenção', 'Este produto já está cadastrado na sua farmácia');
      } else {
        Alert.alert('Erro', errorText || `Erro ${linkResponse.status} ao vincular produto à farmácia`);
      }
      return;
    }

    const linkResult = await linkResponse.json();
    console.log('✅ [STEP 2] Produto vinculado com sucesso!', linkResult);
    
    Alert.alert(
      'Sucesso', 
      'Produto criado e adicionado à farmácia com sucesso!',
      [{ text: 'OK', onPress: () => router.back() }]
    );

  } catch (error) {
    console.error('💥 [ADD PRODUCT] Erro catch:', error);
    Alert.alert('Erro', `Falha ao conectar com o servidor: ${error.message}`);
  } finally {
    setIsLoading(false);
  }
};

  const getCategoriaLabel = () => {
    if (!produtoData.categoria_id) return 'Selecione o tipo de produto';
    const categoria = categorias.find(cat => cat.id === parseInt(produtoData.categoria_id));
    return categoria ? categoria.nome : 'Selecione o tipo de produto';
  };

  const getSubcategoriaLabel = () => {
    if (!produtoData.subcategoria_id) return 'Selecione o animal';
    const subcategoria = subcategorias.find(sub => sub.id === parseInt(produtoData.subcategoria_id));
    return subcategoria ? subcategoria.nome : 'Selecione o animal';
  };

  // TELA DE CARREGAMENTO
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Criando produto...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Adicionar Produto',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
        }} 
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Seção de Imagens */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Imagens do Produto</Text>
          <Text style={styles.sectionSubtitle}>Adicione até 4 imagens do produto</Text>
          
          <ScrollView horizontal style={styles.imagesContainer} showsHorizontalScrollIndicator={false}>
            {images.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.image} />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close" size={16} color="white" />
                </TouchableOpacity>
              </View>
            ))}
            
            {images.length < 4 && (
              <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                <Ionicons name="camera" size={32} color="#3498db" />
                <Text style={styles.addImageText}>Adicionar Imagem</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

        {/* Informações Básicas do PRODUTO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações do Produto</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do Produto *</Text>
            <TextInput
              style={styles.input}
              value={produtoData.nome}
              onChangeText={(text) => handleProdutoChange('nome', text)}
              placeholder="Ex: Vacina contra Febre Aftosa"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Tipo de Produto *</Text>
              <TouchableOpacity 
                style={styles.selectContainer}
                onPress={() => setShowCategorias(true)}
              >
                <Text style={[
                  styles.selectText,
                  !produtoData.categoria_id && { color: '#999' }
                ]}>
                  {getCategoriaLabel()}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#7f8c8d" />
              </TouchableOpacity>
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Animal *</Text>
              <TouchableOpacity 
                style={[
                  styles.selectContainer,
                  !produtoData.categoria_id && styles.selectDisabled
                ]}
                onPress={() => setShowSubcategorias(true)}
                disabled={!produtoData.categoria_id}
              >
                <Text style={[
                  styles.selectText,
                  !produtoData.subcategoria_id && { color: '#999' }
                ]}>
                  {getSubcategoriaLabel()}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#7f8c8d" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição do Produto</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={produtoData.descricao}
              onChangeText={(text) => handleProdutoChange('descricao', text)}
              placeholder="Descreva as características, indicações e modo de uso do produto..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* ✅ NOVA SEÇÃO: Preço e Estoque na FARMÁCIA */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preço e Estoque na Sua Farmácia</Text>
          
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Preço de Venda (R$) *</Text>
              <TextInput
                style={styles.input}
                value={farmaciaProdutoData.preco_venda}
                onChangeText={(text) => handleFarmaciaProdutoChange('preco_venda', text)}
                placeholder="0.00"
                placeholderTextColor="#999"
                keyboardType="decimal-pad"
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Estoque Inicial</Text>
              <TextInput
                style={styles.input}
                value={farmaciaProdutoData.estoque}
                onChangeText={(text) => handleFarmaciaProdutoChange('estoque', text)}
                placeholder="0"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Botão de Submit */}
        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={[
              styles.submitButton,
              (!produtoData.nome || !produtoData.categoria_id || !produtoData.subcategoria_id || !farmaciaProdutoData.preco_venda) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!produtoData.nome || !produtoData.categoria_id || !produtoData.subcategoria_id || !farmaciaProdutoData.preco_venda || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="add-circle" size={20} color="white" />
            )}
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Criando...' : 'Criar Produto'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => router.back()}
            disabled={isLoading}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modais (mantidos iguais) */}
      <Modal visible={showCategorias} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tipo de Produto</Text>
              <TouchableOpacity onPress={() => setShowCategorias(false)}>
                <Ionicons name="close" size={24} color="#7f8c8d" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScrollView}>
              {categorias.map((categoria) => (
                <TouchableOpacity
                  key={categoria.id}
                  style={styles.modalOption}
                  onPress={() => selectCategoria(categoria.id.toString())}
                >
                  <Text style={styles.modalOptionText}>{categoria.nome}</Text>
                  {produtoData.categoria_id === categoria.id.toString() && (
                    <Ionicons name="checkmark" size={20} color="#3498db" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={showSubcategorias} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Animal</Text>
              <TouchableOpacity onPress={() => setShowSubcategorias(false)}>
                <Ionicons name="close" size={24} color="#7f8c8d" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScrollView}>
              {subcategorias.map((subcategoria) => (
                <TouchableOpacity
                  key={subcategoria.id}
                  style={styles.modalOption}
                  onPress={() => selectSubcategoria(subcategoria.id.toString())}
                >
                  <Text style={styles.modalOptionText}>{subcategoria.nome}</Text>
                  {produtoData.subcategoria_id === subcategoria.id.toString() && (
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

// Styles (mantidos iguais)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#7f8c8d' },
  scrollView: { flex: 1 },
  section: { backgroundColor: 'white', padding: 20, marginTop: 10, marginHorizontal: 10, marginBottom: 10, borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginBottom: 5 },
  sectionSubtitle: { fontSize: 12, color: '#7f8c8d', marginBottom: 15 },
  imagesContainer: { flexDirection: 'row', marginBottom: 10 },
  imageWrapper: { position: 'relative', marginRight: 10 },
  image: { width: 100, height: 100, borderRadius: 8, backgroundColor: '#ecf0f1' },
  removeImageButton: { position: 'absolute', top: -8, right: -8, backgroundColor: '#e74c3c', borderRadius: 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'white' },
  addImageButton: { width: 100, height: 100, borderWidth: 2, borderColor: '#3498db', borderStyle: 'dashed', borderRadius: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' },
  addImageText: { fontSize: 12, color: '#3498db', marginTop: 5, textAlign: 'center' },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: '600', color: '#2c3e50', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: 'white', color: '#2c3e50' },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  selectContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, backgroundColor: 'white' },
  selectDisabled: { backgroundColor: '#f8f9fa', borderColor: '#ecf0f1' },
  selectText: { fontSize: 16, color: '#2c3e50' },
  actionSection: { backgroundColor: 'white', padding: 20, marginTop: 10, marginHorizontal: 10, marginBottom: 20 },
  submitButton: { flexDirection: 'row', backgroundColor: '#2ecc71', padding: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  submitButtonDisabled: { backgroundColor: '#bdc3c7' },
  submitButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
  cancelButton: { padding: 16, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#bdc3c7' },
  cancelButtonText: { color: '#7f8c8d', fontSize: 16, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '60%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#ecf0f1' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50' },
  modalScrollView: { maxHeight: 400 },
  modalOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#ecf0f1' },
  modalOptionText: { fontSize: 16, color: '#2c3e50' },
});