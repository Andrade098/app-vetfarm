import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⭐⭐ CONSTANTE PARA IP DO SERVIDOR ⭐⭐
const API_URL = 'http://192.168.0.2:3000';

interface ProdutoFarmacia {
  id: number;
  farmacia_id: number;
  produto_id: number;
  estoque: number;
  preco_venda: number;
  created_at: string;
  updated_at: string;
  produto?: {
    id: number;
    nome: string;
    descricao: string;
    categoria: string;
    subcategoria_id: number;
    imagens: string[];
    ativo: boolean;
    criado_em: string;
    atualizado_em: string;
  };
}

export default function DeleteProductScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Estados
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [farmaciaNome, setFarmaciaNome] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [products, setProducts] = useState<ProdutoFarmacia[]>([]);

  // ✅ CORREÇÃO: Criar ID único para cada produto
  const getProductUniqueId = (item: ProdutoFarmacia) => {
    return `${item.farmacia_id}_${item.produto_id}`;
  };

  // ✅ CORREÇÃO: Função melhorada para obter imagem do produto
  const getProductImage = (imagens: string[]) => {
    if (!imagens || imagens.length === 0) {
      return null;
    }

    try {
      let imageUrl = imagens[0];
      
      // ✅ CORREÇÃO: Parsear se for string JSON
      if (typeof imageUrl === 'string' && imageUrl.startsWith('[')) {
        try {
          const parsedImages = JSON.parse(imageUrl);
          imageUrl = Array.isArray(parsedImages) && parsedImages.length > 0 ? parsedImages[0] : null;
        } catch (parseError) {
          console.log('❌ Erro ao parsear JSON de imagens:', parseError);
          return null;
        }
      }

      if (!imageUrl || typeof imageUrl !== 'string') {
        return null;
      }

      // ✅ CORREÇÃO: Corrigir URLs problemáticas
      if (imageUrl.includes('flacalhost')) {
        imageUrl = imageUrl.replace('flacalhost', 'localhost');
      }
      if (imageUrl.includes('lobshttp')) {
        imageUrl = imageUrl.replace('lobshttp', 'http');
      }

      // ✅ CORREÇÃO: Se for URL relativa, adicionar base URL
      if (imageUrl.startsWith('/uploads/')) {
        imageUrl = `${API_URL}${imageUrl}`;
      }

      // ✅ CORREÇÃO: Se for Base64, usar diretamente
      if (imageUrl.startsWith('data:image')) {
        return imageUrl;
      }

      // ✅ CORREÇÃO: Verificar se é uma URL válida
      if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
      }

      console.log('❌ URL de imagem inválida:', imageUrl);
      return null;

    } catch (error) {
      console.error('❌ Erro ao processar imagem:', error);
      return null;
    }
  };

  // ✅ CORREÇÃO: Função para verificar se é Base64
  const isBase64Image = (uri: string) => {
    return uri && typeof uri === 'string' && uri.startsWith('data:image');
  };

  // ✅ CORREÇÃO: Função para obter source da imagem com fallback
  const getImageSource = (uri: string) => {
    if (!uri) return null;
    
    if (isBase64Image(uri)) {
      return { uri };
    }
    
    if (uri.startsWith('http://') || uri.startsWith('https://')) {
      return { uri };
    }
    
    return null;
  };

  // CARREGAR PRODUTOS
  useEffect(() => {
    loadProducts();
  }, []);

  // ✅ SIMPLIFICADO: Carregar produtos sem verificação de permissões
  const loadProducts = async () => {
    try {
      setIsLoading(true);
      
      const userDataString = await AsyncStorage.getItem('userData');
      
      if (!userDataString) {
        throw new Error('Dados do usuário não encontrados');
      }

      const userData = JSON.parse(userDataString);
      const token = await AsyncStorage.getItem('userToken');
      
      console.log('📦 userData COMPLETO:', userData);
      console.log('👤 ID da farmácia:', userData.farmaciaId);
      console.log('🏢 Nome da farmácia:', userData.nomeFarmacia);
      console.log('🔑 Token:', token ? 'SIM' : 'NÃO');
      
      if (!token) {
        throw new Error('Token não encontrado');
      }

      const farmaciaNome = userData.nomeFarmacia || userData.farmaciaNome || 'Sua Farmácia';
      setFarmaciaNome(farmaciaNome);

      // ✅ CORREÇÃO: Usando o mesmo endpoint da página de listar produtos
      const url = `${API_URL}/api/farmacia-produtos/minha-farmacia`;
      console.log('📡 URL da requisição:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Status da resposta:', response.status);

      const responseText = await response.text();
      console.log('📡 Resposta BRUTA:', responseText);

      if (!response.ok) {
        console.error('❌ Erro HTTP:', response.status, responseText);
        throw new Error(`Erro HTTP: ${response.status} - ${responseText}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
        console.log('📊 Dados parseados:', data);
      } catch (parseError) {
        console.error('❌ Erro ao parsear JSON:', parseError);
        throw new Error('Resposta da API não é JSON válido');
      }
      
      // No loadProducts(), modifique para:
const produtosMapeados = data.map((item: any) => {
  console.log('📦 Item recebido:', item);
  
  return {
    id: item.id, // ← ESTE É O ID DA RELAÇÃO QUE PRECISAMOS
    farmacia_id: item.farmacia_id,
    produto_id: item.produto_id,
    estoque: item.estoque || 0,
    preco_venda: item.preco_venda || 0,
    created_at: item.created_at,
    updated_at: item.updated_at,
    produto: item.produto ? {
      id: item.produto.id,
      nome: item.produto.nome,
      descricao: item.produto.descricao || '',
      categoria: item.produto.categoria || 'Geral',
      subcategoria_id: item.produto.subcategoria_id || null,
      imagens: item.produto.imagens || [],
      ativo: item.produto.ativo !== undefined ? item.produto.ativo : true,
      criado_em: item.produto.criado_em,
      atualizado_em: item.produto.atualizado_em
    } : undefined
  };
});

      console.log('✅ Produtos mapeados:', produtosMapeados.length);
      setProducts(produtosMapeados);

    } catch (error) {
      console.error('❌ Erro completo ao buscar produtos:', error);
      Alert.alert('Erro', 'Não foi possível carregar a lista de produtos');
      setProducts([]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Função para atualizar a lista
  const handleRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  // EXCLUIR PRODUTO - AGORA DIRETO SEM ALERT
  // VERSÃO SIMPLIFICADA - se você modificar o loadProducts
// EXCLUIR PRODUTO - VERSÃO FINAL COM NOVA ROTA
const deleteProduct = async (productUniqueId: string) => {
  try {
    setIsDeleting(true);
    
    console.log('🔍 [DELETE PRODUTO] Iniciando exclusão para:', productUniqueId);
    
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      Alert.alert('Erro', 'Token de autenticação não encontrado');
      return;
    }

    // ✅ Extrair os IDs da chave primária composta
    const [farmaciaId, produtoId] = productUniqueId.split('_');
    
    console.log('🔍 [DELETE PRODUTO] IDs para exclusão:', { farmaciaId, produtoId });

    // ✅ USAR A NOVA ROTA
    const deleteEndpoint = `${API_URL}/api/farmacia-produtos/farmacia/${farmaciaId}/produto/${produtoId}`;
    console.log('🌐 [DELETE PRODUTO] Excluindo via nova rota:', deleteEndpoint);

    const deleteResponse = await fetch(deleteEndpoint, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 [DELETE PRODUTO] Status da exclusão:', deleteResponse.status);

    if (deleteResponse.ok) {
      console.log('✅ [DELETE PRODUTO] EXCLUSÃO BEM-SUCEDIDA!');
      
      // Remove da lista local
      const updatedProducts = products.filter(item => 
        getProductUniqueId(item) !== productUniqueId
      );
      
      setProducts(updatedProducts);
      setSelectedProduct(null);
      
      Alert.alert('Sucesso', 'Produto excluído com sucesso!');
      return;
    }

    const errorText = await deleteResponse.text();
    console.log('❌ [DELETE PRODUTO] Erro na exclusão:', errorText);
    
    if (deleteResponse.status === 404) {
      Alert.alert('Erro', 'Produto não encontrado para exclusão');
    } else {
      Alert.alert('Erro', 'Não foi possível excluir o produto');
    }

  } catch (error) {
    console.error('💥 [DELETE PRODUTO] Erro:', error);
    Alert.alert('Erro', 'Falha ao conectar com o servidor: ' + (error as Error).message);
  } finally {
    setIsDeleting(false);
  }
};
  // ✅ CORREÇÃO: Usando a mesma lógica de filtro da página de listar
  const filteredProducts = products.filter(item =>
    item.produto?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.produto?.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.produto?.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (text: string) => {
    setSearchTerm(text);
  };

  // ✅ CORREÇÃO: Usar ID único para seleção
  const selectProduct = (item: ProdutoFarmacia) => {
    const uniqueId = getProductUniqueId(item);
    setSelectedProduct(uniqueId === selectedProduct ? null : uniqueId);
  };

  // ✅ MODIFICADO: Excluir diretamente sem confirmação
  const handleDelete = () => {
    if (!selectedProduct) {
      Alert.alert('Atenção', 'Selecione um produto para excluir');
      return;
    }

    // Exclui diretamente sem alert de confirmação
    deleteProduct(selectedProduct);
  };

  // ✅ CORREÇÃO: Encontrar produto pelo ID único
  const getSelectedProduct = () => {
    if (!selectedProduct) return null;
    const [farmaciaIdFromUnique, produtoIdFromUnique] = selectedProduct.split('_');
    return products.find(item => 
      item.farmacia_id === parseInt(farmaciaIdFromUnique) && 
      item.produto_id === parseInt(produtoIdFromUnique)
    );
  };

  // Funções auxiliares para formatação
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { text: 'Fora de Estoque', color: '#e74c3c' };
    if (quantity <= 10) return { text: 'Estoque Baixo', color: '#f39c12' };
    return { text: 'Em Estoque', color: '#27ae60' };
  };

  // TELA DE CARREGAMENTO
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Stack.Screen 
          options={{
            title: 'Excluir Produto',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 20,
            },
          }} 
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Carregando produtos...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Excluir Produto',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
        }} 
      />

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#3498db']}
            tintColor="#3498db"
          />
        }
      >
        {/* Cabeçalho com informações da farmácia */}
        <View style={styles.headerSection}>
          <View>
            <Text style={styles.farmaciaId}>Farmácia: {farmaciaNome}</Text>
            <Text style={styles.productsCount}>
              {products.length} produto{products.length !== 1 ? 's' : ''} cadastrado{products.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={handleRefresh}
            disabled={isLoading}
          >
            <Ionicons 
              name="refresh" 
              size={20} 
              color={isLoading ? "#bdc3c7" : "#3498db"} 
            />
          </TouchableOpacity>
        </View>

        {/* Barra de Pesquisa */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#7f8c8d" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar produto por nome, descrição ou categoria..."
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

        {/* Informação sobre produtos */}
        <View style={styles.infoCard}>
          <Ionicons name="warning" size={20} color="#e74c3c" />
          <Text style={styles.infoText}>
            Selecione um produto para excluir permanentemente
          </Text>
        </View>

        {/* Lista de Produtos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
          </Text>

          {filteredProducts.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="cube-outline" size={48} color="#bdc3c7" />
              <Text style={styles.emptyStateText}>
                {searchTerm ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
              </Text>
              <Text style={styles.emptyStateSubtext}>
                {searchTerm 
                  ? 'Tente buscar por outro termo ou verifique a ortografia'
                  : 'Esta farmácia ainda não possui produtos cadastrados'
                }
              </Text>
            </View>
          ) : (
            filteredProducts.map(item => {
              const stockStatus = getStockStatus(item.estoque);
              const imageUrl = item.produto ? getProductImage(item.produto.imagens) : null;
              const imageSource = imageUrl ? getImageSource(imageUrl) : null;
              const uniqueId = getProductUniqueId(item);
              const isSelected = selectedProduct === uniqueId;
              const isBase64 = imageUrl ? isBase64Image(imageUrl) : false;
              
              return (
                <TouchableOpacity
                  key={uniqueId}
                  style={[
                    styles.productCard,
                    isSelected && styles.selectedProductCard,
                    !item.produto?.ativo && styles.inactiveProductCard
                  ]}
                  onPress={() => selectProduct(item)}
                  disabled={isDeleting}
                >
                  {/* Imagem do produto ou ícone padrão */}
                  <View style={styles.productImageContainer}>
                    {imageSource ? (
                      <View style={styles.imageWrapper}>
                        <Image 
                          source={imageSource} 
                          style={styles.productImage}
                          resizeMode="cover"
                          onError={(e) => {
                            console.log(`❌ Erro ao carregar imagem:`, e.nativeEvent.error);
                          }}
                        />
                        {isBase64 && (
                          <View style={styles.base64Badge}>
                            <Text style={styles.base64Text}>Base64</Text>
                          </View>
                        )}
                      </View>
                    ) : (
                      <View style={styles.productIcon}>
                        <Ionicons name="cube" size={24} color="#3498db" />
                      </View>
                    )}
                    {!item.produto?.ativo && (
                      <View style={styles.inactiveOverlay}>
                        <Text style={styles.inactiveText}>INATIVO</Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.productInfo}>
                    <View style={styles.productHeader}>
                      <Text style={[
                        styles.productName,
                        !item.produto?.ativo && styles.inactiveProductName
                      ]} numberOfLines={1}>
                        {item.produto?.nome || 'Produto não encontrado'}
                      </Text>
                      <Text style={styles.productPrice}>
                        {formatPrice(item.preco_venda)}
                      </Text>
                    </View>
                    
                    <View style={styles.badgesContainer}>
                      {item.produto?.categoria && (
                        <View style={styles.categoryBadge}>
                          <Ionicons name="pricetag" size={10} color="#3498db" />
                          <Text style={styles.categoryText}>{item.produto.categoria}</Text>
                        </View>
                      )}
                      
                      <View style={[styles.stockBadge, { backgroundColor: stockStatus.color }]}>
                        <Ionicons name="pulse" size={10} color="white" />
                        <Text style={styles.stockText}>
                          {stockStatus.text} ({item.estoque} uni)
                        </Text>
                      </View>
                    </View>
                    
                    {item.produto?.descricao ? (
                      <Text style={styles.productDescription} numberOfLines={2}>
                        {item.produto.descricao}
                      </Text>
                    ) : null}
                    
                    <Text style={styles.productDate}>
                      <Ionicons name="calendar" size={12} color="#bdc3c7" /> 
                      Atualizado em {formatDate(item.updated_at)}
                    </Text>
                  </View>

                  <View style={styles.selectionIndicator}>
                    {isSelected ? (
                      <Ionicons name="checkmark-circle" size={24} color="#e74c3c" />
                    ) : (
                      <Ionicons name="ellipse-outline" size={24} color="#bdc3c7" />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* Produto Selecionado */}
        {selectedProduct && (
          <View style={styles.selectedSection}>
            <Text style={styles.sectionTitle}>Produto Selecionado para Exclusão</Text>
            <View style={styles.selectedProduct}>
              <View style={styles.selectedProductImageContainer}>
                {(() => {
                  const selectedItem = getSelectedProduct();
                  const imageUrl = selectedItem?.produto ? getProductImage(selectedItem.produto.imagens) : null;
                  const imageSource = imageUrl ? getImageSource(imageUrl) : null;
                  const isBase64 = imageUrl ? isBase64Image(imageUrl) : false;

                  return (
                    <>
                      {imageSource ? (
                        <View style={styles.imageWrapper}>
                          <Image 
                            source={imageSource} 
                            style={styles.selectedProductImage}
                            resizeMode="cover"
                          />
                          {isBase64 && (
                            <View style={styles.selectedBase64Badge}>
                              <Text style={styles.selectedBase64Text}>Base64</Text>
                            </View>
                          )}
                        </View>
                      ) : (
                        <View style={styles.selectedProductIcon}>
                          <Ionicons name="cube" size={40} color="#3498db" />
                        </View>
                      )}
                    </>
                  );
                })()}
                {!getSelectedProduct()?.produto?.ativo && (
                  <View style={styles.selectedInactiveOverlay}>
                    <Text style={styles.selectedInactiveText}>PRODUTO INATIVO</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.selectedProductInfo}>
                <View style={styles.selectedProductHeader}>
                  <Text style={[
                    styles.selectedProductName,
                    !getSelectedProduct()?.produto?.ativo && styles.selectedInactiveProductName
                  ]}>
                    {getSelectedProduct()?.produto?.nome || 'Produto não encontrado'}
                  </Text>
                  <Text style={styles.selectedProductPrice}>
                    {formatPrice(getSelectedProduct()?.preco_venda || 0)}
                  </Text>
                </View>
                
                <View style={styles.selectedBadgesContainer}>
                  {getSelectedProduct()?.produto?.categoria && (
                    <View style={styles.selectedCategoryBadge}>
                      <Ionicons name="pricetag" size={12} color="white" />
                      <Text style={styles.selectedCategoryText}>
                        {getSelectedProduct()?.produto.categoria}
                      </Text>
                    </View>
                  )}
                  
                  {(() => {
                    const stockStatus = getStockStatus(getSelectedProduct()?.estoque || 0);
                    return (
                      <View style={[styles.selectedStockBadge, { backgroundColor: stockStatus.color }]}>
                        <Ionicons name="pulse" size={12} color="white" />
                        <Text style={styles.selectedStockText}>
                          {stockStatus.text} ({getSelectedProduct()?.estoque} unidades)
                        </Text>
                      </View>
                    );
                  })()}
                </View>
                
                {getSelectedProduct()?.produto?.descricao ? (
                  <Text style={styles.selectedProductDescription}>
                    {getSelectedProduct()?.produto.descricao}
                  </Text>
                ) : null}
                
                <View style={styles.selectedProductDetails}>
                  <Text style={styles.selectedProductDetail}>
                    <Ionicons name="cash" size={14} color="#7f8c8d" /> 
                    Preço de venda: {formatPrice(getSelectedProduct()?.preco_venda || 0)}
                  </Text>
                  
                  <Text style={styles.selectedProductDetail}>
                    <Ionicons name="cube" size={14} color="#7f8c8d" /> 
                    Estoque: {getSelectedProduct()?.estoque} unidades
                  </Text>
                  
                  <Text style={styles.selectedProductDetail}>
                    <Ionicons name="calendar" size={14} color="#7f8c8d" /> 
                    Cadastrado em: {formatDate(getSelectedProduct()?.produto?.criado_em || '')}
                  </Text>
                  
                  <Text style={styles.selectedProductDetail}>
                    <Ionicons name="refresh" size={14} color="#7f8c8d" /> 
                    Atualizado em: {formatDate(getSelectedProduct()?.updated_at || '')}
                  </Text>
                  
                  <Text style={styles.selectedProductDetail}>
                    <Ionicons name="flag" size={14} color="#7f8c8d" /> 
                    Status: {getSelectedProduct()?.produto?.ativo ? 'Ativo' : 'Inativo'}
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
              (!selectedProduct || isDeleting) && styles.deleteButtonDisabled
            ]}
            onPress={handleDelete}
            disabled={!selectedProduct || isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="trash" size={20} color="white" />
            )}
            <Text style={styles.deleteButtonText}>
              {isDeleting ? 'Excluindo...' : 'Excluir Produto Selecionado'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.cancelButton, isDeleting && styles.cancelButtonDisabled]}
            onPress={() => router.back()}
            disabled={isDeleting}
          >
            <Text style={styles.cancelButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>

        {/* Espaço extra no final */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

// ESTILOS (mantendo os mesmos)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  farmaciaId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  productsCount: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#ecf0f1',
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
    backgroundColor: '#fdedec',
    padding: 12,
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
  infoText: {
    color: '#e74c3c',
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
  productCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedProductCard: {
    borderColor: '#e74c3c',
    backgroundColor: '#fdedec',
  },
  inactiveProductCard: {
    backgroundColor: '#f8f9fa',
    borderColor: '#e9ecef',
  },
  productImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  productIcon: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  base64Badge: {
    position: 'absolute',
    top: 2,
    left: 2,
    backgroundColor: 'rgba(52, 152, 219, 0.9)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  base64Text: {
    color: 'white',
    fontSize: 7,
    fontWeight: 'bold',
  },
  inactiveOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(231, 76, 60, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  inactiveText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  productInfo: {
    flex: 1,
    marginLeft: 15,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    marginRight: 10,
  },
  inactiveProductName: {
    color: '#bdc3c7',
    textDecorationLine: 'line-through',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  categoryText: {
    color: '#2c3e50',
    fontSize: 10,
    fontWeight: '500',
    marginLeft: 4,
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  stockText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  productDescription: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
    lineHeight: 16,
  },
  productDate: {
    fontSize: 10,
    color: '#bdc3c7',
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
  selectedProduct: {
    flexDirection: 'row',
    backgroundColor: '#fdedec',
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e74c3c',
  },
  selectedProductImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  selectedProductImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  selectedProductIcon: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBase64Badge: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: 'rgba(52, 152, 219, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  selectedBase64Text: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  },
  selectedInactiveOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(231, 76, 60, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  selectedInactiveText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  selectedProductInfo: {
    flex: 1,
    marginLeft: 15,
  },
  selectedProductHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  selectedProductName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    marginRight: 10,
  },
  selectedInactiveProductName: {
    color: '#e74c3c',
    textDecorationLine: 'line-through',
  },
  selectedProductPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  selectedBadgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  selectedCategoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 6,
  },
  selectedCategoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  selectedStockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 6,
  },
  selectedStockText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  selectedProductDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
    lineHeight: 18,
  },
  selectedProductDetails: {
    marginTop: 8,
  },
  selectedProductDetail: {
    fontSize: 13,
    color: '#7f8c8d',
    marginBottom: 4,
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
  cancelButtonDisabled: {
    opacity: 0.5,
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
  bottomSpacer: {
    height: 20,
  },
});