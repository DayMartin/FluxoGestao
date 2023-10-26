import { Box, Button, Paper, TextField, useTheme } from "@mui/material";
import React, { useState } from "react";
import { PessoasService, IDetalhePessoa } from "../../services/api/users/PessoasService";
import { Login } from "../login/Login"

export const UserForms = () => {
  const [name, setName] = useState('');
  const [matricula, setMatricula] = useState('');
  const [setor, setSetor] = useState('');
  const [turno, setTurno] = useState('');
  const [funcao, setFuncao] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [situacao, setSituacao] = useState('Pendente');
  const [showLogin, setShowLogin] = useState(false);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const userData: Omit<IDetalhePessoa, 'id'> = {
      name,
      matricula,
      setor,
      turno,
      funcao,
      email,
      senha,
      situacao,
    };

    try {
      const userId = await PessoasService.create(userData);
      alert('Usuário criado com sucesso! Aguarde a aprovação do supervisor!')
      console.log(`User created with ID: ${userId}`);
      event.currentTarget?.reset();
      window.location.reload();

    } catch (error) {
      console.error("Erro ao criar usuário", (error as Error).message);
    }
  };

  const handleLoginClick = () => {
    setShowLogin(!showLogin);
    window.location.reload();
  };

  const theme = useTheme();

  return (
    showLogin ? (
      <Login>
  {/* Conteúdo do elemento filho (mesmo que seja vazio) */}
</Login>

    ) : (
      <Box
        width='100vw'
        height='100vh'
        display='flex'
        alignItems='center'
        justifyContent='center'
      >
      <Paper
        elevation={3}
        style={{
          padding: theme.spacing(2),
          width: '250px',
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing(1),
          alignItems: 'center',
        }}
      >
        <form onSubmit={handleSubmit}>
          <TextField
            type="text"
            name="nome"
            label="Nome do usuário"
            style={{ marginBottom: '5px' }}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <TextField
            type="text"
            name="matricula"
            label="Matricula do usuário"
            style={{ marginBottom: '5px' }}
            onChange={(event) => setMatricula(event.target.value)}
            required
          />

          <TextField
            type="text"
            name="setor"
            label="Setor do usuário"
            style={{ marginBottom: '5px' }}
            onChange={(event) => setSetor(event.target.value)}
            required
          />

          <TextField
            type="text"
            name="turno"
            label="Turno do usuário"
            style={{ marginBottom: '5px' }}
            onChange={(event) => setTurno(event.target.value)}
            required
          />

          <TextField
            type="text"
            name="funcao"
            label="Função do usuário"
            style={{ marginBottom: '5px' }}
            onChange={(event) => setFuncao(event.target.value)}
            required
          />

          <TextField
            type="email"
            name="email"
            label="E-mail"
            style={{ marginBottom: '5px' }}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <TextField
            type="password"
            name="password"
            label="Senha"
            style={{ marginBottom: '5px' }}
            onChange={(event) => setSenha(event.target.value)}
            required
          />
          <Button
            variant="contained"
            type="submit"
            style={{ marginTop:'10px' , marginRight: '10px' }} // Adicione o marginLeft desejado
          >
            Cadastrar-se
          </Button>

          <Button
            variant="contained"
            onClick={handleLoginClick}
            style={{ marginTop:'10px' , marginRight: '10px' }} // Adicione o marginLeft desejado
          >
            Login
          </Button>

        </form>
      </Paper>
    </Box>
    )
  );
};
