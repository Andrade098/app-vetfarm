import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 🔥 ADICIONE ESTA IMPORT

export default function AlterarSenhaScreen() {
  const router = useRouter();
  const { user, updatePassword, logout } = useAuth(); // 🔥 ADICIONE logout AQUI

  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleAlterarSenha = async () => {
    console.log('🔐 Iniciando alteração de senha...');
    console.log('👤 Usuário:', user?.email);

    // Reset mensagens anteriores
    setMensagemErro('');
    setMensagemSucesso('');
    setCarregando(true);

    // Validações
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      setMensagemErro('Por favor, preencha todos os campos.');
      setCarregando(false);
      return;
    }

    if (novaSenha.length < 6) {
      setMensagemErro('A nova senha deve ter pelo menos 6 caracteres.');
      setCarregando(false);
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setMensagemErro('As senhas não coincidem.');
      setCarregando(false);
      return;
    }

    try {
      // Chama a função de atualização de senha do contexto de autenticação
      const resultado = await updatePassword(senhaAtual, novaSenha);

      if (resultado.success) {
        setMensagemSucesso('Senha alterada com sucesso!');

        // 🔥 LIMPA OS CAMPOS
        setSenhaAtual('');
        setNovaSenha('');
        setConfirmarSenha('');

        // 🔥 MOSTRA ALERTA DE SUCESSO COM OPÇÃO DE FAZER LOGOUT
        Alert.alert(
          'Senha Alterada com Sucesso!',
          'Por segurança, faça login novamente com sua nova senha.',
          [
            {
              text: 'Fazer Login',
              onPress: async () => {
                // 🔥 FAZ LOGOUT E REDIRECIONA PARA LOGIN
                await logout();
                router.replace('/loginANDcadastro');
              }
            }
          ]
        );
      } else {
        setMensagemErro(resultado.message || 'Erro ao alterar senha.');
      }
    } catch (error) {
      console.error('❌ Erro ao alterar senha:', error);
      setMensagemErro('Erro ao conectar com o servidor. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  // 🔥 FUNÇÃO PARA VERIFICAR SE O USUÁRIO ESTÁ AUTENTICADO
  const verificarAutenticacao = () => {
    if (!user) {
      Alert.alert(
        'Sessão Expirada',
        'Por favor, faça login novamente.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/loginANDcadastro')
          }
        ]
      );
      return false;
    }
    return true;
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
        {/* Informações do usuário */}
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfoText}>
            Alterando senha para: {user?.email || 'Usuário'}
          </Text>
        </View>

        {/* Instruções */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            🔒 Por segurança, após alterar a senha você será desconectado e precisará fazer login novamente.
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

          {/* Mensagens de Feedback */}
          {mensagemErro ? (
            <View style={styles.mensagemErro}>
              <Ionicons name="warning" size={20} color="#fff" />
              <Text style={styles.mensagemErroTexto}>{mensagemErro}</Text>
            </View>
          ) : null}

          {mensagemSucesso ? (
            <View style={styles.mensagemSucesso}>
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.mensagemSucessoTexto}>{mensagemSucesso}</Text>
            </View>
          ) : null}

          {/* Botão Salvar */}
          <TouchableOpacity
            style={[
              styles.saveButton,
              carregando && styles.saveButtonDisabled
            ]}
            onPress={handleAlterarSenha}
            disabled={carregando}
          >
            <Text style={styles.saveButtonText}>
              {carregando ? 'Alterando...' : 'Alterar Senha'}
            </Text>
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
  userInfoContainer: {
    backgroundColor: '#e8f5e8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#126b1a',
  },
  userInfoText: {
    fontSize: 14,
    color: '#126b1a',
    fontWeight: '500',
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
  saveButtonDisabled: {
    backgroundColor: '#9e9e9e',
    opacity: 0.6,
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
  mensagemErro: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F44336',
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
    gap: 10,
  },
  mensagemErroTexto: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  mensagemSucesso: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
    gap: 10,
  },
  mensagemSucessoTexto: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
});