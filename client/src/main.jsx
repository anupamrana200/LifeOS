import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from '@/app/App';
import { AuthProvider, SearchProvider, SettingsProvider, ThemeProvider } from '@/context';
import '@/styles/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <SettingsProvider>
          <SearchProvider>
            <App />
            <Toaster position="top-right" />
          </SearchProvider>
        </SettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
