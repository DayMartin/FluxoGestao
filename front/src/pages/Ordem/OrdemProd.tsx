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
import { BarraDeFerramentas, IFilterOption } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { OrdemService, IApiResponse } from '../../shared/services/api';
import { useDebounce } from '../../shared/hooks';
import DetalhesOrdemPopup from '../../shared/components/formulario-ordem/DetalheOrdem';
import { IDetalheOrdem } from '../../shared/services/api/Ordem/OrdemService';
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
  const statusPermitidos = ['Pendente', 'Concluido', 'Em andamento'];
  const statusString = statusPermitidos.join(',');

  // const [quantidadeAguardando, setQuantidadeAguardando] = useState(0);
  // const [quantidadeConcluido, setQuantidadeConcluido] = useState(0);
  const filterOptions: IFilterOption[] = [
    { label: 'Concluido', value: 'opcao1' },
    { label: 'Pendente', value: 'opcao2' },
    { label: 'Em andamento', value: 'opcao3' },
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
    setIsLoading(true);

    debounce(() => {
      const getCurrentPageData = async (page: number) => {
        try {
            
            const result = await OrdemService.getAll({ 
              page: currentPage, 
              limit: Environment.LIMITE_DE_LINHAS, 
              filter: busca, 
              setor: 'produção',
              status: statusString, 
            });

          if (result instanceof Error) {
            alert(result.message);
            setRows([]);
          } else {
            console.log('Dados recebidos:', result);
            setTotalOrdem(result.pagination.totalOrdem);
            setRows(result.ordem);
          }
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
        }
      };

      const pageFromURL = parseInt(searchParams.get('pagina') || '1', 10);
      setCurrentPage(pageFromURL);

      getCurrentPageData(pageFromURL);
    });
  }, [busca, currentPage, debounce, limit, searchParams]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setSearchParams({ busca, pagina: newPage.toString() }, { replace: true });
    setCurrentPage(newPage);
  };


  const handleDelete = (id: string) => {
    if (confirm('Realmente deseja apagar?')) {
      OrdemService.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            setRows(oldRows => [
              ...oldRows.filter(oldRow => oldRow._id !== id),
            ]);
            alert('Registro apagado com sucesso!');
          }
        });
    }
  };

  const handleOpenDetalhesDialog = (ordem: IDetalheOrdem) => {
    setSelectedOrdem(ordem);
    setShowDetalhesDialog(true);
  };

  const handleCloseDetalhesDialog = () => {
    setShowDetalhesDialog(false);
  };


const handleFiltrar = async (setor: string, status: string) => {
  try {
    setIsLoading(true);
    const result = await OrdemService.getAll({
      page: 1,
      limit: Environment.LIMITE_DE_LINHAS,
      filter: busca,
      setor,
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
    setIsLoading(false);
  } catch (error) {
    setIsLoading(false);
    console.error('Erro ao buscar ordens:', error);
  }
};

const handleFiltrarConcluido = async () => {
  await handleFiltrar('produção', 'Concluido');
};

    // useEffect para buscar a quantidade de ordens 'COncluido' quando o componente for montado
    // useEffect(() => {
    //   handleFiltrarConcluido(); // Chama a função ao montar o componente
    // }, []);

  const handleFiltrarPendente = async () => {
    await handleFiltrar('produção', 'Pendente');
  };

  // useEffect para buscar a quantidade de ordens 'Aguardando atendimento' quando o componente for montado
  // useEffect(() => {
  //   handleFiltrarAguardando(); // Chama a função ao montar o componente
  // }, []);

  const handleFiltrarAndamento = async () => {
    await handleFiltrar('produção', 'Em andamento');
  };

      // Função para retornar ao estado natural da página
  const handleReset = async () => {
      await handleFiltrar('produção', statusString); // Sem parâmetros para limpar os filtros
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
                  <TableRow key={row.ordemId}>

                    <TableCell>{row.ordemId}</TableCell>
                    <TableCell>{row.solicitante ? row.solicitante.name : 'N/A'}</TableCell>
                    <TableCell>{row.sala.salaNumber}</TableCell>
                    <TableCell>{row.forno}</TableCell>
                    <TableCell>{row.cabeceira}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>{row.urgencia}</TableCell>
                    <TableCell>{row.setor}</TableCell>
                    <TableCell>
                    <IconButton size="small" onClick={() => handleDelete(row._id)}>
                    <Icon>delete</Icon>
                    </IconButton>
                    <IconButton size="small" onClick={() => navigate(`/ordemDetalhe/detalhe/${row._id}`)}>
                      <Icon>edit</Icon>
                    </IconButton>
                    <IconButton size="small" onClick={() => handleOpenDetalhesDialog(row)}>
                      <Icon>search</Icon>
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
