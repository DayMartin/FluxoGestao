import { Box, Button, Icon, Paper, SelectChangeEvent, TextField, useTheme } from "@mui/material";
import React, { useEffect, useState, ChangeEvent} from "react";
import { OrdemService, IDetalheOrdem, IOrdemServiceData } from "../../services/api/Ordem/OrdemService";
import { IDetalhePessoa, PessoasService } from "../../services/api/users/PessoasService";
import { useAuthContext } from "../../contexts/AuthContext"
import { Select, MenuItem } from "@mui/material";


import { outlinedInputClasses } from '@mui/material/OutlinedInput';

import { createTheme, ThemeProvider, Theme } from '@mui/material/styles';
import { IDetalheSala, IListagemSala, SalaService, TSalaComTotalCount } from "../../services/api/Sala/SalaService";
import { IDetalheSetor, SetorService } from "../../services/api";

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
    },
  });


// export interface IOrdemServiceData {
//   _id: string;
//   ordemId: number;
//   solicitante?: IDetalhePessoa;
//   setor: string;
//   sala: {
//     _id:string;
//     salaNumber: number;
//     setor: string[];
//   };
//   forno: number;
//   cabeceira: string;
//   status: string;
//   services: {
//     name: string;
//     description: string;
//     status: string;
//   }[];
//   comments: {
//     usuario: string;
//     description: string;
//   }[];
//   urgencia: string;
//   createdAt: string;

//   // Add an index signature to allow indexing by string
//   [key: string]: any;
// }

