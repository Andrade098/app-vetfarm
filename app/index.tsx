import { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Easing, ScrollView } from "react-native";
import { Link, useRouter } from "expo-router";


export default function WelcomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const slideAnim = new Animated.Value(50);
  const router = useRouter();

  // Animação de carregamento
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Animação de entrada dos elementos
  useEffect(() => {
    if (!isLoading) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Animated.View style={[styles.logoPulse]}>
          <Image 
            source={require('../assets/images/logovetfarm.png')}
            style={styles.loadingLogo}
            resizeMode="contain"
          />
        </Animated.View>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Background com gradiente sutil */}
      <View style={styles.background}>
        <View style={styles.circle1}></View>
        <View style={styles.circle2}></View>
        <View style={styles.circle3}></View>
      </View>

      {/* Conteúdo Principal */}
      <Animated.View style={[
        styles.content,
        {
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { translateY: slideAnim }
          ]
        }
      ]}>
        
        {/* Logo com destaque */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/images/logovetfarm.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Textos de boas-vindas */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Bem-vindo ao VetFarm</Text>
          <Text style={styles.subtitle}>
            🐄 Sua loja especializada em produtos veterinários 
            e suplementos para animais! 🐎
          </Text>
        </View>

        {/* Ilustração decorativa */}
        <View style={styles.illustration}>
          <Text style={styles.emoji}>🐄🐖🐎🐓</Text>
        </View>

        {/* Botões */}
        <View style={styles.buttonsContainer}>
          <Link href="/loginANDcadastro/" asChild>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>🚀 Fazer Login</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/loginANDcadastro/cadastro" asChild>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>✨ Criar Conta</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Rodapé */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            🌟 Junte-se a milhares de clientes satisfeitos!
          </Text>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20, // Reduzido de 40 para 20
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingLogo: {
    width: 200,
    height: 100,
    marginBottom: 20,
  },
  loadingText: {
    color: "#126b1a",
    fontSize: 16,
    fontWeight: '500',
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  circle1: {
    position: 'absolute',
    top: '10%',
    right: '10%',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(18, 107, 26, 0.1)',
  },
  circle2: {
    position: 'absolute',
    bottom: '20%',
    left: '5%',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
  },
  circle3: {
    position: 'absolute',
    top: '50%',
    right: '5%',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    padding: 20, // Reduzido de 30 para 20
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    marginVertical: 10, // Reduzido de 20 para 10
  },
  logoContainer: {
    marginBottom: 20, // Reduzido de 30 para 20
  },
  logoImage: {
    width: 220, // Reduzido de 250 para 220
    height: 100, // Reduzido de 120 para 100
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 20, // Reduzido de 30 para 20
  },
  title: {
    fontSize: 28, // Reduzido de 32 para 28
    fontWeight: "bold",
    color: "#126b1a",
    marginBottom: 10, // Reduzido de 15 para 10
    textAlign: "center",
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 14, // Reduzido de 16 para 14
    color: "#666",
    textAlign: "center",
    lineHeight: 20, // Reduzido de 22 para 20
    fontWeight: '500',
  },
  illustration: {
    marginBottom: 20, // Reduzido de 30 para 20
  },
  emoji: {
    fontSize: 32, // Reduzido de 40 para 32
  },
  buttonsContainer: {
    width: "100%",
    gap: 12, // Reduzido de 15 para 12
    marginBottom: 20, // Reduzido de 25 para 20
  },
  primaryButton: {
    backgroundColor: "#126b1a",
    padding: 16, // Reduzido de 20 para 16
    borderRadius: 15,
    alignItems: "center",
    shadowColor: '#126b1a',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8, // Reduzido de 10 para 8
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16, // Reduzido de 18 para 16
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderColor: "#126b1a",
    borderWidth: 2,
    padding: 16, // Reduzido de 20 para 16
    borderRadius: 15,
    alignItems: "center",
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8, // Reduzido de 10 para 8
  },
  secondaryButtonText: {
    color: "#126b1a",
    fontSize: 16, // Reduzido de 18 para 16
    fontWeight: "bold",
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12, // Reduzido de 14 para 12
    color: "#888",
    textAlign: "center",
    fontStyle: 'italic',
  },
});