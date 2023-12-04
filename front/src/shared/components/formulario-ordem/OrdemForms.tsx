import { Box, Button, Icon, Paper, SelectChangeEvent, TextField, useTheme } from "@mui/material";
import { createTheme, ThemeProvider, Theme } from '@mui/material/styles';
import { Select, MenuItem } from "@mui/material";
import { outlinedInputClasses } from '@mui/material/OutlinedInput';

import React, { useEffect, useState, ChangeEvent} from "react";

import { useAuthContext } from "../../contexts/AuthContext"
import { IDetalhePessoa, PessoasService } from "../../services/api/users/PessoasService";
import { OrdemService, IDetalheOrdem, IOrdemServiceData } from "../../services/api/Ordem/OrdemService";
import { IDetalheSala, IListagemSala, SalaService, TSalaComTotalCount } from "../../services/api/Sala/SalaService";
import { EquipeService, IDetalheEquipe, IDetalheSetor, SetorService } from "../../services/api";



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
  const setorFromLocalStorage = localStorage.getItem('APP_ACCESS_SETOR');
  const userIdFromStorage = localStorage.getItem('APP_ACCESS_USER_ID');
  const equipeIdFromStorage = localStorage.getItem('APP_ACCESS_EQUIPE')
  
  const [setorName, setSetorName] = useState<string | null>(null);
  const [setorID, setSetorID] = useState<string | null>(null);

  const [equipeName, setEquipeName] = useState<string | null>(null);
  const [equipeID, setEquipeID] = useState<string | null>(null);

  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState('');

  useEffect(() => {

    if (setorID) {
      setOrdemData((prevOrdemData) => ({
        ...prevOrdemData,
        setor_solicitante: setorID,
      }));
    }

    if (setorName) {
      setOrdemData((prevOrdemData) => ({
        ...prevOrdemData,
        name_setor_solicitante: setorName,
      }));
    }

    if (equipeID) {
      setOrdemData((prevOrdemData) => ({
        ...prevOrdemData,
        equipe_solicitante: equipeID,
      }));
    }

    if (equipeName) {
      setOrdemData((prevOrdemData) => ({
        ...prevOrdemData,
        name_equipe_solicitante: equipeName,
      }));
    }

    if (userName) {
      setOrdemData((prevOrdemData) => ({
        ...prevOrdemData,
        solicitante_name: userName,
      }));
    }


    if (userId) {
      setOrdemData((prevOrdemData) => ({
        ...prevOrdemData,
        solicitante: userId,
      }));
    }


    if (setorFromLocalStorage) {
      const setorId = JSON.parse(setorFromLocalStorage);

      SetorService.getById(setorId).then((setor: IDetalheSetor | Error) => {
        if (!(setor instanceof Error)) {
          setSetorName(setor.name);
          setSetorID(setor._id);
        } else {
          console.error("Erro ao buscar detalhes do setor:", setor.message);
        }
      });
    }

    if (equipeIdFromStorage) {
      const equipeID = JSON.parse(equipeIdFromStorage);

      EquipeService.getById(equipeID).then((equipe: IDetalheEquipe | Error) => {
        if (!(equipe instanceof Error)) {
          setEquipeName(equipe.equipeName);
          setEquipeID(equipe._id);
        } else {
          console.error("Erro ao buscar detalhes do equipe:", equipe.message);
        }
      });
    }

    if (userIdFromStorage) {
      const userId = JSON.parse(userIdFromStorage);

      PessoasService.getById(userId).then((soliciante: IDetalhePessoa | Error) => {
        if (!(soliciante instanceof Error)) {
        
          setUserName(soliciante.name);
          setUserId(soliciante._id);
        } else {
          console.error("Erro ao buscar detalhes do setor:", soliciante.message);
        }
      });
    }

  }, [setorID, setorName, userId, userName, equipeName, equipeID ]);

  const [ordemData, setOrdemData] = useState<IOrdemServiceData>({
    _id: "",
    ordemId: NaN,
    solicitante: userId || '' ,
    solicitante_name: userName || "",
    setor_solicitante: setorID || '',
    name_setor_solicitante: setorName || "",
    name_equipe_solicitante: equipeName || "",
    equipe_solicitante: equipeID || "",
    setor: "655be5c6585d76b1ab1ca7e5",
    equipe: "655bece8f2da4148eba30981",
    sala: 1,
    forno: NaN,
    cabeceira: "",
    status: "Aguardando atendimento",
    services: [
      {
        name: "",
        description: "",
        status: "Pendente",
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

        <div className = "campos-detalhes-os">
        <p> Solicitante: </p>
        <div className="selectContainer">
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
        </div>
        </div>

        <input
          type="hidden"
          name="solicitante"
          value={userId}
          onChange={(event) => handleChange(event, "solicitante")}
        />

        <input
          type="hidden"
          name="setor_solicitante"
          value={setorID || 'NAO PEGOU NADA' }
          onChange={(event) => handleChange(event, "setor_solicitante")}
        />

        <div className = "campos-detalhes-os">
        <p> Setor do Solicitante: </p>
        <div className="selectContainer">
        <TextField
            label="Setor Solicitante"
            type="text"
            name="title"
            value={setorName || 'NAO PEGOU NADA'}
            onChange={(event) => handleChange(event, "name_setor_solicitante")}
            required
            margin="normal"
            style={{ marginRight: '40px' }}
            disabled // Desabilita a edição do campo
          />
        </div>
        </div>

        <input
          type="hidden"
          name="equipe_solicitante"
          value={equipeID || 'NAO PEGOU NADA' }
          onChange={(event) => handleChange(event, "equipe_solicitante")}
        />

        <div className = "campos-detalhes-os">
        <p> Equipe do Solicitante: </p>
        <div className="selectContainer">
        <TextField
            label="Equipe Solicitante"
            type="text"
            name="title"
            value={equipeName || 'NAO PEGOU NADA'}
            onChange={(event) => handleChange(event, "name_equipe_solicitante")}
            required
            margin="normal"
            style={{ marginRight: '40px' }}
            disabled // Desabilita a edição do campo
          />
        </div>
        </div>

        <h4> Informações do local do serviço </h4>

        <div className = "campos-detalhes-os">
        <p> Sala: </p>
         <div className="selectContainer">
          <select
            className="selectsInfo"
            value={ordemData?.sala || ''}
            onChange={(e) => handleChange(e, "sala")}
            >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
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

        <div className = "campos-detalhes-os">
        <p> Forno: </p>
         <div className="selectContainer">
        <TextField label="For"
          type="number"
          name="title"
          onChange={(event) => handleChange(event, "forno")}
          required
          margin="normal"
          style={{ marginRight: '40px' }}
        />
        </div>
        </div>

        <div className = "campos-detalhes-os">
        <p> Cabeceira: </p>
         <div className="selectContainer">
        <TextField label="Cab"
          type="text"
          name="title"
          onChange={(event) => handleChange(event, "cabeceira")}
          required
          margin="normal"
          style={{ marginRight: '40px' }}
        />
        </div>
        </div>

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

    <h4> Informações gerais da Ordem </h4>

        <div className = "campos-detalhes-os">
        <p> Urgência: </p>
         <div className="selectContainer">
        <TextField label="Urgência"
          type="text"
          name="title"
          onChange={(event) => handleChange(event, "urgencia")}
          required
          margin="normal"
          style={{ marginRight: '40px' }}
        />
        </div>
        </div>

        <div className = "campos-detalhes-os">
        <p> Status da ordem: </p>
        <div className="selectContainer">
        <TextField label="Status da ordem"
          type="text"
          name="title"
          value={'Aguardando atendimento'}
          onChange={(event) => handleChange(event, "status")}
          required
          margin="normal"
          style={{ marginRight: '60px' }}
          disabled
        />
        </div>
        </div>

        <h4> Setor e Equipe para realizar a Ordem </h4>
        <div className = "campos-detalhes-os">
        <p> Atribuir para qual setor: </p>
         <div className="selectContainer">
          <select
            className="selectsInfo"
            value={ordemData?.setor || ''}
            onChange={(e) => handleChange(e, "setor")}
            >
            <option value="655be5c6585d76b1ab1ca7e5">MSF</option>
            <option value="655be3fd08346d6f62ae7a56">PRODUCAO</option>

          </select>

        <div className="arrowIcon">&#9660;</div>
        </div>
        </div>

        <div className = "campos-detalhes-os">
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
        </div>

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


        <Button type="submit">Cadastrar ordem de serviço</Button>
        </ThemeProvider>
      </form>
    </Box>
  );
};
