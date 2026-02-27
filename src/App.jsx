import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { SettingsProvider } from './context/SettingsContext';
import { NotificationProvider } from './context/NotificationContext';
import { QueueProvider } from './context/QueueContext';
import AppRouter from './routes/AppRouter';
import ToastContainer from './components/common/ToastContainer';

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <QueueProvider>
          <NotificationProvider>
            <ToastProvider>
              <AppRouter />
              <ToastContainer />
            </ToastProvider>
          </NotificationProvider>
        </QueueProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
