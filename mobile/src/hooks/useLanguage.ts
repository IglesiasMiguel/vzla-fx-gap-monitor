import { useState, useEffect } from 'react';
import { getLanguage, saveLanguage } from '@/utils/storage';

export type Language = 'es' | 'en';

export const translations = {
  es: {
    dashboard: {
      loadingRates: 'Cargando tasas...',
      connectionError: 'Error de Conexión',
      failedToFetch: 'Error al obtener tasas. Por favor revisa los logs, Miguel.',
      lastUpdate: 'Última actualización:',
      never: 'Nunca',
      nextAutoRefresh: 'Próxima actualización:',
      usingCachedData: 'Usando datos en caché',
      refreshFailed: 'Error al actualizar:',
      pullDownToRetry: 'Desliza hacia abajo para reintentar.',
      bcvRate: 'Tasa BCV',
      binanceRate: 'Tasa Binance',
      help: 'ℹ️ Ayuda',
      now: 'Ahora',
      lessThanMinute: 'Menos de un minuto',
      inMinutes: (minutes: number) => `En ${minutes} minuto${minutes !== 1 ? 's' : ''}`,
      amountUsed: 'Monto usado:',
      officialRate: 'Tasa oficial',
    },
    gapIndicator: {
      purchasingPower: 'Poder de Compra',
      gapSpread: 'Diferencia de Gap',
      goodTimeToBuy: 'Buen momento para comprar dólar oficial',
      ratesConverging: 'Las tasas están convergiendo',
      monitorMarket: 'Monitorear el mercado',
    },
    modeSelector: {
      displayMode: 'Modo de Visualización',
      purchasingPower: 'Poder de Compra',
      gapSpread: 'Diferencia de Gap',
      purchasingPowerDesc: 'Muestra qué porcentaje de poder adquisitivo tienes con BCV vs Binance',
      gapSpreadDesc: 'Muestra cuánto más caro es el mercado paralelo comparado con BCV',
    },
    widgetPreview: {
      widgetPreview: 'Vista Previa del Widget',
      noDataAvailable: 'No hay datos disponibles. Abre la app para obtener tasas.',
      howItWillLook: 'Así se verá en tu pantalla de inicio',
    },
  },
  en: {
    dashboard: {
      loadingRates: 'Loading rates...',
      connectionError: 'Connection Error',
      failedToFetch: 'Failed to fetch rates. Please check the logs, Miguel.',
      lastUpdate: 'Last update:',
      never: 'Never',
      nextAutoRefresh: 'Next auto refresh:',
      usingCachedData: 'Using cached data',
      refreshFailed: 'Refresh failed:',
      pullDownToRetry: 'Pull down to retry.',
      bcvRate: 'BCV Rate',
      binanceRate: 'Binance Rate',
      help: 'ℹ️ Help',
      now: 'Now',
      lessThanMinute: 'Less than a minute',
      inMinutes: (minutes: number) => `In ${minutes} minute${minutes !== 1 ? 's' : ''}`,
      amountUsed: 'Amount used:',
      officialRate: 'Official rate',
    },
    gapIndicator: {
      purchasingPower: 'Purchasing Power',
      gapSpread: 'Gap Spread',
      goodTimeToBuy: 'Good time to buy official dollar',
      ratesConverging: 'Rates are converging',
      monitorMarket: 'Monitor the market',
    },
    modeSelector: {
      displayMode: 'Display Mode',
      purchasingPower: 'Purchasing Power',
      gapSpread: 'Gap Spread',
      purchasingPowerDesc: 'Shows what percentage of purchasing power you have with BCV vs Binance',
      gapSpreadDesc: 'Shows how much more expensive the parallel market is compared to BCV',
    },
    widgetPreview: {
      widgetPreview: 'Widget Preview',
      noDataAvailable: 'No data available. Open the app to fetch rates.',
      howItWillLook: 'This is how it will look on your home screen',
    },
  },
};

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load saved language preference on mount
    getLanguage().then(savedLanguage => {
      setLanguageState(savedLanguage);
      setIsLoading(false);
    });
  }, []);

  const changeLanguage = async (newLanguage: Language) => {
    setLanguageState(newLanguage);
    await saveLanguage(newLanguage);
  };

  const t = translations[language];

  return {
    language,
    changeLanguage,
    t,
    isLoading,
  };
}
