import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function FinalizarCompra() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // RECEBE OS ITENS DO CARRINHO E TOTAL
  const cartItems = params.cartItems ? JSON.parse(params.cartItems as string) : [];
  const total = params.total || '0,00';

  const [currentStep, setCurrentStep] = useState(1);
  const [formaPagamento, setFormaPagamento] = useState('');
  const [dadosPagamento, setDadosPagamento] = useState({
    nome: '',
    email: '',
    telefone: '',
    cep: '',
    endereco: '',
    numero: '',
    cidade: '',
    estado: '',
    cartao: '',
    validade: '',
    cvv: '',
    nomeTitular: ''
  });

  const formasPagamento = [
    { id: 'credito', nome: 'Cartão de Crédito', icon: '💳' },
    { id: 'debito', nome: 'Cartão de Débito', icon: '💳' },
    { id: 'pix', nome: 'PIX', icon: '📱' },
  ];

  const handleSelecionarPagamento = (forma: string) => {
    setFormaPagamento(forma);
  };

  const handleAvancar = () => {
    if (currentStep === 1) {
      if (!formaPagamento) {
        Alert.alert('Atenção', 'Por favor, selecione uma forma de pagamento');
        return;
      }
      setCurrentStep(2);
    }
  };

  const handleVoltar = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else {
      router.back();
    }
  };

  const handleFinalizarCompra = () => {
    // Validação básica
    if (!dadosPagamento.nome || !dadosPagamento.email || !dadosPagamento.endereco) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    Alert.alert(
      'Compra Finalizada!',
      'Sua compra foi processada com sucesso!',
      [
        {
          text: 'OK',
          onPress: () => router.push('/home/')
        }
      ]
    );
  };

  const renderStep1 = () => (
    <>
      {/* Resumo do Pedido - AGORA DINÂMICO */}
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

      {/* Endereço de Entrega */}
      <View style={styles.secao}>
        <Text style={styles.subtitulo}>Endereço de Entrega</Text>
        <TextInput
          style={styles.input}
          placeholder="CEP"
          keyboardType="numeric"
          value={dadosPagamento.cep}
          onChangeText={(text) => setDadosPagamento({...dadosPagamento, cep: text})}
        />
        <TextInput
          style={styles.input}
          placeholder="Endereço*"
          value={dadosPagamento.endereco}
          onChangeText={(text) => setDadosPagamento({...dadosPagamento, endereco: text})}
        />
        <View style={styles.linha}>
          <TextInput
            style={[styles.input, styles.inputPequeno]}
            placeholder="Número*"
            keyboardType="numeric"
            value={dadosPagamento.numero}
            onChangeText={(text) => setDadosPagamento({...dadosPagamento, numero: text})}
          />
          <TextInput
            style={[styles.input, styles.inputMedio]}
            placeholder="Cidade*"
            value={dadosPagamento.cidade}
            onChangeText={(text) => setDadosPagamento({...dadosPagamento, cidade: text})}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Estado*"
          value={dadosPagamento.estado}
          onChangeText={(text) => setDadosPagamento({...dadosPagamento, estado: text})}
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
      {/* Resumo com forma de pagamento - AGORA DINÂMICO */}
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
        <Text style={styles.headerTitle}>
          {currentStep === 1 ? 'Finalizar Compra' : 'Pagamento'}
        </Text>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* INDICADOR DE STEPS */}
      <View style={styles.stepsContainer}>
        <View style={[styles.step, currentStep === 1 && styles.stepAtivo]}>
          <Text style={[styles.stepText, currentStep === 1 && styles.stepTextAtivo]}>1</Text>
          <Text style={[styles.stepLabel, currentStep === 1 && styles.stepLabelAtivo]}>Dados</Text>
        </View>
        <View style={styles.stepLine} />
        <View style={[styles.step, currentStep === 2 && styles.stepAtivo]}>
          <Text style={[styles.stepText, currentStep === 2 && styles.stepTextAtivo]}>2</Text>
          <Text style={[styles.stepLabel, currentStep === 2 && styles.stepLabelAtivo]}>Pagamento</Text>
        </View>
      </View>

      {/* CONTEÚDO SCROLLABLE */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {currentStep === 1 ? renderStep1() : renderStep2()}

        {/* Botões */}
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
            style={styles.botaoAvancar}
            onPress={currentStep === 1 ? handleAvancar : handleFinalizarCompra}
          >
            <Text style={styles.botaoAvancarTexto}>
              {currentStep === 1 ? 'Avançar' : 'Confirmar Compra'}
            </Text>
          </TouchableOpacity>
        </View>
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
  },
  step: {
    alignItems: 'center',
    paddingHorizontal: 10,
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
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  stepLabelAtivo: {
    color: '#126b1a',
    fontWeight: 'bold',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#ddd',
    marginHorizontal: 10,
    maxWidth: 60,
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
  botaoAvancarTexto: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});