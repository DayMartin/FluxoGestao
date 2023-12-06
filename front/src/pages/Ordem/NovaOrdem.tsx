import { FerramentasDeDetalhe, OrdemForms } from '../../shared/components';
import PermissionComponent from '../../shared/components/AuthComponent/AuthComponent';
import { LayoutBaseDePagina } from '../../shared/layouts';

export const Ordem = () => {
    return (
        <LayoutBaseDePagina 
        titulo='Ordem de serviços' 
        > 
        {/* <PermissionComponent requiredRoles={['6557a3830aac2bc3ce21c5e6', '6557a82b0aac2bc3ce21c604']}> */}
          <OrdemForms />
        {/* </PermissionComponent> */}
        </LayoutBaseDePagina>
      );

};
