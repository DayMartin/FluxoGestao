
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDrawerContext } from '../shared/contexts';
import { useEffect, useState } from 'react';


import {
  Home, Dashboard, Ordem, PessoasListagem, Users, OrdemListagem, OrdemProd, OrdemDetalhe, OrdemMec
} from '../pages';
import { UserForms } from '../shared/components';
import PermissionComponent from '../shared/components/AuthComponent/AuthComponent';

export const AppRoutes = () => {
  const { setDrawerOptions } = useDrawerContext();
  const [userRoles, setUserRoles] = useState<string[]>([]);

  useEffect(() => {
    setDrawerOptions([
      // {
      //   icon: 'home',
      //   path: "/pagina-inicial",
      //   label: 'Página inicial',
      // },

      
      // {
      //   icon: 'people',
      //   path: "/user",
      //   label: 'Usuário',
      // },

      {
        icon: 'assignment',
        path: "/pagina-inicial",
        label: 'Listagem de serviços',
      },

      /*
      {
        icon: 'assignment',
        path: "/usersListagem",
        label: 'Listagem de Usuarios',
      }, */
      
    ]);
  }, []);

    // Simula a obtenção das roles do usuário ao carregar a página
    useEffect(() => {
      // Obtém as roles do usuário do localStorage ou de alguma fonte de dados
      const rolesFromStorage = localStorage.getItem('APP_ACCESS_ROLES');
      if (rolesFromStorage) {
        setUserRoles(JSON.parse(rolesFromStorage));
      }
    }, []);
  
    const getMenuOptions = () => {
      const menuOptions = [];
    
      if (userRoles.includes('6557a82b0aac2bc3ce21c604')) {
        menuOptions.push(
          {
            icon: 'assignment',
            path: "/ordemprod",
            label: 'Work Prod',
          },
          {
            icon: 'assignment',
            path: "/ordemMec",
            label: 'Work Mec',
          }
        );
      } else if (userRoles.includes('654d537089323f636a75a2fd')) {
        menuOptions.push(
          {
          icon: 'assignment',
          path: "/ordemMec",
          label: 'Work Mec',
        },
        {
          icon: 'assignment',
          path: "/ordemprod",
          label: 'Work Prod',
        }
        );
      } else if (userRoles.includes('6557a3e40aac2bc3ce21c5ea')) {
        menuOptions.push({
          icon: 'assignment',
          path: "/ordemMec",
          label: 'Work Mec',
        });
      } else if (userRoles.includes('6557a3830aac2bc3ce21c5e6')) {
        menuOptions.push({
          icon: 'assignment',
          path: "/ordemprod",
          label: 'Work Prod',
        });
      } else {
        menuOptions.push({
          icon: 'assignment',
          path: "/home",
          label: 'Home',
        });
      }
    
      return menuOptions;
    };
    
  
    useEffect(() => {
      setDrawerOptions(getMenuOptions());
    }, [userRoles, setDrawerOptions]);

  return (
    <Routes>
      <Route path="/pagina-inicial" element={<Dashboard />} />
      <Route path="/user" element={<Users />} />
      <Route path="/usersListagem" element={<PessoasListagem />} />
      <Route path="/userperfil" element={<UserForms />} />
      <Route path="/ordem" element={<Ordem/>} />
      <Route path="/ordemDetalhe/detalhe/:_id" element={<OrdemDetalhe />} />
      <Route path="/home" element={<Home/>} />

      {/* Rotas condicionais com base na role do usuário */}
      <Route
        path="/ordemMec"
        element={
          <PermissionComponent requiredRoles={['6557a3e40aac2bc3ce21c5ea', '6557a82b0aac2bc3ce21c604', '654d537089323f636a75a2fd']}>
            <OrdemMec />
          </PermissionComponent>
        }
      />

      <Route
        path="/ordemprod"
        element={
          <PermissionComponent requiredRoles={['6557a3830aac2bc3ce21c5e6', '6557a82b0aac2bc3ce21c604', '654d537089323f636a75a2fd']}>
            <OrdemProd />
          </PermissionComponent>
        }
      />

      {/* Rota padrão */}
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
};