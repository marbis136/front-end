import { RouterProvider } from 'react-router-dom';
import router from './routes/index.jsx';

// MUI
import { CssBaseline } from '@mui/material';

// Providers
import { ConfigProvider } from './contexts/ConfigContext.jsx';
import { AuthProvider } from './auth/AuthContext.jsx';

// Theme (solo uno)
import ThemeCustomization from './theme';

// Global styles
import './assets/scss/style.scss';
import NavigationScroll from './views/layout/NavigationScroll.jsx';

export default function App() {
  return (
    <ConfigProvider>
      <ThemeCustomization>
        <NavigationScroll>
          <AuthProvider>
            <CssBaseline />
            <RouterProvider router={router} />
          </AuthProvider>
        </NavigationScroll>
      </ThemeCustomization>
    </ConfigProvider>
  );
}
