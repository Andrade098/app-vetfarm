import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState(null); // 'cliente' ou 'farmacia'
  const router = useRouter();

  async function handleLogin(tipo) {
  try {
    setLoading(true);
    setLoginType(tipo);
    
    console.log(`🔐 FAZENDO LOGIN COMO: ${tipo}`);
    console.log('📧 Email:', email);
    
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha email e senha');
      return;
    }

    const url = tipo === 'farmacia' 
      ? 'http://192.168.0.3:3000/api/farmacias/login'
      : 'http://192.168.0.3:3000/api/clientes/login';

    console.log('🌐 URL:', url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        email: email.trim(), 
        senha: password 
      })
    });

    console.log('📥 Status da resposta:', response.status);
    
    const responseText = await response.text();
    console.log('📥 Resposta completa:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
      console.log('📥 Resposta JSON:', data);
    } catch (e) {
      console.log('❌ Resposta não é JSON:', responseText);
      Alert.alert('Erro', 'Resposta inválida do servidor');
      return;
    }

    // ✅ CORREÇÃO: Verificar se response.ok em vez de data.success
    if (response.ok) {
      console.log('✅ LOGIN BEM-SUCEDIDO!');
      
      if (tipo === 'farmacia') {
        // ✅ SALVAR TOKEN SEPARADAMENTE
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(data.farmacia));
        
        console.log('🔑 Token salvo:', data.token);
        console.log('👤 Dados farmácia:', data.farmacia);
        
        // ✅ VERIFICAR SE SALVOU
        const savedToken = await AsyncStorage.getItem('userToken');
        const savedUser = await AsyncStorage.getItem('userData');
        console.log('💾 Token no AsyncStorage:', savedToken);
        console.log('💾 UserData no AsyncStorage:', savedUser);
        
        console.log('📍 REDIRECIONANDO PARA ADMIN...');
        router.replace('/adm/');
        
      } else {
        // Para cliente
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(data.usuario));
        console.log('📍 REDIRECIONANDO PARA HOME...');
        router.replace('/home/');
      }
      
    } else {
      console.log('❌ ERRO NO LOGIN:', data);
      Alert.alert('Erro', data.error || `Erro ${response.status}`);
    }

  } catch (error) {
    console.error('💥 ERRO NO LOGIN:', error);
    Alert.alert('Erro', 'Falha na conexão: ' + error.message);
  } finally {
    setLoading(false);
    setLoginType(null);
  }
}

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo */}
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
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* ⭐⭐ DOIS BOTÕES SEPARADOS ⭐⭐ */}
        <TouchableOpacity
          style={[styles.button, styles.clientButton, loading && loginType === 'cliente' && styles.buttonDisabled]}
          onPress={() => handleLogin('cliente')}
          disabled={loading && loginType === 'cliente'}
        >
          <Text style={styles.buttonText}>
            {loading && loginType === 'cliente' ? 'ENTRANDO...' : 'ENTRAR COMO CLIENTE'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.farmacyButton, loading && loginType === 'farmacia' && styles.buttonDisabled]}
          onPress={() => handleLogin('farmacia')}
          disabled={loading && loginType === 'farmacia'}
        >
          <Text style={styles.buttonText}>
            {loading && loginType === 'farmacia' ? 'ENTRANDO...' : 'ENTRAR COMO FARMÁCIA'}
          </Text>
        </TouchableOpacity>

        {/* Links */}
        <Link href="/loginANDcadastro/esqueciSenha" asChild>
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Esqueci minha senha</Text>
          </TouchableOpacity>
        </Link>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>ou</Text>
          <View style={styles.dividerLine} />
        </View>

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
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  clientButton: {
    backgroundColor: "#126b1a", // Verde
  },
  farmacyButton: {
    backgroundColor: "#3498db", // Azul
  },
  buttonDisabled: {
    backgroundColor: "#95a5a6",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotPassword: {
    color: "#126b1a",
    textAlign: "center",
    fontSize: 14,
    marginTop: 10,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
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