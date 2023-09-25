import { useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from '@mui/material';

import { Environment } from '../../shared/environment';
import { BarraDeFerramentas } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { OrdemService, IApiResponse } from '../../shared/services/api'; 
import { useDebounce } from '../../shared/hooks';

export const OrdemListagem: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();

  const [rows, setRows] = useState<IApiResponse['ordem']>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [totalOrdem, setTotalOrdem] = useState(0); 

  const busca = useMemo(() => {
    return searchParams.get('busca') || '';
  }, [searchParams]);

  useEffect(() => {
    setIsLoading(true);

    debounce(() => {
      OrdemService.getAll(1, busca)
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
            setRows([]);
          } else {
            console.log('Dados recebidos:', result);         
            setTotalOrdem(result.pagination.totalOrdem);       
            setRows(result.ordem);           

            if (Array.isArray(result.ordem)) {
             
            } else if (typeof result.ordem === 'object') {
            
            } else {
              console.error('Dados recebidos não são um array ou objeto:', result.ordem);
              setRows([]);
              setTotalOrdem(0);
            }
          }
        })
        .catch((error) => {
          setIsLoading(false);
        });
    });
  }, [busca]);

  return (
    <LayoutBaseDePagina titulo='Listagem de Ordem de serviços'>
      <BarraDeFerramentas
        mostrarInputBusca
        textoBotaoNovo='Nova'
        textoDabusca={busca}
        aoMudarTextoDeBusca={texto => setSearchParams({ busca: texto }, { replace: true })}
      />

      <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ações</TableCell>
              <TableCell>Id</TableCell>
              <TableCell>Solicitante</TableCell>
              <TableCell>Sala</TableCell>
              <TableCell>Forno</TableCell>
              <TableCell>Cabeceira</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
          {isLoading ? (
          <TableRow>
          </TableRow>
        ) : (
          rows.map(row => (
            <TableRow key={row.ordemId}>
              <TableCell>Ações</TableCell>
              <TableCell>{row.ordemId}</TableCell>
              <TableCell>{row.solicitante}</TableCell>
              <TableCell>{row.sala}</TableCell>
              <TableCell>{row.forno}</TableCell>
              <TableCell>{row.cabeceira}</TableCell>
              <TableCell>{row.status}</TableCell>
            </TableRow>
          ))
        )}

        </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell colSpan={7}>
                {isLoading && (
                  <LinearProgress variant='indeterminate' />
                )}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </LayoutBaseDePagina>
  );
};
