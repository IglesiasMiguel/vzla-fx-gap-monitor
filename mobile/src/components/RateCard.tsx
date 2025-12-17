import { View, Text } from 'react-native';

interface RateCardProps {
  label: string;
  value: number;
  currency?: string;
  className?: string;
}

export function RateCard({ label, value, currency = '', className = '' }: RateCardProps) {
  return (
    <View className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg ${className}`}>
      <Text className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-2">{label}</Text>
      <Text className="text-3xl font-bold text-slate-900 dark:text-white">
        {value.toFixed(2)} {currency}
      </Text>
    </View>
  );
}
