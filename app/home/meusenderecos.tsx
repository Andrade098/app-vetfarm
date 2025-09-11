import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEnderecos } from '../../contexts/EnderecoContext';

export default function MeusEnderecosScreen() {
  const router = useRouter();
  const { enderecos, definirPrincipal, removerEndereco } = useEnderecos();

  const toggleEnderecoPrincipal = (id: string) => {
    definirPrincipal(id);
    Alert.alert('Sucesso', 'Endereço principal atualizado!');
  };

  const handleEditarEndereco = (id: string) => {
    Alert.alert('Editar', `Editar endereço ${id}`);
  };

  const handleExcluirEndereco = (id: string) => {
    Alert.alert(
      'Excluir Endereço',
      'Tem certeza que deseja excluir este endereço?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            removerEndereco(id);
            Alert.alert('Sucesso', 'Endereço excluído com sucesso!');
          }
        }
      ]
    );
  };

  const handleNovoEndereco = () => {
    router.push('/home/novoendereco');
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
        <Text style={styles.headerTitle}>Meus Endereços</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        {/* Lista de Endereços */}
        <View style={styles.enderecosContainer}>
          <Text style={styles.sectionTitle}>Seus endereços cadastrados</Text>
          
          {enderecos.map((endereco) => (
            <View key={endereco.id} style={styles.enderecoCard}>
              {/* Cabeçalho do Card */}
              <View style={styles.enderecoHeader}>
                <View style={styles.apelidoContainer}>
                  <Ionicons name="location" size={20} color="#126b1a" />
                  <Text style={styles.apelidoText}>{endereco.apelido}</Text>
                  {endereco.principal && (
                    <View style={styles.principalBadge}>
                      <Text style={styles.principalText}>PRINCIPAL</Text>
                    </View>
                  )}
                </View>
                
                {/* Ações */}
                <View style={styles.acoesContainer}>
                  <TouchableOpacity 
                    style={styles.acaoButton}
                    onPress={() => handleEditarEndereco(endereco.id)}
                  >
                    <Ionicons name="create-outline" size={18} color="#666" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.acaoButton}
                    onPress={() => handleExcluirEndereco(endereco.id)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#ff3b30" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Detalhes do Endereço */}
              <View style={styles.enderecoDetails}>
                <Text style={styles.enderecoText}>
                  {endereco.logradouro}, {endereco.numero}
                  {endereco.complemento && `, ${endereco.complemento}`}
                </Text>
                <Text style={styles.enderecoText}>
                  {endereco.bairro} - {endereco.cidade}/{endereco.estado}
                </Text>
                <Text style={styles.enderecoText}>CEP: {endereco.cep}</Text>
              </View>

              {/* Definir como principal */}
              <View style={styles.principalContainer}>
                <Text style={styles.principalLabel}>Definir como principal</Text>
                <Switch
                  value={endereco.principal}
                  onValueChange={() => toggleEnderecoPrincipal(endereco.id)}
                  thumbColor={endereco.principal ? "#126b1a" : "#f4f3f4"}
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Botão Adicionar Novo Endereço */}
        <TouchableOpacity 
          style={styles.novoEnderecoButton}
          onPress={handleNovoEndereco}
        >
          <Ionicons name="add-circle" size={24} color="#126b1a" />
          <Text style={styles.novoEnderecoText}>Adicionar novo endereço</Text>
        </TouchableOpacity>

        {/* Informações */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            💡 Você pode ter múltiplos endereços para entrega. 
            O endereço principal será usado como padrão para suas compras.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Os estilos permanecem EXATAMENTE os mesmos
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
  enderecosContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  enderecoCard: {
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
  enderecoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  apelidoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  apelidoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  principalBadge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  principalText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#126b1a',
  },
  acoesContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  acaoButton: {
    padding: 5,
  },
  enderecoDetails: {
    marginBottom: 15,
  },
  enderecoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  principalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  principalLabel: {
    fontSize: 14,
    color: '#666',
  },
  novoEnderecoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    gap: 10,
  },
  novoEnderecoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#126b1a',
  },
  infoContainer: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  infoText: {
    fontSize: 14,
    color: '#1565c0',
    lineHeight: 20,
  },
});