import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image, Modal } from 'react-native';
import { Stack, useRouter } from 'expo-router';
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

export default function AddProductScreen() {
  const router = useRouter();
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
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
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

    if (images.length === 0) {
      Alert.alert('Atenção', 'Deseja continuar sem adicionar imagens?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Continuar', onPress: submitProduct }
      ]);
      return;
    }

    submitProduct();
  };

  const submitProduct = () => {
    // Aqui você faria a chamada para sua API
    const productData = {
      ...formData,
      images,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock) || 0
    };

    console.log('Produto a ser enviado:', productData);
    Alert.alert('Sucesso', 'Produto adicionado com sucesso!');
    router.back();
  };

  const getAnimalCategoryLabel = () => {
    return animalCategories.find(cat => cat.value === formData.animalCategory)?.label || 'Selecione a categoria';
  };

  const getProductCategoryLabel = () => {
    return productCategories.find(cat => cat.value === formData.productCategory)?.label || 'Selecione a categoria';
  };

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

      <ScrollView style={styles.scrollView}>
        {/* Seção de Imagens */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Imagens do Produto *</Text>
          <Text style={styles.sectionSubtitle}>Adicione até 4 imagens</Text>
          
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
              <Text style={styles.label}>Estoque</Text>
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

        {/* Botão de Submit */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Adicionar Produto</Text>
        </TouchableOpacity>
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
});