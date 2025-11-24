import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const API_BASE_URL = 'http://192.168.0.3:3000/api'; // ✅ Mudei para o IP correto

export default function CategoriaProdutoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const categoriaId = params.categoriaId;
  const categoriaNome = params.categoriaNome;
  const animalNome = params.animalNome;

  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [carrinho, setCarrinho] = useState<string[]>([]);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [infoCategoria, setInfoCategoria] = useState(null);

  // Carregar produtos do servidor
  useEffect(() => {
    carregarDados();
  }, [categoriaId, animalNome]);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      
      // Carregar informações da categoria
      const infoResponse = await fetch(
        `${API_BASE_URL}/categoria-produto/info/${categoriaId}/${animalNome}`
      );
      
      if (infoResponse.ok) {
        const infoData = await infoResponse.json();
        setInfoCategoria(infoData.data);
      }

      // Carregar produtos
      const produtosResponse = await fetch(
        `${API_BASE_URL}/categoria-produto/produtos?categoriaId=${categoriaId}&animal=${animalNome}`
      );

      if (produtosResponse.ok) {
        const produtosData = await produtosResponse.json();
        console.log('Dados dos produtos:', produtosData.data.produtos); // Para debug
        setProdutos(produtosData.data.produtos || []);
      } else {
        Alert.alert('Erro', 'Não foi possível carregar os produtos');
        setProdutos([]);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Falha na conexão com o servidor');
      setProdutos([]);
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  };

  const onRefresh = () => {
    setAtualizando(true);
    carregarDados();
  };

  const toggleCarrinho = (produtoId: string) => {
    setCarrinho(prev => {
      if (prev.includes(produtoId)) {
        return prev.filter(id => id !== produtoId);
      } else {
        return [...prev, produtoId];
      }
    });
  };

  const toggleFavorito = (produtoId: string) => {
    setFavoritos(prev => {
      if (prev.includes(produtoId)) {
        return prev.filter(id => id !== produtoId);
      } else {
        return [...prev, produtoId];
      }
    });
  };

  const formatarPreco = (preco) => {
    if (!preco && preco !== 0) {
      return 'Consulte';
    }
    
    const precoNumerico = parseFloat(preco);
    
    if (isNaN(precoNumerico)) {
      return 'Consulte';
    }
    
    return `R$ ${precoNumerico.toFixed(2).replace('.', ',')}`;
  };

  // ✅ FUNÇÃO PARA OBTER IMAGEM DO PRODUTO (COPIADA DA HOME SCREEN)
  const getImagemProduto = (produto) => {
    if (!produto.imagens || produto.imagens.length === 0) {
      return null;
    }

    try {
      let imageUrl = produto.imagens[0];
      
      // Parsear se for string JSON
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

      // Corrigir URLs problemáticas
      if (imageUrl.includes('flacalhost')) {
        imageUrl = imageUrl.replace('flacalhost', 'localhost');
      }
      if (imageUrl.includes('lobshttp')) {
        imageUrl = imageUrl.replace('lobshttp', 'http');
      }

      // Se for URL relativa, adicionar base URL
      if (imageUrl.startsWith('/uploads/')) {
        imageUrl = `http://192.168.0.3:3000${imageUrl}`; // ✅ Usando o mesmo IP
      }

      // Se for Base64, usar diretamente
      if (imageUrl.startsWith('data:image')) {
        return imageUrl;
      }

      // Verificar se é uma URL válida
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

  const ProdutoCard = ({ produto }) => {
    const imagemProduto = getImagemProduto(produto);
    
    console.log('🔍 Debug Produto:', produto.nome);
    console.log('🖼️ Debug Imagem:', imagemProduto);
    
    return (
      <View style={styles.produtoCard}>
        {/* Header do Card */}
        <View style={styles.cardHeader}>
          <View style={styles.categoriaTag}>
            <Text style={styles.categoriaTagText}>
              {produto.Categoria?.nome || categoriaNome}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.favoritoButton}
            onPress={() => toggleFavorito(produto.id)}
          >
            <Ionicons
              name={favoritos.includes(produto.id) ? "heart" : "heart-outline"}
              size={20}
              color={favoritos.includes(produto.id) ? "#FF4757" : "#64748B"}
            />
          </TouchableOpacity>
        </View>

        {/* Imagem do Produto - CORRIGIDA */}
        <View style={styles.produtoImagemContainer}>
          {imagemProduto ? (
            <Image 
              source={{ uri: imagemProduto }} 
              style={styles.produtoImagem}
              resizeMode="contain"
              onError={(e) => {
                console.log('❌ Erro ao carregar imagem:', e.nativeEvent.error);
                console.log('📛 URL problemática:', imagemProduto);
              }}
              onLoad={() => {
                console.log('✅ Imagem carregada com sucesso!');
              }}
            />
          ) : (
            <View style={styles.iconeContainer}>
              <Text style={styles.produtoIcone}>
                {produto.Categoria?.icone || '📦'}
              </Text>
              <Text style={styles.semImagemTexto}>Sem imagem</Text>
            </View>
          )}
        </View>

        {/* Informações do Produto */}
        <View style={styles.produtoInfo}>
          <Text style={styles.produtoNome} numberOfLines={2}>
            {produto.nome}
          </Text>
          <Text style={styles.produtoDescricao} numberOfLines={2}>
            {produto.descricao || 'Produto veterinário de qualidade'}
          </Text>

          {/* Preços das Farmácias */}
          <View style={styles.precosContainer}>
            {produto.FarmaciaProdutos && produto.FarmaciaProdutos.length > 0 ? (
              produto.FarmaciaProdutos.slice(0, 2).map((farmaciaProduto, index) => (
                <View key={index} style={styles.precoItem}>
                  <Text style={styles.farmaciaNome} numberOfLines={1}>
                    {farmaciaProduto.Farmacia?.nome || 'Farmácia'}
                  </Text>
                  <Text style={styles.precoTexto}>
                    {formatarPreco(farmaciaProduto.preco)}
                  </Text>
                  <Text style={styles.estoqueTexto}>
                    {farmaciaProduto.estoque} em estoque
                  </Text>
                </View>
              ))
            ) : (
              <View style={styles.precoItem}>
                <Text style={styles.farmaciaNome}>Indisponível</Text>
                <Text style={styles.precoIndisponivel}>Consulte</Text>
              </View>
            )}
          </View>

          {/* Botão de Ação */}
          <TouchableOpacity
            style={[
              styles.botaoCarrinho,
              carrinho.includes(produto.id) && styles.botaoCarrinhoAdicionado
            ]}
            onPress={() => toggleCarrinho(produto.id)}
          >
            <Ionicons
              name={carrinho.includes(produto.id) ? "checkmark-circle" : "cart-outline"}
              size={18}
              color={carrinho.includes(produto.id) ? "#FFFFFF" : "#059669"}
            />
            <Text style={[
              styles.botaoCarrinhoTexto,
              carrinho.includes(produto.id) && styles.botaoCarrinhoTextoAdicionado
            ]}>
              {carrinho.includes(produto.id) ? 'Adicionado' : 'Adicionar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const LoadingSkeleton = () => (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3].map((item) => (
        <View key={item} style={styles.skeletonCard}>
          <View style={styles.skeletonImage} />
          <View style={styles.skeletonContent}>
            <View style={styles.skeletonLine} />
            <View style={[styles.skeletonLine, styles.skeletonShort]} />
            <View style={styles.skeletonButton} />
          </View>
        </View>
      ))}
    </View>
  );

  if (carregando) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            title: `${categoriaNome} - ${animalNome}`,
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 16,
            },
          }}
        />
        <View style={styles.header}>
          <Text style={styles.titulo}>
            {categoriaNome} para {animalNome}
          </Text>
          <Text style={styles.subtitulo}>Carregando produtos...</Text>
        </View>
        <LoadingSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: `${categoriaNome} - ${animalNome}`,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 16,
          },
        }}
      />

      <FlatList
        data={produtos}
        renderItem={({ item }) => <ProdutoCard produto={item} />}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listaContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={onRefresh}
            colors={['#059669']}
            tintColor={'#059669'}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.titulo}>
              {infoCategoria?.categoria?.nome || categoriaNome} para {infoCategoria?.animal || animalNome}
            </Text>
            <Text style={styles.subtitulo}>
              {infoCategoria?.totalProdutos || produtos.length} {produtos.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
            </Text>
            <Text style={styles.descricaoHeader}>
              {infoCategoria?.descricao || `Produtos de ${categoriaNome} para ${animalNome}`}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={80} color="#CBD5E1" />
            <Text style={styles.emptyStateTitulo}>Nenhum produto encontrado</Text>
            <Text style={styles.emptyStateTexto}>
              Não encontramos produtos de {categoriaNome.toLowerCase()} para {animalNome.toLowerCase()} no momento.
            </Text>
            <TouchableOpacity 
              style={styles.botaoVoltar}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={16} color="#FFFFFF" />
              <Text style={styles.botaoVoltarTexto}>Voltar para Animais</Text>
            </TouchableOpacity>
          </View>
        }
        ListFooterComponent={
          produtos.length > 0 && (
            <View style={styles.footer}>
              <Text style={styles.footerTexto}>
                Mostrando {produtos.length} produtos
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  listaContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 8,
  },
  descricaoHeader: {
    fontSize: 14,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  produtoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 0,
  },
  categoriaTag: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoriaTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0369A1',
  },
  favoritoButton: {
    padding: 4,
  },
  produtoImagemContainer: {
    height: 120,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
    marginBottom: 0,
    borderRadius: 12,
  },
  produtoImagem: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  iconeContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  produtoIcone: {
    fontSize: 48,
  },
  semImagemTexto: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 8,
  },
  produtoInfo: {
    padding: 16,
  },
  produtoNome: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
    lineHeight: 24,
  },
  produtoDescricao: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
    lineHeight: 20,
  },
  precosContainer: {
    marginBottom: 16,
  },
  precoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  farmaciaNome: {
    fontSize: 14,
    color: '#475569',
    flex: 1,
  },
  precoTexto: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
    marginLeft: 8,
  },
  precoIndisponivel: {
    fontSize: 14,
    color: '#94A3B8',
    fontStyle: 'italic',
    marginLeft: 8,
  },
  estoqueTexto: {
    fontSize: 12,
    color: '#94A3B8',
    marginLeft: 8,
  },
  botaoCarrinho: {
    backgroundColor: '#D1FAE5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#059669',
  },
  botaoCarrinhoAdicionado: {
    backgroundColor: '#059669',
  },
  botaoCarrinhoTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
    marginLeft: 8,
  },
  botaoCarrinhoTextoAdicionado: {
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginTop: 20,
  },
  emptyStateTitulo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#475569',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateTexto: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  botaoVoltar: {
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  botaoVoltarTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    padding: 16,
  },
  footerTexto: {
    fontSize: 14,
    color: '#94A3B8',
  },
  skeletonContainer: {
    padding: 16,
  },
  skeletonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    flexDirection: 'row',
  },
  skeletonImage: {
    width: 80,
    height: 80,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    marginRight: 16,
  },
  skeletonContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  skeletonLine: {
    height: 16,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonShort: {
    width: '60%',
  },
  skeletonButton: {
    height: 40,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    marginTop: 8,
  },
});