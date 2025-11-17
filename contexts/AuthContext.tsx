import React, { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  id: string;
  nome: string;
  email: string;
  telefone: string;    // ⭐⭐ ADICIONADO
  cpf: string;         // ⭐⭐ ADICIONADO
  data_nascimento: string; // ⭐⭐ ADICIONADO
  tipo: string;
}

interface AuthContextData {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);