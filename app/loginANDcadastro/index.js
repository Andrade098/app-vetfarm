import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  async function handleLogin() {
    console.log('🔐 INICIANDO LOGIN...');
    console.log('📧 Email:', email);
    console.log('🔑 Senha:', password ? '***' : 'FALTANDO');

    if (loading) return;

    try {
      setLoading(true);

      if (!email || !password) {
        Alert.alert('Atenção', 'Por favor, preencha email e senha');
        return;
      }

      // ⭐⭐ IP DO SERVIDOR
      const API_URL = 'http://192.168.0.3:3000';

      console.log('🌐 ENVIANDO REQUEST PARA:', `${API_URL}/api/login`);
      
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(), 
          senha: password 
        }),
      });

      console.log('📊 STATUS DA RESPOSTA:', response.status);
      
      const data = await response.json();
      console.log('📦 RESPOSTA COMPLETA DA API:', data);

      if (!response.ok) {
        Alert.alert('Erro no Login', data.error || 'Credenciais inválidas');
        return;
      }

      // ⭐⭐ CORREÇÃO PRINCIPAL: A API RETORNA data.farmacia E data.token
      if (data.success && data.token && data.farmacia) {
        console.log('✅ LOGIN BEM-SUCEDIDO');
        console.log('🔑 TOKEN:', data.token ? 'PRESENTE' : 'FALTANDO');
        console.log('👤 DADOS DA FARMÁCIA:', data.farmacia);

        // ⭐⭐ CORREÇÃO: Usar data.farmacia que vem da API
        const userData = {
          id: data.farmacia.id.toString(),
          nome: data.farmacia.nome || 'Farmácia',
          email: data.farmacia.email,
          tipo: data.farmacia.tipo || 'filial',
          // Campos opcionais para farmácia
          sobrenome: '',
          telefone: data.farmacia.telefone || '',
          cpf: '',
          data_nascimento: ''
        };

        // ⭐⭐ CHAMAR LOGIN DO CONTEXT COM OS DADOS CORRETOS
        login(userData, data.token);
        
        // ⭐⭐ SALVAR NO ASYNC STORAGE
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        await AsyncStorage.setItem('farmaciaTipo', data.farmacia.tipo); // ⭐⭐ IMPORTANTE para proteção

        console.log('💾 DADOS SALVOS:', {
          token: data.token ? 'SALVO' : 'FALTANDO',
          tipo: data.farmacia.tipo,
          nome: data.farmacia.nome
        });

        // ⭐⭐ REDIRECIONAMENTO CORRETO
        // ⭐⭐ CORREÇÃO: Farmácias (matriz E filial) vão para /adm
// Clientes vão para /home

// Redireciona conforme o tipo do usuário
if (data.tipo === 'cliente') {
  console.log('Redirecionando CLIENTE para /home');
  router.replace('/home');
} else {
  // ⭐⭐ Farmácias (matriz E filial) vão para o painel admin
  console.log('Redirecionando FARMÁCIA para /adm');
  router.replace('/adm');
}

      } else {
        console.log('❌ DADOS INCOMPLETOS NA RESPOSTA:', data);
        Alert.alert('Erro', 'Dados de login incompletos recebidos do servidor');
      }

    } catch (err) {
      console.error('💥 ERRO NO LOGIN:', err);
      Alert.alert('Erro', 'Não foi possível conectar ao servidor. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo com sua imagem */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/logovetfarm.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Text style={styles.subtitle}>Seu delivery favorito</Text>
      </View>

      {/* Formulário */}
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Entrar na minha conta</Text>

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoCorrect={false}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'ENTRANDO...' : 'ENTRAR'}
          </Text>
        </TouchableOpacity>

        {/* Link para Esqueci Senha */}
        <Link href="/loginANDcadastro/esqueciSenha" asChild>
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Esqueci minha senha</Text>
          </TouchableOpacity>
        </Link>

        {/* Divisor */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>ou</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Cadastro */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Não tem uma conta?</Text>
          <Link href="/loginANDcadastro/cadastro" asChild>
            <TouchableOpacity>
              <Text style={styles.signupButton}>Cadastre-se</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
    width: '100%',
  },
  logoImage: {
    width: '100%',
    height: 200,
    maxHeight: 250,
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  formContainer: {
    width: "100%",
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 25,
    color: "#333",
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#126b1a",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: "#95a5a6",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  forgotPassword: {
    color: "#126b1a",
    textAlign: "center",
    fontSize: 14,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  dividerText: {
    marginHorizontal: 15,
    color: "#999",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  signupText: {
    color: "#666",
    marginRight: 5,
  },
  signupButton: {
    color: "#126b1a",
    fontWeight: "bold",
  },
});