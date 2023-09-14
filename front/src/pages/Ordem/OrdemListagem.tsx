import { BarraDeFerramentas, OrdemForms } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';

export const OrdemListagem = () => {
    return (
        <LayoutBaseDePagina 
        titulo='Listagem de Ordem de serviços' 
        > 
        <BarraDeFerramentas mostrarInputBusca/>
        </LayoutBaseDePagina>
      );

};
