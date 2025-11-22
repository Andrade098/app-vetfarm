import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image, Modal, ActivityIndicator } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.0.3:3000';

export default function EditProductScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const farmaciaId = params.farmacia_id;
  const produtoId = params.produto_id;
  
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    nome: '',
    animalCategory: '',
    productCategory: '',
    descricao: '',
    preco_venda: '',
    estoque: ''
  });
  const [showAnimalCategories, setShowAnimalCategories] = useState(false);
  const [showProductCategories, setShowProductCategories] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [categorias, setCategorias] = useState<any[]>([]);
  const [subcategorias, setSubcategorias] = useState<any[]>([]);

  // Upload para o servidor
  const uploadImageToServer = async (imageUri: string): Promise<string> => {
    try {
      // Se já for uma URL do servidor, retornar diretamente
      if (imageUri.startsWith(API_URL)) {
        return imageUri;
      }
      
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('Token não encontrado');
      }

      const formData = new FormData();
      
      let mimeType = 'image/jpeg';
      if (imageUri.includes('.png')) mimeType = 'image/png';
      if (imageUri.includes('.gif')) mimeType = 'image/gif';
      
      formData.append('image', {
        uri: imageUri,
        type: mimeType,
        name: `product_${Date.now()}.${mimeType.split('/')[1]}`
      } as any);

      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro no upload: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      const imageUrl = `${API_URL}${result.url}`;
      
      return imageUrl;
      
    } catch (error) {
      // FALLBACK: Se o upload falhar, converter para Base64
      try {
        const base64 = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        
        let mimeType = 'image/jpeg';
        if (imageUri.includes('.png')) mimeType = 'image/png';
        if (imageUri.includes('.gif')) mimeType = 'image/gif';
        
        const base64Data = `data:${mimeType};base64,${base64}`;
        return base64Data;
      } catch (fallbackError) {
        throw error;
      }
    }
  };

  // Upload múltiplo de imagens
  const uploadAllImages = async (imageUris: string[]): Promise<string[]> => {
    if (imageUris.length === 0) return [];
    
    setIsUploading(true);
    
    try {
      const uploadedUrls: string[] = [];
      
      for (const imageUri of imageUris) {
        try {
          if (imageUri.startsWith(API_URL)) {
            uploadedUrls.push(imageUri);
            continue;
          }
          
          const uploadedUrl = await uploadImageToServer(imageUri);
          uploadedUrls.push(uploadedUrl);
          
          await new Promise(resolve => setTimeout(resolve, 500));
          
        } catch (error) {
          Alert.alert('Aviso', `Uma imagem não pôde ser enviada, mas as outras serão processadas.`);
          uploadedUrls.push(imageUri);
        }
      }
      
      return uploadedUrls;
      
    } finally {
      setIsUploading(false);
    }
  };

  // Função para verificar se é Base64
  const isBase64Image = (uri: string) => {
    return uri && typeof uri === 'string' && uri.startsWith('data:image');
  };

  // Função para verificar se é URL do servidor
  const isServerImage = (uri: string) => {
    return uri && typeof uri === 'string' && uri.startsWith(API_URL);
  };

  // Função melhorada para filtrar imagens válidas
  const isValidImageUri = (uri: string): boolean => {
    if (!uri || typeof uri !== 'string' || uri.trim() === '') {
      return false;
    }
    
    const isValid = 
      uri.startsWith('data:image') || 
      uri.startsWith('http://') || 
      uri.startsWith('https://') ||
      uri.startsWith('blob:') ||
      uri.startsWith('file://') ||
      uri.includes('/') ||
      uri.length > 20;
    
    return isValid;
  };

  // Função para obter source da imagem
  const getImageSource = (uri: string) => {
    if (!uri || typeof uri !== 'string') {
      return null;
    }
    
    if (uri.startsWith('data:image') || uri.startsWith('http') || uri.startsWith('file://') || uri.startsWith('blob:')) {
      return { uri };
    }
    
    return null;
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/api/produtos/categorias`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setCategorias(data.categorias || []);
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
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
        setSubcategorias(data.subcategorias || []);
      }
    } catch (error) {
      console.error('Erro ao buscar subcategorias:', error);
    }
  };

  // Buscar dados reais do produto
  useEffect(() => {
    const loadProductData = async () => {
      try {
        setIsLoading(true);
        
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          Alert.alert('Erro', 'Token não encontrado');
          router.back();
          return;
        }

        const response = await fetch(
          `${API_URL}/api/farmacia-produtos/farmacia/${farmaciaId}/produto/${produtoId}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${await response.text()}`);
        }

        const productData = await response.json();

        setFormData({
          nome: productData.produto?.nome || '',
          animalCategory: productData.produto?.categoria_id?.toString() || '',
          productCategory: productData.produto?.subcategoria_id?.toString() || '',
          descricao: productData.produto?.descricao || '',
          preco_venda: productData.preco_venda?.toString() || '',
          estoque: productData.estoque?.toString() || '0'
        });

        if (productData.produto?.categoria_id) {
          fetchSubcategorias(parseInt(productData.produto.categoria_id));
        }

        // Carregar imagens do produto com tratamento robusto
        let imagensArray = [];
        
        if (productData.produto?.imagens) {
          try {
            if (typeof productData.produto.imagens === 'string') {
              try {
                imagensArray = JSON.parse(productData.produto.imagens);
              } catch (parseError) {
                if (isValidImageUri(productData.produto.imagens)) {
                  imagensArray = [productData.produto.imagens];
                }
              }
            } else if (Array.isArray(productData.produto.imagens)) {
              imagensArray = productData.produto.imagens;
            }
            
            imagensArray = imagensArray.filter(img => isValidImageUri(img));
            
          } catch (parseError) {
            imagensArray = [];
          }
        }

        setImages(imagensArray);

      } catch (error) {
        console.error('Erro ao carregar produto:', error);
        Alert.alert('Erro', 'Não foi possível carregar os dados do produto');
      } finally {
        setIsLoading(false);
      }
    };

    if (farmaciaId && produtoId) {
      loadProductData();
    } else {
      Alert.alert('Erro', 'IDs do produto não encontrados');
      router.back();
    }
  }, [farmaciaId, produtoId]);

  // Função para selecionar e fazer upload
  const pickImage = async () => {
    try {
      setIsUploading(true);
      
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para adicionar imagens.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newImageUri = result.assets[0].uri;
        
        try {
          const uploadedUrl = await uploadImageToServer(newImageUri);
          
          setImages(prev => {
            const newImages = [...prev, uploadedUrl];
            return newImages;
          });
          
        } catch (uploadError) {
          Alert.alert('Erro', 'Não foi possível processar a imagem. Tente novamente.');
        }
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar a imagem');
    } finally {
      setIsUploading(false);
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

    if (field === 'animalCategory' && value) {
      fetchSubcategorias(parseInt(value));
      setFormData(prev => ({ ...prev, productCategory: '' }));
    }
  };

  const selectAnimalCategory = (categoriaId: string) => {
    handleInputChange('animalCategory', categoriaId);
    setShowAnimalCategories(false);
  };

  const selectProductCategory = (subcategoriaId: string) => {
    handleInputChange('productCategory', subcategoriaId);
    setShowProductCategories(false);
  };

  // Funções para obter labels das categorias
  const getAnimalCategoryLabel = () => {
    if (!formData.animalCategory) return 'Selecione o tipo de produto';
    const categoria = categorias.find(cat => cat.id === parseInt(formData.animalCategory));
    return categoria ? categoria.nome : 'Selecione o tipo de produto';
  };

  const getProductCategoryLabel = () => {
    if (!formData.productCategory) return 'Selecione o animal';
    const subcategoria = subcategorias.find(sub => sub.id === parseInt(formData.productCategory));
    return subcategoria ? subcategoria.nome : 'Selecione o animal';
  };

  // Função handleSubmit
  // ✅ FUNÇÃO handleSubmit CORRIGIDA
// ✅ VERSÃO ALTERNATIVA - Mais direta
const handleSubmit = async () => {
  console.log('🎯 [DEBUG] handleSubmit CHAMADO!');
  
  // Verificação rápida dos campos
  if (!formData.nome || !formData.animalCategory || !formData.productCategory || !formData.preco_venda) {
    Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
    return;
  }

  if (parseFloat(formData.preco_venda) <= 0) {
    Alert.alert('Erro', 'O preço deve ser maior que zero');
    return;
  }

  // ✅ CORREÇÃO: Chamar submitChanges diretamente sem Alert de confirmação
  console.log('🚀 [DEBUG] Chamando submitChanges diretamente...');
  await submitChanges();
};
  // Função submitChanges
  const submitChanges = async () => {
    try {
      setIsSaving(true);
      
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Erro', 'Token não encontrado');
        return;
      }

      if (!farmaciaId || !produtoId) {
        Alert.alert('Erro', 'IDs do produto não encontrados');
        return;
      }

      // Estrutura de dados baseada no que o backend espera
      const updateData = {
        nome: formData.nome,
        descricao: formData.descricao,
        categoria_id: parseInt(formData.animalCategory),
        subcategoria_id: parseInt(formData.productCategory),
        imagens: images,
        preco_venda: parseFloat(formData.preco_venda),
        estoque: parseInt(formData.estoque) || 0
      };

      const url = `${API_URL}/api/farmacia-produtos/farmacia/${farmaciaId}/produto/${produtoId}`;

      // Fazer a requisição PUT
      try {
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        });

        if (!response.ok) {
          // Tentar estrutura alternativa se a primeira falhar
          const alternativeData = {
            produto: {
              nome: formData.nome,
              descricao: formData.descricao,
              categoria_id: parseInt(formData.animalCategory),
              subcategoria_id: parseInt(formData.productCategory),
              imagens: images,
            },
            preco_venda: parseFloat(formData.preco_venda),
            estoque: parseInt(formData.estoque) || 0
          };

          const altResponse = await fetch(url, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(alternativeData),
          });

          if (!altResponse.ok) {
            throw new Error(`Erro ${altResponse.status}: ${await altResponse.text()}`);
          }

          // Sucesso com estrutura alternativa
          Alert.alert('Sucesso', 'Produto atualizado com sucesso!', [
            { 
              text: 'OK', 
              onPress: () => router.back()
            }
          ]);
          return;
        }

        // Sucesso com estrutura principal
        Alert.alert('Sucesso', 'Produto atualizado com sucesso!', [
          { 
            text: 'OK', 
            onPress: () => router.back()
          }
        ]);

      } catch (fetchError) {
        throw new Error(`Erro de rede: ${fetchError.message}`);
      }

    } catch (error) {
      Alert.alert(
        'Erro', 
        `Não foi possível atualizar o produto.\n\nErro: ${error.message}`,
        [{ text: 'OK' }]
      );
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <ActivityIndicator size="large" color="#3498db" />
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
        {/* Cabeçalho com IDs do produto */}
        <View style={styles.headerSection}>
          <View>
            <Text style={styles.productId}>Farmácia ID: #{farmaciaId}</Text>
            <Text style={styles.productId}>Produto ID: #{produtoId}</Text>
          </View>
          <Text style={styles.lastUpdate}>
            Última atualização: {formatDate(new Date().toISOString())}
          </Text>
        </View>

        {/* Seção de Imagens */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Imagens do Produto</Text>
          <Text style={styles.sectionSubtitle}>
            {images.length} imagem{images.length !== 1 ? 'ens' : ''} {images.length === 0 ? 'cadastrada' : 'cadastradas'}
            {(isUploading || isSaving) && ' (Processando...)'}
          </Text>
          
          <ScrollView horizontal style={styles.imagesContainer} showsHorizontalScrollIndicator={false}>
            {images.map((uri, index) => {
              const imageSource = getImageSource(uri);
              const isServer = isServerImage(uri);
              const isBase64 = isBase64Image(uri);
              
              return (
                <View key={index} style={styles.imageWrapper}>
                  {imageSource ? (
                    <Image 
                      source={imageSource} 
                      style={styles.image}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Ionicons name="image" size={32} color="#bdc3c7" />
                      <Text style={styles.placeholderText}>Imagem inválida</Text>
                      <Text style={styles.placeholderSubtext}>Toque para remover</Text>
                    </View>
                  )}
                  
                  <View style={[
                    styles.typeBadge,
                    isServer ? styles.serverBadge : 
                    isBase64 ? styles.base64Badge : styles.localBadge
                  ]}>
                    <Text style={styles.typeBadgeText}>
                      {isServer ? 'Servidor' : isBase64 ? 'Base64' : 'Local'}
                    </Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                    disabled={isUploading || isSaving}
                  >
                    <Ionicons name="close" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              );
            })}
            
            {images.length < 4 && (
              <TouchableOpacity 
                style={[
                  styles.addImageButton,
                  (isUploading || isSaving) && styles.addImageButtonDisabled
                ]} 
                onPress={pickImage}
                disabled={isUploading || isSaving}
              >
                {isUploading ? (
                  <ActivityIndicator size="small" color="#3498db" />
                ) : (
                  <Ionicons name="camera" size={32} color="#3498db" />
                )}
                <Text style={styles.addImageText}>
                  {isUploading ? 'Upload...' : 'Adicionar\nImagem'}
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
          
          {images.length === 0 && (
            <View style={styles.noImagesContainer}>
              <Ionicons name="images" size={48} color="#bdc3c7" />
              <Text style={styles.noImagesText}>Nenhuma imagem cadastrada</Text>
              <Text style={styles.noImagesSubtext}>Toque no botão acima para adicionar imagens</Text>
            </View>
          )}
        </View>

        {/* Informações Básicas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Básicas</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do Produto *</Text>
            <TextInput
              style={styles.input}
              value={formData.nome}
              onChangeText={(text) => handleInputChange('nome', text)}
              placeholder="Ex: Vacina contra Febre Aftosa"
              editable={!isUploading && !isSaving}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Tipo de Produto *</Text>
              <TouchableOpacity 
                style={styles.selectContainer}
                onPress={() => setShowAnimalCategories(true)}
                disabled={isUploading || isSaving}
              >
                <Text style={[
                  styles.selectText,
                  !formData.animalCategory && { color: '#7f8c8d' }
                ]}>
                  {getAnimalCategoryLabel()}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#7f8c8d" />
              </TouchableOpacity>
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Animal *</Text>
              <TouchableOpacity 
                style={[
                  styles.selectContainer,
                  !formData.animalCategory && styles.selectDisabled
                ]}
                onPress={() => setShowProductCategories(true)}
                disabled={!formData.animalCategory || isUploading || isSaving}
              >
                <Text style={[
                  styles.selectText,
                  !formData.productCategory && { color: '#7f8c8d' }
                ]}>
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
                value={formData.preco_venda}
                onChangeText={(text) => handleInputChange('preco_venda', text)}
                placeholder="0,00"
                keyboardType="decimal-pad"
                editable={!isUploading && !isSaving}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Estoque *</Text>
              <TextInput
                style={styles.input}
                value={formData.estoque}
                onChangeText={(text) => handleInputChange('estoque', text)}
                placeholder="Quantidade"
                keyboardType="numeric"
                editable={!isUploading && !isSaving}
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
              value={formData.descricao}
              onChangeText={(text) => handleInputChange('descricao', text)}
              placeholder="Descreva as características do produto..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!isUploading && !isSaving}
            />
          </View>
        </View>

        {/* Botões de Ação */}
        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={[styles.saveButton, (isSaving || isUploading) && styles.saveButtonDisabled]} 
            onPress={handleSubmit}
            disabled={isSaving || isUploading}
          >
            {(isSaving || isUploading) ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="save" size={20} color="white" />
            )}
            <Text style={styles.saveButtonText}>
              {isUploading ? 'Enviando Imagens...' : 
               isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => router.push('/adm/listarProduto')}
            disabled={isSaving || isUploading}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal para Categorias */}
      <Modal
        visible={showAnimalCategories}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAnimalCategories(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione o Tipo de Produto</Text>
              <TouchableOpacity onPress={() => setShowAnimalCategories(false)}>
                <Ionicons name="close" size={24} color="#7f8c8d" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {categorias.map((categoria) => (
                <TouchableOpacity
                  key={categoria.id}
                  style={styles.modalOption}
                  onPress={() => selectAnimalCategory(categoria.id.toString())}
                >
                  <Text style={styles.modalOptionText}>{categoria.nome}</Text>
                  {formData.animalCategory === categoria.id.toString() && (
                    <Ionicons name="checkmark" size={20} color="#3498db" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal para Subcategorias */}
      <Modal
        visible={showProductCategories}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowProductCategories(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione o Animal</Text>
              <TouchableOpacity onPress={() => setShowProductCategories(false)}>
                <Ionicons name="close" size={24} color="#7f8c8d" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {subcategorias.map((subcategoria) => (
                <TouchableOpacity
                  key={subcategoria.id}
                  style={styles.modalOption}
                  onPress={() => selectProductCategory(subcategoria.id.toString())}
                >
                  <Text style={styles.modalOptionText}>{subcategoria.nome}</Text>
                  {formData.productCategory === subcategoria.id.toString() && (
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

// ESTILOS
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
    fontSize: 14,
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
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e74c3c',
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: '#e74c3c',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
    fontWeight: 'bold',
  },
  placeholderSubtext: {
    color: '#e74c3c',
    fontSize: 8,
    textAlign: 'center',
    marginTop: 2,
  },
  typeBadge: {
    position: 'absolute',
    top: 5,
    left: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  serverBadge: {
    backgroundColor: 'rgba(46, 204, 113, 0.9)',
  },
  base64Badge: {
    backgroundColor: 'rgba(52, 152, 219, 0.9)',
  },
  localBadge: {
    backgroundColor: 'rgba(241, 196, 15, 0.9)',
  },
  typeBadgeText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
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
  addImageButtonDisabled: {
    opacity: 0.5,
  },
  addImageText: {
    fontSize: 12,
    color: '#3498db',
    marginTop: 5,
    textAlign: 'center',
    lineHeight: 14,
  },
  noImagesContainer: {
    alignItems: 'center',
    padding: 20,
  },
  noImagesText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 10,
  },
  noImagesSubtext: {
    fontSize: 12,
    color: '#bdc3c7',
    textAlign: 'center',
    marginTop: 5,
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
  selectDisabled: {
    backgroundColor: '#f8f9fa',
    borderColor: '#ecf0f1',
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