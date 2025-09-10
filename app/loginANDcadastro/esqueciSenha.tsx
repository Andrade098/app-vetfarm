import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { Link, Stack } from 'expo-router';

export default function EsqueciSenha() {
const [email, setEmail] = useState('');
function handleRecuperarSenha() {
    if (!email) {
    Alert.alert('Erro', 'Por favor, digite seu e-mail');
    return;
}
Alert.alert(
    'E-mail enviado!',
    `Enviamos um link de recuperação para: ${email}\n\nVerifique sua caixa de entrada e spam.`
);
}

return (
<>
<Stack.Screen options={{ title: 'Recuperar Senha' }} />   
<ScrollView contentContainerStyle={styles.container}>
    {/* Logo */}
<View style={styles.logoContainer}>
    <Image 
        source={require('../../assets/images/logovetfarm.png')}
        style={styles.logoImage}
        resizeMode="contain"
    />
    <Text style={styles.title}>Recuperar Senha</Text>
    <Text style={styles.subtitle}>Digite seu e-mail para receber o link de recuperação</Text>
</View>

    {/* Formulário */}
<View style={styles.formContainer}>
        <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail cadastrado"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        />

        <TouchableOpacity style={styles.button} onPress={handleRecuperarSenha}>
        <Text style={styles.buttonText}>Enviar link</Text>
        </TouchableOpacity>
</View>

{/* Links */}
<View style={styles.linksContainer}>
    <Link href="/loginANDcadastro/login" asChild>
<TouchableOpacity>
    <Text style={styles.linkText}>← Voltar para Login</Text>
    </TouchableOpacity>
</Link>
          
<Link href="/loginANDcadastro/cadastro" asChild>
<TouchableOpacity>
    <Text style={styles.linkText}>Criar nova conta</Text>
    </TouchableOpacity>
</Link>
</View>

{/* Informações */}
<View style={styles.infoContainer}>
        <Text style={styles.infoText}>💡 Dica:</Text>
        <Text style={styles.infoText}>Verifique sua caixa de spam caso não encontre o e-mail</Text>
</View>
    </ScrollView>
</>
);
}

const styles = StyleSheet.create({
container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
},
logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
},
logoImage: {
    width: 300,
    height: 150,
    marginBottom: 20,
},
title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#dd2828ff',
    marginBottom: 10,
    textAlign: 'center',
},
subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
},
formContainer: {
    width: '100%',
    marginBottom: 30,
},
input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
},
button: {
    backgroundColor: '#126b1a',
    width: '50%',
    alignSelf:'center',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
},
buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
linksContainer: {
    alignItems: 'center',
    gap: 15,
    marginBottom: 30,
},
linkText: {
    color: '#002efaff',
    fontSize: 16,
    fontWeight: '500',
},
infoContainer: {
    backgroundColor: '#f0f8ff',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#126b1a',
},
infoText: {
    color: '#333',
    fontSize: 14,
    marginBottom: 5,
  },
});