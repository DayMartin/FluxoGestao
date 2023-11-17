import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { AuthService } from '../services/api/auth/AuthService';

interface IAuthContextData {
  logout: () => void;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<string | void>;
  role: string | null;
}

const AuthContext = createContext({} as IAuthContextData);
const LOCAL_STORAGE_KEY__ACCESS_TOKEN = 'APP_ACCESS_TOKEN';
const LOCAL_STORAGE_KEY__ACCESS_ROLES = 'APP_ACCESS_ROLES';


interface IAuthProviderProps {
  children: React.ReactNode;
}
export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string>();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const Token = localStorage.getItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN);
    const Role = localStorage.getItem(LOCAL_STORAGE_KEY__ACCESS_ROLES);

    if (Token) {
      setToken(JSON.parse(Token));
    } else if (Role) {
      setToken(JSON.parse(Role)); 
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
  
      if (Array.isArray(decodedPayload.roles)) {
        localStorage.setItem(LOCAL_STORAGE_KEY__ACCESS_ROLES, JSON.stringify(decodedPayload.roles));
        setRole(decodedPayload.roles); // Defina o valor de role aqui
      } else {
        console.error('decodedPayload.roles não é uma matriz válida');
        // Trate o caso em que decodedPayload.roles não é uma matriz válida
      }
  
      setToken(result.token);
    }
  }, []);
  

  const handleLogout = useCallback(() => {
    
    localStorage.removeItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEY__ACCESS_ROLES)
    setToken(undefined);
    setRole(null);
  }, []);

  const isAuthenticated = useMemo(() => !!token, [token]);


  return (
    <AuthContext.Provider value={{ isAuthenticated, login: handleLogin, logout: handleLogout, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);