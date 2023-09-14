import { FerramentasDeDetalhe, UserForms } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';

export const Users = () => {
    return (
        <LayoutBaseDePagina 
        titulo='Usuário' 
        barraDeFerramentas={(
        <FerramentasDeDetalhe mostrarBotaoSalvarEFechar/>
        )}
        > 
        <UserForms/>
        </LayoutBaseDePagina>
      );

};
