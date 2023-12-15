import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import {
  Icon,
  IconButton,
  LinearProgress,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Dialog,
  Box,
} from '@mui/material';

import { styled } from '@mui/material/styles';

import { Environment } from '../../shared/environment';
import { BarraDeFerramentas, IFilterOption, ILogWithTimestamp } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { OrdemService, IApiResponse, PessoasService, IDetalhePessoa, SetorService, IDetalheSetor, EquipeService, IDetalheEquipe } from '../../shared/services/api';
import { useDebounce } from '../../shared/hooks';
import DetalhesOrdemPopup from '../../shared/components/formulario-ordem/DetalheOrdem';
import { IDetalheOrdem } from '../../shared/services/api/Ordem/OrdemService';
import { LogService } from '../../shared/services/api/Log/LogService';
//import { IOrdemServiceData } from '../../shared/components/formulario-ordem/OrdemForms';


export const OrdemProd: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  const navigate = useNavigate();

  const [rows, setRows] = useState<IApiResponse['ordem']>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalOrdem, setTotalOrdem] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrdem, setSelectedOrdem] = useState<IDetalheOrdem | null>(null);
  const [showDetalhesDialog, setShowDetalhesDialog] = useState(false);
  const statusPermitidos = ['Pendente', 'Concluido', 'Em andamento', 'Aguardando atendimento', 'Dever de recusa'];
  const statusString = statusPermitidos.join(',');

  const [equipeName, setEquipeName] = useState<string | undefined>(undefined); 
  const [setorName, setSetorName] = useState<string | null>(null); 
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState('');

  const setorFromLocalStorage = localStorage.getItem('APP_ACCESS_SETOR');
  const userIdFromStorage = localStorage.getItem('APP_ACCESS_USER_ID');
  const equipeIdFromStorage = localStorage.getItem('APP_ACCESS_EQUIPE')

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

  if (equipeIdFromStorage) {
    const equipeID = JSON.parse(equipeIdFromStorage);

    EquipeService.getById(equipeID).then((equipe: IDetalheEquipe | Error) => {
      if (!(equipe instanceof Error)) {
        setEquipeName(equipe.equipeName);
      } else {
        console.error("Erro ao buscar detalhes do equipe:", equipe.message);
      }
    });
  }

  // const [quantidadeAguardando, setQuantidadeAguardando] = useState(0);
  // const [quantidadeConcluido, setQuantidadeConcluido] = useState(0);
  const filterOptions: IFilterOption[] = [
    { label: 'Concluido', value: 'opcao1' },
    { label: 'Pendente', value: 'opcao2' },
    { label: 'Em andamento', value: 'opcao3' },
    { label: 'Aguardando atendimento', value: 'opcao4' },
    { label: 'Dever de recusa', value: 'opcao5' },
    { label: 'Todos', value: 'reset' },
  ];

  const limit = Environment.LIMITE_DE_LINHAS.toString();

  const CustomDialog = styled(Dialog)(({ theme }) => ({
    width: '800px',
    height: '700px',
    [theme.breakpoints.down('sm')]: {
      width: '100%', // Ajuste de largura para telas menores
    },
  }));


  const busca = useMemo(() => {
    return searchParams.get('busca') || '';
  }, [searchParams]);

  useEffect(() => {
    const equipeFromLocalStorage = localStorage.getItem('APP_ACCESS_EQUIPE');
    const setorFromLocalStorage = localStorage.getItem('APP_ACCESS_SETOR');
  
    if (equipeFromLocalStorage && setorFromLocalStorage) {
      const equipeNameFromLocalStorage = JSON.parse(equipeFromLocalStorage);
      setEquipeName(equipeNameFromLocalStorage);
  
      const setorNameFromLocalStorage = JSON.parse(setorFromLocalStorage);
      setSetorName(setorNameFromLocalStorage);
  
      setIsLoading(true);
  
      debounce(async () => {
        try {
          const result = await OrdemService.getAll({ 
            page: currentPage, 
            limit: Environment.LIMITE_DE_LINHAS, 
            filter: busca, 
            equipe: equipeNameFromLocalStorage,
            setor: setorNameFromLocalStorage,
            status: statusPermitidos.join(','),
          });

          console.log(setorNameFromLocalStorage)
  
          if (result instanceof Error) {
            alert(result.message);
            setRows([]);
          } else {
            setTotalOrdem(result.pagination.totalOrdem);
            setRows(result.ordem);
          }
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
          console.error('Erro ao buscar ordens:', error);
        }
      });
    }
  }, [busca, currentPage, debounce, setIsLoading]);
  
  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setSearchParams({ busca, pagina: newPage.toString() }, { replace: true });
    setCurrentPage(newPage);
  };


  const handleDelete = async (id: string, ordemId: number) => {
    try {
      if (confirm('Realmente deseja apagar?')) {
        const result = await OrdemService.deleteById(id);
  
        if (result instanceof Error) {
          alert(result.message);
        } else {
          setRows((oldRows) => [
            ...oldRows.filter((oldRow) => oldRow._id !== id),
          ]);
  
          // Criar log após apagar o registro
          const logData: Omit<ILogWithTimestamp, '_id'> = {
            timestamp: new Date(),
            userId: userId || '',
            userName: userName || '',
            userEquipe: equipeName || '',
            userSetor: setorName || '',
            action: 'delete',
            entity: 'Ordem',
            entityId: id,
            details: `Ordem de serviço apagada - ordemId: ${ordemId}`,
          };
  
          await LogService.createLog(logData);
          console.log('Log de apagar registro criado com sucesso!');
  
          alert('Registro apagado com sucesso!');
        }
      }
    } catch (error) {
      console.error('Erro ao apagar o registro:', error);
    }
  };

  const handleOpenDetalhesDialog = (ordem: IDetalheOrdem) => {
    setSelectedOrdem(ordem);
    setShowDetalhesDialog(true);
  };

  const handleCloseDetalhesDialog = () => {
    setShowDetalhesDialog(false);
  };


  const handleFiltrar = async (status: string) => {
    try {
      setIsLoading(true);
  
      const equipeFromLocalStorage = localStorage.getItem('APP_ACCESS_EQUIPE');
      const setorFromLocalStorage = localStorage.getItem('APP_ACCESS_SETOR');
  
      if (equipeFromLocalStorage && setorFromLocalStorage) {
        const equipeNameFromLocalStorage = JSON.parse(equipeFromLocalStorage);
        const setorNameFromLocalStorage = JSON.parse(setorFromLocalStorage);
  
        const result = await OrdemService.getAll({
          page: 1,
          limit: Environment.LIMITE_DE_LINHAS,
          filter: busca,
          equipe: equipeNameFromLocalStorage,
          setor: setorNameFromLocalStorage,
          status,
        });
  
        if (result instanceof Error) {
          alert(result.message);
          setRows([]);
        } else {
          setTotalOrdem(result.pagination.totalOrdem);
          setRows(result.ordem);
          setCurrentPage(1);
        }
      } else {
        console.error('Valores de equipe ou setor não encontrados no localStorage');
      }
  
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Erro ao buscar ordens:', error);
    }
  };
  
  const handleFiltrarConcluido = async () => {
    await handleFiltrar('Concluido');
  };
  
  const handleFiltrarPendente = async () => {
    await handleFiltrar('Pendente');
  };
  
  const handleFiltrarAndamento = async () => {
    await handleFiltrar('Em andamento');
  };

  const handleFiltrarAguardando = async () => {
    await handleFiltrar('Aguardando atendimento');
  };

  const handleFiltrarRecusa = async () => {
    await handleFiltrar('Dever de recusa');
  };
  
  const handleReset = async () => {
    await handleFiltrar(statusString);
  };
    // Objeto de funções correspondentes às opções de filtro
