import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEnderecos } from '../../contexts/EnderecoContext';

export default function FinalizarCompra() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { enderecoPrincipal, loading } = useEnderecos();
  
  // RECEBE OS ITENS DO CARRINHO E TOTAL
  const cartItems = params.cartItems ? JSON.parse(params.cartItems as string) : [];
  
  // ⭐⭐ FUNÇÃO PARA CALCULAR TOTAL CORRETAMENTE ⭐⭐
  const calcularTotal = () => {
    if (cartItems.length === 0) return '0,00';
    
    const totalCalculado = cartItems.reduce((acc: number, item: any) => {
      // Extrair o valor numérico do preço formatado
      let precoString = item.price;
      
      // Remover "R$ " se existir
      if (precoString.includes('R$')) {
        precoString = precoString.replace('R$', '').trim();
      }
      
      // Substituir vírgula por ponto e converter para número
      const precoNumerico = parseFloat(
        precoString.replace('.', '').replace(',', '.')
      );
      
      // Se for NaN, usar 0
      const precoValido = isNaN(precoNumerico) ? 0 : precoNumerico;
      
      return acc + (precoValido * item.quantity);
    }, 0);
    
    // Formatar para o padrão brasileiro
    return totalCalculado.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const total = calcularTotal();

  const [currentStep, setCurrentStep] = useState(1);
  const [formaPagamento, setFormaPagamento] = useState('');
  const [dadosPagamento, setDadosPagamento] = useState({
    nome: '',
    email: '',
    telefone: '',
    cartao: '',
    validade: '',
    cvv: '',
    nomeTitular: '',
    cpfNotaFiscal: '',
    emailNotaFiscal: ''
  });

  // DADOS DO PEDIDO CONFIRMADO
  const [pedidoConfirmado, setPedidoConfirmado] = useState({
    numeroPedido: Math.floor(100000 + Math.random() * 900000).toString(),
    codigoRastreio: `VF${Math.floor(100000000 + Math.random() * 900000000)}BR`,
    dataEntrega: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
    dataPedido: new Date().toLocaleDateString('pt-BR')
  });

  const formasPagamento = [
    { id: 'credito', nome: 'Cartão de Crédito', icon: '💳' },
    { id: 'debito', nome: 'Cartão de Débito', icon: '💳' },
    { id: 'pix', nome: 'PIX', icon: '📱' },
  ];

  // Verificar se tem endereço principal quando chegar na etapa 1
  useEffect(() => {
    if (currentStep === 1 && !loading && !enderecoPrincipal) {
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
  }, [currentStep, loading, enderecoPrincipal]);

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
      if (!formaPagamento) {
        Alert.alert('Atenção', 'Por favor, selecione uma forma de pagamento');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Validação dos dados de pagamento
      if (formaPagamento !== 'pix') {
        if (!dadosPagamento.cartao || !dadosPagamento.validade || !dadosPagamento.cvv || !dadosPagamento.nomeTitular) {
          Alert.alert('Erro', 'Por favor, preencha todos os dados do cartão');
          return;
        }
      }
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

  const handleFinalizarCompra = () => {
    // Simular processamento do pedido
    Alert.alert(
      'Compra Finalizada com Sucesso!',
      `Seu pedido #${pedidoConfirmado.numeroPedido} foi processado.\nSerá entregue no endereço: ${enderecoPrincipal?.apelido}\nCódigo de rastreio: ${pedidoConfirmado.codigoRastreio}`,
      [
        {
          text: 'Acompanhar Pedido',
          onPress: () => router.push('/home/rastrearpedido')
        },
        {
          text: 'Voltar à Loja',
          onPress: () => router.push('/home/')
        }
      ]
    );
  };

  const renderStep1 = () => (
    <>
      {/* Resumo do Pedido */}
      <View style={styles.resumo}>
        <Text style={styles.subtitulo}>Resumo do Pedido</Text>
        {cartItems.map((item: any, index: number) => (
          <View key={index} style={styles.item}>
            <View>
              <Text style={styles.itemNome}>{item.name}</Text>
              <Text style={styles.itemQuantidade}>Quantidade: {item.quantity}</Text>
            </View>
            <Text style={styles.itemPreco}>{item.price}</Text>
          </View>
        ))}
        <View style={styles.total}>
          <Text style={styles.totalTexto}>Total: R$ {total}</Text>
        </View>
      </View>

      {/* Endereço de Entrega - AGORA USANDO O ENDEREÇO PRINCIPAL DO CONTEXTO */}
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

      {/* Dados Pessoais */}
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

      {/* Forma de Pagamento */}
      <View style={styles.secao}>
        <Text style={styles.subtitulo}>Forma de Pagamento</Text>
        <Text style={styles.instrucao}>Selecione como deseja pagar:</Text>
        
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
      </View>
    </>
  );

  const renderStep2 = () => (
    <>
      {/* Resumo com forma de pagamento */}
      <View style={styles.resumo}>
        <Text style={styles.subtitulo}>Resumo do Pedido</Text>
        {cartItems.map((item: any, index: number) => (
          <View key={index} style={styles.item}>
            <View>
              <Text style={styles.itemNome}>{item.name}</Text>
              <Text style={styles.itemQuantidade}>Quantidade: {item.quantity}</Text>
            </View>
            <Text style={styles.itemPreco}>{item.price}</Text>
          </View>
        ))}
        <View style={styles.item}>
          <Text style={styles.itemNome}>Forma de Pagamento:</Text>
          <Text style={styles.itemPreco}>
            {formaPagamento === 'credito' && 'Cartão de Crédito'}
            {formaPagamento === 'debito' && 'Cartão de Débito'}
            {formaPagamento === 'pix' && 'PIX'}
          </Text>
        </View>
        <View style={styles.total}>
          <Text style={styles.totalTexto}>Total: R$ {total}</Text>
        </View>
      </View>

      {/* Dados de Pagamento Específicos */}
      <View style={styles.secao}>
        <Text style={styles.subtitulo}>Dados de Pagamento</Text>
        
        {formaPagamento === 'pix' ? (
          // TELA PIX
          <View style={styles.pixContainer}>
            <Text style={styles.pixTitulo}>Pagamento via PIX</Text>
            <Text style={styles.pixInstrucao}>
              Escaneie o QR Code abaixo ou copie a chave PIX para realizar o pagamento
            </Text>
            
            {/* QR Code Placeholder */}
            <View style={styles.qrCodePlaceholder}>
              <Text style={styles.qrCodeText}>QR CODE PIX</Text>
              <Text style={styles.qrCodeSubtext}>Aponte a câmera do seu app bancário</Text>
            </View>
            
            {/* Chave PIX */}
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
          </View>
        ) : (
          // TELA CARTÃO (CRÉDITO/DÉBITO)
          <>
            <TextInput
              style={styles.input}
              placeholder="Número do Cartão*"
              keyboardType="numeric"
              value={dadosPagamento.cartao}
              onChangeText={(text) => setDadosPagamento({...dadosPagamento, cartao: text})}
            />
            <View style={styles.linha}>
              <TextInput
                style={[styles.input, styles.inputMedio]}
                placeholder="Validade (MM/AA)*"
                value={dadosPagamento.validade}
                onChangeText={(text) => setDadosPagamento({...dadosPagamento, validade: text})}
              />
              <TextInput
                style={[styles.input, styles.inputPequeno]}
                placeholder="CVV*"
                keyboardType="numeric"
                secureTextEntry
                value={dadosPagamento.cvv}
                onChangeText={(text) => setDadosPagamento({...dadosPagamento, cvv: text})}
              />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Nome do Titular*"
              value={dadosPagamento.nomeTitular}
              onChangeText={(text) => setDadosPagamento({...dadosPagamento, nomeTitular: text})}
            />
            
            {formaPagamento === 'credito' && (
              <View style={styles.parcelamento}>
                <Text style={styles.parcelamentoLabel}>Parcelas:</Text>
                <TouchableOpacity style={styles.parcelamentoSelect}>
                  <Text>1x de R$ {total} (sem juros)</Text>
                  <Ionicons name="chevron-down" size={16} color="#666" />
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>
    </>
  );

  const renderStep3 = () => (
    <>
      {/* REVISÃO COMPLETA DO PEDIDO */}
      <View style={styles.secao}>
        <Text style={styles.subtitulo}>Revise seu Pedido</Text>
        <Text style={styles.instrucao}>Confirme todas as informações antes de finalizar</Text>
        
        {/* Dados Pessoais */}
        <View style={styles.revisaoGrupo}>
          <Text style={styles.revisaoTitulo}>Dados Pessoais</Text>
          <Text style={styles.revisaoTexto}>{dadosPagamento.nome}</Text>
          <Text style={styles.revisaoTexto}>{dadosPagamento.email}</Text>
          <Text style={styles.revisaoTexto}>{dadosPagamento.telefone}</Text>
        </View>

        {/* Endereço - AGORA USANDO O ENDEREÇO PRINCIPAL */}
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

        {/* Pagamento */}
        <View style={styles.revisaoGrupo}>
          <Text style={styles.revisaoTitulo}>Forma de Pagamento</Text>
          <Text style={styles.revisaoTexto}>
            {formaPagamento === 'credito' && 'Cartão de Crédito'}
            {formaPagamento === 'debito' && 'Cartão de Débito'}
            {formaPagamento === 'pix' && 'PIX'}
          </Text>
          {formaPagamento !== 'pix' && dadosPagamento.cartao && (
            <Text style={styles.revisaoTexto}>Final {dadosPagamento.cartao?.slice(-4)}</Text>
          )}
        </View>

        {/* Itens do Pedido */}
        <View style={styles.revisaoGrupo}>
          <Text style={styles.revisaoTitulo}>Itens do Pedido</Text>
          {cartItems.map((item: any, index: number) => (
            <View key={index} style={styles.revisaoItem}>
              <Text style={styles.revisaoTexto}>{item.quantity}x {item.name}</Text>
              <Text style={styles.revisaoTexto}>{item.price}</Text>
            </View>
          ))}
          <View style={styles.revisaoTotal}>
            <Text style={styles.revisaoTotalTexto}>Total: R$ {total}</Text>
          </View>
        </View>
      </View>

      {/* Termos e Condições */}
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
      {/* NOTA FISCAL */}
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
      {/* CONFIRMAÇÃO E RASTREAMENTO */}
      <View style={styles.secao}>
        <View style={styles.confirmacaoHeader}>
          <Ionicons name="checkmark-circle" size={60} color="#27ae60" />
          <Text style={styles.confirmacaoTitulo}>Pedido Confirmado!</Text>
          <Text style={styles.confirmacaoSubtitulo}>
            Seu pedido foi processado com sucesso
          </Text>
        </View>

        {/* Dados do Pedido */}
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

          {/* Endereço de Entrega na Confirmação */}
          <View style={styles.pedidoInfo}>
            <Text style={styles.pedidoInfoLabel}>Endereço de Entrega</Text>
            <Text style={styles.pedidoInfoValor}>{enderecoPrincipal?.apelido}</Text>
          </View>
        </View>

        {/* Código de Rastreio */}
        <View style={styles.rastreioContainer}>
          <Text style={styles.rastreioTitulo}>Acompanhe seu Pedido</Text>
          <View style={styles.codigoRastreioBox}>
            <Text style={styles.codigoRastreio}>{pedidoConfirmado.codigoRastreio}</Text>
            <TouchableOpacity style={styles.botaoCopiarRastreio}>
              <Ionicons name="copy-outline" size={16} color="#126b1a" />
              <Text style={styles.botaoCopiarRastreioTexto}>Copiar</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.botaoRastrear}
            onPress={() => router.push('/home/rastrearpedido')}
          >
            <Ionicons name="search-outline" size={20} color="white" />
            <Text style={styles.botaoRastrearTexto}>Rastrear Pedido Agora</Text>
          </TouchableOpacity>

          <Text style={styles.rastreioAviso}>
            Você receberá atualizações por email e WhatsApp
          </Text>
        </View>

        {/* Resumo Final */}
        <View style={styles.resumoFinal}>
          <Text style={styles.resumoFinalTitulo}>Resumo da Compra</Text>
          <View style={styles.resumoFinalItem}>
            <Text style={styles.resumoFinalLabel}>Itens:</Text>
            <Text style={styles.resumoFinalValor}>{cartItems.length} produto(s)</Text>
          </View>
          <View style={styles.resumoFinalItem}>
            <Text style={styles.resumoFinalLabel}>Total:</Text>
            <Text style={styles.resumoFinalValor}>R$ {total}</Text>
          </View>
          <View style={styles.resumoFinalItem}>
            <Text style={styles.resumoFinalLabel}>Forma de Pagamento:</Text>
            <Text style={styles.resumoFinalValor}>
              {formaPagamento === 'credito' && 'Cartão de Crédito'}
              {formaPagamento === 'debito' && 'Cartão de Débito'}
              {formaPagamento === 'pix' && 'PIX'}
            </Text>
          </View>
          <View style={styles.resumoFinalItem}>
            <Text style={styles.resumoFinalLabel}>Endereço:</Text>
            <Text style={styles.resumoFinalValor}>{enderecoPrincipal?.apelido}</Text>
          </View>
        </View>
      </View>
    </>
  );

  const getStepTitle = () => {
    switch(currentStep) {
      case 1: return 'Finalizar Compra';
      case 2: return 'Pagamento';
      case 3: return 'Revisão do Pedido';
      case 4: return 'Nota Fiscal';
      case 5: return 'Confirmação';
      default: return 'Finalizar Compra';
    }
  };

  const getButtonText = () => {
    switch(currentStep) {
      case 1: return 'Avançar para Pagamento';
      case 2: return 'Revisar Pedido';
      case 3: return 'Continuar para Nota Fiscal';
      case 4: return 'Confirmar e Finalizar';
      case 5: return 'Acompanhar Pedido';
      default: return 'Avançar';
    }
  };

  // Se estiver carregando e não tem endereço principal
  if (loading && !enderecoPrincipal && currentStep === 1) {
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
      {/* REMOVE O HEADER PADRÃO */}
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* HEADER FIXO */}
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

      {/* INDICADOR DE STEPS EXPANDIDO */}
      <View style={styles.stepsContainer}>
        {[1, 2, 3, 4, 5].map((step) => (
          <React.Fragment key={step}>
            <View style={[styles.step, currentStep === step && styles.stepAtivo]}>
              <Text style={[styles.stepText, currentStep === step && styles.stepTextAtivo]}>
                {step}
              </Text>
              <Text style={[styles.stepLabel, currentStep === step && styles.stepLabelAtivo]}>
                {step === 1 && 'Dados'}
                {step === 2 && 'Pagamento'}
                {step === 3 && 'Revisão'}
                {step === 4 && 'Nota Fiscal'}
                {step === 5 && 'Confirmação'}
              </Text>
            </View>
            {step < 5 && <View style={styles.stepLine} />}
          </React.Fragment>
        ))}
      </View>

      {/* CONTEÚDO SCROLLABLE */}
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

        {/* Botões - Não mostrar na etapa final */}
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
                !enderecoPrincipal && styles.botaoAvancarDisabled
              ]}
              onPress={handleAvancar}
              disabled={!enderecoPrincipal}
            >
              <Text style={styles.botaoAvancarTexto}>
                {getButtonText()}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Botões específicos para etapa final */}
        {currentStep === 5 && (
          <View style={styles.botoesFinal}>
            <TouchableOpacity 
              style={styles.botaoSecundario}
              onPress={() => router.push('/home/rastrearpedido')}
            >
              <Ionicons name="search-outline" size={20} color="#126b1a" />
              <Text style={styles.botaoSecundarioTexto}>Acompanhar Pedido</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.botaoPrimario}
              onPress={handleFinalizarCompra}
            >
              <Ionicons name="home-outline" size={20} color="white" />
              <Text style={styles.botaoPrimarioTexto}>Voltar à Loja</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

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
    paddingTop: 30,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 8,
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
    marginTop: 100,
    paddingHorizontal: 10,
  },
  step: {
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  stepAtivo: {
    // Estilo quando step está ativo
  },
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
    marginTop: 10,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
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
    marginBottom: 20,
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
    marginBottom: 20,
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
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputPequeno: {
    width: '30%',
  },
  inputMedio: {
    width: '65%',
  },
  
  // Estilos para formas de pagamento
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
  
  // Estilos para PIX
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
  
  // Estilos para parcelamento
  parcelamento: {
    marginTop: 10,
  },
  parcelamentoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  parcelamentoSelect: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fafafa',
  },
  
  // Botões
  botoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
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

  // NOVOS ESTILOS PARA AS ETAPAS ADICIONAIS

  // Estilos para revisão (etapa 3)
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

  // Estilos para nota fiscal (etapa 4)
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

  // Estilos para confirmação (etapa 5)
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
  rastreioContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  rastreioTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  codigoRastreioBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#126b1a',
    marginBottom: 15,
    width: '100%',
  },
  codigoRastreio: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#126b1a',
    fontFamily: 'monospace',
  },
  botaoCopiarRastreio: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  botaoCopiarRastreioTexto: {
    fontSize: 12,
    color: '#126b1a',
    fontWeight: '500',
    marginLeft: 4,
  },
  botaoRastrear: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#126b1a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
    justifyContent: 'center',
  },
  botaoRastrearTexto: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  rastreioAviso: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  resumoFinal: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
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

  // Botões da etapa final
  botoesFinal: {
    marginTop: 20,
    marginBottom: 40,
  },
  botaoSecundario: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#126b1a',
    marginBottom: 10,
  },
  botaoSecundarioTexto: {
    color: '#126b1a',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  botaoPrimario: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 8,
  },
  botaoPrimarioTexto: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  // NOVOS ESTILOS PARA O SISTEMA DE ENDEREÇOS
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
    gap: 8,
  },
  enderecoApelido: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
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
    gap: 4,
  },
  enderecoText: {
    fontSize: 14,
    color: '#666',
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
});