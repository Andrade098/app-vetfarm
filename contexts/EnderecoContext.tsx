import React, { createContext, useContext, useState, ReactNode } from 'react';

type Endereco = {
  id: string;
  apelido: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  principal: boolean;
};

type EnderecoContextType = {
  enderecos: Endereco[];
  adicionarEndereco: (endereco: Omit<Endereco, 'id'>) => void;
  removerEndereco: (id: string) => void;
  definirPrincipal: (id: string) => void;
};

const EnderecoContext = createContext<EnderecoContextType | undefined>(undefined);

export const useEnderecos = () => {
  const context = useContext(EnderecoContext);
  if (!context) {
    throw new Error('useEnderecos deve ser usado dentro de EnderecoProvider');
  }
  return context;
};

export const EnderecoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Dados iniciais de exemplo
  const [enderecos, setEnderecos] = useState<Endereco[]>([
    {
      id: '1',
      apelido: 'Fazenda central',
      logradouro: 'Estrada da Fazenda',
      numero: 'S/N',
      complemento: 'Km 12',
      bairro: 'Zona Rural',
      cidade: 'Campinas',
      estado: 'SP',
      cep: '13000-000',
      principal: true
    },
    {
      id: '2',
      apelido: 'Fazenda secundária',
      logradouro: 'Rodovia dos Bandeirantes',
      numero: '1234',
      complemento: 'Galpão 5',
      bairro: 'Distrito Industrial',
      cidade: 'Jundiaí',
      estado: 'SP',
      cep: '13200-000',
      principal: false
    }
  ]);

  const adicionarEndereco = (novoEndereco: Omit<Endereco, 'id'>) => {
    const enderecoComId = {
      ...novoEndereco,
      id: Date.now().toString() // Gera um ID único
    };
    setEnderecos(prev => [...prev, enderecoComId]);
  };

  const removerEndereco = (id: string) => {
    setEnderecos(prev => prev.filter(e => e.id !== id));
  };

  const definirPrincipal = (id: string) => {
    setEnderecos(prev => prev.map(e => ({
      ...e,
      principal: e.id === id
    })));
  };

  return (
    <EnderecoContext.Provider value={{
      enderecos,
      adicionarEndereco,
      removerEndereco,
      definirPrincipal
    }}>
      {children}
    </EnderecoContext.Provider>
  );
};