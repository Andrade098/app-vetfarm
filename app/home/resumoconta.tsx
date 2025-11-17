import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, Alert, Modal, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Função para calcular pontos baseada no valor da compra - NOVA ESCALA
const calcularPontos = (valor: number) => {
  if (valor >= 500) return 50;
  if (valor >= 350) return 35;
  if (valor >= 250) return 20;
  if (valor >= 100) return 10;
  return Math.floor(valor / 10); // 1 ponto a cada R$ 10 para compras abaixo de R$ 100
};

export default function ResumoContaScreen() {
  const router = useRouter();

  // Estado dos dados do usuário - agora editável
  const [userData, setUserData] = useState({
    nome: 'João Pedro Ferreira de Souza',
    email: 'contato.joaopedro@gmail.com',
    telefone: '(11) 99999-9999',
    cpf: '123.456.789-00',
    dataNascimento: '15/05/1990',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [dadosEditados, setDadosEditados] = useState({ ...userData });
  const [showHistorico, setShowHistorico] = useState(false);

  // Estatísticas (pode vir de uma API no futuro)
  const estatisticas = [
    { id: '1', label: 'Pedidos Realizados', valor: '15', icon: 'cart' },
    { id: '2', label: 'Favoritos', valor: '8', icon: 'heart' },
    { id: '3', label: 'Endereços', valor: '2', icon: 'location' },
  ];

  // Dados do programa de fidelidade
  const [pontosData, setPontosData] = useState({
    pontos: 245, // Atualizado para nova escala
    meta: 1000,
    nivel: 'Prata',
    consultasGratis: 0,
    expiracao: '15/12/2025'
  });

  // Histórico de pontos COM NOVA ESCALA DE PONTOS
  const [historicoPontos, setHistoricoPontos] = useState([
    {
      id: '1',
      data: '15/03/2024',
      descricao: 'Compra - Vermífugo Bovino',
      valor: 45.90,
      pontos: calcularPontos(45.90), // 4 pontos (R$ 45,90 / 10)
      tipo: 'ganho'
    },
    {
      id: '2',
      data: '10/03/2024',
      descricao: 'Compra - Cela Equina',
      valor: 289.90,
      pontos: calcularPontos(289.90), // 20 pontos (acima de R$ 250)
      tipo: 'ganho'
    },
    {
      id: '3',
      data: '05/03/2024',
      descricao: 'Compra - Vacina Febre Aftosa',
      valor: 89.90,
      pontos: calcularPontos(89.90), // 8 pontos (R$ 89,90 / 10)
      tipo: 'ganho'
    },
    {
      id: '4',
      data: '28/02/2024',
      descricao: 'Compra - Suplemento Animais',
      valor: 149.90,
      pontos: calcularPontos(149.90), // 10 pontos (acima de R$ 100)
      tipo: 'ganho'
    },
    {
      id: '5',
      data: '20/02/2024',
      descricao: 'Bônus - Primeira Compra',
      valor: 0,
      pontos: 25, // Bônus reduzido para nova escala
      tipo: 'bonus'
    },
    {
      id: '6',
      data: '15/02/2024',
      descricao: 'Compra - Ração Premium',
      valor: 98.90,
      pontos: calcularPontos(98.90), // 9 pontos (R$ 98,90 / 10)
      tipo: 'ganho'
    },
    {
      id: '7',
      data: '10/02/2024',
      descricao: 'Compra - Medicamentos',
      valor: 420.00,
      pontos: calcularPontos(420.00), // 35 pontos (acima de R$ 350)
      tipo: 'ganho'
    },
    {
      id: '8',
      data: '05/02/2024',
      descricao: 'Compra - Acessórios',
      valor: 550.00,
      pontos: calcularPontos(550.00), // 50 pontos (acima de R$ 500)
      tipo: 'ganho'
    },
    {
      id: '9',
      data: '01/02/2024',
      descricao: 'Compra - Kit Emergência',
      valor: 320.00,
      pontos: calcularPontos(320.00), // 20 pontos (acima de R$ 250)
      tipo: 'ganho'
    },
    {
      id: '10',
      data: '25/01/2024',
      descricao: 'Compra - Vitaminas',
      valor: 75.00,
      pontos: calcularPontos(75.00), // 7 pontos (R$ 75,00 / 10)
      tipo: 'ganho'
    },
  ]);

  const handleSalvarAlteracoes = () => {
    // Validações básicas
    if (!dadosEditados.nome || !dadosEditados.email) {
      Alert.alert('Erro', 'Nome e e-mail são obrigatórios.');
      return;
    }

    // Atualiza os dados
    setUserData({ ...dadosEditados });
    setIsEditing(false);
    
    Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
  };

  const handleCancelarEdicao = () => {
    setDadosEditados({ ...userData });
    setIsEditing(false);
  };

  const handleInputChange = (campo: string, valor: string) => {
    setDadosEditados(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const calcularProgresso = () => {
    return (pontosData.pontos / pontosData.meta) * 100;
  };

  const pontosRestantes = () => {
    return pontosData.meta - pontosData.pontos;
  };

  const getCategoriaPontos = (valor: number) => {
    if (valor >= 500) return 'Máximo (50 pts)';
    if (valor >= 350) return 'Alta (35 pts)';
    if (valor >= 250) return 'Média (20 pts)';
    if (valor >= 100) return 'Básica (10 pts)';
    return `Padrão (${Math.floor(valor / 10)} pts)`;
  };

  const renderItemHistorico = ({ item }) => (
    <View style={styles.historicoItem}>
      <View style={styles.historicoIcon}>
        <Ionicons 
          name={item.tipo === 'bonus' ? "gift" : "cart"} 
          size={20} 
          color={item.tipo === 'bonus' ? "#FF6B35" : "#126b1a"} 
        />
      </View>
      <View style={styles.historicoInfo}>
        <Text style={styles.historicoDescricao}>{item.descricao}</Text>
        <Text style={styles.historicoData}>{item.data}</Text>
        {item.tipo === 'ganho' && (
          <Text style={styles.historicoValorCompra}>R$ {item.valor.toFixed(2)}</Text>
        )}
      </View>
      <View style={styles.historicoPontos}>
        <Text style={[
          styles.historicoValor,
          { color: item.tipo === 'bonus' ? '#FF6B35' : '#126b1a' }
        ]}>
          +{item.pontos}
        </Text>
        <Text style={styles.historicoLabel}>pontos</Text>
        {item.tipo === 'ganho' && (
          <Text style={styles.historicoCategoria}>
            {getCategoriaPontos(item.valor)}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#126b1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Resumo da Conta</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        {/* Saudação */}
        <View style={styles.saudacaoContainer}>
          <Text style={styles.saudacao}>Olá,</Text>
          <Text style={styles.nomeUsuario}>{userData.nome}</Text>
        </View>

        {/* Estatísticas */}
        <View style={styles.estatisticasContainer}>
          <Text style={styles.sectionTitle}>Sua Atividade</Text>
          <View style={styles.estatisticasGrid}>
            {estatisticas.map((item) => (
              <View key={item.id} style={styles.estatisticaCard}>
                <Ionicons name={item.icon as any} size={24} color="#126b1a" />
                <Text style={styles.estatisticaValor}>{item.valor}</Text>
                <Text style={styles.estatisticaLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Dados da Conta */}
        <View style={styles.dadosContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Dados da conta</Text>
            {!isEditing ? (
              <TouchableOpacity onPress={() => setIsEditing(true)}>
                <Text style={styles.alterarTexto}>alterar</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleCancelarEdicao}>
                <Text style={styles.cancelarTexto}>cancelar</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.infoCard}>
  {!isEditing ? (
    // MODO VISUALIZAÇÃO
    <>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>Nome completo</Text>
        <Text style={styles.infoValue}>{userData.nome}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>E-mail</Text>
        <Text style={styles.infoValue}>{userData.email}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>Telefone</Text>
        <Text style={styles.infoValue}>{userData.telefone}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>CPF</Text>
        <Text style={styles.infoValue}>{userData.cpf}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>Data de nascimento</Text>
        <Text style={styles.infoValue}>{userData.dataNascimento}</Text>
      </View>
    </>
  ) : (
    // MODO EDIÇÃO
    <>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>Nome completo</Text>
        <TextInput
          style={styles.input}
          value={dadosEditados.nome}
          onChangeText={(text) => handleInputChange('nome', text)}
          placeholder="Digite seu nome completo"
        />
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>E-mail</Text>
        <TextInput
          style={styles.input}
          value={dadosEditados.email}
          onChangeText={(text) => handleInputChange('email', text)}
          placeholder="Digite seu e-mail"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>Telefone</Text>
        <TextInput
          style={styles.input}
          value={dadosEditados.telefone}
          onChangeText={(text) => handleInputChange('telefone', text)}
          placeholder="Digite seu telefone"
          keyboardType="phone-pad"
        />
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>CPF</Text>
        <TextInput
          style={styles.input}
          value={dadosEditados.cpf}
          onChangeText={(text) => handleInputChange('cpf', text)}
          placeholder="Digite seu CPF"
          keyboardType="numeric"
        />
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>Data de nascimento</Text>
        <TextInput
          style={styles.input}
          value={dadosEditados.dataNascimento}
          onChangeText={(text) => handleInputChange('dataNascimento', text)}
          placeholder="DD/MM/AAAA"
        />
      </View>
      
      {/* Botão Salvar */}
      <TouchableOpacity 
        style={styles.salvarButton}
        onPress={handleSalvarAlteracoes}
      >
        <Text style={styles.salvarButtonText}>Salvar Alterações</Text>
      </TouchableOpacity>
    </>
  )}
</View>
        </View>

        {/* Alterar Senha */}
        <TouchableOpacity 
          style={styles.alterarSenhaButton}
          onPress={() => router.push('/home/alterarsenha')}
        >
          <Ionicons name="lock-closed" size={20} color="#126b1a" />
          <Text style={styles.alterarSenhaText}>Alterar senha</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        {/* Programa de Fidelidade */}
        <View style={styles.fidelidadeContainer}>
          <Text style={styles.sectionTitle}>Seus Pontos de Fidelidade</Text>
          
          {/* Card de Tabela de Pontos - ATUALIZADO */}
          <View style={styles.tabelaPontosCard}>
            <Text style={styles.tabelaTitulo}>Como Ganhar Pontos</Text>
            <View style={styles.tabelaLinha}>
              <Text style={styles.tabelaValor}>Compras acima de R$ 500</Text>
              <Text style={styles.tabelaPontos}>50 pontos</Text>
            </View>
            <View style={styles.tabelaLinha}>
              <Text style={styles.tabelaValor}>Compras acima de R$ 350</Text>
              <Text style={styles.tabelaPontos}>35 pontos</Text>
            </View>
            <View style={styles.tabelaLinha}>
              <Text style={styles.tabelaValor}>Compras acima de R$ 250</Text>
              <Text style={styles.tabelaPontos}>20 pontos</Text>
            </View>
            <View style={styles.tabelaLinha}>
              <Text style={styles.tabelaValor}>Compras acima de R$ 100</Text>
              <Text style={styles.tabelaPontos}>10 pontos</Text>
            </View>
            <View style={styles.tabelaLinha}>
              <Text style={styles.tabelaValor}>Compras abaixo de R$ 100</Text>
              <Text style={styles.tabelaPontos}>1 ponto a cada R$ 10</Text>
            </View>
          </View>

          <View style={styles.fidelidadeCard}>
            <View style={styles.pontosHeader}>
              <Ionicons name="trophy" size={24} color="#FFD700" />
              <View style={styles.pontosInfo}>
                <Text style={styles.pontosTitulo}>{pontosData.pontos} Pontos</Text>
                <Text style={styles.pontosMeta}>
                  {pontosRestantes()} pontos para visita grátis
                </Text>
                <Text style={styles.nivelTexto}>Nível: {pontosData.nivel}</Text>
              </View>
            </View>

            {/* Barra de progresso */}
            <View style={styles.progressoContainer}>
              <View style={styles.progressoBar}>
                <View 
                  style={[
                    styles.progressoPreenchido, 
                    { width: `${calcularProgresso()}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressoTexto}>
                {Math.round(calcularProgresso())}% completo
              </Text>
            </View>

            <Text style={styles.expiracaoTexto}>
              Pontos expiram em: {pontosData.expiracao}
            </Text>

            <TouchableOpacity 
              style={styles.verDetalhesButton}
              onPress={() => setShowHistorico(true)}
            >
              <Text style={styles.verDetalhesText}>Ver histórico completo</Text>
              <Ionicons name="chevron-forward" size={16} color="#126b1a" />
            </TouchableOpacity>
          </View>

          {/* Prêmio */}
          <View style={styles.premioCard}>
            <Ionicons name="gift" size={24} color="#126b1a" />
            <View style={styles.premioInfo}>
              <Text style={styles.premioTitulo}>Prêmio: Visitação Grátis</Text>
              <Text style={styles.premioDescricao}>
                Ao atingir {pontosData.meta} pontos, ganhe uma visitação gratuita do nosso veterinário parceiro!
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* MODAL DO HISTÓRICO */}
      <Modal
        visible={showHistorico}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowHistorico(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Header do Modal */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Histórico de Pontos</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowHistorico(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Resumo */}
            <View style={styles.resumoPontos}>
              <View style={styles.resumoItem}>
                <Text style={styles.resumoValor}>{pontosData.pontos}</Text>
                <Text style={styles.resumoLabel}>Pontos Atuais</Text>
              </View>
              <View style={styles.resumoItem}>
                <Text style={styles.resumoValor}>{historicoPontos.length}</Text>
                <Text style={styles.resumoLabel}>Transações</Text>
              </View>
              <View style={styles.resumoItem}>
                <Text style={styles.resumoValor}>{pontosData.consultasGratis}</Text>
                <Text style={styles.resumoLabel}>Consultas Grátis</Text>
              </View>
            </View>

            {/* Lista do Histórico */}
            <FlatList
              data={historicoPontos}
              renderItem={renderItemHistorico}
              keyExtractor={item => item.id}
              style={styles.historicoList}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <Text style={styles.historicoTitulo}>Últimas Transações</Text>
              }
            />

            {/* Botão Fechar */}
            <TouchableOpacity 
              style={styles.fecharModalButton}
              onPress={() => setShowHistorico(false)}
            >
              <Text style={styles.fecharModalText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... (todos os estilos permanecem iguais do código anterior)
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#126b1a',
  },
  headerRight: {
    width: 34,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  saudacaoContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  saudacao: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  nomeUsuario: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  estatisticasContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  estatisticasGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  estatisticaCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  estatisticaValor: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#126b1a',
    marginVertical: 5,
  },
  estatisticaLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  dadosContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  alterarTexto: {
    color: '#126b1a',
    fontWeight: '500',
  },
  cancelarTexto: {
    color: '#F44336',
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  infoItem: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  salvarButton: {
    backgroundColor: '#126b1a',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  salvarButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  alterarSenhaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  alterarSenhaText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  fidelidadeContainer: {
    marginBottom: 30,
  },
  tabelaPontosCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tabelaTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  tabelaLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tabelaValor: {
    fontSize: 14,
    color: '#333',
    flex: 2,
  },
  tabelaPontos: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#126b1a',
    flex: 1,
    textAlign: 'right',
  },
  fidelidadeCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  pontosHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  pontosInfo: {
    flex: 1,
    marginLeft: 15,
  },
  pontosTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  pontosMeta: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  nivelTexto: {
    fontSize: 12,
    color: '#126b1a',
    fontWeight: '500',
  },
  progressoContainer: {
    marginBottom: 15,
  },
  progressoBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 5,
    overflow: 'hidden',
  },
  progressoPreenchido: {
    height: '100%',
    backgroundColor: '#126b1a',
    borderRadius: 4,
  },
  progressoTexto: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  expiracaoTexto: {
    fontSize: 12,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  verDetalhesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#f0f8f0',
    borderRadius: 5,
  },
  verDetalhesText: {
    color: '#126b1a',
    fontWeight: '500',
    marginRight: 5,
  },
  premioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  premioInfo: {
    flex: 1,
    marginLeft: 15,
  },
  premioTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  premioDescricao: {
    fontSize: 14,
    color: '#666',
  },
  // Estilos do Modal do Histórico
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalCloseButton: {
    padding: 5,
  },
  resumoPontos: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#f8f9fa',
    margin: 20,
    borderRadius: 10,
  },
  resumoItem: {
    alignItems: 'center',
  },
  resumoValor: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#126b1a',
    marginBottom: 5,
  },
  resumoLabel: {
    fontSize: 12,
    color: '#666',
  },
  historicoList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  historicoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  historicoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historicoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  historicoInfo: {
    flex: 1,
  },
  historicoDescricao: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  historicoData: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  historicoValorCompra: {
    fontSize: 11,
    color: '#888',
    fontWeight: '500',
  },
  historicoPontos: {
    alignItems: 'flex-end',
  },
  historicoValor: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  historicoLabel: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  },
  historicoCategoria: {
    fontSize: 9,
    color: '#126b1a',
    fontWeight: '500',
  },
  fecharModalButton: {
    backgroundColor: '#126b1a',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  fecharModalText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});