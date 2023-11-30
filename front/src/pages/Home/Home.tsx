import React from 'react';
import Button from '@mui/material/Button';
import PermissionComponent from '../../shared/components/AuthComponent/AuthComponent';

export const Home = () => {
  const handleButtonClick = () => {
    window.location.href = 'http://localhost:3000/pagina-inicial'; };

  const handleButtonClick1 = () => {
    window.location.href = 'http://localhost:3000/userperfil'; 
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
      <PermissionComponent requiredRoles={['6557a82b0aac2bc3ce21c604', '654d537089323f636a75a2fd']}>
      <Button variant="contained" color="primary" style={{ width: '200px', height:'80px', margin: '10px' }}>
        Relatórios
      </Button>
      </PermissionComponent>
      <Button onClick={handleButtonClick1} variant="contained" color="primary" style={{ width: '200px', height:'80px', margin: '10px' }}>
        Perfil
      </Button>
            
    </div>
  );
};
