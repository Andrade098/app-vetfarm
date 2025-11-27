// home/resumoconta.tsx - VERSÃO 100% LOCAL COMPLETA
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  Modal, 
  FlatList,
  ActivityIndicator,
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useFidelidade } from '../../contexts/FidelidadeContext';
import { usePedidos } from '../../contexts/PedidoContext';

interface HistoricoPontos {
  id: string;
  data: string;
  descricao: string;
  valor: number;
  pontos: number;
  tipo: 'ganho' | 'bonus';
}

const LoadingScreen = () => (
  <SafeAreaView style={styles.container}>
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#126b1a" />
      <Text style={styles.loadingText}>Carregando seus dados...</Text>
    </View>
  </SafeAreaView>
);

export default function ResumoContaScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { pontos, carregarPontos } = useFidelidade();
  const { pedidos } = usePedidos();

  const [showHistorico, setShowHistorico] = useState(false);
  const [historicoPontos, setHistoricoPontos] = useState<HistoricoPontos[]>([]);
  const [carregandoDados, setCarregandoDados] = useState(true);

  const [pontosData, setPontosData] = useState({
    pontos: 0,
    meta: 1000,
    nivel: 'Bronze',
    consultasGratis: 0,
    expiracao: '31/12/2025',
    descontoAtivo: 0,
    dataExpiracaoDesconto: '',
    premioLiberado: false,
    progressoMeta: '0%'
  });

  const calcularNivel = (pontos: number) => {
    if (pontos >= 1000) return 'Diamante';
    if (pontos >= 500) return 'Ouro';
    if (pontos >= 250) return 'Prata';
    return 'Bronze';
  };

  const carregarDadosUsuario = async () => {
    try {
      setCarregandoDados(true);
      
      await carregarPontos();
      
      const pontosUsuario = pontos;
      const descontoUsuario = user?.desconto_proxima_compra || 0;
      
      console.log('👤 Dados carregados LOCALMENTE:', {
        pontos_fidelidade: pontosUsuario,
        desconto_proxima_compra: descontoUsuario
      });

      setPontosData({
        pontos: pontosUsuario,
        meta: 1000,
        nivel: calcularNivel(pontosUsuario),
        consultasGratis: Math.floor(pontosUsuario / 1000),
        expiracao: '31/12/2025',
        descontoAtivo: descontoUsuario,
        dataExpiracaoDesconto: user?.data_expiracao_desconto ? 
          new Date(user.data_expiracao_desconto).toLocaleDateString('pt-BR') : 
          '',
        premioLiberado: pontosUsuario >= 1000,
        progressoMeta: `${Math.min((pontosUsuario / 1000) * 100, 100)}%`
      });
      
    } catch (error) {
      console.error('💥 Erro ao carregar dados locais:', error);
    } finally {
      setCarregandoDados(false);
    }
  };

  useEffect(() => {
    carregarDadosUsuario();
  }, [user, pontos]);

  const carregarHistoricoPontos = () => {
    try {
      console.log('📦 Gerando histórico a partir dos pedidos locais...');
      
      const historico: HistoricoPontos[] = [];
      
      pedidos.forEach(pedido => {
        if (pedido.pontos_ganhos > 0) {
          historico.push({
            id: `pedido_${pedido.id}`,
            data: new Date(pedido.createdAt).toLocaleDateString('pt-BR'),
            descricao: `Compra - Pedido #${pedido.numero_pedido}`,
            valor: parseFloat(pedido.total.replace('R$', '').replace('.', '').replace(',', '.')),
            pontos: pedido.pontos_ganhos,
            tipo: 'ganho'
          });
        }
      });
      
      historico.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
      
      if (historico.length === 0) {
        historico.push({
          id: '1',
          data: new Date().toLocaleDateString('pt-BR'),
          descricao: 'Bem-vindo ao VetFarm!',
          valor: 0,
          pontos: 0,
          tipo: 'bonus'
        });
      }
      
      setHistoricoPontos(historico);
      console.log('✅ Histórico gerado:', historico.length, 'itens');
      
    } catch (error) {
      console.error('❌ Erro ao gerar histórico:', error);
      
      const historicoSimulado: HistoricoPontos[] = [
        {
          id: '1',
          data: new Date().toLocaleDateString('pt-BR'),
          descricao: 'Bem-vindo ao VetFarm!',
          valor: 0,
          pontos: 0,
          tipo: 'bonus'
        }
      ];
      setHistoricoPontos(historicoSimulado);
    }
  };

  useEffect(() => {
    if (showHistorico) {
      carregarHistoricoPontos();
    }
  }, [showHistorico, pedidos]);

  const handleResgatarPremio = async () => {
    Alert.alert(
      'Resgatar Prêmio',
      'Funcionalidade disponível em breve!',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const calcularProgresso = () => {
    return (pontosData.pontos / pontosData.meta) * 100;
  };

  const pontosRestantes = () => {
    return Math.max(0, pontosData.meta - pontosData.pontos);
  };

  const getCategoriaPontos = (valor: number) => {
    if (valor >= 500) return 'Máximo (50 pts)';
    if (valor >= 350) return 'Alta (35 pts)';
    if (valor >= 250) return 'Média (20 pts)';
    if (valor >= 100) return 'Básica (10 pts)';
    return `Padrão (${Math.floor(valor / 10)} pts)`;
  };

  const temDescontoAtivo = () => {
    if (pontosData.descontoAtivo <= 0) return false;
    
    if (pontosData.dataExpiracaoDesconto) {
      const hoje = new Date();
      const dataExpiracao = new Date(pontosData.dataExpiracaoDesconto);
      return dataExpiracao > hoje;
    }
    
    return true;
  };

  const renderItemHistorico = ({ item }: { item: HistoricoPontos }) => (
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
        {item.tipo === 'ganho' && item.valor > 0 && (
          <Text style={styles.historicoValorCompra}>R$ {item.valor.toFixed(2)}</Text>
        )}
      </View>
      <View style={styles.historicoPontos}>
        <Text style={[
          styles.historicoValor,
          { color: item.tipo === 'bonus' ? '#FF6B35' : '#126b1a' }
        ]}>
          {item.pontos > 0 ? `+${item.pontos}` : item.pontos}
        </Text>
        <Text style={styles.historicoLabel}>pontos</Text>
        {item.tipo === 'ganho' && item.valor > 0 && (
          <Text style={styles.historicoCategoria}>
            {getCategoriaPontos(item.valor)}
          </Text>
        )}
      </View>
    </View>
  );

  if (carregandoDados) {
    return <LoadingScreen />;
  }

  const userData = {
    nomeCompleto: user?.nome ? `${user.nome} ${user.sobrenome || ''}`.trim() : 'Usuário',
    email: user?.email || 'email@exemplo.com',
    telefone: user?.telefone || 'Não informado',
    cpf: user?.cpf || 'Não informado',
    dataNascimento: user?.data_nascimento 
      ? new Date(user.data_nascimento).toLocaleDateString('pt-BR')
      : 'Não informada',
  };

  return (
    <SafeAreaView style={styles.container}>
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
        <View style={styles.saudacaoContainer}>
          <Text style={styles.saudacao}>Olá,</Text>
          <Text style={styles.nomeUsuario}>{userData.nomeCompleto}</Text>
          <Text style={styles.emailUsuario}>{userData.email}</Text>
        </View>

        <View style={styles.dadosContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Dados da conta</Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Nome completo</Text>
              <Text style={styles.infoValue}>{userData.nomeCompleto}</Text>
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
          </View>
        </View>

        <View style={styles.fidelidadeContainer}>
          <Text style={styles.sectionTitle}>Seus Pontos de Fidelidade</Text>

          {temDescontoAtivo() && (
            <View style={styles.descontoAtivoCard}>
              <View style={styles.descontoAtivoHeader}>
                <Ionicons name="sparkles" size={24} color="#FFD700" />
                <Text style={styles.descontoAtivoTitulo}>Desconto Ativo!</Text>
              </View>
              <Text style={styles.descontoAtivoTexto}>
                Você tem {pontosData.descontoAtivo}% de desconto na próxima compra
              </Text>
              {pontosData.dataExpiracaoDesconto && (
                <Text style={styles.descontoExpiracao}>
                  Válido até: {pontosData.dataExpiracaoDesconto}
                </Text>
              )}
            </View>
          )}

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

            <View style={styles.progressoContainer}>
              <View style={styles.progressoBar}>
                <View
                  style={[
                    styles.progressoPreenchido,
                    { width: `${Math.min(calcularProgresso(), 100)}%` }
                  ]}
                />
              </View>
              <Text style={styles.progressoTexto}>
                {pontosData.progressoMeta} completo
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

          <View style={styles.premioCard}>
            <Ionicons name="gift" size={24} color="#126b1a" />
            <View style={styles.premioInfo}>
              <Text style={styles.premioTitulo}>Prêmio: Visitação Grátis</Text>
              <Text style={styles.premioDescricao}>
                Ao atingir {pontosData.meta} pontos, ganhe uma visitação gratuita do nosso veterinário parceiro!
              </Text>
              
              {pontosData.premioLiberado && (
                <TouchableOpacity 
                  style={styles.resgatarButton}
                  onPress={handleResgatarPremio}
                >
                  <Text style={styles.resgatarButtonText}>Resgatar Prêmio</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showHistorico}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowHistorico(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Histórico de Pontos</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowHistorico(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

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

            <FlatList
              data={historicoPontos}
              renderItem={renderItemHistorico}
              keyExtractor={item => item.id}
              style={styles.historicoList}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <Text style={styles.historicoTitulo}>Últimas Transações</Text>
              }
              ListEmptyComponent={
                <View style={styles.historicoVazio}>
                  <Ionicons name="receipt-outline" size={48} color="#ccc" />
                  <Text style={styles.historicoVazioTexto}>Nenhuma transação encontrada</Text>
                  <Text style={styles.historicoVazioSubtexto}>
                    Suas compras aparecerão aqui
                  </Text>
                </View>
              }
            />

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
  descontoAtivoCard: {
    backgroundColor: '#FFF9E6',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  descontoAtivoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  descontoAtivoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E67E22',
  },
  descontoAtivoTexto: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  descontoExpiracao: {
    fontSize: 12,
    color: '#7F8C8D',
    fontStyle: 'italic',
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
    alignItems: 'flex-start',
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
  resgatarButton: {
    backgroundColor: '#126b1a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  resgatarButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
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
  historicoVazio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  historicoVazioTexto: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    marginBottom: 5,
  },
  historicoVazioSubtexto: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default ResumoContaScreen;