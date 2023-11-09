import React, { useEffect, useState } from 'react';

interface PermissionComponentProps {
  requiredRoles: string | string[]; // Agora permitimos que requiredRoles seja uma string ou uma matriz de strings
  children: React.ReactNode;
}

const PermissionComponent: React.FC<PermissionComponentProps> = ({ requiredRoles, children }) => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [userRoles, setUserRoles] = useState<string[]>([]);

  useEffect(() => {
    const storedRoles = localStorage.getItem('APP_ACCESS_ROLES');

    if (storedRoles) {
      try {
        const parsedRoles = JSON.parse(storedRoles);
        if (!arraysEqual(parsedRoles, userRoles)) {
          setUserRoles(parsedRoles);
        }
      } catch (error) {
        console.error('Erro ao analisar as roles do localStorage:', error);
      }
    }

    if (userRoles.length > 0) {
      if (Array.isArray(requiredRoles)) {
        // Verifica se pelo menos uma das roles necessárias está presente nas roles do usuário
        setHasPermission(requiredRoles.some((role) => userRoles.includes(role)));
      } else {
        // Verifica se a role necessária está presente nas roles do usuário
        setHasPermission(userRoles.includes(requiredRoles));
      }
    } else {
      // Caso userRoles seja vazio, defina permissão como false (ou o que for apropriado para sua lógica)
      setHasPermission(false);
    }
  }, [requiredRoles, userRoles]);

  // Função para verificar igualdade de arrays
  function arraysEqual(arr1: any[], arr2: any[]) {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
  }

  return <>{hasPermission && children}</>;
};

export default PermissionComponent;
