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
} from '@mui/material';

import { Environment } from '../../shared/environment';
import { BarraDeFerramentas } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { OrdemService, IApiResponse } from '../../shared/services/api';
import { useDebounce } from '../../shared/hooks';

export const OrdemListagem: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  const navigate = useNavigate();

  const [rows, setRows] = useState<IApiResponse['ordem']>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalOrdem, setTotalOrdem] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const limit = Environment.LIMITE_DE_LINHAS.toString();

  const busca = useMemo(() => {
    return searchParams.get('busca') || '';
  }, [searchParams]);

  useEffect(() => {
    setIsLoading(true);

    debounce(() => {
      const getCurrentPageData = async (page: number) => {
        try {
          const result = await OrdemService.getAll({ page, limit: Environment.LIMITE_DE_LINHAS, filter: busca });

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

  return (
    <LayoutBaseDePagina titulo='Listagem de Ordem de serviços'
    
    
    >
      <BarraDeFerramentas
        mostrarInputBusca
        textoBotaoNovo='Nova'
        textoDabusca={busca}
        aoMudarTextoDeBusca={texto => setSearchParams({ busca: texto }, { replace: true })}
        aoClicarEmNovo={() => navigate('/ordemDetalhe/detalhe/nova')}
      />


      

      <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              
              <TableCell>Id</TableCell>
              <TableCell>Solicitante</TableCell>
              <TableCell>Sala</TableCell>
              <TableCell>Forno</TableCell>
              <TableCell>Cabeceira</TableCell>
              <TableCell>Status</TableCell>
              <TableCell width={100}>Ações</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <LinearProgress variant='indeterminate' />
                </TableCell>
              </TableRow>
            ) : (
              rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    {Environment.LISTAGEM_VAZIA}
                  </TableCell>
                </TableRow>
              ) : (
                rows.map(row => (
                  <TableRow key={row.ordemId}>

                    <TableCell>{row.ordemId}</TableCell>
                    <TableCell>{row.solicitante}</TableCell>
                    <TableCell>{row.sala}</TableCell>
                    <TableCell>{row.forno}</TableCell>
                    <TableCell>{row.cabeceira}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>
                    <IconButton size="small" onClick={() => handleDelete(row._id)}>
                    <Icon>delete</Icon>
                  </IconButton>
                  <IconButton size="small" onClick={() => navigate(`/ordemDetalhe/detalhe/${row._id}`)}>
                    <Icon>edit</Icon>
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
    </LayoutBaseDePagina>
  );
};
