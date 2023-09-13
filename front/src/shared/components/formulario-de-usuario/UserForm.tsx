// UserForm.tsx

import { Box, Button, Paper, TextField, useTheme } from "@mui/material"
import React, { useState } from "react";
import postService from "../../services/api/users/postService";

export const UserForm = () => {
  const [name, setName] = useState('');
  const [matricula, setMatricula] = useState('');
  const [setor, setSetor] = useState('');
  const [supervisor, setSupervisor] = useState('');
  const [turno, setTurno] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('matricula', matricula);
    formData.append('setor', setor);
    formData.append('supervisor', supervisor);
    formData.append('turno', turno);
    
    try {
      const response = await postService.create(formData);
      console.log(response);
      event.currentTarget?.reset();
    } catch (error) {
      console.error("Erro ao enviar o formulário", error);
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
          onChange={event => setName(event.target.value)}
          required
        />

        <TextField
          type="text"
          name="matricula"
          placeholder="Matricula do usuário"
          onChange={event => setMatricula(event.target.value)}
          required
        />

        <TextField
          type="text"
          name="setor"
          placeholder="setor do usuário"
          onChange={event => setSetor(event.target.value)}
          required
        />

        <TextField
          type="text"
          name="supervisor"
          placeholder="supervisor do usuário"
          onChange={event => setSupervisor(event.target.value)}
          required
        />

        <TextField
          type="text"
          name="turno"
          placeholder="turno do usuário"
          onChange={event => setTurno(event.target.value)}
          required
        />

        <Button type="submit"> Cadastrar usuário </Button>
      </form>
    </Box>
  );
};
