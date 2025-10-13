import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image, Modal } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

// Opções para os selects
const animalCategories = [
  { label: 'Bovinos', value: 'bovinos' },
  { label: 'Equinos', value: 'equinos' },
  { label: 'Ovinos', value: 'ovinos' },
  { label: 'Suínos', value: 'suinos' },
  { label: 'Peixes', value: 'peixes' },
  { label: 'Aves', value: 'aves' }
];

const productCategories = [
  { label: 'Vacinas', value: 'vacinas' },
  { label: 'Suplementos', value: 'suplementos' },
  { label: 'Nutrição', value: 'nutricao' },
  { label: 'Higiene', value: 'higiene' },
  { label: 'Acessórios', value: 'acessorios' },
  { label: 'Antibióticos', value: 'antibioticos' },
  { label: 'Antiparasitários', value: 'antiparasitarios' }
];

// Dados simulados do produto (em uma aplicação real, viria da API)
const mockProductData = {
  id: 1,
  name: 'Vacina contra Febre Aftosa',
  animalCategory: 'bovinos',
  productCategory: 'vacinas',
  description: 'Vacina para prevenção da febre aftosa em bovinos. Alta eficácia e segurança comprovada.',
  price: '89.90',
  stock: '24',
  images: [
    'https://via.placeholder.com/300?text=Imagem+1',
    'https://via.placeholder.com/300?text=Imagem+2'
  ]
};

export default function EditProductScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const productId = params.id ? parseInt(params.id as string) : 1;

  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    animalCategory: '',
    productCategory: '',
    description: '',
    price: '',
    stock: ''
  });
  const [showAnimalCategories, setShowAnimalCategories] = useState(false);
  const [showProductCategories, setShowProductCategories] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simular carregamento dos dados do produto
  useEffect(() => {
    const loadProductData = async () => {
      setIsLoading(true);
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFormData({
        name: mockProductData.name,
        animalCategory: mockProductData.animalCategory,
        productCategory: mockProductData.productCategory,
        description: mockProductData.description,
        price: mockProductData.price,
        stock: mockProductData.stock.toString()
      });
      
      setImages(mockProductData.images);
      setIsLoading(false);
    };

    loadProductData();
  }, [productId]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImages([...images, result.assets[0].uri]);
      }
    } catch (error) {
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const selectAnimalCategory = (value: string) => {
    handleInputChange('animalCategory', value);
    setShowAnimalCategories(false);
  };

  const selectProductCategory = (value: string) => {
    handleInputChange('productCategory', value);
    setShowProductCategories(false);
  };

  const handleSubmit = () => {
    // Validação básica
    if (!formData.name || !formData.animalCategory || !formData.productCategory || !formData.price) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    Alert.alert(
      'Confirmar Alterações',
      'Deseja salvar as alterações neste produto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Salvar', onPress: submitChanges }
      ]
    );
  };

  const submitChanges = () => {
    // Aqui você faria a chamada para sua API para atualizar o produto
    const productData = {
      ...formData,
      images,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock) || 0,
      id: productId
    };

    console.log('Produto atualizado:', productData);
    Alert.alert('Sucesso', 'Produto atualizado com sucesso!');
    router.back();
  };

  const getAnimalCategoryLabel = () => {
    return animalCategories.find(cat => cat.value === formData.animalCategory)?.label || 'Selecione a categoria';
  };

  const getProductCategoryLabel = () => {
    return productCategories.find(cat => cat.value === formData.productCategory)?.label || 'Selecione a categoria';
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Stack.Screen 
          options={{
            title: 'Editar Produto',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 20,
            },
          }} 
        />
        <View style={styles.loadingContainer}>
          <Ionicons name="refresh" size={40} color="#3498db" />
          <Text style={styles.loadingText}>Carregando produto...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Editar Produto',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
        }} 
      />

      <ScrollView style={styles.scrollView}>
        {/* Cabeçalho com ID do produto */}
        <View style={styles.headerSection}>
          <Text style={styles.productId}>ID: #{productId}</Text>
          <Text style={styles.lastUpdate}>Última atualização: 15/12/2023</Text>
        </View>

        {/* Seção de Imagens */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Imagens do Produto</Text>
          <Text style={styles.sectionSubtitle}>Clique para adicionar ou remover imagens</Text>
          
          <ScrollView horizontal style={styles.imagesContainer}>
            {images.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.image} />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close" size={20} color="white" />
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

        {/* Informações Básicas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Básicas</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do Produto *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
              placeholder="Ex: Vacina contra Febre Aftosa"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Categoria do Animal *</Text>
              <TouchableOpacity 
                style={styles.selectContainer}
                onPress={() => setShowAnimalCategories(true)}
              >
                <Text style={styles.selectText}>
                  {getAnimalCategoryLabel()}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#7f8c8d" />
              </TouchableOpacity>
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Categoria do Produto *</Text>
              <TouchableOpacity 
                style={styles.selectContainer}
                onPress={() => setShowProductCategories(true)}
              >
                <Text style={styles.selectText}>
                  {getProductCategoryLabel()}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#7f8c8d" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Preço e Estoque */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preço e Estoque</Text>
          
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Preço (R$) *</Text>
              <TextInput
                style={styles.input}
                value={formData.price}
                onChangeText={(text) => handleInputChange('price', text)}
                placeholder="0,00"
                keyboardType="decimal-pad"
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Estoque *</Text>
              <TextInput
                style={styles.input}
                value={formData.stock}
                onChangeText={(text) => handleInputChange('stock', text)}
                placeholder="Quantidade"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Descrição */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição do Produto</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => handleInputChange('description', text)}
              placeholder="Descreva as características do produto..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Botões de Ação */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
            <Ionicons name="save" size={20} color="white" />
            <Text style={styles.saveButtonText}>Salvar Alterações</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal para Categorias de Animal */}
      <Modal
        visible={showAnimalCategories}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAnimalCategories(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione a Categoria do Animal</Text>
              <TouchableOpacity onPress={() => setShowAnimalCategories(false)}>
                <Ionicons name="close" size={24} color="#7f8c8d" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {animalCategories.map((category) => (
                <TouchableOpacity
                  key={category.value}
                  style={styles.modalOption}
                  onPress={() => selectAnimalCategory(category.value)}
                >
                  <Text style={styles.modalOptionText}>{category.label}</Text>
                  {formData.animalCategory === category.value && (
                    <Ionicons name="checkmark" size={20} color="#3498db" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal para Categorias de Produto */}
      <Modal
        visible={showProductCategories}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowProductCategories(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione a Categoria do Produto</Text>
              <TouchableOpacity onPress={() => setShowProductCategories(false)}>
                <Ionicons name="close" size={24} color="#7f8c8d" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {productCategories.map((category) => (
                <TouchableOpacity
                  key={category.value}
                  style={styles.modalOption}
                  onPress={() => selectProductCategory(category.value)}
                >
                  <Text style={styles.modalOptionText}>{category.label}</Text>
                  {formData.productCategory === category.value && (
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  productId: {
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
    minHeight: 100,
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
});