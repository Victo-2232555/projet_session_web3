// src/contexts/LoginContext.tsx

/**
 * Contexte pour la gestion de l'authentification utilisateur.
 * Fournit les fonctionnalités de connexion et de déconnexion,
 * ainsi que l'état d'authentification et le token JWT.
 * @author Étienne Rivard adapté par Michel Komivi Akakpo 
 * en se basant sur le code du site de cours
 */
import axios from 'axios';
import { createContext, useState } from 'react';

export type LoginContextType = {
  isLoggedIn: boolean;
  token: string;
  login: (courriel: string, motDePasse: string) => Promise<boolean>;
  logout: () => void;
};

export const LoginContext = createContext<LoginContextType>({
  isLoggedIn: false,
  token: '',
  login: () => new Promise<boolean>(() => false),
  logout: () => {},
});

type LoginProviderProps = {
  children: React.ReactNode;
};

const API_BASE_URL = 'http://localhost:3000'; // l'adresse de mon backend

export default function LoginProvider({ children }: LoginProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');

  async function login(courriel: string, motDePasse: string): Promise<boolean> {
    return axios
      .post(`${API_BASE_URL}/api/generatetoken`, {
        userLogin: {
          courriel,
          mot_de_passe: motDePasse,
        },
      })
      .then((response) => {
        const { token } = response.data;
        if (token) {
          setIsLoggedIn(true);
          setToken(token);
          return true;
        } else {
          setIsLoggedIn(false);
          setToken('');
          return false;
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
        setToken('');
        return false;
      });
  }

  function logout() {
    setToken('');
    setIsLoggedIn(false);
  }

  const values: LoginContextType = { isLoggedIn, token, login, logout };

  return (
    <LoginContext.Provider value={values}>
      {children}
    </LoginContext.Provider>
  );
}
