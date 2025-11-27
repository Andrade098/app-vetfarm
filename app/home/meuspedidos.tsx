// home/meuspedidos.tsx - VERSÃO 100% LOCAL COMPLETA
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePedidos } from '../../contexts/PedidoContext';

type FiltroStatus = 'todos' | 'entregue' | 'pendentes';

export default function MeusPedidos() {
  const router = useRouter();
  const { pedidos, loading, carregarPedidos } = usePedidos();
  const [filtroAtivo, setFiltroAtivo] = useState<FiltroStatus>('todos');

  useEffect(() => {
    carregarPedidos();
  }, []);

  useEffect(() => {
    console.log('📦 Pedidos carregados LOCALMENTE:', pedidos);
  }, [pedidos]);

  const pedidosFiltrados = pedidos.filter(pedido => {
    if (filtroAtivo === 'todos') return true;
    if (filtroAtivo === 'entregue') return pedido.status === 'entregue';
    if (filtroAtivo === 'pendentes') {
      return pedido.status === 'pendente' || pedido.status === 'processando' || pedido.status === 'enviado';
    }
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'entregue': return '#4CAF50';
      case 'processando': return '#FF9800';
      case 'enviado': return '#2196F3';
      case 'pendente': return '#FF9800';
      case 'cancelado': return '#F44336';
      default: return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'entregue': return 'Entregue';
      case 'processando': return 'Processando';
      case 'enviado': return 'Enviado';
      case 'pendente': return 'Pendente';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  const formatarTotal = (total: string) => {
    try {
      if (total.includes('R$')) {
        return total;
      }
      
      const totalNumero = parseFloat(total);
      return totalNumero.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
    } catch {
      return 'R$ 0,00';
    }
  };

  const handleDetalhesPedido = (pedidoId: string) => {
    Alert.alert('Detalhes', `Ver detalhes do pedido ${pedidoId}`);
  };

  const handleRastrearPedido = (pedidoId: string) => {
    router.push(`/home/rastrearpedido?id=${pedidoId}`);
  };

  const handleAvaliarPedido = (pedidoId: string) => {
    Alert.alert('Avaliar', `Avaliar pedido ${pedidoId}`);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#126b1a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Meus Pedidos</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#126b1a" />
          <Text style={styles.loadingText}>Carregando seus pedidos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#126b1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Pedidos</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.filtersContainer}>
          <Text style={styles.sectionTitle}>Histórico de Pedidos</Text>
          
          <View style={styles.abasContainer}>
            <TouchableOpacity 
              style={[styles.aba, filtroAtivo === 'todos' && styles.abaAtiva]}
              onPress={() => setFiltroAtivo('todos')}
            >
              <Text style={[styles.abaTexto, filtroAtivo === 'todos' && styles.abaTextoAtiva]}>
                Todos
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.aba, filtroAtivo === 'entregue' && styles.abaAtiva]}
              onPress={() => setFiltroAtivo('entregue')}
            >
              <Text style={[styles.abaTexto, filtroAtivo === 'entregue' && styles.abaTextoAtiva]}>
                Entregues
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.aba, filtroAtivo === 'pendentes' && styles.abaAtiva]}
              onPress={() => setFiltroAtivo('pendentes')}
            >
              <Text style={[styles.abaTexto, filtroAtivo === 'pendentes' && styles.abaTextoAtiva]}>
                Pendentes
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.contadorText}>
            {pedidosFiltrados.length} pedido(s) {filtroAtivo !== 'todos' ? `encontrado(s)` : 'no total'}
          </Text>
        </View>

        <View style={styles.pedidosContainer}>
          {pedidosFiltrados.map((pedido) => (
            <View key={pedido.id} style={styles.pedidoCard}>
              <View style={styles.pedidoHeader}>
                <View>
                  <Text style={styles.pedidoNumero}>Pedido #{pedido.numero_pedido}</Text>
                  <Text style={styles.pedidoData}>
                    Data: {new Date(pedido.createdAt).toLocaleDateString('pt-BR')}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(pedido.status) }]}>
                  <Text style={styles.statusText}>{getStatusText(pedido.status)}</Text>
                </View>
              </View>

              <View style={styles.pedidoDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="cube" size={16} color="#666" />
                  <Text style={styles.detailText}>
                    {pedido.itens?.length || 0} item(s)
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="cash" size={16} color="#666" />
                  <Text style={styles.detailText}>
                    Total: {formatarTotal(pedido.total)}
                  </Text>
                </View>
                {pedido.pontos_ganhos > 0 && (
                  <View style={styles.detailRow}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.detailText}>
                      Pontos ganhos: +{pedido.pontos_ganhos}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.itensContainer}>
                {pedido.itens?.slice(0, 2).map((item, index) => (
                  <Text key={index} style={styles.itemText}>
                    • {item.quantity}x {item.name}
                  </Text>
                ))}
                {pedido.itens?.length > 2 && (
                  <Text style={styles.moreItemsText}>
                    +{pedido.itens.length - 2} mais itens...
                  </Text>
                )}
              </View>

              <View style={styles.entregaInfo}>
                <View style={styles.detailRow}>
                  <Ionicons name="location" size={14} color="#666" />
                  <Text style={styles.entregaText}>
                    {pedido.endereco_entrega?.apelido || 'Endereço principal'}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="barcode" size={14} color="#666" />
                  <Text style={styles.rastreioText}>
                    Rastreio: {pedido.codigo_rastreio || 'Aguardando...'}
                  </Text>
                </View>
              </View>

              <View style={styles.acoesContainer}>
                <TouchableOpacity 
                  style={styles.acaoButton}
                  onPress={() => handleDetalhesPedido(pedido.id)}
                >
                  <Text style={styles.acaoButtonText}>Ver Detalhes</Text>
                </TouchableOpacity>
                
                {(pedido.status === 'enviado' || pedido.status === 'processando') && (
                  <TouchableOpacity 
                    style={[styles.acaoButton, styles.rastrearButton]}
                    onPress={() => handleRastrearPedido(pedido.numero_pedido)}
                  >
                    <Text style={styles.acaoButtonText}>Rastrear</Text>
                  </TouchableOpacity>
                )}
                
                {pedido.status === 'entregue' && (
                  <TouchableOpacity 
                    style={[styles.acaoButton, styles.avaliarButton]}
                    onPress={() => handleAvaliarPedido(pedido.id)}
                  >
                    <Text style={styles.acaoButtonText}>Avaliar</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>

        {pedidosFiltrados.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt" size={64} color="#ccc" />
            <Text style={styles.emptyText}>
              {filtroAtivo === 'todos' 
                ? 'Nenhum pedido encontrado' 
                : `Nenhum pedido ${filtroAtivo === 'entregue' ? 'entregue' : 'pendente'}`
              }
            </Text>
            <Text style={styles.emptySubtext}>
              {filtroAtivo === 'todos' 
                ? 'Suas compras aparecerão aqui' 
                : 'Quando houver pedidos neste status, eles aparecerão aqui'
              }
            </Text>
            
            {filtroAtivo === 'todos' && pedidos.length === 0 && (
              <TouchableOpacity 
                style={styles.comprarButton}
                onPress={() => router.push('/home/')}
              >
                <Text style={styles.comprarButtonText}>Fazer Minha Primeira Compra</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  filtersContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  abasContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 4,
    marginBottom: 10,
  },
  aba: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 6,
    alignItems: 'center',
  },
  abaAtiva: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  abaTexto: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  abaTextoAtiva: {
    color: '#126b1a',
    fontWeight: 'bold',
  },
  contadorText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  pedidosContainer: {
    marginBottom: 20,
  },
  pedidoCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  pedidoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  pedidoNumero: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  pedidoData: {
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  pedidoDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
  },
  itensContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  itemText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  moreItemsText: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 4,
  },
  entregaInfo: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f0f9f0',
    borderRadius: 5,
    borderLeftWidth: 3,
    borderLeftColor: '#126b1a',
  },
  entregaText: {
    fontSize: 12,
    color: '#666',
  },
  rastreioText: {
    fontSize: 11,
    color: '#126b1a',
    fontWeight: '500',
  },
  acoesContainer: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  acaoButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    backgroundColor: '#126b1a',
  },
  rastrearButton: {
    backgroundColor: '#2196F3',
  },
  avaliarButton: {
    backgroundColor: '#FF9800',
  },
  acaoButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
  comprarButton: {
    backgroundColor: '#126b1a',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  comprarButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MeusPedidos;