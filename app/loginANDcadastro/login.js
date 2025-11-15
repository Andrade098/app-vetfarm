import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from "react-native";
import { loginUser } from '../database/asyncStorageDB';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin() {
    // Validação básica
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha email e senha');
      return;
    }

    setLoading(true);

    try {
      const user = await loginUser(email, password);

      if (user) {
        Alert.alert(
          'Login realizado!',
          `Bem-vindo de volta, ${user.nome}!`,
          [
            {
              text: "OK",
              onPress: () => {
                router.push('/home');
              }
            }
          ]
        );
      } else {
        Alert.alert("Erro", "Email ou senha incorretos!");
      }
    } catch (err) {
      console.error("Erro no login:", err);
      Alert.alert("Erro", "Não foi possível realizar o login. Tente novamente.");
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
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Entrando..." : "Entrar"}
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
    backgroundColor: "#ccc",
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