const filtroFunctions: Record<string, () => void> = {
  opcao1: () => {
    handleFiltrarConcluido();
    // console.log('Opção 1 selecionada');
  },
  opcao2: () => {
    handleFiltrarPendente();
    // console.log('Opção 2 selecionada');
  },
  opcao3: () => {
    handleFiltrarAndamento();
    // console.log('Opção 2 selecionada');
  },

  opcao4: () => {
    handleFiltrarAguardando();
    // console.log('Opção 2 selecionada');
  },
  opcao5: () => {
    handleFiltrarRecusa();
    // console.log('Opção 2 selecionada');
  },
  reset: () => {
    handleReset();
    // console.log('Opção 2 selecionada');
  },
};

  return (
    <LayoutBaseDePagina titulo='Listagem de Ordem de serviços de Produção'

    >
      <BarraDeFerramentas
        mostrarInputBusca
        textoBotaoNovo='Nova'
        textoDabusca={busca}
        aoMudarTextoDeBusca={texto => setSearchParams({ busca: texto }, { replace: true })}
        aoClicarEmNovo={() => navigate('/ordem')}
        filterOptions={filterOptions}
        aoSelecionarFiltro={(filtro) => {
          // Verifica se a função correspondente à opção selecionada existe no objeto
          if (filtroFunctions[filtro]) {
            // Chama a função correspondente à opção selecionada
            filtroFunctions[filtro]();
          } else {
            console.log('Função não encontrada para esta opção de filtro');
          }
        }}
      />

      <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>

              <TableCell>Id</TableCell>
              <TableCell>Solicitante</TableCell>
              <TableCell>SAL</TableCell>
              <TableCell>For</TableCell>
              <TableCell>Cab</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Urgencia</TableCell>
              <TableCell>Setor Atual</TableCell>
              <TableCell width={130}>Ações</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10}>
                  <LinearProgress variant='indeterminate' />
                </TableCell>
              </TableRow>
            ) : (
              rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10}>
                    {Environment.LISTAGEM_VAZIA}
                  </TableCell>
                </TableRow>
              ) : (
                rows.map(row => (
                  <TableRow key={row._id}>

                    <TableCell>{row.ordemId}</TableCell>
                    <TableCell>{row.solicitante_name}</TableCell>
                    <TableCell>{row.sala ? row.sala : 'N/A'}</TableCell>
                    <TableCell>{row.forno}</TableCell>
                    <TableCell>{row.cabeceira}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>{row.urgencia}</TableCell>
                    <TableCell>
                      {row.setor === process.env.REACT_APP_SETOR_PRODUCAO ? (
                        <p>PRODUÇÃO</p>
                      ) : row.setor === process.env.REACT_APP_SETOR_MSF ? (
                        <p>MSF</p>
                      ) : (
                        <p>{row.setor}</p>
                      )}
                    </TableCell>
                    <TableCell>
                    <IconButton size="small" onClick={() => handleDelete(row._id, row.ordemId)}>
                    <Icon>delete</Icon>
                    </IconButton>
                    <IconButton size="small" onClick={() => navigate(`/ordemDetalhe/detalhe/${row._id}`)}>
                      <Icon>edit</Icon>
                    </IconButton>
                    <IconButton size="small" onClick={() => handleOpenDetalhesDialog(row)}>
                    <Icon>visibility</Icon>
                    </IconButton>
                      </TableCell>
                  </TableRow>
                ))
              )
            )}

        </TableBody>
        <TableFooter>
            {(totalOrdem > 0) && (
              <TableRow>
                <TableCell colSpan={7}>
                  <Pagination
                    page={currentPage}
                    count={Math.ceil(totalOrdem / parseInt(limit))}
                    onChange={handlePageChange}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableFooter>
        </Table>
      </TableContainer>
      < Dialog
      maxWidth="sm"
      open={showDetalhesDialog}
      onClose={handleCloseDetalhesDialog}
      >

        {showDetalhesDialog && selectedOrdem &&  (
          <DetalhesOrdemPopup ordemId={selectedOrdem._id} onClose={handleCloseDetalhesDialog} />
        )}
      </Dialog>
    </LayoutBaseDePagina>
  );
};
