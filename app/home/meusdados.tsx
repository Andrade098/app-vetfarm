import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MeusDadosScreen() {
  const router = useRouter();
  const { user, login } = useAuth();

  // Estado dos dados do usuário - COM DADOS REAIS DO AUTHCONTEXT
  const [userData, setUserData] = useState({
    nome: user?.nome || 'Usuário',
    sobrenome: user?.sobrenome || 'Não informado',
    email: user?.email || 'email@exemplo.com',
    cpf: user?.cpf || 'Não informado',
    celular: user?.telefone || 'Não informado',
    dataNascimento: user?.data_nascimento || 'Não informada',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [dadosEditados, setDadosEditados] = useState({ ...userData });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);

      // Validações básicas
      if (!dadosEditados.nome || !dadosEditados.email) {
        Alert.alert('Erro', 'Nome e e-mail são obrigatórios.');
        return;
      }

      // Validação de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(dadosEditados.email)) {
        Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
        return;
      }

      // Busca o token
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Erro', 'Sessão expirada. Faça login novamente.');
        router.push('/loginANDcadastro');
        return;
      }

      // Faz a requisição para atualizar no backend
      const response = await fetch('http://192.168.0.6:3000/api/clientes/meus-dados', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: dadosEditados.nome,
          sobrenome: dadosEditados.sobrenome,
          email: dadosEditados.email,
          telefone: dadosEditados.celular,
          data_nascimento: dadosEditados.dataNascimento
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar dados');
      }

      if (data.success) {
        // Atualiza os dados locais
        setUserData({ ...dadosEditados });

        // Atualiza o AuthContext com os novos dados
        login({
          id: user?.id || '',
          nome: dadosEditados.nome,
          sobrenome: dadosEditados.sobrenome,
          email: dadosEditados.email,
          telefone: dadosEditados.celular,
          cpf: user?.cpf || '',
          data_nascimento: dadosEditados.dataNascimento,
          tipo: user?.tipo || 'cliente'
        });

        setIsEditing(false);
        Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
      } else {
        throw new Error(data.error || 'Erro ao atualizar dados');
      }

    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      Alert.alert('Erro', error.message || 'Não foi possível salvar os dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setDadosEditados({ ...userData });
    setIsEditing(false);
  };

  const handleInputChange = (campo: string, valor: string) => {
    setDadosEditados(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  // Formatação para exibição
  const formatarTelefone = (telefone: string) => {
    if (!telefone) return telefone;

    // Remove tudo que não é número
    const numeros = telefone.replace(/\D/g, '');

    // Formata (11) 99999-9999
    if (numeros.length === 11) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
    }

    return telefone;
  };

  const formatarCPF = (cpf: string) => {
    if (!cpf) return cpf;

    // Remove tudo que não é número
    const numeros = cpf.replace(/\D/g, '');

    // Formata 123.456.789-00
    if (numeros.length === 11) {
      return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9)}`;
    }

    return cpf;
  };

  const formatarData = (data: string) => {
    if (!data) return data;

    // Remove tudo que não é número
    const numeros = data.replace(/\D/g, '');

    // Formata DD/MM/AAAA
    if (numeros.length === 8) {
      return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`;
    }

    return data;
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
        <Text style={styles.headerTitle}>Meus Dados</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>

          {/* Nome */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome*</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={dadosEditados.nome}
                onChangeText={(text) => handleInputChange('nome', text)}
                placeholder="Digite seu nome"
              />
            ) : (
              <Text style={styles.valueText}>{userData.nome}</Text>
            )}
          </View>

          {/* Sobrenome */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Sobrenome*</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={dadosEditados.sobrenome}
                onChangeText={(text) => handleInputChange('sobrenome', text)}
                placeholder="Digite seu sobrenome"
              />
            ) : (
              <Text style={styles.valueText}>{userData.sobrenome}</Text>
            )}
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Endereço de email*</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={dadosEditados.email}
                onChangeText={(text) => handleInputChange('email', text)}
                placeholder="Digite seu email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <Text style={[styles.valueText, styles.emailText]}>{userData.email}</Text>
            )}
          </View>

          {/* CPF (não editável) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>CPF***</Text>
            <Text style={[styles.valueText, styles.nonEditable]}>
              {formatarCPF(userData.cpf)}
            </Text>
            <Text style={styles.cpfWarning}>CPF não pode ser alterado</Text>
          </View>

          {/* Celular */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Celular***</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={dadosEditados.celular}
                onChangeText={(text) => handleInputChange('celular', text)}
                placeholder="(11) 99999-9999"
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.valueText}>{formatarTelefone(userData.celular)}</Text>
            )}
          </View>

          {/* Data de Nascimento */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data de nascimento***</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={dadosEditados.dataNascimento}
                onChangeText={(text) => handleInputChange('dataNascimento', text)}
                placeholder="DD/MM/AAAA"
                keyboardType="numeric"
              />
            ) : (
              <Text style={styles.valueText}>{formatarData(userData.dataNascimento)}</Text>
            )}
          </View>

          {/* Botões */}
          <View style={styles.buttonsContainer}>
            {isEditing ? (
              <>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton, loading && styles.disabledButton]}
                  onPress={handleSave}
                  disabled={loading}
                >
                  {loading ? (
                    <Text style={styles.buttonText}>SALVANDO...</Text>
                  ) : (
                    <Text style={styles.buttonText}>SALVAR DADOS</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleCancelEdit}
                  disabled={loading}
                >
                  <Text style={[styles.buttonText, styles.cancelButtonText]}>CANCELAR</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={() => setIsEditing(true)}
              >
                <Ionicons name="create-outline" size={18} color="#fff" />
                <Text style={styles.buttonText}>EDITAR DADOS</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Texto de observação */}
          <Text style={styles.observationText}>
            * Campos obrigatórios{'\n'}
            ** Campos opcionais{'\n'}
            *** Campos sensíveis - edite com cuidado
          </Text>
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
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
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
  valueText: {
    fontSize: 16,
    color: '#333',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#eee',
  },
  emailText: {
    color: '#126b1a',
    fontWeight: '500',
  },
  nonEditable: {
    backgroundColor: '#f0f0f0',
    color: '#666',
  },
  cpfWarning: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
    fontStyle: 'italic',
  },
  buttonsContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#126b1a',
    gap: 8,
  },
  saveButton: {
    backgroundColor: '#126b1a',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  disabledButton: {
    backgroundColor: '#95a5a6',
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButtonText: {
    color: '#666',
  },
  observationText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 10,
  },
});