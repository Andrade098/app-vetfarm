import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  Dimensions
} from "react-native";
import { Link } from "expo-router";

const { width } = Dimensions.get("window");

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCadastro() {
  if (
    !nome ||
    !sobrenome ||
    !cpf ||
    !email ||
    !telefone ||
    !dataNascimento ||
    !senha ||
    !confirmarSenha
  ) {
    Alert.alert("Erro", "Por favor, preencha todos os campos!");
    return;
  }

  if (senha !== confirmarSenha) {
    Alert.alert("Erro", "As senhas não coincidem!");
    return;
  }

  if (senha.length < 6) {
    Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres!");
    return;
  }

  const partes = dataNascimento.split("/");
  if (partes.length !== 3) {
    Alert.alert("Erro", "Data inválida! Use o formato DD/MM/AAAA");
    return;
  }
  const dataFormatada = `${partes[2]}-${partes[1]}-${partes[0]}`;

  setLoading(true);

  try {
    const response = await fetch("http://192.168.0.3:3000/api/clientes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nome,
        sobrenome,
        cpf,
        telefone,
        email,
        data_nascimento: dataFormatada,
        senha
      })
    });

    const data = await response.json();

    if (!response.ok) {
      Alert.alert("Erro", data.error || "Falha no cadastro.");
      setLoading(false);
      return;
    }

    Alert.alert("Sucesso", "Cadastro realizado com sucesso!");

    setNome("");
    setSobrenome("");
    setCpf("");
    setTelefone("");
    setEmail("");
    setDataNascimento("");
    setSenha("");
    setConfirmarSenha("");

  } catch (error) {
    console.error("Erro no cadastro:", error);
    Alert.alert("Erro", "Não foi possível conectar ao servidor.");
  } finally {
    setLoading(false);
  }
}


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/logovetfarm.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Text style={styles.title}>Criar conta</Text>
        <Text style={styles.subtitle}>Preencha seus dados abaixo</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="Sobrenome"
          value={sobrenome}
          onChangeText={setSobrenome}
        />
        <TextInput
          style={styles.input}
          placeholder="CPF"
          value={cpf}
          onChangeText={setCpf}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Telefone"
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Data de nascimento (DD/MM/AAAA)"
          value={dataNascimento}
          onChangeText={setDataNascimento}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar senha"
          secureTextEntry
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleCadastro}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Cadastrando..." : "Criar conta"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Já possui uma conta?</Text>
        <Link href="/loginANDcadastro/" asChild>
          <TouchableOpacity>
            <Text style={styles.loginLink}>Fazer login</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 30
  },
  header: {
    alignItems: "center",
    marginBottom: 30
  },
  logoImage: {
    width: "100%",
    height: 200,
    marginBottom: 10
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#126b1a",
    marginBottom: 5
  },
  subtitle: {
    fontSize: 16,
    color: "#666"
  },
  form: {
    width: "100%",
    marginBottom: 25
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#f9f9f9"
  },
  button: {
    backgroundColor: "#126b1a",
    padding: 15,
    borderRadius: 10,
    alignItems: "center"
  },
  buttonDisabled: {
    backgroundColor: "#ccc"
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold"
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20
  },
  loginText: {
    color: "#666",
    marginRight: 5
  },
  loginLink: {
    color: "#126b1a",
    fontWeight: "bold"
  }
});
