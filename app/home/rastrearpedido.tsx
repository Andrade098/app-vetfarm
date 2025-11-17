import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

type EtapaRastreio = {
  id: string;
  status: 'concluido' | 'ativo' | 'pendente';
  data: string;
  hora: string;
  descricao: string;
  localizacao: string;
};
export default function RastrearPedidoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const pedidoId = params.id as string;
  // Dados de exemplo - etapas do rastreamento
  const etapasRastreio: EtapaRastreio[] = [
    {
      id: '1',
      status: 'concluido',
      data: '15/11/2024',
      hora: '08:30',
      descricao: 'Pedido confirmado',
      localizacao: 'Centro de Distribuição - SP'
    },
    {
      id: '2',
      status: 'concluido',
      data: '15/11/2024',
      hora: '10:15',
      descricao: 'Pedido em separação',
      localizacao: 'Centro de Distribuição - SP'
    },
    {
      id: '3',
      status: 'concluido',
      data: '15/11/2024',
      hora: '14:20',
      descricao: 'Pedido embalado',
      localizacao: 'Centro de Distribuição - SP'
    },
    {
      id: '4',
      status: 'concluido',
      data: '16/11/2024',
      hora: '09:00',
      descricao: 'Pedido enviado para transporte',
      localizacao: 'Transportadora FastDeliver'
    },
    {
      id: '5',
      status: 'ativo',
      data: '16/11/2024',
      hora: '15:45',
      descricao: 'Em trânsito',
      localizacao: 'Rodovia Presidente Dutra, KM 150'
    },
    {
      id: '6',
      status: 'pendente',
      data: '17/11/2024',
      hora: '08:00',
      descricao: 'Previsão de entrega',
      localizacao: 'Sua fazenda'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'concluido': return 'checkmark-circle';
      case 'ativo': return 'ellipse';
      case 'pendente': return 'time';
      default: return 'ellipse';
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluido': return '#4CAF50';
      case 'ativo': return '#2196F3';
      case 'pendente': return '#FF9800';
      default: return '#666';
    }
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
        <Text style={styles.headerTitle}>Rastrear Pedido</Text>
        <View style={styles.headerRight} />
      </View>
      <ScrollView style={styles.content}>
        {/* Informações do Pedido */}
        <View style={styles.infoContainer}>
          <Text style={styles.pedidoNumero}>Pedido #{pedidoId}</Text>
          <Text style={styles.statusGeral}>Em trânsito - Previsão de entrega: 17/11/2024</Text>
        </View>

        {/* Linha do Tempo do Rastreio */}
        <View style={styles.timelineContainer}>
          <Text style={styles.timelineTitle}>Status da Entrega</Text>
          
          {etapasRastreio.map((etapa, index) => (
            <View key={etapa.id} style={styles.timelineItem}>
              {/* Linha vertical */}
              {index < etapasRastreio.length - 1 && (
                <View 
                  style={[
                    styles.timelineLine,
                    { backgroundColor: etapa.status === 'concluido' ? '#4CAF50' : '#e0e0e0' }
                  ]} 
                />
              )}

              {/* Ícone da etapa */}
              <View style={styles.timelineIconContainer}>
                <Ionicons 
                  name={getStatusIcon(etapa.status) as any} 
                  size={20} 
                  color={getStatusColor(etapa.status)} 
                />
              </View>

              {/* Detalhes da etapa */}
              <View style={styles.timelineContent}>
                <Text style={[styles.etapaDescricao, 
                  etapa.status === 'ativo' && styles.etapaAtiva]}>
                  {etapa.descricao}
                </Text>
                <Text style={styles.etapaData}>{etapa.data} às {etapa.hora}</Text>
                <Text style={styles.etapaLocalizacao}>{etapa.localizacao}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Informações de Contato */}
        <View style={styles.contatoContainer}>
          <Text style={styles.contatoTitle}>Precisa de ajuda?</Text>
          <View style={styles.contatoItem}>
            <Ionicons name="call" size={18} color="#126b1a" />
            <Text style={styles.contatoText}>Transportadora: (11) 3333-4444</Text>
          </View>
          <View style={styles.contatoItem}>
            <Ionicons name="chatbubble" size={18} color="#126b1a" />
            <Text style={styles.contatoText}>Suporte VetFarm: (11) 9999-8888</Text>
          </View>
        </View>
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
  infoContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  pedidoNumero: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  statusGeral: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '500',
  },
  timelineContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
    minHeight: 50,
  },
  timelineLine: {
    width: 2,
    backgroundColor: '#e0e0e0',
    position: 'absolute',
    top: 20,
    bottom: -20,
    left: 9,
  },
  timelineIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginRight: 15,
    zIndex: 1,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 0,
  },
  etapaDescricao: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 2,
  },
  etapaAtiva: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  etapaData: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  etapaLocalizacao: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  contatoContainer: {
    backgroundColor: '#e8f5e9',
    padding: 20,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  contatoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  contatoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  contatoText: {
    fontSize: 14,
    color: '#666',
  },
});