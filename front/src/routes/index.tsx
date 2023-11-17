
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
  
    // Função para determinar as opções de menu com base nas roles do usuário
    const getMenuOptions = () => {
      if (userRoles.includes('6545bc08c05adf0df42e48d2')) {
        return [
          // ...opções adicionais para essa role
          {
            icon: 'assignment',
            path: "/ordemprod",
            label: 'Ordem Prod',
          },
        ];
      } else if (userRoles.includes('654d537089323f636a75a2fd')) {
        return [
          // ...opções adicionais para essa role
          {
            icon: 'assignment',
            path: "/ordemMec",
            label: 'Ordem Mec',
          },
        ];
      }
      // Caso contrário, retorne as opções padrão
      return [
        {
          icon: 'assignment',
          path: "/ordemListagem",
          label: 'Listagem de serviços',
        },
      ];
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
      <Route path="/ordemMec" element={<PermissionComponent requiredRoles={['654d537089323f636a75a2fd']}>
        <OrdemMec />
      </PermissionComponent>} />

      <Route path="/ordemprod" element={<PermissionComponent requiredRoles={['6545bc08c05adf0df42e48d2']}>
        <OrdemProd />
      </PermissionComponent>} />

      {/* Rota padrão */}
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
};