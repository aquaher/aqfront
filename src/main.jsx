import React from 'react'
import ReactDOM from 'react-dom/client'
import store from '@/store/store';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { themeMaterial } from './theme';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';
import { Navigation } from './router';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'sweetalert2/dist/sweetalert2.css'
import "@patternfly/react-core/dist/styles/base.css";
import '@/assets/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={themeMaterial}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Provider store={store}>
          <BrowserRouter>
            <AuthProvider>
              <Navigation />
            </AuthProvider>
          </BrowserRouter>
        </Provider>
      </LocalizationProvider>
    </ThemeProvider>
  </React.StrictMode>
)
