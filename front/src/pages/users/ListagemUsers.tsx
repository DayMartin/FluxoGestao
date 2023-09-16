import { useSearchParams } from 'react-router-dom';
import { BarraDeFerramentas, OrdemForms } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { useEffect, useMemo } from 'react';
import { PessoasService } from '../../shared/services/api/users/PessoasService';
import { useDebounce } from '../../shared/hooks';

export const PessoasListagem: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { debounce } = useDebounce();

    const busca = useMemo(() => {
      return searchParams.get('busca') || '';
    }, [searchParams]);

    useEffect(() => {

      debounce(() => {

        PessoasService.getAll(1, busca)
      .then((result) => {
        if (result instanceof Error) {
          alert(result.message);
        } else {
          console.log(result);
        }
      });
    });
    }, [busca]);

    return (
        <LayoutBaseDePagina 
        titulo='Listagem de Usuarios' 
        > 
        <BarraDeFerramentas 
        mostrarInputBusca
        textoBotaoNovo='Novo'
        textoDabusca={busca}
        aoMudarTextoDeBusca={texto => setSearchParams({busca: texto}, { replace: true})}
        />
        </LayoutBaseDePagina>
      );

};
