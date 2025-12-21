import { View, Text } from 'react-native';

interface RateCardProps {
  label: string;
  value: number;
  currency?: string;
  className?: string;
  amountUsed?: number; // Monto en VES usado para calcular la tasa (solo para Binance)
  amountUsedLabel?: string; // Etiqueta traducida para "Monto usado"
}

export function RateCard({
  label,
  value,
  currency = '',
  className = '',
  amountUsed,
  amountUsedLabel,
}: RateCardProps) {
  return (
    <View className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg ${className}`}>
      <Text className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-2">{label}</Text>
      <Text className="text-3xl font-bold text-slate-900 dark:text-white">
        {value.toFixed(2)} {currency}
      </Text>
      {amountUsed !== undefined && amountUsedLabel && (
        <View className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
          <Text className="text-xs text-slate-500 dark:text-slate-400">
            {amountUsedLabel} {amountUsed.toFixed(2)} VES
          </Text>
        </View>
      )}
    </View>
  );
}
