import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  Modal, 
  FlatList,
  ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

// Função para calcular pontos baseada no valor da compra
const calcularPontos = (valor: number) => {
  if (valor >= 500) return 50;
  if (valor >= 350) return 35;
  if (valor >= 250) return 20;
  if (valor >= 100) return 10;
  return Math.floor(valor / 10);
};

// Componente de Loading
const LoadingScreen = () => (
  <SafeAreaView style={styles.container}>
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#126b1a" />
      <Text style={styles.loadingText}>Carregando seus dados...</Text>
    </View>
  </SafeAreaView>
);

// Componente de Error
const ErrorScreen = ({ onRetry }: { onRetry: () => void }) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.errorContainer}>
      <Ionicons name="alert-circle-outline" size={48} color="#e74c3c" />
      <Text style={styles.errorText}>Usuário não encontrado</Text>
      <Text style={styles.errorSubtext}>Não foi possível carregar seus dados</Text>
      <TouchableOpacity 
        style={styles.retryButton}
        onPress={onRetry}
      >
        <Text style={styles.retryButtonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);

// Componente auxiliar para Info Items
const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

export default function ResumoContaScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [showHistorico, setShowHistorico] = useState(false);

  // Dados do programa de fidelidade
  const [pontosData, setPontosData] = useState({
    pontos: 245,
    meta: 1000,
    nivel: 'Prata',
    consultasGratis: 0,
    expiracao: '15/12/2025'
  });

  // Histórico de pontos
  const [historicoPontos, setHistoricoPontos] = useState([
    {
      id: '1',
      data: '15/03/2024',
      descricao: 'Compra - Vermífugo Bovino',
      valor: 45.90,
      pontos: calcularPontos(45.90),
      tipo: 'ganho'
    },
    {
      id: '2',
      data: '10/03/2024',
      descricao: 'Compra - Cela Equina',
      valor: 289.90,
      pontos: calcularPontos(289.90),
      tipo: 'ganho'
    },
    {
      id: '3',
      data: '05/03/2024',
      descricao: 'Compra - Vacina Febre Aftosa',
      valor: 89.90,
      pontos: calcularPontos(89.90),
      tipo: 'ganho'
    },
    {
      id: '4',
      data: '28/02/2024',
      descricao: 'Compra - Suplemento Animais',
      valor: 149.90,
      pontos: calcularPontos(149.90),
      tipo: 'ganho'
    },
    {
      id: '5',
      data: '20/02/2024',
      descricao: 'Bônus - Primeira Compra',
      valor: 0,
      pontos: 25,
      tipo: 'bonus'
    },
  ]);

  // ⭐⭐ LOADING STATE
  if (loading) {
    return <LoadingScreen />;
  }

  // ⭐⭐ ERROR STATE
  if (!user) {
    return <ErrorScreen onRetry={() => router.back()} />;
  }

  // ⭐⭐ DADOS FORMATADOS DO USUÁRIO
  const userData = {
    nomeCompleto: user?.nome ? `${user.nome} ${user.sobrenome || ''}`.trim() : 'Usuário',
    email: user?.email || 'email@exemplo.com',
    telefone: user?.telefone || 'Não informado',
    cpf: user?.cpf || 'Não informado',
    dataNascimento: user?.data_nascimento || 'Não informada',
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
        {/* Saudação - COM DADOS REAIS */}
        <View style={styles.saudacaoContainer}>
          <Text style={styles.saudacao}>Olá,</Text>
          <Text style={styles.nomeUsuario}>{userData.nomeCompleto}</Text>
          <Text style={styles.emailUsuario}>{userData.email}</Text>
        </View>

        {/* Dados da Conta - SEM BOTÃO ALTERAR */}
        <View style={styles.dadosContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Dados da conta</Text>
          </View>

          <View style={styles.infoCard}>
            <InfoItem label="Nome completo" value={userData.nomeCompleto} />
            <InfoItem label="E-mail" value={userData.email} />
            <InfoItem label="Telefone" value={userData.telefone} />
            <InfoItem label="CPF" value={userData.cpf} />
            <InfoItem label="Data de nascimento" value={userData.dataNascimento} />
          </View>
        </View>

        {/* Programa de Fidelidade */}
        <View style={styles.fidelidadeContainer}>
          <Text style={styles.sectionTitle}>Seus Pontos de Fidelidade</Text>

          {/* Card de Tabela de Pontos */}
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
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  // ⭐⭐ NOVOS ESTILOS PARA LOADING E ERROR
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#126b1a',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
    marginBottom: 5,
  },
  emailUsuario: {
    fontSize: 14,
    color: '#666',
  },
  dadosContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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