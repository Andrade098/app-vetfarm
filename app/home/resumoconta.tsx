import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ResumoContaScreen() {
  const router = useRouter();
// Dados do usuário (você pode substituir por dados reais)
  const userData = {
    nome: 'João Pedro Ferreira de Souza',
    email: 'contato.joaopedro@gmail.com',
    telefone: '(11) 99999-9999',
    cpf: '123.456.789-00',
    dataNascimento: '15/05/1990',
  };
// Dados de fidelidade
  const fidelidadeData = {
    pontosAtuais: 720,
    pontosNecessarios: 1000,
    expiracao: '15/12/2025',
    progresso: (720 / 1000) * 100, // 72%
    historico: [
      { data: '10/11/2024', compra: 'R$ 150,00', pontos: 60 },
      { data: '05/11/2024', compra: 'R$ 89,90', pontos: 36 },
      { data: '25/10/2024', compra: 'R$ 289,90', pontos: 116 },
    ]
  };
// Estatísticas (pode vir de uma API no futuro)
  const estatisticas = [
    { id: '1', label: 'Pedidos Realizados', valor: '15', icon: 'cart' },
    { id: '2', label: 'Favoritos', valor: '8', icon: 'heart' },
    { id: '3', label: 'Endereços', valor: '2', icon: 'location' },
  ];

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
    <Text style={styles.nomeUsuario}>João Pedro Ferreira de Souza</Text>
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
<TouchableOpacity>
    <Text style={styles.alterarTexto}>alterar</Text>
</TouchableOpacity>
</View>

    <View style={styles.infoCard}>
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
</View>
</View>

      {/* Alterar Senha */}
<TouchableOpacity 
  style={styles.alterarSenhaButton}
  onPress={() => router.push('/home/alterarsenha')} // ← Mude aqui
>
  <Ionicons name="lock-closed" size={20} color="#126b1a" />
  <Text style={styles.alterarSenhaText}>Alterar senha</Text>
  <Ionicons name="chevron-forward" size={20} color="#666" />
</TouchableOpacity>

        {/* Programa de Fidelidade */}
<View style={styles.fidelidadeContainer}>
    <Text style={styles.sectionTitle}>Seus Pontos de Fidelidade</Text>
    <View style={styles.fidelidadeCard}>
    <View style={styles.pontosHeader}>
<Ionicons name="trophy" size={24} color="#FFD700" />
    <View style={styles.pontosInfo}>
    <Text style={styles.pontosTitulo}>{fidelidadeData.pontosAtuais} Pontos</Text>
    <Text style={styles.pontosMeta}>
    {fidelidadeData.pontosNecessarios - fidelidadeData.pontosAtuais} pontos para visita grátis
</Text>
</View>
</View>

       {/* Barra de progresso */}
    <View style={styles.progressoContainer}>
    <View style={styles.progressoBar}>
    <View 
    style={[
    styles.progressoPreenchido, 
    { width: `${fidelidadeData.progresso}%` }
]} 
/>
</View>
    <Text style={styles.progressoTexto}>
    {Math.round(fidelidadeData.progresso)}% completo
</Text>
</View>

    <Text style={styles.expiracaoTexto}> Pontos expiram em: {fidelidadeData.expiracao}
    </Text>

    <TouchableOpacity style={styles.verDetalhesButton}>
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
    Ao atingir 1000 pontos, ganhe uma visitação gratuita do nosso veterinário parceiro!
</Text>
</View>
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
});