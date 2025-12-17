import { View, Text, TouchableOpacity } from 'react-native';
import { DisplayMode } from '@/types';

interface ModeSelectorProps {
  selectedMode: DisplayMode;
  onModeChange: (mode: DisplayMode) => void;
}

export function ModeSelector({ selectedMode, onModeChange }: ModeSelectorProps) {
  return (
    <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg">
      <Text className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-3">
        Display Mode
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
            Purchasing Power
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
            Gap Spread
          </Text>
        </TouchableOpacity>
      </View>
      <Text className="text-slate-500 dark:text-slate-400 text-xs mt-2">
        {selectedMode === 'purchasing_power'
          ? 'Shows what percentage of purchasing power you have with BCV vs Binance'
          : 'Shows how much more expensive the parallel market is compared to BCV'}
      </Text>
    </View>
  );
}
