import { View, Text } from 'react-native';

interface RateCardProps {
  label: string;
  value: number;
  currency?: string;
  className?: string;
  amountUsed?: number; // Monto en VES usado para calcular la tasa (solo para Binance)
  amountUsedLabel?: string; // Etiqueta traducida para "Monto usado"
  officialRateLabel?: string; // Etiqueta traducida para "Tasa oficial" (solo para BCV)
}

export function RateCard({
  label,
  value,
  currency = '',
  className = '',
  amountUsed,
  amountUsedLabel,
  officialRateLabel,
}: RateCardProps) {
  // Formatear el amountUsed como entero con separadores de miles
  const formatAmountUsed = (amount: number): string => {
    return Math.round(amount).toLocaleString('es-VE');
  };

  return (
    <View className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg ${className}`}>
      <Text className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-2">{label}</Text>
      <Text className="text-3xl font-bold text-slate-900 dark:text-white">
        {value.toFixed(2)} {currency}
      </Text>
      {/* Reservar siempre el espacio para mantener altura consistente */}
      <View className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 min-h-[20px]">
        {amountUsed !== undefined && amountUsedLabel && (
          <Text
            className="text-xs text-slate-500 dark:text-slate-400"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {amountUsedLabel} {formatAmountUsed(amountUsed)} VES
          </Text>
        )}
        {officialRateLabel && !amountUsed && (
          <Text
            className="text-xs text-slate-500 dark:text-slate-400"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {officialRateLabel}
          </Text>
        )}
      </View>
    </View>
  );
}
