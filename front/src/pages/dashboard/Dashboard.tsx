import { FerramentasDeDetalhe } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';

export const Dashboard = () => {
    return (
        <LayoutBaseDePagina 
        titulo='Página inicials' 
        barraDeFerramentas={(
          <FerramentasDeDetalhe mostrarBotaoSalvarEFechar/>
          )}
        > 
       
        </LayoutBaseDePagina>
      );

};
