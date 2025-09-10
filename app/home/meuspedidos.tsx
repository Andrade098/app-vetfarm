import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type Pedido = {
  id: string;
  numero: string;
  data: string;
  status: 'entregue' | 'processando' | 'cancelado' | 'transporte';
  total: string;
  items: number;
  itemsDetails: {
    nome: string;
    quantidade: number;
    preco: string;
  }[];
};

type FiltroStatus = 'todos' | 'entregue' | 'pendentes';

export default function MeusPedidosScreen() {
  const router = useRouter();
  const [filtroAtivo, setFiltroAtivo] = useState<FiltroStatus>('todos');
  
  // Dados de exemplo - pedidos do usuário
  const [pedidos, setPedidos] = useState<Pedido[]>([
    {
      id: '1',
      numero: '#VF00123',
      data: '15/11/2024',
      status: 'entregue',
      total: 'R$ 289,90',
      items: 3,
      itemsDetails: [
        { nome: 'Vacina Febre Aftosa', quantidade: 2, preco: 'R$ 89,90' },
        { nome: 'Vermífugo Bovino', quantidade: 1, preco: 'R$ 45,90' },
        { nome: 'Suplemento Mineral', quantidade: 1, preco: 'R$ 149,90' }
      ]
    },
    {
      id: '2',
      numero: '#VF00119',
      data: '10/11/2024',
      status: 'transporte',
      total: 'R$ 149,90',
      items: 1,
      itemsDetails: [
        { nome: 'Suplemento Mineral', quantidade: 1, preco: 'R$ 149,90' }
      ]
    },
    {
      id: '3',
      numero: '#VF00105',
      data: '05/11/2024',
      status: 'processando',
      total: 'R$ 89,90',
      items: 1,
      itemsDetails: [
        { nome: 'Vacina Febre Aftosa', quantidade: 1, preco: 'R$ 89,90' }
      ]
    },
    {
      id: '4',
      numero: '#VF00098',
      data: '25/10/2024',
      status: 'cancelado',
      total: 'R$ 45,90',
      items: 1,
      itemsDetails: [
        { nome: 'Vermífugo Bovino', quantidade: 1, preco: 'R$ 45,90' }
      ]
    }
  ]);

  // Filtrar pedidos baseado na aba selecionada
  const pedidosFiltrados = pedidos.filter(pedido => {
    if (filtroAtivo === 'todos') return true;
    if (filtroAtivo === 'entregue') return pedido.status === 'entregue';
    if (filtroAtivo === 'pendentes') {
      return pedido.status === 'processando' || pedido.status === 'transporte';
    }
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'entregue': return '#4CAF50';
      case 'processando': return '#FF9800';
      case 'transporte': return '#2196F3';
      case 'cancelado': return '#F44336';
      default: return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'entregue': return 'Entregue';
      case 'processando': return 'Processando';
      case 'transporte': return 'Em Transporte';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  const handleDetalhesPedido = (pedidoId: string) => {
    Alert.alert('Detalhes', `Ver detalhes do pedido ${pedidoId}`);
    // router.push(`/home/detalhes-pedido/${pedidoId}`);
  };

  const handleRastrearPedido = (pedidoId: string) => {
    router.push(`/home/rastrearpedido?id=${pedidoId}`);
  };

  const handleAvaliarPedido = (pedidoId: string) => {
    Alert.alert('Avaliar', `Avaliar pedido ${pedidoId}`);
    // router.push(`/home/avaliar-pedido/${pedidoId}`);
  };

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
        <Text style={styles.headerTitle}>Meus Pedidos</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        {/* Abas de Filtro */}
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

          {/* Contador de resultados */}
          <Text style={styles.contadorText}>
            {pedidosFiltrados.length} pedido(s) {filtroAtivo !== 'todos' ? `encontrado(s)` : 'no total'}
          </Text>
        </View>

        {/* Lista de Pedidos Filtrados */}
        <View style={styles.pedidosContainer}>
          {pedidosFiltrados.map((pedido) => (
            <View key={pedido.id} style={styles.pedidoCard}>
              {/* Cabeçalho do Pedido */}
              <View style={styles.pedidoHeader}>
                <View>
                  <Text style={styles.pedidoNumero}>{pedido.numero}</Text>
                  <Text style={styles.pedidoData}>Data: {pedido.data}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(pedido.status) }]}>
                  <Text style={styles.statusText}>{getStatusText(pedido.status)}</Text>
                </View>
              </View>

              {/* Detalhes do Pedido */}
              <View style={styles.pedidoDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="cube" size={16} color="#666" />
                  <Text style={styles.detailText}>{pedido.items} item(s)</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="cash" size={16} color="#666" />
                  <Text style={styles.detailText}>Total: {pedido.total}</Text>
                </View>
              </View>

              {/* Itens do Pedido (Resumo) */}
              <View style={styles.itensContainer}>
                {pedido.itemsDetails.slice(0, 2).map((item, index) => (
                  <Text key={index} style={styles.itemText}>
                    • {item.quantidade}x {item.nome}
                  </Text>
                ))}
                {pedido.itemsDetails.length > 2 && (
                  <Text style={styles.moreItemsText}>
                    +{pedido.itemsDetails.length - 2} mais itens...
                  </Text>
                )}
              </View>

              {/* Ações do Pedido */}
              <View style={styles.acoesContainer}>
                <TouchableOpacity 
                  style={styles.acaoButton}
                  onPress={() => handleDetalhesPedido(pedido.id)}
                >
                  <Text style={styles.acaoButtonText}>Ver Detalhes</Text>
                </TouchableOpacity>
                
                {pedido.status === 'transporte' && (
                  <TouchableOpacity 
                    style={[styles.acaoButton, styles.rastrearButton]}
                    onPress={() => handleRastrearPedido(pedido.id)}
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

        {/* Mensagem se não houver pedidos */}
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
                ? 'Seus pedidos aparecerão aqui' 
                : 'Quando houver pedidos neste status, eles aparecerão aqui'
              }
            </Text>
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
    marginBottom: 15,
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
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});