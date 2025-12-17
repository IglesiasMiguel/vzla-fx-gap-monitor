import { View, Text } from 'react-native';
import { RatesResponse } from '@/types';
import { getLastRates } from '@/utils/storage';
import { useEffect, useState } from 'react';
import { Language } from '@/hooks/useLanguage';
import { translations } from '@/hooks/useLanguage';

interface WidgetPreviewProps {
  rates?: RatesResponse | null;
  language: Language;
}

export function WidgetPreview({ rates, language }: WidgetPreviewProps) {
  const [localRates, setLocalRates] = useState<RatesResponse | null>(rates || null);
  const t = translations[language].widgetPreview;

  useEffect(() => {
    if (!rates) {
      getLastRates().then(setLocalRates);
    }
  }, [rates]);

  const displayRates = rates || localRates;

  if (!displayRates) {
    return (
      <View className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
        <Text className="text-slate-600 dark:text-slate-400 text-sm mb-4">{t.widgetPreview}</Text>
        <Text className="text-slate-500 dark:text-slate-400 text-center">{t.noDataAvailable}</Text>
      </View>
    );
  }

  const purchasingPower = displayRates.purchasing_power;
  const getColorClass = () => {
    if (purchasingPower < 60) return 'text-green-600 dark:text-green-400';
    if (purchasingPower > 90) return 'text-red-600 dark:text-red-400';
    return 'text-yellow-600 dark:text-yellow-400';
  };

  return (
    <View className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
      <Text className="text-slate-600 dark:text-slate-400 text-xs mb-4">
        {t.widgetPreview} ({t.howItWillLook})
      </Text>
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-slate-500 dark:text-slate-400 text-xs mb-1">BCV</Text>
          <Text className="text-lg font-bold text-slate-900 dark:text-white">
            {Number(displayRates.bcv ?? 0).toFixed(2)}
          </Text>
        </View>
        <View className="flex-1 items-center">
          <Text className="text-slate-500 dark:text-slate-400 text-xs mb-1">Binance</Text>
          <Text className="text-lg font-bold text-slate-900 dark:text-white">
            {Number(displayRates.binance ?? 0).toFixed(2)}
          </Text>
        </View>
        <View className="flex-1 items-end">
          <Text className="text-slate-500 dark:text-slate-400 text-xs mb-1">Gap</Text>
          <Text className={`text-lg font-bold ${getColorClass()}`}>
            {Number(displayRates.purchasing_power ?? 0).toFixed(1)}%
          </Text>
        </View>
      </View>
    </View>
  );
}
