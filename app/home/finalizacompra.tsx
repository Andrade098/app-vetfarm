// home/finalizacompra.tsx - VERSÃO COMPLETA COM SISTEMA DE CUPOM AUTOMÁTICO
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEnderecos } from '../../contexts/EnderecoContext';
import { useAuth } from '../../contexts/AuthContext';
import { usePedidos } from '../../contexts/PedidoContext';
import { useCart } from '../../contexts/CartContext';
import { useFidelidade } from '../../contexts/FidelidadeContext';

export default function FinalizarCompra() {
  
  const router = useRouter();
  const params = useLocalSearchParams();
  const { enderecoPrincipal, loading: loadingEnderecos } = useEnderecos();
  const { user } = useAuth();
  const { criarPedido, carregarPedidos } = usePedidos();
  const { 
    cart: cartItems,
    pontosGanhos, 
    descontoFidelidade, 
    descontoAplicado, 
    aplicarDescontoFidelidade, 
    removerDescontoFidelidade,
    calcularTotalComDesconto,
    clearCart,
    calcularTotalCarrinho,
    calcularPontos,
    setPontosGanhos,
    carregarCarrinho
  } = useCart();
  
  // 🔥 ADICIONAR HOOK DO FIDELIDADE CONTEXT
  const { 
    verificarEConcederCupom, 
    usarCupomDesconto,
    temCupomDisponivel 
  } = useFidelidade();
  
  // 🔥 VARIÁVEL DE FALLBACK - USA PARAMS DIRETAMENTE
  const [cartItemsFallback, setCartItemsFallback] = useState<any[]>([]);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formaPagamento, setFormaPagamento] = useState('pix');
  const [finalizando, setFinalizando] = useState(false);
  const [carregandoCarrinho, setCarregandoCarrinho] = useState(true);

  const [dadosPagamento, setDadosPagamento] = useState({
    nome: user?.nome || '',
    email: user?.email || '',
    telefone: user?.telefone || '',
    cpfNotaFiscal: '',
    emailNotaFiscal: user?.email || ''
  });

  const [pedidoConfirmado, setPedidoConfirmado] = useState({
    numeroPedido: Math.floor(100000 + Math.random() * 900000).toString(),
    codigoRastreio: `VF${Math.floor(100000000 + Math.random() * 900000000)}BR`,
    dataEntrega: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
    dataPedido: new Date().toLocaleDateString('pt-BR')
  });

  const formasPagamento = [
    { id: 'pix', nome: 'PIX', icon: '📱' },
  ];

  const temDescontoDisponivel = user?.desconto_proxima_compra > 0 && 
    (!user.data_expiracao_desconto || new Date(user.data_expiracao_desconto) > new Date());

  // 🔥 EFFECT PRINCIPAL - TENTA TODOS OS MÉTODOS
  useEffect(() => {
    const carregarTodosOsDados = async () => {
      console.log('🚀 INICIANDO CARREGAMENTO DE DADOS...');
      setCarregandoCarrinho(true);
      
      try {
        // 1. Tenta carregar do Context
        console.log('📦 Método 1: Carregando do Context...');
        await carregarCarrinho();
        
        // 2. Tenta carregar do AsyncStorage
        console.log('📦 Método 2: Carregando do AsyncStorage...');
        const carrinhoSalvo = await AsyncStorage.getItem('@carrinho');
        console.log('📦 AsyncStorage result:', carrinhoSalvo);
        
        if (carrinhoSalvo) {
          const carrinhoParseado = JSON.parse(carrinhoSalvo);
          console.log('✅ Carrinho do AsyncStorage:', carrinhoParseado);
        }
        
        // 3. 🔥 Tenta carregar dos PARAMS (MÉTODO DE EMERGÊNCIA)
        console.log('📦 Método 3: Verificando parâmetros...');
        console.log('📦 Parâmetros recebidos:', params);
        
        if (params.cartItems) {
          try {
            const itemsFromParams = JSON.parse(params.cartItems as string);
            console.log('🔥 ITENS DOS PARÂMETROS:', itemsFromParams);
            setCartItemsFallback(itemsFromParams);
          } catch (error) {
            console.log('❌ Erro ao parsear params:', error);
          }
        }
        
      } catch (error) {
        console.error('❌ Erro geral ao carregar dados:', error);
      } finally {
        setCarregandoCarrinho(false);
      }
    };

    carregarTodosOsDados();
  }, []);

  // 🔥 FUNÇÃO QUE USA O FALLBACK
  const getCartItems = () => {
    // Prioridade: Context > Fallback
    if (cartItems && cartItems.length > 0) {
      console.log('✅ Usando itens do Context:', cartItems.length);
      return cartItems;
    } else if (cartItemsFallback.length > 0) {
      console.log('🔥 Usando itens do Fallback:', cartItemsFallback.length);
      return cartItemsFallback;
    } else {
      console.log('❌ Nenhum item encontrado');
      return [];
    }
  };

  const currentCartItems = getCartItems();

  // 🔥 FUNÇÃO CORRIGIDA PARA CALCULAR TOTAL COM DESCONTO
