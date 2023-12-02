
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDrawerContext } from '../shared/contexts';
import { useEffect, useState } from 'react';


import {
  Home, Dashboard, Ordem, PessoasListagem, Users, OrdemListagem, OrdemProd, OrdemDetalhe, OrdemMec, OrdemEncerradas
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

      // {
      //   icon: 'assignment',
      //   path: "/pagina-inicial",
      //   label: 'Listagem de serviços',
      // },

      {
        icon: 'assignment',
        path: "/ordemprod",
        label: 'Work Prod',
      },

      {
        icon: 'assignment',
        path: "/ordemEncerrada",
        label: 'Encerradas',
      }


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
  
    // const getMenuOptions = () => {
    //   const menuOptions = [];
    
    //   if (userRoles.includes('6557a82b0aac2bc3ce21c604')) {
    //     menuOptions.push(
      //     {
      //       icon: 'assignment',
      //       path: "/ordemprod",
      //       label: 'Work Prod',
      //     },
      //     {
      //       icon: 'assignment',
      //       path: "/ordemMec",
      //       label: 'Work Mec',
      //     },
      //     {
      //       icon: 'assignment',
      //       path: "/ordemEncerrada",
      //       label: 'Encerradas',
      //     }
      //   );
      // } else if (userRoles.includes('654d537089323f636a75a2fd')) {
      //   menuOptions.push(
      //     {
      //     icon: 'assignment',
      //     path: "/ordemMec",
      //     label: 'Work Mec',
      //   },
      //   {
      //     icon: 'assignment',
      //     path: "/ordemprod",
      //     label: 'Work Prod',
      //   },
      //   {
      //     icon: 'assignment',
      //     path: "/ordemEncerrada",
      //     label: 'Encerradas',
      //   }
      //   );
      // } else if (userRoles.includes('655fa44c3cd09a126e61f961')) {
      //   menuOptions.push(
      //     {
      //     icon: 'assignment',
      //     path: "/ordemMec",
      //     label: 'Work Mec',
      //   },
      //   {
      //     icon: 'assignment',
      //     path: "/ordemEncerrada",
      //     label: 'Encerradas',
      //   }
      //   );
      // } else if (userRoles.includes('655fa4283cd09a126e61f95e')) {
      //   menuOptions.push(
      //     {
      //     icon: 'assignment',
      //     path: "/ordemprod",
      //     label: 'Work Prod',
      //   },
      //   {
      //     icon: 'assignment',
      //     path: "/ordemEncerrada",
      //     label: 'Encerradas',
      //   }
      //   );
      // } else {
      //   menuOptions.push({
      //     icon: 'assignment',
      //     path: "/home",
      //     label: 'Home',
      //   });
      // }
    
    //   return menuOptions;
    // };
    
  
    // useEffect(() => {
    //   setDrawerOptions(getMenuOptions());
    // }, [userRoles, setDrawerOptions]);

  return (
    <Routes>
      <Route path="/pagina-inicial" element={<Dashboard />} />
      <Route path="/usersListagem" element={<PessoasListagem />} />
      <Route path="/ordemEncerrada" element={<OrdemEncerradas />} />
      <Route path="/userperfil" element={<UserForms />} />
      <Route path="/ordemDetalhe/detalhe/:_id" element={<OrdemDetalhe />} />
      <Route path="/home" element={<Home/>} />

      {/* Rotas condicionais com base na role do usuário */}

      <Route
        path="/user"
        element={
          <PermissionComponent requiredRoles={['6557a82b0aac2bc3ce21c604', '654d537089323f636a75a2fd']}>
            <Users />
          </PermissionComponent>
        }
      />

      <Route
        path="/ordem"
        element={
          <PermissionComponent requiredRoles={['655fa4283cd09a126e61f95e', '6557a82b0aac2bc3ce21c604','655fa44c3cd09a126e61f961']}>
            <Ordem />
          </PermissionComponent>
        }
      />

      {/* <Route
        path="/ordemMec"
        element={
          <PermissionComponent requiredRoles={['6557a82b0aac2bc3ce21c604', '655fa44c3cd09a126e61f961']}>
            <OrdemMec />
          </PermissionComponent>
        }
      /> */}

      <Route
        path="/ordemprod"
        element={
            <OrdemProd />
        }
      />

      {/* Rota padrão */}
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
};