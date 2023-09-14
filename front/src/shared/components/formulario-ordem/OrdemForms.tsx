import { Box, Button, Paper, TextField, useTheme } from "@mui/material";
import React, { useState } from "react";
import { OrdemService, IDetalheOrdem } from "../../services/api/Ordem/OrdemService";

export interface IOrdemServiceData {
  title: string;
  solicitante: string;
  setor: string;
  sala: number;
  forno: number;
  cabeceira: string;
  status: string;
  estadoatual: string;
  services: {
    name: string;
    description: string;
    status: string;
  }[];
  comments: {
    usuario: string;
    description: string;
  }[];
  
  // Add an index signature to allow indexing by string
  [key: string]: any;
}

export const OrdemForms = () => {
  const [ordemData, setOrdemData] = useState<IOrdemServiceData>({
    title: "",
    solicitante: "",
    setor: "",
    sala: NaN,
    forno: NaN,
    cabeceira: "",
    status: "",
    estadoatual: "",
    services: [
      {
        name: "",
        description: "",
        status: "",
      },
    ],
    comments: [
      {
        usuario: "",
        description: "",
      },
    ],
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string,
    index?: number
  ) => {
    const { name, value } = event.target;
    if (index !== undefined) {
      const updatedArray = [...ordemData[field]];
      updatedArray[index] = { ...updatedArray[index], [name]: value };
      setOrdemData({ ...ordemData, [field]: updatedArray });
    } else {
      setOrdemData({ ...ordemData, [field]: value });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const orderId = await OrdemService.create(ordemData);
      console.log(`Ordem de serviço criada com ID: ${orderId}`);
      event.currentTarget?.reset();
    } catch (error) {
      console.error("Erro ao criar a ordem de serviço", (error as Error).message);
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
          name="title"
          placeholder="Título"
          onChange={(event) => handleChange(event, "title")}
          required
        />

        <TextField
          type="text"
          name="title"
          placeholder="Solicitante"
          onChange={(event) => handleChange(event, "solicitante")}
          required
        />

        <TextField
          type="text"
          name="title"
          placeholder="setor"
          onChange={(event) => handleChange(event, "setor")}
          required
        />

        <TextField
          type="number"
          name="title"
          placeholder="sala"
          onChange={(event) => handleChange(event, "sala")}
          required
        />

        <TextField
          type="number"
          name="title"
          placeholder="forno"
          onChange={(event) => handleChange(event, "forno")}
          required
        />

        <TextField
          type="text"
          name="title"
          placeholder="cabeceira"
          onChange={(event) => handleChange(event, "cabeceira")}
          required
        />

        <TextField
          type="text"
          name="title"
          placeholder="status"
          onChange={(event) => handleChange(event, "status")}
          required
        />

        <TextField
          type="text"
          name="title"
          placeholder="estadoatual"
          onChange={(event) => handleChange(event, "estadoatual")}
          required
        />

        {/* Add similar text fields for other fields in IOrdemServiceData */}
        
        {/* Services and Comments */}
        {ordemData.services.map((service, index) => (
          <div key={`service-${index}`}>
            <TextField
              type="text"
              name="name"
              placeholder="Nome do serviço"
              onChange={(event) => handleChange(event, "services", index)}
              required
            />
            <TextField
              type="text"
              name="description"
              placeholder="Descrição do serviço"
              onChange={(event) => handleChange(event, "services", index)}
              required
            />
            <TextField
              type="text"
              name="status"
              placeholder="Status do serviço"
              onChange={(event) => handleChange(event, "services", index)}
              required
            />
          </div>
        ))}

        {ordemData.comments.map((comment, index) => (
          <div key={`comment-${index}`}>
            <TextField
              type="text"
              name="usuario"
              placeholder="Usuário do comentário"
              onChange={(event) => handleChange(event, "comments", index)}
              required
            />
            <TextField
              type="text"
              name="description"
              placeholder="Descrição do comentário"
              onChange={(event) => handleChange(event, "comments", index)}
              required
            />
          </div>
        ))}

        <Button type="submit">Cadastrar ordem de serviço</Button>
      </form>
    </Box>
  );
};
