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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFavoritos } from '../../contexts/FavoritosContext'; // 🔥 NOVO IMPORT

const API_BASE_URL = 'http://192.168.0.2:3000/api';

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
  const [infoCategoria, setInfoCategoria] = useState(null);

  // 🔥🔥🔥 NOVO HOOK DOS FAVORITOS
  const { 
    toggleFavorito, 
    isFavorito 
  } = useFavoritos();

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
        console.log('Dados dos produtos:', produtosData.data.produtos);
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

  // ✅✅✅ FUNÇÃO CORRIGIDA PARA ADICIONAR AO CARRINHO ✅✅✅
  const toggleCarrinho = async (produto: any) => {
    try {
      const imagemProduto = getImagemProduto(produto);
      
      console.log('🖼️ Imagem para carrinho:', imagemProduto);
      
      // Salvar no AsyncStorage para acessar na home
      const produtoCarrinho = {
        id: `${produto.id}_${produto.FarmaciaProdutos?.[0]?.farmacia_id || '0'}`,
        produto_id: produto.id,
        farmacia_id: produto.FarmaciaProdutos?.[0]?.farmacia_id || '0',
        nome: produto.nome,
        descricao: produto.descricao,
        categoria: produto.Categoria?.nome,
        preco_venda: produto.FarmaciaProdutos?.[0]?.preco || 0,
        estoque: produto.FarmaciaProdutos?.[0]?.estoque || 0,
        farmacia_nome: produto.FarmaciaProdutos?.[0]?.Farmacia?.nome || 'Farmácia',
        imagens: produto.imagem || [],
        price: `R$ ${(produto.FarmaciaProdutos?.[0]?.preco || 0).toFixed(2).replace('.', ',')}`,
        // ✅ CORREÇÃO: ADICIONAR A IMAGEM NO FORMATO CORRETO PARA O CARRINHO
        image: imagemProduto ? { uri: imagemProduto } : null
      };

      // Obter carrinho existente do AsyncStorage
      const carrinhoExistente = await AsyncStorage.getItem('carrinhoItens');
      let carrinhoArray = [];
      
      if (carrinhoExistente) {
        carrinhoArray = JSON.parse(carrinhoExistente);
      }
      
      // Verificar se o produto já está no carrinho
      const produtoExistente = carrinhoArray.find((item: any) => 
        item.id === produtoCarrinho.id
      );
      
      if (produtoExistente) {
        // Se já existe, aumenta a quantidade
        carrinhoArray = carrinhoArray.map((item: any) =>
          item.id === produtoCarrinho.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        // Se não existe, adiciona novo
        carrinhoArray.push({ ...produtoCarrinho, quantity: 1 });
      }
      
      // Salvar no AsyncStorage
      await AsyncStorage.setItem('carrinhoItens', JSON.stringify(carrinhoArray));
      
      // Atualizar estado local
      setCarrinho(prev => {
        if (prev.includes(produtoCarrinho.id)) {
          return prev;
        } else {
          return [...prev, produtoCarrinho.id];
        }
      });
      
      Alert.alert('Sucesso', `${produto.nome} adicionado ao carrinho!`);
      console.log('✅ Produto adicionado ao carrinho:', produto.nome);
      console.log('📦 Dados do produto no carrinho:', produtoCarrinho);
      
    } catch (error) {
      console.error('❌ Erro ao adicionar ao carrinho:', error);
      Alert.alert('Erro', 'Não foi possível adicionar o produto ao carrinho');
    }
  };

  // 🔥🔥🔥 FUNÇÃO ATUALIZADA PARA TOGGLE FAVORITO (AGORA USA O CONTEXT)
  const handleToggleFavorito = (produto: any) => {
    const produtoFavorito = {
      id: `${produto.id}_${produto.FarmaciaProdutos?.[0]?.farmacia_id || '0'}`,
      produto_id: produto.id,
      farmacia_id: produto.FarmaciaProdutos?.[0]?.farmacia_id || '0',
      nome: produto.nome,
      descricao: produto.descricao,
      categoria: produto.Categoria?.nome,
      preco_venda: produto.FarmaciaProdutos?.[0]?.preco || 0,
      estoque: produto.FarmaciaProdutos?.[0]?.estoque || 0,
      farmacia_nome: produto.FarmaciaProdutos?.[0]?.Farmacia?.nome || 'Farmácia',
      imagens: produto.imagem || []
    };
    
    toggleFavorito(produtoFavorito);
  };

  // ✅✅✅ FUNÇÃO CORRIGIDA PARA OBTER IMAGEM DO PRODUTO ✅✅✅
  const getImagemProduto = (produto) => {
    // ✅ CORREÇÃO: usar 'imagem' em vez de 'imagens'
    if (!produto.imagem || produto.imagem.length === 0) {
      console.log('❌ Produto sem imagens:', produto.nome);
      return null;
    }

    try {
      let imageUrl = produto.imagem[0];
      
      console.log('🖼️ Imagem original:', imageUrl);

      // Se for string JSON, parsear
      if (typeof imageUrl === 'string' && imageUrl.startsWith('[')) {
        try {
          const parsedImages = JSON.parse(imageUrl);
          imageUrl = Array.isArray(parsedImages) && parsedImages.length > 0 ? parsedImages[0] : null;
          console.log('📦 Imagem parseada do JSON:', imageUrl);
        } catch (parseError) {
          console.log('❌ Erro ao parsear JSON de imagens:', parseError);
          return null;
        }
      }

      if (!imageUrl || typeof imageUrl !== 'string') {
        console.log('❌ URL de imagem inválida após parse');
        return null;
      }

      // ✅ CORREÇÃO PRINCIPAL: Verificar se já é uma URL completa
      if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        console.log('✅ URL completa encontrada:', imageUrl);
        return imageUrl;
      }

      // ✅ CORREÇÃO: Se for caminho relativo, adicionar base URL
      if (imageUrl.startsWith('/uploads/') || imageUrl.startsWith('uploads/')) {
        // Remove barras extras no início se houver
        const caminhoLimpo = imageUrl.replace(/^\/+/, '');
        const urlCompleta = `http://192.168.0.2:3000/${caminhoLimpo}`;
        console.log('✅ URL construída do uploads:', urlCompleta);
        return urlCompleta;
      }

      // ✅ Se for Base64, usar diretamente
      if (imageUrl.startsWith('data:image')) {
        console.log('✅ Imagem Base64 encontrada');
        return imageUrl;
      }

      // ✅ Tentativa final: adicionar base URL para qualquer caminho relativo
      const urlCompleta = `http://192.168.0.2:3000/${imageUrl.replace(/^\/+/, '')}`;
      console.log('✅ URL final construída:', urlCompleta);
      return urlCompleta;

    } catch (error) {
      console.error('❌ Erro ao processar imagem:', error);
      return null;
    }
  };

  // 🔥 NOVA FUNÇÃO: VOLTAR PARA HOME
  const handleVoltarParaHome = () => {
    router.replace('/home');
  };

  const ProdutoCard = ({ produto }) => {
    const imagemProduto = getImagemProduto(produto);
    const produtoCarrinhoId = `${produto.id}_${produto.FarmaciaProdutos?.[0]?.farmacia_id || '0'}`;
    const produtoFavoritoId = `${produto.id}_${produto.FarmaciaProdutos?.[0]?.farmacia_id || '0'}`;
    const produtoEstaFavoritado = isFavorito(produtoFavoritoId); // 🔥 USA O CONTEXT
    
    console.log('🔍 Debug Produto:', produto.nome);
    console.log('📸 Propriedade imagem:', produto.imagem);
    console.log('🖼️ Debug Imagem Final:', imagemProduto);
    
    return (
      <View style={styles.produtoCard}>
        {/* Header do Card */}
        <View style={styles.cardHeader}>
          <View style={styles.categoriaTag}>
            <Text style={styles.categoriaTagText}>
              {produto.Categoria?.nome || categoriaNome}
            </Text>
          </View>
          {/* 🔥🔥🔥 BOTÃO FAVORITO ATUALIZADO (AGORA USA O CONTEXT) */}
          <TouchableOpacity
            style={styles.favoritoButton}
            onPress={() => handleToggleFavorito(produto)}
          >
            <Ionicons
              name={produtoEstaFavoritado ? "heart" : "heart-outline"}
              size={20}
              color={produtoEstaFavoritado ? "#FF4757" : "#64748B"}
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

          {/* Botão de Ação - CORRIGIDO */}
          <TouchableOpacity
            style={[
              styles.botaoCarrinho,
              carrinho.includes(produtoCarrinhoId) && styles.botaoCarrinhoAdicionado
            ]}
            onPress={() => toggleCarrinho(produto)}
          >
            <Ionicons
              name={carrinho.includes(produtoCarrinhoId) ? "checkmark-circle" : "cart-outline"}
              size={18}
              color={carrinho.includes(produtoCarrinhoId) ? "#FFFFFF" : "#059669"}
            />
            <Text style={[
              styles.botaoCarrinhoTexto,
              carrinho.includes(produtoCarrinhoId) && styles.botaoCarrinhoTextoAdicionado
            ]}>
              {carrinho.includes(produtoCarrinhoId) ? 'Adicionado' : 'Adicionar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
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
            
            {/* 🔥 NOVO BOTÃO VOLTAR PARA HOME */}
            <TouchableOpacity 
              style={styles.botaoVoltarHome}
              onPress={handleVoltarParaHome}
            >
              <Ionicons name="home-outline" size={18} color="#FFFFFF" />
              <Text style={styles.botaoVoltarHomeTexto}>Voltar para Home</Text>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={80} color="#CBD5E1" />
            <Text style={styles.emptyStateTitulo}>Nenhum produto encontrado</Text>
            <Text style={styles.emptyStateTexto}>
              Não encontramos produtos de {categoriaNome.toLowerCase()} para {animalNome.toLowerCase()} no momento.
            </Text>
            
            {/* 🔥 BOTÃO VOLTAR PARA HOME NO EMPTY STATE */}
            <TouchableOpacity 
              style={styles.botaoVoltarHome}
              onPress={handleVoltarParaHome}
            >
              <Ionicons name="home-outline" size={18} color="#FFFFFF" />
              <Text style={styles.botaoVoltarHomeTexto}>Voltar para Home</Text>
            </TouchableOpacity>
          </View>
        }
        ListFooterComponent={
          produtos.length > 0 && (
            <View style={styles.footer}>
              {/* 🔥 BOTÃO VOLTAR PARA HOME NO FOOTER */}
              <TouchableOpacity 
                style={styles.botaoVoltarHomeFooter}
                onPress={handleVoltarParaHome}
              >
                <Ionicons name="home-outline" size={18} color="#FFFFFF" />
                <Text style={styles.botaoVoltarHomeTexto}>Voltar para Home</Text>
              </TouchableOpacity>
              
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
    marginBottom: 16,
  },
  // 🔥 NOVO ESTILO PARA BOTÃO VOLTAR HOME
  botaoVoltarHome: {
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  botaoVoltarHomeFooter: {
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  botaoVoltarHomeTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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
    marginTop: 8,
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