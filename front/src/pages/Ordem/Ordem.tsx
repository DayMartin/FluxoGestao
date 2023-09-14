import { FerramentasDeDetalhe, OrdemForms } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';

export const Ordem = () => {
    return (
        <LayoutBaseDePagina 
        titulo='Ordem de serviços' 
        barraDeFerramentas={(
        <FerramentasDeDetalhe mostrarBotaoSalvarEFechar/>
        )}
        > 
        <OrdemForms/>
        </LayoutBaseDePagina>
      );

};
