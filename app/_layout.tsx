import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';

export default function RootLayout() {
return (
  <SafeAreaView style={{ flex: 1 }}>
    <StatusBar style="dark" />
      <Stack
        screenOptions={{
          // REMOVIDO o backgroundColor verde
          headerTintColor: '#126b1a', // Apenas cor do texto
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
        
        <Stack.Screen 
          name="home/meusenderecos" 
          options={{  // ← CORRIGIDO: "options" em vez de "ptions"
            title: 'Meus Endereços',
            headerShown: false
          }}
        />
        {/* Meuspedidos */}
        <Stack.Screen 
          name="home/meuspedidos" 
          options={{ 
            title: 'Meus Pedidos',
            headerShown: false
  }}/>
        {/*Rastrearpedido */}
        <Stack.Screen 
        name="home/rastrearpedido" 
        options={{ 
          title: 'Rastrear Pedido',
          headerShown: false
  }}
/>
      {/* Alterar senha */}
      <Stack.Screen 
        name="home/alterarsenha" 
        options={{ 
        title: 'Alterar Senha',
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