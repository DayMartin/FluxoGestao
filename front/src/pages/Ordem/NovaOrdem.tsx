import { FerramentasDeDetalhe, OrdemForms } from '../../shared/components';
import PermissionComponent from '../../shared/components/AuthComponent/AuthComponent';
import { LayoutBaseDePagina } from '../../shared/layouts';

export const Ordem = () => {
    return (
        <LayoutBaseDePagina 
        titulo='Ordem de serviços' 
        barraDeFerramentas={(
        <FerramentasDeDetalhe mostrarBotaoSalvarEFechar/>
        )}
        > 
        <PermissionComponent requiredRoles={['6545bc08c05adf0df42e48d2']}>
          <OrdemForms />
        </PermissionComponent>
        </LayoutBaseDePagina>
      );

};
