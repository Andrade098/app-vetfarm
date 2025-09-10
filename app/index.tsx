import { Redirect } from "expo-router";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { useState } from "react";

export default function WelcomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
// Simula carregamento inicial
  setTimeout(() => setIsLoading(false), 1500);

if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Image 
          source={require('../assets/images/logovetfarm.png')}
          style={styles.loadingLogo}
          resizeMode="contain"
        />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/images/logovetfarm.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Text style={styles.title}>Olá, Bem-vindo ao VetFarm</Text>
        <Text style={styles.subtitle}>Sua loja delivery favorita!</Text>
      </View>

      {/* Botões */}
      <View style={styles.buttonsContainer}>
        <Link href="/loginANDcadastro/login" asChild>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Fazer Login</Text>
          </TouchableOpacity>
        </Link>
        
        <Link href="/loginANDcadastro/cadastro" asChild>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Criar Conta</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingLogo: {
    width: 200,
    height: 100,
    marginBottom: 20,
  },
  loadingText: {
    color: "#666",
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 50,
  },
  logoImage: {
    width: 300,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2f56d4ff",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  buttonsContainer: {
    width: "100%",
    gap: 15,
  },
  primaryButton: {
    backgroundColor: "#126b1a",
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  secondaryButton: {
    borderColor: "#126b1a",
    borderWidth: 2,
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#126b1a",
    fontSize: 18,
    fontWeight: "bold",
  },
});