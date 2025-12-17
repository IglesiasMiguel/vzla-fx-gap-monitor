import { View, Text } from 'react-native';

interface GapIndicatorProps {
  value: number;
  mode: 'purchasing_power' | 'gap_spread';
  recommendation: 'BUY_BCV' | 'NEUTRAL' | 'SELL_USDT';
}

export function GapIndicator({ value, mode, recommendation }: GapIndicatorProps) {
  const getColorClass = () => {
    if (mode === 'purchasing_power') {
      if (value < 60) return 'text-green-600 dark:text-green-400'; // Good opportunity
      if (value > 90) return 'text-red-600 dark:text-red-400'; // Rates too close
      return 'text-yellow-600 dark:text-yellow-400'; // Neutral
    } else {
      // gap_spread mode
      if (value > 50) return 'text-green-600 dark:text-green-400'; // High gap = opportunity
      if (value < 10) return 'text-red-600 dark:text-red-400'; // Low gap = caution
      return 'text-yellow-600 dark:text-yellow-400'; // Neutral
    }
  };

  const getRecommendationText = () => {
    switch (recommendation) {
      case 'BUY_BCV':
        return 'Good time to buy official dollar';
      case 'SELL_USDT':
        return 'Rates are converging';
      default:
        return 'Monitor the market';
    }
  };

  return (
    <View className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
      <Text className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-2">
        {mode === 'purchasing_power' ? 'Purchasing Power' : 'Gap Spread'}
      </Text>
      <Text className={`text-4xl font-bold mb-2 ${getColorClass()}`}>{value.toFixed(2)}%</Text>
      <Text className="text-slate-500 dark:text-slate-400 text-xs">{getRecommendationText()}</Text>
    </View>
  );
}
