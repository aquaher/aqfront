import React from 'react'
import ReactDOM from 'react-dom/client'
import store from '@/store/store';
import { Provider } from 'react-redux';
import Index from './pages/Index';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';
import { Navigation } from './router';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <BrowserRouter>
          <AuthProvider>
            <Navigation />
          </AuthProvider>
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
)
