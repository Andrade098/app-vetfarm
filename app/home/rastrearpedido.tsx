import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePedidos } from '../../contexts/PedidoContext';

export default function RastrearPedido() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { pedidos, loading } = usePedidos();
  const [pedido, setPedido] = useState(null);

  useEffect(() => {
    if (params.id && pedidos.length > 0) {
      console.log('🔍 Procurando pedido com ID:', params.id);
      console.log('📦 Pedidos disponíveis:', pedidos.map(p => p.numero_pedido));
      
      const pedidoEncontrado = pedidos.find(p => 
        p.numero_pedido === params.id || p.id === params.id
      );
      
      console.log('✅ Pedido encontrado:', pedidoEncontrado);
      setPedido(pedidoEncontrado);
    }
  }, [params.id, pedidos]);

  // Status MUITO SIMPLIFICADO - APENAS "CONFIRMADO"
  const getStatusSimples = () => {
    return [
      { status: 'Pedido confirmado', ativo: true, concluido: true }
    ];
  };

  const getStatusText = (status) => {
    return 'Confirmado'; // SEMPRE RETORNA "CONFIRMADO"
  };

  const getStatusColor = (status) => {
    return '#126b1a'; // SEMPRE VERDE
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#126b1a" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!pedido) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#126b1a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Rastrear Pedido</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.notFoundContainer}>
          <Ionicons name="document-outline" size={64} color="#bdc3c7" />
          <Text style={styles.notFoundText}>Pedido não encontrado</Text>
          <Text style={styles.notFoundSubtext}>
            Verifique se o número do pedido está correto ou tente novamente mais tarde.
          </Text>
          <TouchableOpacity 
            style={styles.backButtonStyle}
            onPress={() => router.push('/home/menu')}
          >
            <Text style={styles.backButtonText}>Voltar ao Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => router.push('/home/meuspedidos')}
          >
            <Text style={styles.secondaryButtonText}>Ver Meus Pedidos</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusList = getStatusSimples();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#126b1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rastrear Pedido</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        {/* ✅ CARTA DE CONFIRMAÇÃO SIMPLES */}
        <View style={styles.confirmacaoCard}>
          <View style={styles.confirmacaoIcon}>
            <Ionicons name="checkmark-circle" size={60} color="#27ae60" />
          </View>
          <Text style={styles.confirmacaoTitulo}>Pedido Confirmado!</Text>
          <Text style={styles.confirmacaoSubtitulo}>
            Seu pedido foi recebido e está sendo processado
          </Text>
        </View>

        {/* Informações Básicas do Pedido */}
        <View style={styles.pedidoInfoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Número do Pedido:</Text>
            <Text style={styles.infoValue}>#{pedido.numero_pedido}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status:</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(pedido.status) }]}>
              <Text style={styles.statusText}>{getStatusText(pedido.status)}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Data do Pedido:</Text>
            <Text style={styles.infoValue}>
              {new Date(pedido.createdAt).toLocaleDateString('pt-BR')}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Código de Rastreio:</Text>
            <Text style={[styles.infoValue, styles.codigoRastreio]}>
              {pedido.codigo_rastreio || 'Aguardando...'}
            </Text>
          </View>
        </View>

        {/* ✅ STATUS SUPER SIMPLIFICADO - APENAS UMA LINHA */}
        <View style={styles.statusSimpleCard}>
          <Text style={styles.statusSimpleTitle}>Situação do Pedido</Text>
          <View style={styles.statusSimpleItem}>
            <Ionicons name="checkmark-circle" size={24} color="#27ae60" />
            <Text style={styles.statusSimpleText}>Pedido confirmado</Text>
          </View>
          <Text style={styles.statusSimpleAviso}>
            Você receberá atualizações por email quando houver mudanças no status.
          </Text>
        </View>

        {/* Informações de Entrega (Opcional) */}
        {pedido.endereco_entrega && (
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Local de Entrega</Text>
            <View style={styles.enderecoInfo}>
              <Ionicons name="location-outline" size={20} color="#126b1a" />
              <View style={styles.enderecoTexts}>
                <Text style={styles.enderecoApelido}>{pedido.endereco_entrega.apelido}</Text>
                <Text style={styles.enderecoDetails}>
                  {pedido.endereco_entrega.logradouro}, {pedido.endereco_entrega.numero}
                  {pedido.endereco_entrega.complemento && `, ${pedido.endereco_entrega.complemento}`}
                </Text>
                <Text style={styles.enderecoDetails}>
                  {pedido.endereco_entrega.bairro} - {pedido.endereco_entrega.cidade}/{pedido.endereco_entrega.estado}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Botões de Ação */}
        <View style={styles.botoesContainer}>
          <TouchableOpacity 
            style={styles.botaoPrincipal}
            onPress={() => router.push('/home/menu')}
          >
            <Ionicons name="home-outline" size={20} color="white" />
            <Text style={styles.botaoPrincipalTexto}>Voltar ao Menu</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.botaoSecundario}
            onPress={() => router.push('/home/meuspedidos')}
          >
            <Ionicons name="list-outline" size={20} color="#126b1a" />
            <Text style={styles.botaoSecundarioTexto}>Ver Todos os Pedidos</Text>
          </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  notFoundSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 20,
  },
  backButtonStyle: {
    backgroundColor: '#126b1a',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#126b1a',
    width: '100%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#126b1a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // NOVOS ESTILOS SIMPLIFICADOS
  confirmacaoCard: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  confirmacaoIcon: {
    marginBottom: 15,
  },
  confirmacaoTitulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 8,
    textAlign: 'center',
  },
  confirmacaoSubtitulo: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  pedidoInfoCard: {
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  codigoRastreio: {
    fontFamily: 'monospace',
    color: '#126b1a',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusSimpleCard: {
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
  statusSimpleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statusSimpleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 12,
    backgroundColor: '#f0f9f0',
    borderRadius: 8,
  },
  statusSimpleText: {
    fontSize: 16,
    color: '#27ae60',
    fontWeight: '500',
    marginLeft: 10,
  },
  statusSimpleAviso: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 10,
    textAlign: 'center',
  },
  infoCard: {
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
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  enderecoInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  enderecoTexts: {
    flex: 1,
    marginLeft: 10,
  },
  enderecoApelido: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  enderecoDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  botoesContainer: {
    marginBottom: 20,
  },
  botaoPrincipal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#126b1a',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  botaoPrincipalTexto: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
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
  },
  botaoSecundarioTexto: {
    color: '#126b1a',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});