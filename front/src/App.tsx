import { BrowserRouter } from 'react-router-dom';

import { AppThemeProvider, AuthProvider, DrawerProvider } from './shared/contexts';
import { AppRoutes } from './routes';
import { Login, MenuLateral } from './shared/components';

export const App = () => {
  return (

    <AuthProvider>
    <AppThemeProvider>

      <Login>

      <DrawerProvider>
        <BrowserRouter>
          <MenuLateral>
            <AppRoutes />
          </MenuLateral>
        </BrowserRouter>
      </DrawerProvider>
      
      </Login>

    </AppThemeProvider>
    </AuthProvider>
  );
};
