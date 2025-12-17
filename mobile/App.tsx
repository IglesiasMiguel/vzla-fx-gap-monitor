import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { DashboardScreen } from './src/components/DashboardScreen';
import { DocumentationScreen } from './src/components/DocumentationScreen';
import './global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

type Screen = 'dashboard' | 'documentation';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        {currentScreen === 'dashboard' ? (
          <DashboardScreen onShowDocumentation={() => setCurrentScreen('documentation')} />
        ) : (
          <DocumentationScreen onBack={() => setCurrentScreen('dashboard')} />
        )}
        <StatusBar style="auto" />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
