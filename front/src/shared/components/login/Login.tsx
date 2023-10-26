import { useState } from 'react';
import { Box, Button, Card, CardActions, CardContent, CircularProgress, TextField, Typography } from '@mui/material';
import * as yup from 'yup';

import { useAuthContext } from '../../contexts';
import { UserForms } from '../formulario-de-usuario/UserForms';

const loginSchema = yup.object().shape({
  email: yup.string().email().required(),
  senha: yup.string().required().min(5),
});

interface ILoginProps {
  children: React.ReactNode;
}

export const Login: React.FC<ILoginProps> = ({ children }) => {
  const { isAuthenticated, login } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);
  const [senhaError, setSenhaError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [senha, setSenha] = useState('');
  const [email, setEmail] = useState('');
  const [showUserForm, setShowUserForm] = useState(false); // Estado para controlar a exibição do formulário de usuário

  const handleSubmit = () => {
    setIsLoading(true);
    
    loginSchema
    .validate({ email, senha }, { abortEarly: false })
    .then(dadosValidados => {
      login(dadosValidados.email, dadosValidados.senha)
        .then(() => {
          setIsLoading(false);
        });
    })
    .catch((errors: yup.ValidationError) => {
      setIsLoading(false);

      errors.inner.forEach(error => {
        if (error.path === 'email') {
          setEmailError(error.message);
        } else if (error.path === 'senha') {
          setSenhaError(error.message);
        }
      });
    });
};

  if (isAuthenticated) return (
    <>{children}</>
  );

  // Função para mostrar o formulário de usuário quando o botão "Cadastrar-se" é clicado
  const handleUserFormClick = () => {
    setShowUserForm(true);
  };

  return (
    <Box width='100vw' height='100vh' display='flex' alignItems='center' justifyContent='center'>
      <Card>
        <CardContent>
          {showUserForm ? ( // Renderizar o formulário de usuário se showUserForm for true
            <UserForms />
          ) : (
            <Box display='flex' flexDirection='column' gap={2} width={250}>
              <Typography variant='h6' align='center'>Identifique-se</Typography>

              <TextField
                fullWidth
                type='email'
                label='Email'
                value={email}
                disabled={isLoading}
                error={!!emailError}
                helperText={emailError}
                onKeyDown={() => setEmailError('')}
                onChange={e => setEmail(e.target.value)}
              />

              <TextField
                fullWidth
                label='Senha'
                type='password'
                value={senha}
                disabled={isLoading}
                error={!!senhaError}
                helperText={senhaError}
                onKeyDown={() => setSenhaError('')}
                onChange={e => setSenha(e.target.value)}
              />
            </Box>
          )}
        </CardContent>
        <CardActions>
          <Box width='100%' display='flex' justifyContent='center'>
            <Button
              variant='contained'
              disabled={isLoading}
              onClick={handleSubmit}
              endIcon={isLoading ? <CircularProgress variant='indeterminate' color='inherit' size={20} /> : undefined}
            >
              Entrar
            </Button>
            <Button
              variant='contained'
              disabled={isLoading}
              onClick={handleUserFormClick} // Chame a função para mostrar o formulário de usuário
              endIcon={isLoading ? <CircularProgress variant='indeterminate' color='inherit' size={20} /> : undefined}
            >
              Cadastrar-se
            </Button>
          </Box>
        </CardActions>
      </Card>
    </Box>
  );
};
