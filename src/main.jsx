import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './index.css';
import App from './App.jsx';

const theme = createTheme({
  palette: { mode: 'dark', primary: { main: '#4c8dff' } },
  typography: { fontFamily: "'Inter', system-ui, sans-serif" },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
