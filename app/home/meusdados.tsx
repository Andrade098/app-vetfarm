import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function MeusDadosScreen() {
const router = useRouter();
  // Estado dos dados do usuário
  const [userData, setUserData] = useState({
    nome: 'João',
    sobrenome: 'Pedro',
    email: 'contato.jp@gmail.com',
    cpf: '123.456.789-00',
    celular: '(11) 99999-9999',
    dataNascimento: '15/05/1990',
  });

  const [isEditing, setIsEditing] = useState(false);
  const handleSave = () => {
    // Aqui você pode adicionar a lógica para salvar os dados
    Alert.alert('Sucesso', 'Dados salvos com sucesso!');
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Aqui você pode resetar os dados se necessário
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
        <Text style={styles.headerTitle}>Meus Dados</Text>
        <View style={styles.headerRight} />
      </View>
      <ScrollView style={styles.content}>
        {/* Formulário de Dados */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>         

          {/* Nome */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome*</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={userData.nome}
                onChangeText={(text) => setUserData({...userData, nome: text})}
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
                value={userData.sobrenome}
                onChangeText={(text) => setUserData({...userData, sobrenome: text})}
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
                value={userData.email}
                onChangeText={(text) => setUserData({...userData, email: text})}
                placeholder="Digite seu email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <Text style={[styles.valueText, styles.emailText]}>{userData.email}</Text>
            )}
          </View>

          {/* Senha */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <TouchableOpacity 
              style={styles.passwordButton}
              onPress={() => router.push('/home/alterar-senha')}
            >
              <Text style={styles.passwordButtonText}>ALTERAR SENHA</Text>
            </TouchableOpacity>
          </View>

          {/* CPF */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>CPF***</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={userData.cpf}
                onChangeText={(text) => setUserData({...userData, cpf: text})}
                placeholder="Digite seu CPF"
                keyboardType="numeric"
              />
            ) : (
              <Text style={styles.valueText}>{userData.cpf}</Text>
            )}
          </View>

          {/* Celular */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Celular***</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={userData.celular}
                onChangeText={(text) => setUserData({...userData, celular: text})}
                placeholder="Digite seu celular"
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.valueText}>{userData.celular}</Text>
            )}
          </View>

          {/* Data de Nascimento */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data de nascimento***</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={userData.dataNascimento}
                onChangeText={(text) => setUserData({...userData, dataNascimento: text})}
                placeholder="DD/MM/AAAA"
                keyboardType="numeric"
              />
            ) : (
              <Text style={styles.valueText}>{userData.dataNascimento}</Text>
            )}
          </View>

          {/* Botões */}
          <View style={styles.buttonsContainer}>
            {isEditing ? (
              <>
                <TouchableOpacity 
                  style={[styles.button, styles.saveButton]}
                  onPress={handleSave}
                >
                  <Text style={styles.buttonText}>SALVAR DADOS</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleCancelEdit}
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
  passwordButton: {
    backgroundColor: '#126b1a',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  passwordButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
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