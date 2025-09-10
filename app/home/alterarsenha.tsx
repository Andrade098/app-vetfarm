import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AlterarSenhaScreen() {
  const router = useRouter();
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const handleAlterarSenha = () => {
    // Validações
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (novaSenha.length < 6) {
      Alert.alert('Erro', 'A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    // Simulação de alteração de senha
    Alert.alert(
      'Sucesso', 
      'Senha alterada com sucesso! Você será redirecionado para fazer login novamente.',
      [
        {
          text: 'OK',
          onPress: () => {
            // Redireciona para o login
            router.replace('/');
          }
        }
      ]
    );
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
        <Text style={styles.headerTitle}>Alterar Senha</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        {/* Instruções */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            🔒 Para sua segurança, digite sua senha atual e crie uma nova senha.
          </Text>
        </View>

        {/* Formulário */}
        <View style={styles.formContainer}>
          {/* Senha Atual */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha Atual *</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                value={senhaAtual}
                onChangeText={setSenhaAtual}
                placeholder="Digite sua senha atual"
                secureTextEntry={!mostrarSenhaAtual}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setMostrarSenhaAtual(!mostrarSenhaAtual)}
              >
                <Ionicons 
                  name={mostrarSenhaAtual ? "eye-off" : "eye"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Nova Senha */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nova Senha *</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                value={novaSenha}
                onChangeText={setNovaSenha}
                placeholder="Digite a nova senha"
                secureTextEntry={!mostrarNovaSenha}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setMostrarNovaSenha(!mostrarNovaSenha)}
              >
                <Ionicons 
                  name={mostrarNovaSenha ? "eye-off" : "eye"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.helperText}>Mínimo de 6 caracteres</Text>
          </View>

          {/* Confirmar Nova Senha */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmar Nova Senha *</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                placeholder="Confirme a nova senha"
                secureTextEntry={!mostrarConfirmarSenha}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
              >
                <Ionicons 
                  name={mostrarConfirmarSenha ? "eye-off" : "eye"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Botão Salvar */}
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleAlterarSenha}
          >
            <Text style={styles.saveButtonText}>Salvar Nova Senha</Text>
          </TouchableOpacity>

          {/* Dicas de Segurança */}
          <View style={styles.securityTips}>
            <Text style={styles.securityTitle}>💡 Dicas para uma senha segura:</Text>
            <Text style={styles.securityTip}>• Use pelo menos 6 caracteres</Text>
            <Text style={styles.securityTip}>• Combine letras, números e símbolos</Text>
            <Text style={styles.securityTip}>• Evite senhas óbvias como "123456"</Text>
            <Text style={styles.securityTip}>• Não use informações pessoais</Text>
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
  infoContainer: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  infoText: {
    fontSize: 14,
    color: '#1565c0',
    lineHeight: 20,
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
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  eyeButton: {
    padding: 10,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: '#126b1a',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  securityTips: {
    marginTop: 25,
    padding: 15,
    backgroundColor: '#f0f8f0',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  securityTip: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
});