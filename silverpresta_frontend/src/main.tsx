// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '../src/components/App/App'; 
import LoginProvider from './contexts/LoginContext';
import { IntlProvider } from 'react-intl';
import frMessages from './lang/fr.json';
import enMessages from './lang/en.json';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import './index.css';

const theme = createTheme({
  palette: { mode: 'light' },
});

const messages = { fr: frMessages, en: enMessages };
const locale: 'fr' | 'en' = 'fr'; // je pourrai le rendre dynamique plus tard

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <IntlProvider locale={locale} messages={messages[locale]}>
        <LoginProvider>
          <BrowserRouter>
            <App />   {/* maintenant App est à l'intérieur du Router */}
          </BrowserRouter>
        </LoginProvider>
      </IntlProvider>
    </ThemeProvider>
  </React.StrictMode>
);
