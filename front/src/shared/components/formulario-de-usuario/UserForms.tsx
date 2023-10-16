import { Box, Button, Paper, TextField, useTheme } from "@mui/material";
import React, { useState } from "react";
import { PessoasService, IDetalhePessoa } from "../../services/api/users/PessoasService";

export const UserForms = () => {
  const [name, setName] = useState('');
  const [matricula, setMatricula] = useState('');
  const [setor, setSetor] = useState('');
  const [turno, setTurno] = useState('');
  const [funcao, setFuncao] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [situacao, setSituacao] = useState('');

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
      console.log(`User created with ID: ${userId}`);
      event.currentTarget?.reset();
    } catch (error) { 
      console.error("Erro ao criar usuário", (error as Error).message);
    }
  };
  
  const theme = useTheme();

  return (
    <Box
      height={theme.spacing(60)}
      marginX={1}
      padding={1}
      paddingX={2}
      display={"flex"}
      gap={1}
      alignItems={"center"}
      component={Paper}
    >
      <form onSubmit={handleSubmit}>
        <TextField
          type="text"
          name="nome"
          placeholder="Nome do usuário"
          onChange={(event) => setName(event.target.value)}
          required
        />

        <TextField
          type="text"
          name="matricula"
          placeholder="Matricula do usuário"
          onChange={(event) => setMatricula(event.target.value)}
          required
        />

        <TextField
          type="text"
          name="setor"
          placeholder="Setor do usuário"
          onChange={(event) => setSetor(event.target.value)}
          required
        />

        <TextField
          type="text"
          name="turno"
          placeholder="Turno do usuário"
          onChange={(event) => setTurno(event.target.value)}
          required
        />

        <TextField
          type="text"
          name="funcao"
          placeholder="Função do usuário"
          onChange={(event) => setFuncao(event.target.value)}
          required
        />

        <TextField
          type="email"
          name="email"
          placeholder="E-mail"
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <TextField
          type="password"
          name="password"
          placeholder="Senha"
          onChange={(event) => setSenha(event.target.value)}
          required
        />

        <Button type="submit">Cadastrar usuário</Button>
      </form>
    </Box>
  );
};
