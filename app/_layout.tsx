import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#126b1aff', 
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
        }}
      >
        {/* Tela inicial - sem header */}
        <Stack.Screen 
          name="index" 
          options={{ headerShown: false }}
        />

        {/* Telas de autenticação */}
        <Stack.Screen 
          name="loginANDcadastro/index" 
          options={{ title: 'Entrar' }}
        />
        <Stack.Screen 
          name="loginANDcadastro/login" 
          options={{ title: 'Login' }}
        />
        <Stack.Screen 
          name="loginANDcadastro/cadastro" 
          options={{ title: 'Cadastro' }}
        />

        {/* Grupo de tabs - sem header próprio */}
        <Stack.Screen 
          name="(tabs)" 
          options={{ headerShown: false }}
        />

        {/* Home independente (se existir) */}
        <Stack.Screen 
          name="home/index" 
          options={{ title: 'Início' }}
        />
      </Stack>
    </SafeAreaView>
  );
}