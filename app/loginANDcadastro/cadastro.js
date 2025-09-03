import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image, Dimensions } from "react-native";
import { Link } from "expo-router";

// Obtém a largura da tela
const { width } = Dimensions.get('window');

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  function handleCadastro() {
    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem!");
      return;
    }

    Alert.alert(
      "Cadastro realizado!",
      `Bem-vindo(a) ${nome}!\nEmail: ${email}\nTelefone: ${telefone}`
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Cabeçalho com IMAGEM */}
      <View style={styles.header}>
        <Image 
          source={require('../../assets/images/logovetfarm.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Text style={styles.title}>Criar conta</Text>
        <Text style={styles.subtitle}>Preencha seus dados abaixo</Text>
      </View>

      {/* Formulário */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          placeholderTextColor="#999"
          value={nome}
          onChangeText={setNome}
        />

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
          placeholder="Telefone"
          placeholderTextColor="#999"
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="phone-pad"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#999"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirmar senha"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />

        <TouchableOpacity style={styles.button} onPress={handleCadastro}>
          <Text style={styles.buttonText}>Criar conta</Text>
        </TouchableOpacity>
      </View>

      {/* Link para login */}
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Já possui uma conta?</Text>
        <Link href="/loginANDcadastro/login" asChild>
          <TouchableOpacity>
            <Text style={styles.loginLink}>Fazer login</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Termos */}
      <Text style={styles.terms}>
        Ao criar uma conta, você concorda com nossos{' '}
        <Text style={styles.termsLink}>Termos de Serviço</Text> e{' '}
        <Text style={styles.termsLink}>Política de Privacidade</Text>
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 30, // Reduzi um pouco o padding top
  },
  header: {
    alignItems: "center",
    marginBottom: 30, // Reduzi a margem inferior
  },
  logoImage: {
    width: '100%',       // Ocupa 100% do container
    height: 200,         // Altura fixa (ajuste conforme needed)
    maxHeight: 250,      // Altura máxima
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#126b1a",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  form: {
    width: "100%",
    marginBottom: 25,
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
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  loginText: {
    color: "#666",
    marginRight: 5,
  },
  loginLink: {
    color: "#126b1a", // Mudei para verde para combinar
    fontWeight: "bold",
  },
  terms: {
    textAlign: "center",
    color: "#999",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
  },
  termsLink: {
    color: "#126b1a", // Mudei para verde para combinar
  },
});