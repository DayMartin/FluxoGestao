import { useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import { BarraDeFerramentas, OrdemForms } from '../../shared/components';
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
      .then((result: TOrdemComTotalCount | Error) => {
        setIsLoading(false);

        if (result instanceof Error) {
          alert(result.message);
        } else {
          console.log('Dados recebidos:', result);

          setTotalCount(result.totalCount);
          setRows(result.data);
        }
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
            {rows && rows.map((row) => (
              <TableRow key={row.ordemId}>
                <TableCell>Ações</TableCell>
                <TableCell>{row.ordemId}</TableCell>
                <TableCell>{row.solicitante}</TableCell>
                <TableCell>{row.sala}</TableCell>
                <TableCell>{row.forno}</TableCell>
                <TableCell>{row.cabeceira}</TableCell>
                <TableCell>{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
        </LayoutBaseDePagina>
      );

};
