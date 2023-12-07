import { Box, Button, Icon, Paper, SelectChangeEvent, TextField, useTheme } from "@mui/material";
import { createTheme, ThemeProvider, Theme } from '@mui/material/styles';
import { Select, MenuItem } from "@mui/material";
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { v4 as uuidv4 } from 'uuid';

import React, { useEffect, useState, ChangeEvent} from "react";

import { useAuthContext } from "../../contexts/AuthContext"
import { IDetalhePessoa, PessoasService } from "../../services/api/users/PessoasService";
import { OrdemService, IDetalheOrdem, IOrdemServiceData } from "../../services/api/Ordem/OrdemService";
import { IDetalheSala, IListagemSala, SalaService, TSalaComTotalCount } from "../../services/api/Sala/SalaService";
import { EquipeService, IDetalheEquipe, IDetalheSetor, SetorService } from "../../services/api";
import { LogService, ILog } from "../../services/api/Log/LogService";

const producaoId = process.env.REACT_APP_SETOR_PRODUCAO;
const msfId = process.env.REACT_APP_SETOR_MSF;
const equipe_producaoId = process.env.REACT_APP_EQUIPE_PRODUCAO;
const equipe_greenId = process.env.REACT_APP_EQUIPE_GREEN;

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

// Tipo ajustado do ILog com a inclusão da propriedade timestamp
export interface ILogWithTimestamp extends ILog {
  timestamp: Date;
}

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

      if (userId && userName) {
    setOrdemData((prevOrdemData) => {
      const updatedServices = prevOrdemData.services.map((service) => ({
        ...service,
        solicitante_servico: userName,
      }));

      return {
        ...prevOrdemData,
        services: updatedServices,
      };
    });
  }

  if (userId && userName) {
    setOrdemData((prevOrdemData) => {
      const updatedComments = prevOrdemData.comments.map((comments) => ({
        ...comments,
        usuario: userName,
      }));

      return {
        ...prevOrdemData,
        comments: updatedComments,
      };
    });
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
    setor: process.env.REACT_APP_SETOR_PRODUCAO || "NULL" ,
    equipe: process.env.REACT_APP_EQUIPE_GREEN || "NULL" ,
    sala: 1,
    forno: NaN,
    cabeceira: "",
    status: "Aguardando atendimento",
    services: [
      {
        name: "",
        description: "",
        status: "Pendente",
        solicitante_servico: userName || "",
        id_service: uuidv4(),
      },
    ],
    comments: [
      {
        usuario: userName || "",
        description: "Criou Nova OS",
        createdAt: "",
      },
    ],
    urgencia: "Não Urgente",
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    try {
      const ordemDataWithoutServiceId = { ...ordemData };
  
      // Criar a ordem de serviço e capturar o _id retornado
      const orderId = await OrdemService.create(ordemDataWithoutServiceId);
  
      // Verifica se o orderId é um number (ou seja, um ordemId válido)
      if (typeof orderId === 'number') {
        console.log(`Ordem de serviço criada com ID: ${orderId}`);
        alert(`Ordem de serviço criada com ID: ${orderId}`);
  
        // Criar log após a criação da ordem de serviço
        const logData: Omit<ILogWithTimestamp, '_id'> = {
          timestamp: new Date(),
          userId: userId || '',
          userName: userName || '',
          action: 'create',
          entity: 'Ordem',
          entityId: orderId, // Usando o ordemID retornado pela criação da ordem
          details: 'Nova ordem de serviço criada',
        };
  
        await LogService.createLog(logData);
        console.log('Log de criação de ordem criado com sucesso!');
  
        // Limpar todos os campos após o cadastro
        setOrdemData({
          _id: "", 
          ordemId: NaN,
          solicitante: userId || '',
          solicitante_name: userName || "",
          setor_solicitante: setorID || '',
          name_setor_solicitante: setorName || "",
          name_equipe_solicitante: equipeName || "",
          equipe_solicitante: equipeID || "",
          setor: process.env.REACT_APP_SETOR_PRODUCAO || "NULL",
          equipe: process.env.REACT_APP_EQUIPE_GREEN || "NULL",
          sala: 1,
          forno: NaN,
          cabeceira: "",
          status: "Aguardando atendimento",
          services: [
            {
              name: "",
              description: "",
              status: "Pendente",
              solicitante_servico: userName || "PADRAO",
              id_service: uuidv4(),
            },
          ],
          comments: [
            {
              usuario: userName || "",
              description: "Criou Nova OS",
              createdAt: "",
            },
          ],
          urgencia: "Não Urgente",
          createdAt: ''
        });
  
        event.currentTarget?.reset();
      } else {
        // Se o orderId não for uma string (ou seja, um _id inválido), exibir um erro
        throw new Error('Erro ao criar a ordem de serviço');
      }
    } catch (error) {
      alert("Erro ao criar a ordem de serviço");
      console.error("Erro ao criar a ordem de serviço", (error as Error).message);
    }
  };
  
  
  const handleAddService = () => {
    // Se já houver pelo menos um serviço na lista, adicione um novo serviço vazio
    const hasService = ordemData.services.length > 0;
  
    if (hasService) {
      const newService = {
        name: "",
        description: "",
        status: "Pendente",
        solicitante_servico: userName || "ADD",
        id_service: uuidv4(),
      };
      
      setOrdemData((prevState) => ({
        ...prevState,
        services: [...prevState.services, newService],
      }));
    }
  };
  
  const handleRemoveService = (indexToRemove: number) => {
    if (ordemData.services.length === 1) {
      // Se houver apenas um serviço, exiba um alerta e não remova
      alert("É necessário ter ao menos 1 serviço.");
      return;
    }
  
    setOrdemData((prevState) => ({
      ...prevState,
      services: prevState.services.filter((_, index) => index !== indexToRemove),
    }));
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
          value={userName || 'NULL' }
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
          value={setorID || 'NULL' }
          onChange={(event) => handleChange(event, "setor_solicitante")}
        />

        <div className = "campos-detalhes-os">
        <p> Setor do Solicitante: </p>
        <div className="selectContainer">
        <TextField
            label="Setor Solicitante"
            type="text"
            name="title"
            value={setorName || 'NULL'}
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
          value={equipeID || 'NULL' }
          onChange={(event) => handleChange(event, "equipe_solicitante")}
        />

        <div className = "campos-detalhes-os">
        <p> Equipe do Solicitante: </p>
        <div className="selectContainer">
        <TextField
            label="Equipe Solicitante"
            type="text"
            name="title"
            value={equipeName || 'NULL'}
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


    <h4> Informações gerais da Ordem </h4>

      <div className = "campos-detalhes-os">
        <p> Urgência: </p>
         <div className="selectContainer">
          <select
            className="selectsInfo"
            value={ordemData?.urgencia || ''}
            onChange={(e) => handleChange(e, "urgencia")}
            >
            <option value="Não Urgente">Não Urgente</option>
            <option value="Urgente">Urgente</option>
            <option value="Perigo">Perigo</option>
            <option value="Risco de vida">Risco de vida</option>
          </select>

        <div className="arrowIcon">&#9660;</div>
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
            <option value={msfId}>MSF</option>
            <option value={producaoId}>PRODUCAO</option>

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
           <option value={equipe_greenId}>GREEN</option>
           <option value={equipe_producaoId}>PRODUCAO</option>
          </select>

        <div className="arrowIcon">&#9660;</div>
        </div>
        </div>

        <h4> Serviços a serem realizados <Button onClick={handleAddService}><Icon> add_circle</Icon></Button></h4>
        {/* Services e Comments */}
        {ordemData.services.map((service, index) => (
        <div key={`service-${index}`}>
          <TextField
            label="Serviço"
            type="text"
            name="name"
            value={service.name}
            onChange={(event) => handleChange(event, "services", index)}
            required
            margin="normal"
            style={{ marginRight: '40px' }}
          />
          <TextField
            label="Descrição do serviço"
            type="text"
            name="description"
            value={service.description}
            onChange={(event) => handleChange(event, "services", index)}
            required
            margin="normal"
            style={{ marginRight: '40px' }}
          />
          <TextField
            label="Status do serviço"
            type="text"
            name="status"
            value={service.status}
            onChange={(event) => handleChange(event, "services", index)}
            required
            margin="normal"
            style={{ marginRight: '40px' }}
            disabled
          />

        <input
          type="hidden"
          name="solicitante_servico"
          value={service.solicitante_servico}
          onChange={(event) => handleChange(event, "services", index)}
        />
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleRemoveService(index)}
            style={{ marginLeft: '10px', marginTop: '5px', height: '69px' }} // Adicionei um estilo de margem superior para alinhar verticalmente o botão
          >
          <Icon>delete</Icon>
          </Button>
        </div>
      ))}

        <Button
          className='botao-detalhes-os1'
          type="submit"
          sx={{
            width: '40%',
            height: '50px',
            backgroundColor: '#0d48a1c9',
            border: 'none',
            color: 'rgb(255, 255, 255)',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'regular',
            borderRadius: '8px',
            margin: '5px',
            marginTop: '50px',
            marginBottom: '60px',
            transition: 'background-color 0.3s ease',
            '&:hover': {
              backgroundColor: '#08101bc9', // Change to the color you want on hover
            },
          }}
        >
          Cadastrar ordem de serviço
        </Button>

        </ThemeProvider>
      </form>
    </Box>
  );
};