export const OrdemForms = ( ) => {
  const [selectedSetor, setSelectedSetor] = useState<string>("");

  const handleSetorChange = (event: ChangeEvent<{ value: unknown }>) => {
    const newValue = event.target.value as string;
    setSelectedSetor(newValue);
  };

  const { name } = useAuthContext();
  const [salas, setSalas] = useState<IListagemSala[]>([]);
  console.log(name)
  const [ordemData, setOrdemData] = useState<IOrdemServiceData>({
    _id: "",
    ordemId: NaN,
    solicitante: "",
      // {
      //   _id: "",
      //   name: "",
      //   matricula: "",
      //   setor: "",
      //   turno: "",
      //   equipe: "",
      //   email: "",
      //   senha: "",
      //   roles: [
      //   ],
      // },
    solicitante_nome: "",
    setor_solicitante: "",
    setor: "",
    equipe: "",
    sala: NaN,
    // sala:
    // {
    //   _id: "",
    //   salaNumber: NaN,
    //   // setor: {
    //   //   _id: "",
    //   //   name: "",
    //   //   equipe: [],
    //   // },
    // },
    forno: NaN,
    cabeceira: "",
    status: "",
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
        createdAt: "",
      },
    ],
    urgencia: "",
    createdAt: ''

  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>,
    field: string,
    index?: number
  ) => {
    const { name, value } = event.target as HTMLInputElement & { value: unknown };
  
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
  
  const [setorName, setSetorName] = useState<string | null>(null);
  const [setorID, setSetorID] = useState<string | null>(null);

  const [userName, setUserName] = useState<string | null>(null); 
  // const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const setorFromLocalStorage = localStorage.getItem('APP_ACCESS_SETOR');
    const userNameFromLocalStorage = localStorage.getItem('APP_ACCESS_USER');
    const userIDFromLocalStorage = localStorage.getItem('APP_ACCESS_USER_ID');
  
    if (setorFromLocalStorage) {
      const setorId = JSON.parse(setorFromLocalStorage);
  
      SetorService.getById(setorId).then((setor: IDetalheSetor | Error) => {
        if (!(setor instanceof Error)) {
          setSetorName(setor.name);
        } else {
          console.error("Erro ao buscar detalhes do setor:", setor.message);
        }
      });
    }
  
    if (userNameFromLocalStorage) {
      setUserName(JSON.parse(userNameFromLocalStorage));
    }

    if (userIDFromLocalStorage) {
      setUserId(JSON.parse(userIDFromLocalStorage)); // Atualiza o estado com o ID do usuário
    }

    // async function fetchSalas() {
    //   try {
    //     const response = await SalaService.getAll(); // Chame o método getAll do seu serviço
    //     console.log('Dados das salas:', response); // Adicione este console.log para verificar os dados

    //     if (!(response instanceof Error) && response.data) {
    //       setSalas(response.data); // Atualize o estado com as salas retornadas
    //     }
    //   } catch (error) {
    //     console.error('Erro ao buscar salas:', error);
    //   }
    // }

    //     fetchSalas(); // Chame a função para buscar as salas ao montar o componente
  }, []);

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
      <ThemeProvider theme={customTheme(outerTheme)}>
        <h4> Informações Solicitante </h4>

        <TextField
          label="Solicitante"
          type="text"
          name="title"
          value={userName || 'NAO PEGOU NADA' }
          onChange={(event) => handleChange(event, "solicitante_name")}
          required
          margin="normal"
          style={{ marginRight: '40px' }}
          disabled // Desabilita a edição do campo
        />

        <input
          type="hidden"
          name="solicitante" 
          value={userId}
          onChange={(event) => handleChange(event, "solicitante")}
        />

        <TextField
            label="Setor Solicitante" 
            type="text"
            name="title"
            value={setorName || 'NAO PEGOU NADA'}
            placeholder="ola" 
            onChange={(event) => handleChange(event, "setor_solicitante")}
            required
            margin="normal"
            style={{ marginRight: '40px' }}
            disabled // Desabilita a edição do campo
          />

        <TextField label="Status" 
          type="text"
          name="title"
          value={'Aguardando atendimento'}
          onChange={(event) => handleChange(event, "status")}
          required
          margin="normal"
          style={{ marginRight: '40px' }}
          disabled
        />

        <h4> Informações gerais </h4>

        <div className = "campos-detalhes-os">
        <p> Sala: </p>
         <div className="selectContainer">
          <select
            className="selectsInfo"
            value={ordemData?.sala || ''}
            onChange={(e) => handleChange(e, "sala")} 
            >
            <option value="65695c3e1c3697c13429d689">4</option>
          </select>

        <div className="arrowIcon">&#9660;</div>
        </div>
        </div>
{/* 
        <select onChange={(event) => handleChange(event, "sala")}>
          <option value="">Selecione uma sala</option>
          {salas.map((sala) => (
            <option key={sala._id} value={sala._id}>
              Sala {sala.salaNumber}
            </option>
          ))}
        </select> */}


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

        <br/>

        <TextField label="Urgência" 
          type="text"
          name="title"
          onChange={(event) => handleChange(event, "urgencia")}
          required
          margin="normal"
          style={{ marginRight: '40px' }}
        />


        <h4> Serviços a serem realizados <Button onClick={handleAddService}><Icon> add_circle</Icon></Button></h4>
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
              value={'Pendente'}
              onChange={(event) => handleChange(event, "services", index)}
              required
              margin="normal"
              style={{ marginRight: '40px' }}
              disabled
            />
          </div>
        ))}
            {/* Botão para adicionar novo serviço */}
          

        
        {/* Comentários */}
        { /* 
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
        ))} */}

        <p> Atribuir para qual setor: </p>
         <div className="selectContainer">
          <select
            className="selectsInfo"
            value={ordemData?.setor || ''}
            onChange={(e) => handleChange(e, "setor")} 
            >
            <option value="655be3fd08346d6f62ae7a56">PRODUCAO</option>
            <option value="655be5c6585d76b1ab1ca7e5">MSF</option>
          </select>

        <div className="arrowIcon">&#9660;</div>
        </div>

        <p> Atribuir para qual equipe: </p>
         <div className="selectContainer">
          <select
            className="selectsInfo"
            value={ordemData?.equipe || ''}
            onChange={(e) => handleChange(e, "equipe")} 
            >
           <option value="655bece8f2da4148eba30981">GREEN</option>
           <option value="6569783744abf5a3198e2de0">PRODUCAO</option>
          </select>

        <div className="arrowIcon">&#9660;</div>
        </div>

        <Button type="submit">Cadastrar ordem de serviço</Button>
        </ThemeProvider>
      </form>
    </Box>
  );
};
