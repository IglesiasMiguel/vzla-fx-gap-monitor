import { View, Text, TouchableOpacity } from 'react-native';
import { DisplayMode } from '@/types';
import { Language } from '@/hooks/useLanguage';
import { translations } from '@/hooks/useLanguage';

interface ModeSelectorProps {
  selectedMode: DisplayMode;
  onModeChange: (mode: DisplayMode) => void;
  language: Language;
}

export function ModeSelector({ selectedMode, onModeChange, language }: ModeSelectorProps) {
  const t = translations[language].modeSelector;

  return (
    <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg">
      <Text className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-3">
        {t.displayMode}
      </Text>
      <View className="flex-row gap-2">
        <TouchableOpacity
          onPress={() => onModeChange('purchasing_power')}
          className={`flex-1 py-3 px-4 rounded-xl ${
            selectedMode === 'purchasing_power'
              ? 'bg-blue-600 dark:bg-blue-500'
              : 'bg-slate-100 dark:bg-slate-700'
          }`}
        >
          <Text
            className={`text-center font-medium ${
              selectedMode === 'purchasing_power'
                ? 'text-white'
                : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            {t.purchasingPower}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onModeChange('gap_spread')}
          className={`flex-1 py-3 px-4 rounded-xl ${
            selectedMode === 'gap_spread'
              ? 'bg-blue-600 dark:bg-blue-500'
              : 'bg-slate-100 dark:bg-slate-700'
          }`}
        >
          <Text
            className={`text-center font-medium ${
              selectedMode === 'gap_spread' ? 'text-white' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            {t.gapSpread}
          </Text>
        </TouchableOpacity>
      </View>
      <Text className="text-slate-500 dark:text-slate-400 text-xs mt-2">
        {selectedMode === 'purchasing_power' ? t.purchasingPowerDesc : t.gapSpreadDesc}
      </Text>
    </View>
  );
}
