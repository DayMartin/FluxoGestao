import { useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

import { LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from '@mui/material';


import { Environment } from '../../shared/environment';
import { BarraDeFerramentas } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { IOrdemServiceData, OrdemService, TOrdemComTotalCount } from '../../shared/services/api';
import { useDebounce } from '../../shared/hooks';


export const OrdemListagem: React.FC = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const { debounce } = useDebounce();

    const [rows, setRows] = useState<IOrdemServiceData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    
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
          // Limpe a lista aqui se ocorrer um erro
          setRows([]);
        } else {
          console.log('Dados recebidos:', result);

          setTotalCount(result.totalCount);

          if (Array.isArray(result.data)) {
            // Mapeamento dos dados recebidos para o formato IOrdemServiceData
            const newData = result.data.map((item) => ({
              _id: item._id,
              ordemId: item.ordemId,
              solicitante: item.solicitante,
              setor: item.setor,
              sala: item.sala,
              forno: item.forno,
              cabeceira: item.cabeceira,
              status: item.status,
              services: item.services,
              comments: item.comments,
              urgencia: item.urgencia,
            }));

            // Se houver dados, atualize a lista
            setRows(newData);
          } else if (typeof result.data === 'object') {
            // SE result.data for um objeto, adicione apenas esse objeto à lista
            setRows([result.data]);
          } else {
            console.error('Dados recebidos não são um array:', result.data);
            // LIMPAR A LISTA DE ROWS SE O RESULTADO NÃO FOR UM ARRAY OU OBJETO
            setRows([]);
            setTotalCount(0);
          }
        }
      })
      .catch((error) => {
        setIsLoading(false);
      });
  });
}, [busca]);
    return (
        <LayoutBaseDePagina 
        titulo='Listagem de Ordem de serviços' 
        > 
        <BarraDeFerramentas 
        mostrarInputBusca
        textoBotaoNovo='Nova'
        textoDabusca={busca}
        aoMudarTextoDeBusca={texto => setSearchParams({busca: texto}, { replace: true})}
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
            {totalCount === 0 && !isLoading ? (
              <TableRow>
                <TableCell colSpan={7}>Nenhum resultado encontrado.</TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => (
                <TableRow key={index}>
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
                { isLoading && (
                <LinearProgress variant='indeterminate'/>
              )}
                </TableCell>
              </TableRow>
          </TableFooter>    


        </Table>
      </TableContainer>
        </LayoutBaseDePagina>
      );

};
