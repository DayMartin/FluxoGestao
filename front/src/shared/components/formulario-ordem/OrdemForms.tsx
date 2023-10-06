import { Box, Button, Paper, TextField, useTheme } from "@mui/material";
import React, { useState } from "react";
import { OrdemService, IDetalheOrdem } from "../../services/api/Ordem/OrdemService";


import { outlinedInputClasses } from '@mui/material/OutlinedInput';

import { createTheme, ThemeProvider, Theme } from '@mui/material/styles';

const customTheme = (outerTheme: Theme) =>
  createTheme({
    palette: {
      mode: outerTheme.palette.mode,
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            '--TextField-brandBorderColor': '#E0E3E7',
            '--TextField-brandBorderHoverColor': '#B2BAC2',
            '--TextField-brandBorderFocusedColor': '#6F7E8C',
            '& label.Mui-focused': {
              color: 'var(--TextField-brandBorderFocusedColor)',
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            borderColor: 'var(--TextField-brandBorderColor)',
          },
          root: {
            [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: 'var(--TextField-brandBorderHoverColor)',
            },
            [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: 'var(--TextField-brandBorderFocusedColor)',
            },
          },
        },
      },
      MuiFilledInput: {
        styleOverrides: {
          root: {
            '&:before, &:after': {
              borderBottom: '2px solid var(--TextField-brandBorderColor)',
            },
          },
        },
      },
      MuiInput: {
        styleOverrides: {
          root: {
            '&:before': {
              borderBottom: '2px solid var(--TextField-brandBorderColor)',
            },

          },
        },
      },
    },
  });


export interface IOrdemServiceData {
  ordemId: number;
  _id: string;
  solicitante: string;
  setor: string;
  sala: number;
  forno: number;
  cabeceira: string;
  status: string;
  services: {
    name: string;
    description: string;
    status: string;
    comments: {
      usuario: string;
      description: string;
    }[];
  }[];
  comments: {
    usuario: string;
    description: string;
  }[];
  urgencia: string;

  // Add an index signature to allow indexing by string
  [key: string]: any;
}

export const OrdemForms = () => {
  const [ordemData, setOrdemData] = useState<IOrdemServiceData>({
    ordemId: NaN,
    _id: "",
    solicitante: "",
    setor: "",
    sala: NaN,
    forno: NaN,
    cabeceira: "",
    status: "",
    services: [
      {
        name: "",
        description: "",
        status: "",
        comments: [
          {
            usuario: "",
            description: "",
          },
        ],
      },
    ],
    comments: [
      {
        usuario: "",
        description: "",
      },
    ],
    urgencia: "",
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

  const handleAddService = () => {
    // Crie um novo serviço vazio e adicione-o à lista de serviços
    const newService = {
      name: "",
      description: "",
      status: "",
      comments: [
        {
          usuario: "",
          description: "",
        },
      ],
    };

    setOrdemData((prevState) => ({
      ...prevState,
      services: [...prevState.services, newService],
    }));
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
  const outerTheme = useTheme();

  return (
    <Box
      marginX={1}
      padding={1}
      paddingX={8}
      display={"flex"}
      gap={2}
      alignItems={"center"}
      component={Paper}

    >
      <form onSubmit={handleSubmit}>
        <h4> Informações gerais </h4>

        <ThemeProvider theme={customTheme(outerTheme)}>

        <TextField label="Titulo" 
          type="text"
          name="title"
          required
          margin="normal"
          style={{ marginRight: '40px' }}
          onChange={(event) => handleChange(event, "title")}
        />
          <TextField label="Solicitante" 
          type="text"
          name="title"
          onChange={(event) => handleChange(event, "solicitante")}
          required
          margin="normal"
          style={{ marginRight: '40px' }}
        />

        <TextField label="Setor" 
          type="text"
          name="title"
          onChange={(event) => handleChange(event, "setor")}
          required
          margin="normal"
          style={{ marginRight: '40px' }}
        />

        <TextField label="Sall" 
          type="number"
          name="title"
          onChange={(event) => handleChange(event, "sala")}
          required
          margin="normal"
          style={{ marginRight: '40px' }}
        />
        <br/>

        <TextField label="For" 
          type="number"
          name="title"
          onChange={(event) => handleChange(event, "forno")}
          required
          margin="normal"
          style={{ marginRight: '40px' }}
        />

        <TextField label="Cab" 
          type="text"
          name="title"
          onChange={(event) => handleChange(event, "cabeceira")}
          required
          margin="normal"
          style={{ marginRight: '40px' }}
        />

        <TextField label="Status" 
          type="text"
          name="title"
          onChange={(event) => handleChange(event, "status")}
          required
          margin="normal"
          style={{ marginRight: '40px' }}
        />

        <TextField label="Setor atual" 
          type="text"
          name="title"
          onChange={(event) => handleChange(event, "estadoatual")}
          required
          margin="normal"
          style={{ marginRight: '40px' }}
        />

     

        <h4> Serviços a serem realizados </h4>
        {/* Services e Comments */}
        {ordemData.services.map((service, index) => (
          <div key={`service-${index}`}>

            
            <TextField label="Serviço" 
              type="text"
              name="name"
              onChange={(event) => handleChange(event, "services", index)}
              required
              margin="normal"
              style={{ marginRight: '40px' }}
            />
            <TextField label="Descrição do serviço" 
              type="text"
              name="description"
              onChange={(event) => handleChange(event, "services", index)}
              required
              margin="normal"
              style={{ marginRight: '40px' }}
            />
            <TextField label="Status do serviço" 
              type="text"
              name="status"
              onChange={(event) => handleChange(event, "services", index)}
              required
              margin="normal"
              style={{ marginRight: '40px' }}
            />
          </div>
        ))}
            {/* Botão para adicionar novo serviço */}
            <Button onClick={handleAddService}>Adicionar Novo Serviço</Button>


        {/* Comentários */}
        {ordemData.comments.map((comment, index) => (
          <div key={`comment-${index}`}>
            <h4> Comentário </h4>

            <TextField label="Usuário do comentário"
              type="text"
              name="usuario"
              onChange={(event) => handleChange(event, "comments", index)}
              required
              margin="normal"
              style={{ marginRight: '40px' }}
            />
            <TextField label="Descrição do comentário"
              type="text"
              name="description"
              onChange={(event) => handleChange(event, "comments", index)}
              required
              margin="normal"
              style={{ marginRight: '40px' }}
            />
          </div>
        ))}

        <Button type="submit">Cadastrar ordem de serviço</Button>
        </ThemeProvider>
      </form>
    </Box>
  );
};
