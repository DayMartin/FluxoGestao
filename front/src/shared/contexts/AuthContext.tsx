import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { AuthService } from '../services/api/auth/AuthService';

interface IAuthContextData {
  logout: () => void;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<string | void>;
  role: string | null;
  name: string | null;
}

const AuthContext = createContext({} as IAuthContextData);
const LOCAL_STORAGE_KEY__ACCESS_TOKEN = 'APP_ACCESS_TOKEN';
const LOCAL_STORAGE_KEY__ACCESS_ROLES = 'APP_ACCESS_ROLES';
const LOCAL_STORAGE_KEY__ACCESS_USER = 'APP_ACCESS_USER';


interface IAuthProviderProps {
  children: React.ReactNode;
}
export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string>();
  const [role, setRole] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const Token = localStorage.getItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN);
    const Role = localStorage.getItem(LOCAL_STORAGE_KEY__ACCESS_ROLES);
    const Name = localStorage.getItem(LOCAL_STORAGE_KEY__ACCESS_USER);

    if (Token) {
      setToken(JSON.parse(Token));
    } else if (Role) {
      setToken(JSON.parse(Role)); 
    } else if (Name) {
      setToken(JSON.parse(Name)); 
    }
  }, []);

  const handleLogin = useCallback(async (email: string, senha: string) => {
    const result = await AuthService.auth(email, senha);
    if (result instanceof Error) {
      return result.message;
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN, JSON.stringify(result.token));
  
      const payload = result.token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
  
      if (decodedPayload.roles) {
        localStorage.setItem(LOCAL_STORAGE_KEY__ACCESS_ROLES, JSON.stringify(decodedPayload.roles));
        setRole(decodedPayload.roles); // Define o valor de role aqui
      } else {
        console.error('decodedPayload.roles não está presente ou é inválido');
        // Trate o caso em que decodedPayload.roles não está presente ou é inválido
      }
      
      if (decodedPayload.name) {
        localStorage.setItem(LOCAL_STORAGE_KEY__ACCESS_USER, JSON.stringify(decodedPayload.name));
        setName(decodedPayload.name); // Define o valor de name aqui
      } else {
        console.error('decodedPayload.name não está presente ou é inválido');
        // Trate o caso em que decodedPayload.name não está presente ou é inválido
      }
      
  
      setToken(result.token);
    }
  }, []);
  

  const handleLogout = useCallback(() => {
    
    localStorage.removeItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEY__ACCESS_ROLES);
    localStorage.removeItem(LOCAL_STORAGE_KEY__ACCESS_USER)
    setToken(undefined);
    setRole(null);
    setName(null)
  }, []);

  const isAuthenticated = useMemo(() => !!token, [token]);


  return (
    <AuthContext.Provider value={{ isAuthenticated, login: handleLogin, logout: handleLogout, role, name }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);