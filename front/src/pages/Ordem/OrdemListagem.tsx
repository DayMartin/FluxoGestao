import { useSearchParams } from 'react-router-dom';
import { BarraDeFerramentas, OrdemForms } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { useEffect, useMemo } from 'react';
import { OrdemService } from '../../shared/services/api';

export const OrdemListagem: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const busca = useMemo(() => {
      return searchParams.get('busca') || '';
    }, [searchParams]);

    useEffect(() => {

      OrdemService.getAll(1, busca)
      .then((result) => {
        if (result instanceof Error) {
          alert(result.message);
        } else {
          console.log(result);
        }
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
        </LayoutBaseDePagina>
      );

};
