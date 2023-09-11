import { BarraDeFerramentas } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';


export const Dashboard = () => {
    return (
        <LayoutBaseDePagina 
        titulo='Página inicial' 
        barraDeFerramentas={(<BarraDeFerramentas />)}>  
            Dinah doria
        </LayoutBaseDePagina>
      );

};
