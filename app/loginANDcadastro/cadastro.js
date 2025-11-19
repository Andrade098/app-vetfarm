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

    // Validação de CPF (básica)
    if (cpf.length !== 11) {
      Alert.alert("Erro", "CPF deve ter 11 dígitos!");
      return;
    }

    // Validação de data
    const partes = dataNascimento.split("/");
    if (partes.length !== 3 || partes[0].length !== 2 || partes[1].length !== 2 || partes[2].length !== 4) {
      Alert.alert("Erro", "Data inválida! Use o formato DD/MM/AAAA");
      return;
    }

    const dia = parseInt(partes[0]);
    const mes = parseInt(partes[1]);
    const ano = parseInt(partes[2]);

    if (dia < 1 || dia > 31 || mes < 1 || mes > 12 || ano < 1900 || ano > new Date().getFullYear()) {
      Alert.alert("Erro", "Data de nascimento inválida!");
      return;
    }

    const dataFormatada = `${partes[2]}-${partes[1]}-${partes[0]}`;
    setLoading(true);

    try {
      console.log('📤 PREPARANDO DADOS PARA ENVIAR:');

      // ⭐⭐ OBJETO COM TODOS OS CAMPOS EXPLÍCITOS ⭐⭐
      const dadosParaEnviar = {
        nome: nome.trim(),
        sobrenome: sobrenome.trim(),
        cpf: cpf.trim(),
        telefone: telefone.trim(),
        email: email.trim().toLowerCase(),
        data_nascimento: dataFormatada,
        senha: senha
      };

      console.log('📤 DADOS QUE SERÃO ENVIADOS:', JSON.stringify(dadosParaEnviar, null, 2));
      console.log('📤 URL:', "http://192.168.0.3:3000/api/clientes");

      const response = await fetch('http://192.168.0.3:3000/api/clientes', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dadosParaEnviar)
      });

      console.log('📥 STATUS DA RESPOSTA:', response.status);
      console.log('📥 RESPONSE OK?:', response.ok);

      const data = await response.json();
      console.log('📥 RESPOSTA COMPLETA DA API:', data);

      if (!response.ok) {
        Alert.alert(
          "Erro no Cadastro",
          data.error || data.message || `Erro ${response.status}: ${JSON.stringify(data)}`
        );
        return;
      }

      Alert.alert(
        "Sucesso!",
        data.message || "Cadastro realizado com sucesso!",
        [
          {
            text: "OK",
            onPress: () => {
              // Limpar campos
              setNome("");
              setSobrenome("");
              setCpf("");
              setTelefone("");
              setEmail("");
              setDataNascimento("");
              setSenha("");
              setConfirmarSenha("");
            }
          }
        ]
      );

    } catch (error) {
      console.error("❌ ERRO COMPLETO NO CADASTRO:", error);
      Alert.alert(
        "Erro de Conexão",
        `Não foi possível conectar ao servidor:\n${error.message}`,
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  }

  // Função para formatar CPF
  const formatarCPF = (text) => {
    const numbers = text.replace(/\D/g, '');
    if (numbers.length <= 11) {
      setCpf(numbers);
    }
  };

  // Função para formatar telefone
  const formatarTelefone = (text) => {
    const numbers = text.replace(/\D/g, '');
    if (numbers.length <= 11) {
      setTelefone(numbers);
    }
  };

  // Função para formatar data
  const formatarData = (text) => {
    const numbers = text.replace(/\D/g, '');
    if (numbers.length <= 8) {
      if (numbers.length <= 2) {
        setDataNascimento(numbers);
      } else if (numbers.length <= 4) {
        setDataNascimento(numbers.slice(0, 2) + '/' + numbers.slice(2));
      } else {
        setDataNascimento(numbers.slice(0, 2) + '/' + numbers.slice(2, 4) + '/' + numbers.slice(4, 8));
      }
    }
  };

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
          placeholderTextColor="#999"
          value={nome}
          onChangeText={setNome}
          returnKeyType="next"
        />

        <TextInput
          style={styles.input}
          placeholder="Sobrenome"
          placeholderTextColor="#999"
          value={sobrenome}
          onChangeText={setSobrenome}
          returnKeyType="next"
        />

        <TextInput
          style={styles.input}
          placeholder="CPF (apenas números)"
          placeholderTextColor="#999"
          value={cpf}
          onChangeText={formatarCPF}
          keyboardType="numeric"
          maxLength={11}
          returnKeyType="next"
        />

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          returnKeyType="next"
        />

        <TextInput
          style={styles.input}
          placeholder="Telefone (apenas números)"
          placeholderTextColor="#999"
          value={telefone}
          onChangeText={formatarTelefone}
          keyboardType="phone-pad"
          maxLength={11}
          returnKeyType="next"
        />

        <TextInput
          style={styles.input}
          placeholder="Data de nascimento (DD/MM/AAAA)"
          placeholderTextColor="#999"
          value={dataNascimento}
          onChangeText={formatarData}
          keyboardType="numeric"
          maxLength={10}
          returnKeyType="next"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha (mínimo 6 caracteres)"
          placeholderTextColor="#999"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
          returnKeyType="next"
        />

        <TextInput
          style={styles.input}
          placeholder="Confirmar senha"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          returnKeyType="done"
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
    paddingTop: 30
  },
  header: {
    alignItems: "center",
    marginBottom: 30
  },
  logoImage: {
    width: "100%",
    height: 200,
    maxHeight: 250,
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
    color: "#666",
    textAlign: "center"
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
    fontSize: 16,
    backgroundColor: "#f9f9f9"
  },
  button: {
    backgroundColor: "#126b1a",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10
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
    marginBottom: 20
  },
  loginText: {
    color: "#666",
    marginRight: 5
  },
  loginLink: {
    color: "#126b1a",
    fontWeight: "bold"
  },
  terms: {
    textAlign: "center",
    color: "#999",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10
  },
  termsLink: {
    color: "#126b1a"
  }
});