import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEnderecos } from '../../contexts/EnderecoContext';

type NovoEndereco = {
  apelido: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  principal: boolean;
};

export default function NovoEnderecoScreen() {
  const router = useRouter();
  const { adicionarEndereco } = useEnderecos();
  
  const [formData, setFormData] = useState<NovoEndereco>({
    apelido: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    principal: false
  });

  const [erro, setErro] = useState('');

  const handleInputChange = (campo: keyof NovoEndereco, valor: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }));
    setErro('');
  };

  const buscarCep = async () => {
    if (formData.cep.length === 8) {
      try {
        // Simulação de busca de CEP (em app real, integraria com API dos Correios)
        const cepsSimulados: { [key: string]: any } = {
          '13000000': {
            logradouro: 'Rua das Flores',
            bairro: 'Centro',
            cidade: 'Campinas',
            estado: 'SP'
          },
          '13200000': {
            logradouro: 'Avenida Principal',
            bairro: 'Jardim das Américas',
            cidade: 'Jundiaí',
            estado: 'SP'
          }
        };

        const dadosCep = cepsSimulados[formData.cep];
        if (dadosCep) {
          setFormData(prev => ({
            ...prev,
            logradouro: dadosCep.logradouro,
            bairro: dadosCep.bairro,
            cidade: dadosCep.cidade,
            estado: dadosCep.estado
          }));
        }
      } catch (error) {
        console.log('Erro ao buscar CEP:', error);
      }
    }
  };

  const validarFormulario = () => {
    if (!formData.apelido.trim()) {
      setErro('Apelido é obrigatório');
      return false;
    }
    if (!formData.cep.trim() || formData.cep.length !== 8) {
      setErro('CEP inválido');
      return false;
    }
    if (!formData.logradouro.trim()) {
      setErro('Logradouro é obrigatório');
      return false;
    }
    if (!formData.numero.trim()) {
      setErro('Número é obrigatório');
      return false;
    }
    if (!formData.bairro.trim()) {
      setErro('Bairro é obrigatório');
      return false;
    }
    if (!formData.cidade.trim()) {
      setErro('Cidade é obrigatória');
      return false;
    }
    if (!formData.estado.trim()) {
      setErro('Estado é obrigatório');
      return false;
    }
    return true;
  };

  const handleSalvarEndereco = () => {
    if (!validarFormulario()) return;

    // Usa a função do contexto para adicionar o endereço
    adicionarEndereco({
      apelido: formData.apelido,
      logradouro: formData.logradouro,
      numero: formData.numero,
      complemento: formData.complemento,
      bairro: formData.bairro,
      cidade: formData.cidade,
      estado: formData.estado,
      cep: formData.cep,
      principal: formData.principal
    });

    Alert.alert('Sucesso!', 'Endereço adicionado com sucesso!');
    router.back(); // Volta para a tela anterior
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#126b1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Novo Endereço</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        {/* Mensagem de Erro */}
        {erro ? (
          <View style={styles.erroContainer}>
            <Ionicons name="warning" size={20} color="#fff" />
            <Text style={styles.erroTexto}>{erro}</Text>
          </View>
        ) : null}

        <View style={styles.formContainer}>
          {/* Apelido */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Apelido do Endereço *</Text>
            <TextInput
              style={styles.input}
              value={formData.apelido}
              onChangeText={(text) => handleInputChange('apelido', text)}
              placeholder="Ex: Casa, Trabalho, Fazenda"
            />
          </View>

          {/* CEP */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>CEP *</Text>
            <TextInput
              style={styles.input}
              value={formData.cep}
              onChangeText={(text) => handleInputChange('cep', text.replace(/\D/g, ''))}
              placeholder="00000-000"
              keyboardType="numeric"
              maxLength={8}
              onBlur={buscarCep}
            />
          </View>

          {/* Logradouro */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Logradouro *</Text>
            <TextInput
              style={styles.input}
              value={formData.logradouro}
              onChangeText={(text) => handleInputChange('logradouro', text)}
              placeholder="Rua, Avenida, Estrada"
            />
          </View>

          {/* Número e Complemento */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.flex1]}>
              <Text style={styles.label}>Número *</Text>
              <TextInput
                style={styles.input}
                value={formData.numero}
                onChangeText={(text) => handleInputChange('numero', text)}
                placeholder="Nº"
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, styles.flex2]}>
              <Text style={styles.label}>Complemento</Text>
              <TextInput
                style={styles.input}
                value={formData.complemento}
                onChangeText={(text) => handleInputChange('complemento', text)}
                placeholder="Apto, Bloco, Referência"
              />
            </View>
          </View>

          {/* Bairro */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bairro *</Text>
            <TextInput
              style={styles.input}
              value={formData.bairro}
              onChangeText={(text) => handleInputChange('bairro', text)}
              placeholder="Nome do bairro"
            />
          </View>

          {/* Cidade e Estado */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.flex2]}>
              <Text style={styles.label}>Cidade *</Text>
              <TextInput
                style={styles.input}
                value={formData.cidade}
                onChangeText={(text) => handleInputChange('cidade', text)}
                placeholder="Nome da cidade"
              />
            </View>
            <View style={[styles.inputGroup, styles.flex1]}>
              <Text style={styles.label}>Estado *</Text>
              <TextInput
                style={styles.input}
                value={formData.estado}
                onChangeText={(text) => handleInputChange('estado', text.toUpperCase())}
                placeholder="UF"
                maxLength={2}
                autoCapitalize="characters"
              />
            </View>
          </View>

          {/* Definir como Principal */}
          <TouchableOpacity 
            style={styles.principalContainer}
            onPress={() => handleInputChange('principal', !formData.principal)}
          >
            <Ionicons 
              name={formData.principal ? "checkbox" : "square-outline"} 
              size={24} 
              color={formData.principal ? "#126b1a" : "#666"} 
            />
            <Text style={styles.principalText}>Definir como endereço principal</Text>
          </TouchableOpacity>

          {/* Botão Salvar */}
          <TouchableOpacity 
            style={styles.salvarButton}
            onPress={handleSalvarEndereco}
          >
            <Text style={styles.salvarButtonText}>Salvar Endereço</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#126b1a',
  },
  headerRight: {
    width: 34,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  erroContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F44336',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    gap: 10,
  },
  erroTexto: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  row: {
    flexDirection: 'row',
    gap: 15,
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  principalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 25,
    padding: 10,
    backgroundColor: '#f0f8f0',
    borderRadius: 8,
  },
  principalText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  salvarButton: {
    backgroundColor: '#126b1a',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  salvarButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});