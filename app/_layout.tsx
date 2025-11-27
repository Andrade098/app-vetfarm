// app/_layout.tsx - VERSÃO CORRIGIDA COM FIDELIDADEPROVIDER
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';
import { EnderecoProvider } from '../contexts/EnderecoContext';
import { AuthProvider } from '../contexts/AuthContext';
import { PedidoProvider } from '../contexts/PedidoContext';
import { CartProvider } from '../contexts/CartContext';
import { FidelidadeProvider } from '../contexts/FidelidadeContext'; // 🔥 ADICIONAR

export default function RootLayout() {
  return (
    <AuthProvider>
      <FidelidadeProvider> {/* 🔥 ADICIONAR ESTE PROVIDER */}
        <CartProvider>
          <EnderecoProvider>
            <PedidoProvider>
              <SafeAreaView style={{ flex: 1 }}>
                <StatusBar style="dark" />
                <Stack
                  screenOptions={{
                    headerTintColor: '#126b1a',
                  }}
                >
                  {/* TELA INICIAL (SUA TELA DE BOAS-VINDAS) - IMPORTANTE! */}
                  <Stack.Screen
                    name="index"
                    options={{
                      headerShown: false
                    }}
                  />

                  {/* TELAS DE LOGIN - SEM HEADER */}
                  <Stack.Screen
                    name="loginANDcadastro"
                    options={{
                      headerShown: false
                    }}
                  />

                  {/* Tela HOME independente */}
                  <Stack.Screen
                    name="home/index"
                    options={{
                      title: 'Início',
                      headerShown: false
                    }}
                  />

                  {/* Tela de MENU */}
                  <Stack.Screen
                    name="home/menu"
                    options={{
                      title: 'Menu',
                      headerShown: false
                    }}
                  />

                  {/* Tela de RESUMO DA CONTA */}
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
                    options={{
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
                    }}
                  />

                  {/* Rastrearpedido */}
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

                  {/* Novo endereço */}
                  <Stack.Screen
                    name="home/novoendereco"
                    options={{
                      title: 'Novo Endereço',
                      headerShown: false
                    }}
                  />

                  {/* ⭐⭐ TELA DE FINALIZAR COMPRA */}
                  <Stack.Screen
                    name="home/finalizacompra"
                    options={{
                      title: 'Finalizar Compra',
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
            </PedidoProvider>
          </EnderecoProvider>
        </CartProvider>
      </FidelidadeProvider> {/* 🔥 FECHAR AQUI */}
    </AuthProvider>
  );
}