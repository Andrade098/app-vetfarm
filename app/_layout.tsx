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
            backgroundColor: '#126b1a',
          },
          headerTintColor: '#ffffffff',
        }}
      >
        {/* Tela HOME independente */}
        <Stack.Screen 
          name="home/index" 
          options={{ 
            title: 'Início',
            headerShown: false
          }}
        />
        
        {/* Tela de MENU - também sem header */}
        <Stack.Screen 
          name="home/menu" 
          options={{ 
            title: 'Menu',
            headerShown: false
          }}
        />
        
        {/* Tela de RESUMO DA CONTA - sem header */}
        <Stack.Screen 
          name="home/resumoconta" 
          options={{ 
            title: 'Resumo da Conta',
            headerShown: false
          }}
        />
        <Stack.Screen 
          name="home/meusdados" 
          options={{ 
            title: 'Meus Dados',
            headerShown: false
          }}
        />
        
        {/* Grupo de tabs */}
        <Stack.Screen 
          name="(tabs)" 
          options={{ headerShown: false }}
        />
      </Stack>
    </SafeAreaView>
  );
}