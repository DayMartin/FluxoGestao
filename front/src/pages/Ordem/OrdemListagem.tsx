import { useSearchParams } from 'react-router-dom';
import { BarraDeFerramentas, OrdemForms } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { useMemo } from 'react';

export const OrdemListagem: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const busca = useMemo(() => {
    return searchParams.get('busca') || '';
  }, [searchParams]);

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
