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
          headerTintColor: '#fff',
        }}
      >
        {/* Tela HOME independente */}
        <Stack.Screen 
          name="home/index" 
          options={{ 
            title: 'Início',
            headerShown: false // ou false se quiser sem header
          }}
        />
        
        {/* Tela de MENU - também sem header */}
        <Stack.Screen 
          name="home/menu" 
          options={{ 
            title: 'Menu',
            headerShown: false // ADICIONE ESTA LINHA
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