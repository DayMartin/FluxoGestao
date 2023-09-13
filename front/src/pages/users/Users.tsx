import { FerramentasDeDetalhe, UserForm } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';

export const Users = () => {
    return (
        <LayoutBaseDePagina 
        titulo='Usuário' 
        barraDeFerramentas={(
        <FerramentasDeDetalhe mostrarBotaoSalvarEFechar/>
        )}
        > 
        <UserForm/>
        </LayoutBaseDePagina>
      );

};
