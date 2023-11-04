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
        <PermissionComponent requiredRoles={['admin']}>
          <OrdemForms />
        </PermissionComponent>
        </LayoutBaseDePagina>
      );

};