const calcularTotalFallback = () => {
  const items = currentCartItems;
  console.log('💰 CALCULANDO TOTAL FALLBACK - Itens:', items.length);
  
  if (items.length === 0) {
    console.log('🛒 Carrinho vazio');
    return '0,00';
  }
  
  let total = 0;
  
  // Calcula manualmente o total
  items.forEach((item: any) => {
    const precoString = item.preco || item.price || '0';
    console.log('🔍 Processando item:', item.nome || item.name, 'Preço:', precoString);
    
    // Converte preço brasileiro para número
    let precoNumerico = 0;
    if (precoString.includes('R$')) {
      const precoLimpo = precoString.replace('R$', '').trim().replace(',', '.');
      precoNumerico = parseFloat(precoLimpo) || 0;
    } else {
      precoNumerico = parseFloat(precoString.replace(',', '.')) || 0;
    }
    
    const subtotal = precoNumerico * item.quantity;
    total += subtotal;
    console.log(`📦 ${item.quantity}x ${item.nome || item.name}: R$ ${precoNumerico} = R$ ${subtotal}`);
  });
  
  console.log('💰 Total sem desconto:', total);
  
  // 🔥 CORREÇÃO: CALCULA O DESCONTO CORRETAMENTE BASEADO NO PERCENTUAL DO USUÁRIO
  if (descontoAplicado && user?.desconto_proxima_compra && user.desconto_proxima_compra > 0) {
    const percentualDesconto = user.desconto_proxima_compra;
    const valorDesconto = (total * percentualDesconto) / 100;
    total = Math.max(0, total - valorDesconto);
    console.log('💰 Total COM desconto aplicado:', total, `(Desconto: ${percentualDesconto}% = R$ ${valorDesconto.toFixed(2)})`);
  } else {
    console.log('💰 Total sem desconto aplicado:', total);
  }
  
  return total.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

  const total = calcularTotalFallback();

  // 🔥 FUNÇÃO PARA CALCULAR O VALOR DO DESCONTO (PARA EXIBIÇÃO)
  const calcularValorDesconto = () => {
    const items = currentCartItems;
    if (items.length === 0) return 0;
    
    let totalSemDesconto = 0;
    
    items.forEach((item: any) => {
      const precoString = item.preco || item.price || '0';
      let precoNumerico = 0;
      
      if (precoString.includes('R$')) {
        const precoLimpo = precoString.replace('R$', '').trim().replace(',', '.');
        precoNumerico = parseFloat(precoLimpo) || 0;
      } else {
        precoNumerico = parseFloat(precoString.replace(',', '.')) || 0;
      }
      
      totalSemDesconto += precoNumerico * item.quantity;
    });
    
    if (descontoAplicado && user?.desconto_proxima_compra && user.desconto_proxima_compra > 0) {
      return (totalSemDesconto * user.desconto_proxima_compra) / 100;
    }
    
    return 0;
  };

  const valorDesconto = calcularValorDesconto();

  // 🔥 FUNÇÃO PARA CALCULAR PONTOS COM FALLBACK
  const calcularPontosFallback = () => {
    const items = currentCartItems;
    if (items.length === 0) return 0;
    
    let totalPontos = 0;
    
    // Calcula manualmente o total para pontos
    items.forEach((item: any) => {
      const precoString = item.preco || item.price || '0';
      let precoNumerico = 0;
      
      if (precoString.includes('R$')) {
        const precoLimpo = precoString.replace('R$', '').trim().replace(',', '.');
        precoNumerico = parseFloat(precoLimpo) || 0;
      } else {
        precoNumerico = parseFloat(precoString.replace(',', '.')) || 0;
      }
      
      totalPontos += precoNumerico * item.quantity;
    });
    
    // Aplica a mesma lógica de pontos
    if (totalPontos >= 500) return 50;
    if (totalPontos >= 350) return 35;
    if (totalPontos >= 250) return 20;
    if (totalPontos >= 100) return 10;
    
    return Math.floor(totalPontos / 10);
  };

  const pontosCalculados = calcularPontosFallback();

  const pontosTemporarios = {
    adicionarPontos: async (pontos: number) => {
      console.log('🎯 Pontos adicionados (temporário):', pontos);
      try {
        const pontosAtuais = await AsyncStorage.getItem('@pontos_fidelidade');
        const novosPontos = (parseInt(pontosAtuais || '0')) + pontos;
        await AsyncStorage.setItem('@pontos_fidelidade', novosPontos.toString());
        console.log('✅ Pontos salvos temporariamente:', novosPontos);
      } catch (error) {
        console.log('❌ Erro ao salvar pontos temporários:', error);
      }
    }
  };

  // Resto dos effects...
  useEffect(() => {
    if (currentStep === 1 && !loadingEnderecos && !enderecoPrincipal) {
      Alert.alert(
        'Endereço Necessário',
        'Você precisa cadastrar um endereço de entrega antes de finalizar a compra.',
        [
          { text: 'Cancelar', style: 'cancel', onPress: () => router.back() },
          { 
            text: 'Cadastrar Endereço', 
            onPress: () => router.push('/home/novoendereco')
          }
        ]
      );
    }
  }, [currentStep, loadingEnderecos, enderecoPrincipal]);

  useEffect(() => {
    if (user) {
      setDadosPagamento(prev => ({
        ...prev,
        nome: user.nome || '',
        email: user.email || '',
        telefone: user.telefone || '',
        emailNotaFiscal: user.email || ''
      }));
    }
  }, [user]);

  const handleSelecionarPagamento = (forma: string) => {
    setFormaPagamento(forma);
  };

  const handleAvancar = () => {
    if (currentStep === 1) {
      if (!enderecoPrincipal) {
        Alert.alert(
          'Endereço Necessário',
          'Você precisa cadastrar um endereço de entrega.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { 
              text: 'Cadastrar Endereço', 
              onPress: () => router.push('/home/novoendereco')
            }
          ]
        );
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      if (!dadosPagamento.cpfNotaFiscal) {
        Alert.alert('Atenção', 'Por favor, informe o CPF para emissão da nota fiscal');
        return;
      }
      setCurrentStep(5);
    }
  };

  const handleVoltar = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  // 🔥 FUNÇÃO handleFinalizarCompra MODIFICADA COM SISTEMA DE CUPOM
  const handleFinalizarCompra = async () => {
    try {
      setFinalizando(true);

      console.log('🚀 INICIANDO FINALIZAÇÃO...');
      console.log('📦 Itens no carrinho:', currentCartItems.length);
      console.log('💰 Total:', total);

      // 🔥 CONVERTER TOTAL PARA NÚMERO PARA VERIFICAR CUPOM
      const totalNumerico = parseFloat(total.replace('.', '').replace(',', '.'));
      console.log('💰 Total numérico para cupom:', totalNumerico);

      // 🔥 VERIFICAR E CONCEDER CUPOM PARA PRÓXIMA COMPRA (se aplicável)
      const resultadoCupom = await verificarEConcederCupom(totalNumerico);
      if (resultadoCupom.concedido) {
        console.log('🎫🎉 Cupom de', resultadoCupom.desconto + '% concedido para próxima compra!');
      }

      // 🔥 SE HOUVER CUPOM SENDO USADO NA COMPRA ATUAL, MARCA COMO UTILIZADO
      if (descontoAplicado && user?.desconto_proxima_compra && user.desconto_proxima_compra > 0) {
        console.log('🎫 Usando cupom de desconto atual...');
        await usarCupomDesconto();
      }

      const pedidoData = {
        numero_pedido: pedidoConfirmado.numeroPedido,
        codigo_rastreio: pedidoConfirmado.codigoRastreio,
        status: 'pendente' as const,
        total: total.replace('.', '').replace(',', '.'),
        endereco_entrega: enderecoPrincipal,
        forma_pagamento: 'pix',
        itens: currentCartItems.map((item: any) => ({
          id: item.id,
          name: item.nome || item.name,
          price: item.preco || item.price,
          quantity: item.quantity,
          image: item.imagem || item.image
        })),
        data_entrega_prevista: pedidoConfirmado.dataEntrega,
        pontos_ganhos: pontosCalculados
      };

      console.log('📦 Criando pedido...');
      await criarPedido(pedidoData);

      console.log('🎯 Adicionando pontos:', pontosCalculados);
      await pontosTemporarios.adicionarPontos(pontosCalculados);

      console.log('🗑️ Limpando carrinho...');
      await clearCart();

      await carregarPedidos();

      console.log('✅ COMPRA FINALIZADA COM SUCESSO!');

      // 🔥 MENSAGEM PERSONALIZADA COM INFO DO CUPOM
      let mensagemSucesso = `Seu pedido #${pedidoConfirmado.numeroPedido} foi processado com sucesso!\n\n📦 Será entregue no endereço: ${enderecoPrincipal?.apelido}\n⭐ Você ganhou ${pontosCalculados} pontos de fidelidade!\n💰 Total: R$ ${total}\n\n`;
      
      if (resultadoCupom.concedido) {
        mensagemSucesso += `🎫 **PARABÉNS!** Você ganhou um cupom de ${resultadoCupom.desconto}% de desconto para sua próxima compra!\n\n`;
      }
      
      mensagemSucesso += `Você pode acompanhar seus pedidos no menu "Meus Pedidos".`;

      Alert.alert(
        '🎉 Compra Finalizada com Sucesso!',
        mensagemSucesso,
        [
          {
            text: '🏠 Voltar à Loja',
            onPress: () => {
              router.replace('/home');
            }
          }
        ]
      );
    } catch (error: any) {
      console.error('❌ Erro ao finalizar compra:', error);
      
      Alert.alert(
        'Erro ao Finalizar Compra', 
        `Não foi possível finalizar a compra. \n\nErro: ${error.message || 'Tente novamente.'}`
      );
    } finally {
      setFinalizando(false);
    }
  };

  // 🔥 FUNÇÕES DE RENDERIZAÇÃO
  const getStepTitle = () => {
    switch(currentStep) {
      case 1: return 'Finalizar Compra';
      case 2: return 'Pagamento PIX';
      case 3: return 'Revisão do Pedido';
      case 4: return 'Nota Fiscal';
      case 5: return 'Confirmação';
      default: return 'Finalizar Compra';
    }
  };

  const getButtonText = () => {
    switch(currentStep) {
      case 1: return 'Pagar com PIX';
      case 2: return 'Revisar Pedido';
      case 3: return 'Continuar para Nota Fiscal';
      case 4: return 'Confirmar e Finalizar';
      case 5: return finalizando ? 'Finalizando...' : 'Voltar à Loja';
      default: return 'Avançar';
    }
  };

  const renderStep1 = () => (
    <>
      {temDescontoDisponivel && !descontoAplicado && (
        <View style={styles.fidelidadeSection}>
          <View style={styles.fidelidadeHeader}>
            <Ionicons name="trophy" size={24} color="#FFD700" />
            <Text style={styles.fidelidadeTitle}>Desconto de Fidelidade Disponível!</Text>
          </View>
          <Text style={styles.fidelidadeText}>
            Você tem {user?.desconto_proxima_compra}% de desconto para esta compra!
          </Text>
          <TouchableOpacity 
            style={styles.aplicarDescontoButton}
            onPress={() => aplicarDescontoFidelidade(user?.desconto_proxima_compra || 0)}
          >
            <Ionicons name="sparkles" size={16} color="white" />
            <Text style={styles.aplicarDescontoText}>Aplicar {user?.desconto_proxima_compra}% de Desconto</Text>
          </TouchableOpacity>
        </View>
      )}

      {descontoAplicado && (
        <View style={styles.descontoAplicadoSection}>
          <View style={styles.descontoAplicadoHeader}>
            <Ionicons name="checkmark-circle" size={20} color="#27ae60" />
            <Text style={styles.descontoAplicadoText}>
              Desconto de {user?.desconto_proxima_compra}% aplicado!
            </Text>
          </View>
          <Text style={styles.descontoValorText}>
            Economia de R$ {valorDesconto.toFixed(2)}
          </Text>
          <TouchableOpacity 
            style={styles.removerDescontoButton}
            onPress={removerDescontoFidelidade}
          >
            <Text style={styles.removerDescontoText}>Remover desconto</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.pontosSection}>
        <View style={styles.pontosHeader}>
          <Ionicons name="star" size={20} color="#FFD700" />
          <Text style={styles.pontosTitle}>Pontos de Fidelidade</Text>
        </View>
        
        <Text style={styles.pontosText}>
          Com esta compra você ganhará: <Text style={styles.pontosDestaque}>{pontosCalculados} pontos</Text>
        </Text>
        <Text style={styles.pontosInfo}>
          Seus pontos totais: {(user?.pontos_fidelidade || 0) + pontosCalculados}
        </Text>
      </View>

      <View style={styles.resumo}>
        <Text style={styles.subtitulo}>Resumo do Pedido</Text>
        {currentCartItems.map((item: any, index: number) => (
          <View key={index} style={styles.item}>
            <View>
              <Text style={styles.itemNome}>{item.nome || item.name}</Text>
              <Text style={styles.itemQuantidade}>Quantidade: {item.quantity}</Text>
            </View>
            <Text style={styles.itemPreco}>{item.preco || item.price}</Text>
          </View>
        ))}
        
        {descontoAplicado && (
          <View style={styles.item}>
            <Text style={styles.itemNome}>Desconto Fidelidade:</Text>
            <Text style={styles.descontoItemPreco}>- R$ {valorDesconto.toFixed(2)}</Text>
          </View>
        )}
          
        <View style={styles.total}>
          <Text style={styles.totalTexto}>Total: R$ {total}</Text>
        </View>

        {/* 🔥 NOVA SEÇÃO DE INFO SOBRE CUPOM FUTURO */}
        {parseFloat(total.replace('.', '').replace(',', '.')) > 500 && !descontoAplicado && (
          <View style={styles.cupomInfoSection}>
            <View style={styles.cupomInfoHeader}>
              <Ionicons name="gift" size={20} color="#E67E22" />
              <Text style={styles.cupomInfoTitle}>Oportunidade Especial!</Text>
            </View>
            <Text style={styles.cupomInfoText}>
              Compras acima de R$ 500,00 ganham <Text style={styles.cupomInfoDestaque}>10% de desconto automático</Text> na próxima compra!
            </Text>
          </View>
        )}
      </View>

      <View style={styles.secao}>
        <View style={styles.sectionHeader}>
          <Text style={styles.subtitulo}>Endereço de Entrega</Text>
          <TouchableOpacity onPress={() => router.push('/home/meusenderecos')}>
            <Text style={styles.editText}>Alterar</Text>
          </TouchableOpacity>
        </View>

        {enderecoPrincipal ? (
          <View style={styles.enderecoCard}>
            <View style={styles.enderecoHeader}>
              <Ionicons name="location" size={20} color="#126b1a" />
              <Text style={styles.enderecoApelido}>{enderecoPrincipal.apelido}</Text>
              <View style={styles.principalBadge}>
                <Text style={styles.principalText}>PRINCIPAL</Text>
              </View>
            </View>
            
            <View style={styles.enderecoDetails}>
              <Text style={styles.enderecoText}>
                {enderecoPrincipal.logradouro}, {enderecoPrincipal.numero}
                {enderecoPrincipal.complemento && `, ${enderecoPrincipal.complemento}`}
              </Text>
              <Text style={styles.enderecoText}>
                {enderecoPrincipal.bairro} - {enderecoPrincipal.cidade}/{enderecoPrincipal.estado}
              </Text>
              <Text style={styles.enderecoText}>CEP: {enderecoPrincipal.cep}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.semEnderecoCard}>
            <Ionicons name="location-outline" size={40} color="#ccc" />
            <Text style={styles.semEnderecoText}>Nenhum endereço cadastrado</Text>
            <Text style={styles.semEnderecoSubtext}>
              Cadastre um endereço para entrega
            </Text>
            <TouchableOpacity 
              style={styles.cadastrarEnderecoButton}
              onPress={() => router.push('/home/novoendereco')}
            >
              <Text style={styles.cadastrarEnderecoText}>Cadastrar Endereço</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.secao}>
        <Text style={styles.subtitulo}>Dados Pessoais</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome completo*"
          value={dadosPagamento.nome}
          onChangeText={(text) => setDadosPagamento({...dadosPagamento, nome: text})}
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail*"
          keyboardType="email-address"
          value={dadosPagamento.email}
          onChangeText={(text) => setDadosPagamento({...dadosPagamento, email: text})}
        />
        <TextInput
          style={styles.input}
          placeholder="Telefone"
          keyboardType="phone-pad"
          value={dadosPagamento.telefone}
          onChangeText={(text) => setDadosPagamento({...dadosPagamento, telefone: text})}
        />
      </View>

      <View style={styles.secao}>
        <Text style={styles.subtitulo}>Forma de Pagamento</Text>
        <Text style={styles.instrucao}>Pagamento rápido e seguro via PIX</Text>
        
        {formasPagamento.map((forma) => (
          <TouchableOpacity
            key={forma.id}
            style={[
              styles.pagamentoOption,
              formaPagamento === forma.id && styles.pagamentoOptionSelecionado
            ]}
            onPress={() => handleSelecionarPagamento(forma.id)}
          >
            <Text style={styles.pagamentoIcon}>{forma.icon}</Text>
            <Text style={styles.pagamentoNome}>{forma.nome}</Text>
            {formaPagamento === forma.id && (
              <Ionicons name="checkmark-circle" size={20} color="#27ae60" />
            )}
          </TouchableOpacity>
        ))}

        <View style={styles.pixInfo}>
          <Ionicons name="information-circle-outline" size={16} color="#126b1a" />
          <Text style={styles.pixInfoText}>
            Pagamento instantâneo • Disponível 24h • Sem taxas
          </Text>
        </View>
      </View>
    </>
  );

  const renderStep2 = () => (
    <>
      <View style={styles.resumo}>
        <Text style={styles.subtitulo}>Resumo do Pedido</Text>
        {currentCartItems.map((item: any, index: number) => (
          <View key={index} style={styles.item}>
            <View>
              <Text style={styles.itemNome}>{item.nome || item.name}</Text>
              <Text style={styles.itemQuantidade}>Quantidade: {item.quantity}</Text>
            </View>
            <Text style={styles.itemPreco}>{item.preco || item.price}</Text>
          </View>
        ))}
        <View style={styles.item}>
          <Text style={styles.itemNome}>Forma de Pagamento:</Text>
          <Text style={styles.itemPreco}>PIX</Text>
        </View>
        <View style={styles.total}>
          <Text style={styles.totalTexto}>Total: R$ {total}</Text>
        </View>
      </View>

      <View style={styles.secao}>
        <Text style={styles.subtitulo}>Pagamento via PIX</Text>
        
        <View style={styles.pixContainer}>
          <Text style={styles.pixTitulo}>Pague com PIX</Text>
          <Text style={styles.pixInstrucao}>
            Escaneie o QR Code abaixo ou copie a chave PIX para realizar o pagamento
          </Text>
          
          <View style={styles.qrCodePlaceholder}>
            <Text style={styles.qrCodeText}>QR CODE PIX</Text>
            <Text style={styles.qrCodeSubtext}>Aponte a câmera do seu app bancário</Text>
          </View>
          
          <View style={styles.chavePixContainer}>
            <Text style={styles.chavePixLabel}>Chave PIX (Copie e Cole):</Text>
            <TouchableOpacity style={styles.chavePixBox}>
              <Text style={styles.chavePixText}>
                00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-1234-567890abcdef5204000053039865406{total.replace(',', '')}5802BR5913VET FARM LTDA6008SAO PAULO62070503***6304A1B2
              </Text>
              <Ionicons name="copy-outline" size={20} color="#126b1a" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.botaoCopiar}>
              <Text style={styles.botaoCopiarTexto}>Copiar Chave PIX</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.pixAviso}>
            ✅ Pagamento aprovado automaticamente após a confirmação
          </Text>

          <View style={styles.instrucoesPix}>
            <Text style={styles.instrucoesTitulo}>Como pagar:</Text>
            <View style={styles.instrucaoItem}>
              <Text style={styles.instrucaoNumero}>1</Text>
              <Text style={styles.instrucaoTexto}>Abra seu app bancário</Text>
            </View>
            <View style={styles.instrucaoItem}>
              <Text style={styles.instrucaoNumero}>2</Text>
              <Text style={styles.instrucaoTexto}>Escaneie o QR Code ou cole a chave PIX</Text>
            </View>
            <View style={styles.instrucaoItem}>
              <Text style={styles.instrucaoNumero}>3</Text>
              <Text style={styles.instrucaoTexto}>Confirme o pagamento</Text>
            </View>
            <View style={styles.instrucaoItem}>
              <Text style={styles.instrucaoNumero}>4</Text>
              <Text style={styles.instrucaoTexto}>Pronto! Seu pedido será processado</Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );

  const renderStep3 = () => (
    <>
      <View style={styles.secao}>
        <Text style={styles.subtitulo}>Revise seu Pedido</Text>
        <Text style={styles.instrucao}>Confirme todas as informações antes de finalizar</Text>
        
        <View style={styles.revisaoGrupo}>
          <Text style={styles.revisaoTitulo}>Dados Pessoais</Text>
          <Text style={styles.revisaoTexto}>{dadosPagamento.nome}</Text>
          <Text style={styles.revisaoTexto}>{dadosPagamento.email}</Text>
          <Text style={styles.revisaoTexto}>{dadosPagamento.telefone}</Text>
        </View>

        <View style={styles.revisaoGrupo}>
          <Text style={styles.revisaoTitulo}>Endereço de Entrega</Text>
          {enderecoPrincipal ? (
            <>
              <Text style={styles.revisaoTexto}>
                {enderecoPrincipal.apelido} {enderecoPrincipal.principal && '(Principal)'}
              </Text>
              <Text style={styles.revisaoTexto}>
                {enderecoPrincipal.logradouro}, {enderecoPrincipal.numero}
                {enderecoPrincipal.complemento && `, ${enderecoPrincipal.complemento}`}
              </Text>
              <Text style={styles.revisaoTexto}>
                {enderecoPrincipal.bairro} - {enderecoPrincipal.cidade}/{enderecoPrincipal.estado}
              </Text>
              <Text style={styles.revisaoTexto}>CEP: {enderecoPrincipal.cep}</Text>
            </>
          ) : (
            <Text style={styles.revisaoTextoErro}>Nenhum endereço cadastrado</Text>
          )}
        </View>

        <View style={styles.revisaoGrupo}>
          <Text style={styles.revisaoTitulo}>Forma de Pagamento</Text>
          <Text style={styles.revisaoTexto}>PIX</Text>
          <Text style={styles.revisaoTextoPixInfo}>Pagamento instantâneo e seguro</Text>
        </View>

        <View style={styles.revisaoGrupo}>
          <Text style={styles.revisaoTitulo}>Itens do Pedido</Text>
          {currentCartItems.map((item: any, index: number) => (
            <View key={index} style={styles.revisaoItem}>
              <Text style={styles.revisaoTexto}>{item.quantity}x {item.nome || item.name}</Text>
              <Text style={styles.revisaoTexto}>{item.preco || item.price}</Text>
            </View>
          ))}
          {descontoAplicado && (
            <View style={styles.revisaoItem}>
              <Text style={styles.revisaoTexto}>Desconto Fidelidade:</Text>
              <Text style={styles.revisaoTextoDesconto}>- R$ {valorDesconto.toFixed(2)}</Text>
            </View>
          )}
          <View style={styles.revisaoTotal}>
            <Text style={styles.revisaoTotalTexto}>Total: R$ {total}</Text>
          </View>
        </View>

        <View style={styles.revisaoGrupo}>
          <Text style={styles.revisaoTitulo}>Pontos de Fidelidade</Text>
          <Text style={styles.revisaoTexto}>Pontos a ganhar: <Text style={styles.revisaoPontosDestaque}>{pontosCalculados} pontos</Text></Text>
          <Text style={styles.revisaoTexto}>Total após compra: <Text style={styles.revisaoPontosDestaque}>{(user?.pontos_fidelidade || 0) + pontosCalculados} pontos</Text></Text>
        </View>

        {/* 🔥 NOVA SEÇÃO DE INFO SOBRE CUPOM FUTURO NA REVISÃO */}
        {parseFloat(total.replace('.', '').replace(',', '.')) > 500 && !descontoAplicado && (
          <View style={styles.revisaoGrupo}>
            <Text style={styles.revisaoTitulo}>Benefício Especial</Text>
            <View style={styles.cupomRevisaoInfo}>
              <Ionicons name="gift" size={20} color="#E67E22" />
              <Text style={styles.cupomRevisaoTexto}>
                Esta compra acima de R$ 500,00 garante <Text style={styles.cupomRevisaoDestaque}>10% de desconto automático</Text> na sua próxima compra!
              </Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.termosContainer}>
        <Text style={styles.termosTexto}>
          Ao confirmar o pedido, você concorda com nossos{' '}
          <Text style={styles.termosLink}>Termos de Uso</Text> e{' '}
          <Text style={styles.termosLink}>Política de Privacidade</Text>.
        </Text>
      </View>
    </>
  );

  const renderStep4 = () => (
    <>
      <View style={styles.secao}>
        <Text style={styles.subtitulo}>Nota Fiscal</Text>
        <Text style={styles.instrucao}>
          Informe os dados para emissão da nota fiscal
        </Text>

        <View style={styles.notaFiscalContainer}>
          <View style={styles.notaFiscalInfo}>
            <Ionicons name="document-text-outline" size={24} color="#126b1a" />
            <Text style={styles.notaFiscalTitulo}>Nota Fiscal Eletrônica</Text>
          </View>
          <Text style={styles.notaFiscalDescricao}>
            A nota fiscal será enviada automaticamente para seu email após a confirmação do pagamento.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="CPF para nota fiscal*"
            keyboardType="numeric"
            value={dadosPagamento.cpfNotaFiscal}
            onChangeText={(text) => setDadosPagamento({...dadosPagamento, cpfNotaFiscal: text})}
          />

          <TextInput
            style={styles.input}
            placeholder="Email para receber a nota (opcional)"
            keyboardType="email-address"
            value={dadosPagamento.emailNotaFiscal}
            onChangeText={(text) => setDadosPagamento({...dadosPagamento, emailNotaFiscal: text})}
          />

          <View style={styles.notaFiscalAviso}>
            <Ionicons name="information-circle-outline" size={16} color="#666" />
            <Text style={styles.notaFiscalAvisoTexto}>
              Se não informar um email específico, usaremos: {dadosPagamento.email}
            </Text>
          </View>
        </View>
      </View>
    </>
  );

  const renderStep5 = () => (
    <>
      <View style={styles.secao}>
        <View style={styles.confirmacaoHeader}>
          <Ionicons name="checkmark-circle" size={60} color="#27ae60" />
          <Text style={styles.confirmacaoTitulo}>Pedido Confirmado!</Text>
          <Text style={styles.confirmacaoSubtitulo}>
            Seu pedido foi processado com sucesso
          </Text>
        </View>

        <View style={styles.pontosGanhosSection}>
          <View style={styles.pontosGanhosHeader}>
            <Ionicons name="trophy" size={24} color="#FFD700" />
            <Text style={styles.pontosGanhosTitle}>Pontos Ganhos!</Text>
          </View>
          <Text style={styles.pontosGanhosText}>
            Você ganhou <Text style={styles.pontosGanhosDestaque}>{pontosCalculados} pontos</Text> com esta compra!
          </Text>
          <Text style={styles.pontosGanhosInfo}>
            Seus pontos totais: {(user?.pontos_fidelidade || 0) + pontosCalculados}
          </Text>
        </View>

        {/* 🔥 NOVA SEÇÃO DE CUPOM CONCEDIDO NA CONFIRMAÇÃO */}
        {parseFloat(total.replace('.', '').replace(',', '.')) > 500 && (
          <View style={styles.cupomConcedidoSection}>
            <View style={styles.cupomConcedidoHeader}>
              <Ionicons name="gift" size={24} color="#E67E22" />
              <Text style={styles.cupomConcedidoTitle}>Cupom Concedido!</Text>
            </View>
            <Text style={styles.cupomConcedidoText}>
              🎉 <Text style={styles.cupomConcedidoDestaque}>PARABÉNS!</Text> Você ganhou um cupom de{' '}
              <Text style={styles.cupomConcedidoDestaque}>10% de desconto</Text> para sua próxima compra!
            </Text>
            <Text style={styles.cupomConcedidoInfo}>
              O desconto será aplicado automaticamente no seu próximo pedido. Válido por 30 dias.
            </Text>
          </View>
        )}

        <View style={styles.pedidoInfoContainer}>
          <View style={styles.pedidoInfo}>
            <Text style={styles.pedidoInfoLabel}>Número do Pedido</Text>
            <Text style={styles.pedidoInfoValor}>#{pedidoConfirmado.numeroPedido}</Text>
          </View>

          <View style={styles.pedidoInfo}>
            <Text style={styles.pedidoInfoLabel}>Data do Pedido</Text>
            <Text style={styles.pedidoInfoValor}>{pedidoConfirmado.dataPedido}</Text>
          </View>

          <View style={styles.pedidoInfo}>
            <Text style={styles.pedidoInfoLabel}>Previsão de Entrega</Text>
            <Text style={styles.pedidoInfoValor}>{pedidoConfirmado.dataEntrega}</Text>
          </View>

          <View style={styles.pedidoInfo}>
            <Text style={styles.pedidoInfoLabel}>Endereço de Entrega</Text>
            <Text style={styles.pedidoInfoValor}>{enderecoPrincipal?.apelido}</Text>
          </View>

          <View style={styles.pedidoInfo}>
            <Text style={styles.pedidoInfoLabel}>Forma de Pagamento</Text>
            <Text style={styles.pedidoInfoValor}>PIX</Text>
          </View>
        </View>

        <View style={styles.resumoFinal}>
          <Text style={styles.resumoFinalTitulo}>Resumo da Compra</Text>
          <View style={styles.resumoFinalItem}>
            <Text style={styles.resumoFinalLabel}>Itens:</Text>
            <Text style={styles.resumoFinalValor}>{currentCartItems.length} produto(s)</Text>
          </View>
          
          {descontoAplicado && (
            <View style={styles.resumoFinalItem}>
              <Text style={styles.resumoFinalLabel}>Desconto Fidelidade:</Text>
              <Text style={styles.resumoFinalDesconto}>- R$ {valorDesconto.toFixed(2)}</Text>
            </View>
          )}
          
          <View style={styles.resumoFinalItem}>
            <Text style={styles.resumoFinalLabel}>Total:</Text>
            <Text style={styles.resumoFinalValor}>R$ {total}</Text>
          </View>
          <View style={styles.resumoFinalItem}>
            <Text style={styles.resumoFinalLabel}>Forma de Pagamento:</Text>
            <Text style={styles.resumoFinalValor}>PIX</Text>
          </View>
          <View style={styles.resumoFinalItem}>
            <Text style={styles.resumoFinalLabel}>Endereço:</Text>
            <Text style={styles.resumoFinalValor}>{enderecoPrincipal?.apelido}</Text>
          </View>
          
          <View style={styles.resumoFinalItem}>
            <Text style={styles.resumoFinalLabel}>Pontos Ganhos:</Text>
            <Text style={styles.resumoFinalPontos}>+{pontosCalculados} pontos</Text>
          </View>

          {/* 🔥 NOVA LINHA NO RESUMO FINAL PARA O CUPOM */}
          {parseFloat(total.replace('.', '').replace(',', '.')) > 500 && (
            <View style={styles.resumoFinalItem}>
              <Text style={styles.resumoFinalLabel}>Cupom Ganho:</Text>
              <Text style={styles.resumoFinalCupom}>+10% próxima compra</Text>
            </View>
          )}
        </View>

        <View style={styles.infoAcompanhamento}>
          <Ionicons name="information-circle" size={20} color="#126b1a" />
          <Text style={styles.infoAcompanhamentoTexto}>
            Você pode acompanhar seus pedidos no menu "Meus Pedidos"
          </Text>
        </View>
      </View>
    </>
  );

  // 🔥 LOADING
  if (carregandoCarrinho) {
    return (
      <View style={styles.fullContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#126b1a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Finalizar Compra</Text>
          <View style={styles.headerPlaceholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#126b1a" />
          <Text style={styles.loadingText}>Carregando dados do pedido...</Text>
        </View>
      </View>
    );
  }

  if (loadingEnderecos && !enderecoPrincipal && currentStep === 1) {
    return (
      <View style={styles.fullContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleVoltar}
          >
            <Ionicons name="arrow-back" size={24} color="#126b1a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{getStepTitle()}</Text>
          <View style={styles.headerPlaceholder} />
        </View>
        <View style={styles.loadingContainer}>
          <Ionicons name="refresh" size={40} color="#126b1a" />
          <Text style={styles.loadingText}>Carregando endereços...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.fullContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleVoltar}
        >
          <Ionicons name="arrow-back" size={24} color="#126b1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getStepTitle()}</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <View style={styles.stepsContainer}>
        {[1, 2, 3, 4, 5].map((step) => (
          <React.Fragment key={step}>
            <View style={[styles.step, currentStep === step && styles.stepAtivo]}>
              <Text style={[styles.stepText, currentStep === step && styles.stepTextAtivo]}>
                {step}
              </Text>
              <Text style={[styles.stepLabel, currentStep === step && styles.stepLabelAtivo]}>
                {step === 1 && 'Dados'}
                {step === 2 && 'PIX'}
                {step === 3 && 'Revisão'}
                {step === 4 && 'Nota Fiscal'}
                {step === 5 && 'Confirmação'}
              </Text>
            </View>
            {step < 5 && <View style={styles.stepLine} />}
          </React.Fragment>
        ))}
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}

        {currentStep !== 5 && (
          <View style={styles.botoes}>
            <TouchableOpacity 
              style={styles.botaoVoltar}
              onPress={handleVoltar}
            >
              <Text style={styles.botaoVoltarTexto}>
                {currentStep === 1 ? 'Voltar' : 'Anterior'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.botaoAvancar,
                (!enderecoPrincipal || currentCartItems.length === 0) && styles.botaoAvancarDisabled
              ]}
              onPress={handleAvancar}
              disabled={!enderecoPrincipal || currentCartItems.length === 0}
            >
              <Text style={styles.botaoAvancarTexto}>
                {getButtonText()}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {currentStep === 5 && (
          <View style={styles.botoesFinal}>
            <TouchableOpacity 
              style={[styles.botaoPrimario, finalizando && styles.botaoPrimarioDisabled]}
              onPress={handleFinalizarCompra}
              disabled={finalizando}
            >
              {finalizando ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Ionicons name="home-outline" size={20} color="white" />
              )}
              <Text style={styles.botaoPrimarioTexto}>
                {finalizando ? 'Finalizando...' : 'Voltar à Loja'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// 🎨 ESTILOS COMPLETOS COM NOVOS ESTILOS PARA O CUPOM
const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#126b1a',
  },
  headerPlaceholder: {
    width: 40,
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  step: {
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  stepAtivo: {},
  stepText: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ddd',
    textAlign: 'center',
    lineHeight: 30,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  stepTextAtivo: {
    backgroundColor: '#126b1a',
    color: '#fff',
  },
  stepLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  stepLabelAtivo: {
    color: '#126b1a',
    fontWeight: 'bold',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#ddd',
    marginHorizontal: 5,
    maxWidth: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 30,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#34495e',
  },
  instrucao: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  secao: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resumo: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemNome: {
    fontSize: 16,
    color: '#333',
  },
  itemQuantidade: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  itemPreco: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  total: {
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 10,
    marginTop: 10,
  },
  totalTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  pagamentoOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 2,
    borderColor: '#eee',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#fafafa',
  },
  pagamentoOptionSelecionado: {
    borderColor: '#126b1a',
    backgroundColor: '#f0f9f0',
  },
  pagamentoIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  pagamentoNome: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  pixInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9f0',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  pixInfoText: {
    fontSize: 12,
    color: '#126b1a',
    flex: 1,
    marginLeft: 8,
  },
  pixContainer: {
    alignItems: 'center',
  },
  pixTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#126b1a',
    marginBottom: 10,
  },
  pixInstrucao: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  qrCodePlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    marginBottom: 20,
  },
  qrCodeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
  },
  qrCodeSubtext: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  chavePixContainer: {
    width: '100%',
    marginBottom: 15,
  },
  chavePixLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  chavePixBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  chavePixText: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  botaoCopiar: {
    backgroundColor: '#126b1a',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoCopiarTexto: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  pixAviso: {
    fontSize: 14,
    color: '#27ae60',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 10,
  },
  instrucoesPix: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  instrucoesTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  instrucaoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  instrucaoNumero: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#126b1a',
    color: 'white',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 10,
  },
  instrucaoTexto: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  botoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
  botaoVoltar: {
    backgroundColor: '#95a5a6',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  botaoVoltarTexto: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  botaoAvancar: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 8,
    flex: 2,
    marginLeft: 10,
    alignItems: 'center',
  },
  botaoAvancarDisabled: {
    backgroundColor: '#bdc3c7',
  },
  botaoAvancarTexto: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  revisaoGrupo: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  revisaoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  revisaoTexto: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 4,
  },
  revisaoTextoErro: {
    fontSize: 14,
    color: '#e74c3c',
    fontStyle: 'italic',
  },
  revisaoTextoPixInfo: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  revisaoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  revisaoTotal: {
    borderTopWidth: 1,
    borderTopColor: '#bdc3c7',
    paddingTop: 10,
    marginTop: 10,
  },
  revisaoTotalTexto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  termosContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  termosTexto: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  termosLink: {
    color: '#126b1a',
    fontWeight: '500',
  },
  notaFiscalContainer: {
    alignItems: 'center',
  },
  notaFiscalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  notaFiscalTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#126b1a',
    marginLeft: 10,
  },
  notaFiscalDescricao: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  notaFiscalAviso: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  notaFiscalAvisoTexto: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  confirmacaoHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  confirmacaoTitulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27ae60',
    marginTop: 10,
    marginBottom: 5,
  },
  confirmacaoSubtitulo: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  pedidoInfoContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  pedidoInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  pedidoInfoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  pedidoInfoValor: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  resumoFinal: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  resumoFinalTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  resumoFinalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  resumoFinalLabel: {
    fontSize: 14,
    color: '#666',
  },
  resumoFinalValor: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
  infoAcompanhamento: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9f0',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  infoAcompanhamentoTexto: {
    fontSize: 14,
    color: '#126b1a',
    flex: 1,
    fontWeight: '500',
    marginLeft: 10,
  },
  botoesFinal: {
    marginTop: 20,
    marginBottom: 40,
  },
  botaoPrimario: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 8,
  },
  botaoPrimarioDisabled: {
    backgroundColor: '#bdc3c7',
  },
  botaoPrimarioTexto: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  editText: {
    fontSize: 14,
    color: '#126b1a',
    fontWeight: '500',
  },
  enderecoCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#126b1a',
  },
  enderecoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  enderecoApelido: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginLeft: 8,
  },
  principalBadge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  principalText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#126b1a',
  },
  enderecoDetails: {
    marginTop: 5,
  },
  enderecoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  semEnderecoCard: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#eee',
    borderStyle: 'dashed',
  },
  semEnderecoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 10,
    marginBottom: 5,
  },
  semEnderecoSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 15,
  },
  cadastrarEnderecoButton: {
    backgroundColor: '#126b1a',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cadastrarEnderecoText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 200,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  fidelidadeSection: {
    backgroundColor: '#FFF9E6',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  fidelidadeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fidelidadeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E67E22',
    marginLeft: 8,
  },
  fidelidadeText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  aplicarDescontoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#27ae60',
    padding: 12,
    borderRadius: 8,
  },
  aplicarDescontoText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  descontoAplicadoSection: {
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#27ae60',
  },
  descontoAplicadoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  descontoAplicadoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
    marginLeft: 8,
  },
  descontoValorText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  removerDescontoButton: {
    alignSelf: 'flex-start',
  },
  removerDescontoText: {
    color: '#e74c3c',
    fontSize: 12,
    fontWeight: '500',
  },
  pontosSection: {
    backgroundColor: '#F0F8FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  pontosHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pontosTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginLeft: 8,
  },
  pontosText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  pontosDestaque: {
    fontWeight: 'bold',
    color: '#E67E22',
  },
  pontosInfo: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  descontoItemPreco: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  pontosGanhosSection: {
    backgroundColor: '#FFF9E6',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  pontosGanhosHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pontosGanhosTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E67E22',
    marginLeft: 8,
  },
  pontosGanhosText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  pontosGanhosDestaque: {
    fontWeight: 'bold',
    color: '#E67E22',
    fontSize: 18,
  },
  pontosGanhosInfo: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  resumoFinalDesconto: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  resumoFinalPontos: {
    fontSize: 14,
    color: '#E67E22',
    fontWeight: 'bold',
  },
  revisaoTextoDesconto: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  revisaoPontosDestaque: {
    fontWeight: 'bold',
    color: '#E67E22',
  },

  // 🔥 NOVOS ESTILOS PARA O SISTEMA DE CUPOM
  cupomInfoSection: {
    backgroundColor: '#FFF0F5',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#E67E22',
  },
  cupomInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cupomInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E67E22',
    marginLeft: 8,
  },
  cupomInfoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  cupomInfoDestaque: {
    fontWeight: 'bold',
    color: '#E67E22',
  },
  cupomRevisaoInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF0F5',
    padding: 12,
    borderRadius: 8,
  },
  cupomRevisaoTexto: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    marginLeft: 8,
    lineHeight: 18,
  },
  cupomRevisaoDestaque: {
    fontWeight: 'bold',
    color: '#E67E22',
  },
  cupomConcedidoSection: {
    backgroundColor: '#FFF0F5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#E67E22',
  },
  cupomConcedidoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cupomConcedidoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E67E22',
    marginLeft: 8,
  },
  cupomConcedidoText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  cupomConcedidoDestaque: {
    fontWeight: 'bold',
    color: '#E67E22',
  },
  cupomConcedidoInfo: {
    fontSize: 14,
    color: '#7F8C8D',
    fontStyle: 'italic',
  },
  resumoFinalCupom: {
    fontSize: 14,
    color: '#E67E22',
    fontWeight: 'bold',
  },
  
});

export default FinalizarCompra;