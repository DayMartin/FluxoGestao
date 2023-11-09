import React from 'react';
import Button from '@mui/material/Button';
import PermissionComponent from '../../shared/components/AuthComponent/AuthComponent';

export const Home = () => {
  const handleButtonClick = () => {
    window.location.href = 'http://localhost:3000/pagina-inicial';
  };

  return (
    
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        flexWrap: 'wrap',
      }}
    >
      <Button onClick={handleButtonClick} variant="contained" color="primary" style={{ width: '200px', height:'80px', margin: '10px' }}>
        Serviços
      </Button>
      <PermissionComponent requiredRoles="6545bc08c05adf0df42e48d2">
      <Button variant="contained" color="primary" style={{ width: '200px', height:'80px', margin: '10px' }}>
        Funcionários
      </Button>
      </PermissionComponent>
      <Button variant="contained" color="primary" style={{ width: '200px', height:'80px', margin: '10px' }}>
        Relatórios
      </Button>
      <Button variant="contained" color="primary" style={{ width: '200px', height:'80px', margin: '10px' }}>
        Perfil
      </Button>
            
    </div>
  );
};
