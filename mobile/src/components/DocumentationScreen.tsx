import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLanguage } from '@/hooks/useLanguage';

interface DocumentationScreenProps {
  onBack: () => void;
}

export function DocumentationScreen({ onBack }: DocumentationScreenProps) {
  const { language } = useLanguage();

  const t = {
    es: {
      title: 'Documentación',
      back: 'Volver',
      introduction: {
        title: '¿Qué es el Gap?',
        content:
          'El "gap" o diferencia cambiaria es la brecha entre el tipo de cambio oficial del Banco Central de Venezuela (BCV) y el tipo de cambio del mercado paralelo (Binance P2P). Monitorear esta diferencia es crucial para tomar decisiones financieras informadas.',
      },
      purchasingPower: {
        title: 'Poder de Compra (Purchasing Power)',
        concept:
          'El Poder de Compra muestra qué porcentaje de poder adquisitivo tienes con el dólar oficial (BCV) comparado con el mercado paralelo (Binance).',
        formula: 'Fórmula: (BCV / Binance) × 100',
        example: {
          title: 'Ejemplo:',
          scenario: 'Si BCV = 40 VES/USD y Binance = 50 VES/USD',
          calculation: 'Poder de Compra = (40 / 50) × 100 = 80%',
          interpretation:
            'Un 80% significa que con 1 USD oficial puedes comprar el 80% de lo que comprarías con 1 USD en Binance.',
        },
        useCases: {
          title: 'Cuándo usar este modo:',
          low: 'Valor bajo (< 60%): Buena oportunidad para comprar dólar oficial',
          high: 'Valor alto (> 90%): Los tipos de cambio están convergiendo',
          medium: 'Valor medio (60-90%): Situación neutral, monitorear el mercado',
        },
      },
      gapSpread: {
        title: 'Diferencia de Gap (Gap Spread)',
        concept:
          'El Gap Spread muestra cuánto más caro es el mercado paralelo comparado con el tipo de cambio oficial.',
        formula: 'Fórmula: ((Binance - BCV) / BCV) × 100',
        example: {
          title: 'Ejemplo:',
          scenario: 'Si BCV = 40 VES/USD y Binance = 50 VES/USD',
          calculation: 'Gap Spread = ((50 - 40) / 40) × 100 = 25%',
          interpretation:
            'Un 25% significa que el mercado paralelo es 25% más caro que el oficial.',
        },
        useCases: {
          title: 'Cuándo usar este modo:',
          high: 'Valor alto (> 50%): Alto gap = oportunidad de arbitraje',
          low: 'Valor bajo (< 10%): Los mercados están convergiendo, menos oportunidad',
          medium: 'Valor medio (10-50%): Gap moderado, evaluar oportunidades',
        },
      },
      practicalExamples: {
        title: 'Ejemplos Prácticos',
        scenario1: {
          title: 'Escenario 1: Gap Alto',
          rates: 'BCV: 40 VES/USD | Binance: 60 VES/USD',
          purchasingPower: 'Poder de Compra: 66.67%',
          gapSpread: 'Gap Spread: 50%',
          interpretation:
            'El mercado paralelo es significativamente más caro. Es un buen momento para considerar comprar dólar oficial.',
        },
        scenario2: {
          title: 'Escenario 2: Gap Bajo',
          rates: 'BCV: 45 VES/USD | Binance: 47 VES/USD',
          purchasingPower: 'Poder de Compra: 95.74%',
          gapSpread: 'Gap Spread: 4.44%',
          interpretation:
            'Los tipos de cambio están muy cerca. Hay menos oportunidad de arbitraje en este momento.',
        },
        scenario3: {
          title: 'Escenario 3: Gap Medio',
          rates: 'BCV: 42 VES/USD | Binance: 55 VES/USD',
          purchasingPower: 'Poder de Compra: 76.36%',
          gapSpread: 'Gap Spread: 30.95%',
          interpretation:
            'Gap moderado. Evalúa tus necesidades y el contexto del mercado antes de tomar decisiones.',
        },
      },
      appUseCases: {
        title: 'Casos de Uso de la Aplicación',
        monitoring: {
          title: 'Monitoreo Diario',
          content:
            'Revisa la app diariamente para identificar oportunidades de cambio. Un gap alto puede indicar el mejor momento para realizar transacciones.',
        },
        purchaseDecision: {
          title: 'Decisión de Compra',
          content:
            '¿Comprar dólar oficial o USDT en Binance? El Poder de Compra te ayuda a entender cuánto más valor obtienes con cada opción.',
        },
        arbitrage: {
          title: 'Arbitraje',
          content:
            'Identifica cuándo el gap es suficientemente grande para justificar transacciones de arbitraje entre ambos mercados.',
        },
        financialPlanning: {
          title: 'Planificación Financiera',
          content:
            'Entiende el poder adquisitivo real de tus dólares. Si tienes dólares oficiales, sabes exactamente qué porcentaje de valor tienen comparado con el mercado paralelo.',
        },
      },
    },
    en: {
      title: 'Documentation',
      back: 'Back',
      introduction: {
        title: 'What is the Gap?',
        content:
          'The "gap" or exchange rate difference is the spread between the official exchange rate from the Central Bank of Venezuela (BCV) and the parallel market rate (Binance P2P). Monitoring this difference is crucial for making informed financial decisions.',
      },
      purchasingPower: {
        title: 'Purchasing Power',
        concept:
          'Purchasing Power shows what percentage of purchasing power you have with the official dollar (BCV) compared to the parallel market (Binance).',
        formula: 'Formula: (BCV / Binance) × 100',
        example: {
          title: 'Example:',
          scenario: 'If BCV = 40 VES/USD and Binance = 50 VES/USD',
          calculation: 'Purchasing Power = (40 / 50) × 100 = 80%',
          interpretation:
            '80% means that with 1 official USD you can buy 80% of what you would buy with 1 USD on Binance.',
        },
        useCases: {
          title: 'When to use this mode:',
          low: 'Low value (< 60%): Good opportunity to buy official dollar',
          high: 'High value (> 90%): Exchange rates are converging',
          medium: 'Medium value (60-90%): Neutral situation, monitor the market',
        },
      },
      gapSpread: {
        title: 'Gap Spread',
        concept:
          'Gap Spread shows how much more expensive the parallel market is compared to the official exchange rate.',
        formula: 'Formula: ((Binance - BCV) / BCV) × 100',
        example: {
          title: 'Example:',
          scenario: 'If BCV = 40 VES/USD and Binance = 50 VES/USD',
          calculation: 'Gap Spread = ((50 - 40) / 40) × 100 = 25%',
          interpretation:
            '25% means the parallel market is 25% more expensive than the official one.',
        },
        useCases: {
          title: 'When to use this mode:',
          high: 'High value (> 50%): High gap = arbitrage opportunity',
          low: 'Low value (< 10%): Markets are converging, less opportunity',
          medium: 'Medium value (10-50%): Moderate gap, evaluate opportunities',
        },
      },
      practicalExamples: {
        title: 'Practical Examples',
        scenario1: {
          title: 'Scenario 1: High Gap',
          rates: 'BCV: 40 VES/USD | Binance: 60 VES/USD',
          purchasingPower: 'Purchasing Power: 66.67%',
          gapSpread: 'Gap Spread: 50%',
          interpretation:
            'The parallel market is significantly more expensive. It is a good time to consider buying official dollar.',
        },
        scenario2: {
          title: 'Scenario 2: Low Gap',
          rates: 'BCV: 45 VES/USD | Binance: 47 VES/USD',
          purchasingPower: 'Purchasing Power: 95.74%',
          gapSpread: 'Gap Spread: 4.44%',
          interpretation:
            'Exchange rates are very close. There is less arbitrage opportunity at this time.',
        },
        scenario3: {
          title: 'Scenario 3: Medium Gap',
          rates: 'BCV: 42 VES/USD | Binance: 55 VES/USD',
          purchasingPower: 'Purchasing Power: 76.36%',
          gapSpread: 'Gap Spread: 30.95%',
          interpretation:
            'Moderate gap. Evaluate your needs and market context before making decisions.',
        },
      },
      appUseCases: {
        title: 'Application Use Cases',
        monitoring: {
          title: 'Daily Monitoring',
          content:
            'Check the app daily to identify exchange opportunities. A high gap can indicate the best time to make transactions.',
        },
        purchaseDecision: {
          title: 'Purchase Decision',
          content:
            'Buy official dollar or USDT on Binance? Purchasing Power helps you understand how much more value you get with each option.',
        },
        arbitrage: {
          title: 'Arbitrage',
          content:
            'Identify when the gap is large enough to justify arbitrage transactions between both markets.',
        },
        financialPlanning: {
          title: 'Financial Planning',
          content:
            'Understand the real purchasing power of your dollars. If you have official dollars, you know exactly what percentage of value they have compared to the parallel market.',
        },
      },
    },
  };

  const content = t[language];

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <View className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 pt-12 pb-4">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={onBack}
            className="bg-slate-100 dark:bg-slate-700 px-4 py-2 rounded-lg"
          >
            <Text className="text-slate-700 dark:text-slate-300 font-medium">{content.back}</Text>
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-slate-900 dark:text-white">{content.title}</Text>
          <View className="w-20" />
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4 gap-6">
          {/* Introduction */}
          <View className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-lg">
            <Text className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              {content.introduction.title}
            </Text>
            <Text className="text-slate-600 dark:text-slate-400 leading-6">
              {content.introduction.content}
            </Text>
          </View>

          {/* Purchasing Power Section */}
          <View className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-lg">
            <Text className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              {content.purchasingPower.title}
            </Text>
            <Text className="text-slate-600 dark:text-slate-400 leading-6 mb-4">
              {content.purchasingPower.concept}
            </Text>
            <Text className="text-slate-700 dark:text-slate-300 font-semibold mb-3">
              {content.purchasingPower.formula}
            </Text>

            {/* Example Box */}
            <View className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-4 border border-blue-200 dark:border-blue-800">
              <Text className="text-slate-700 dark:text-slate-300 font-semibold mb-2">
                {content.purchasingPower.example.title}
              </Text>
              <Text className="text-slate-600 dark:text-slate-400 mb-2">
                {content.purchasingPower.example.scenario}
              </Text>
              <Text className="text-blue-700 dark:text-blue-300 font-mono mb-2">
                {content.purchasingPower.example.calculation}
              </Text>
              <Text className="text-slate-600 dark:text-slate-400 text-sm italic">
                {content.purchasingPower.example.interpretation}
              </Text>
            </View>

            {/* Use Cases */}
            <Text className="text-slate-700 dark:text-slate-300 font-semibold mb-2">
              {content.purchasingPower.useCases.title}
            </Text>
            <View className="gap-2">
              <View className="flex-row items-start">
                <Text className="text-green-600 dark:text-green-400 mr-2">•</Text>
                <Text className="text-slate-600 dark:text-slate-400 flex-1">
                  {content.purchasingPower.useCases.low}
                </Text>
              </View>
              <View className="flex-row items-start">
                <Text className="text-yellow-600 dark:text-yellow-400 mr-2">•</Text>
                <Text className="text-slate-600 dark:text-slate-400 flex-1">
                  {content.purchasingPower.useCases.medium}
                </Text>
              </View>
              <View className="flex-row items-start">
                <Text className="text-red-600 dark:text-red-400 mr-2">•</Text>
                <Text className="text-slate-600 dark:text-slate-400 flex-1">
                  {content.purchasingPower.useCases.high}
                </Text>
              </View>
            </View>
          </View>

          {/* Gap Spread Section */}
          <View className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-lg">
            <Text className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              {content.gapSpread.title}
            </Text>
            <Text className="text-slate-600 dark:text-slate-400 leading-6 mb-4">
              {content.gapSpread.concept}
            </Text>
            <Text className="text-slate-700 dark:text-slate-300 font-semibold mb-3">
              {content.gapSpread.formula}
            </Text>

            {/* Example Box */}
            <View className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 mb-4 border border-purple-200 dark:border-purple-800">
              <Text className="text-slate-700 dark:text-slate-300 font-semibold mb-2">
                {content.gapSpread.example.title}
              </Text>
              <Text className="text-slate-600 dark:text-slate-400 mb-2">
                {content.gapSpread.example.scenario}
              </Text>
              <Text className="text-purple-700 dark:text-purple-300 font-mono mb-2">
                {content.gapSpread.example.calculation}
              </Text>
              <Text className="text-slate-600 dark:text-slate-400 text-sm italic">
                {content.gapSpread.example.interpretation}
              </Text>
            </View>

            {/* Use Cases */}
            <Text className="text-slate-700 dark:text-slate-300 font-semibold mb-2">
              {content.gapSpread.useCases.title}
            </Text>
            <View className="gap-2">
              <View className="flex-row items-start">
                <Text className="text-green-600 dark:text-green-400 mr-2">•</Text>
                <Text className="text-slate-600 dark:text-slate-400 flex-1">
                  {content.gapSpread.useCases.high}
                </Text>
              </View>
              <View className="flex-row items-start">
                <Text className="text-yellow-600 dark:text-yellow-400 mr-2">•</Text>
                <Text className="text-slate-600 dark:text-slate-400 flex-1">
                  {content.gapSpread.useCases.medium}
                </Text>
              </View>
              <View className="flex-row items-start">
                <Text className="text-red-600 dark:text-red-400 mr-2">•</Text>
                <Text className="text-slate-600 dark:text-slate-400 flex-1">
                  {content.gapSpread.useCases.low}
                </Text>
              </View>
            </View>
          </View>

          {/* Practical Examples */}
          <View className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-lg">
            <Text className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              {content.practicalExamples.title}
            </Text>

            {/* Scenario 1 */}
            <View className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 mb-3">
              <Text className="text-slate-900 dark:text-white font-semibold mb-2">
                {content.practicalExamples.scenario1.title}
              </Text>
              <Text className="text-slate-600 dark:text-slate-400 text-sm mb-1">
                {content.practicalExamples.scenario1.rates}
              </Text>
              <Text className="text-blue-600 dark:text-blue-400 font-semibold text-sm mb-1">
                {content.practicalExamples.scenario1.purchasingPower}
              </Text>
              <Text className="text-purple-600 dark:text-purple-400 font-semibold text-sm mb-2">
                {content.practicalExamples.scenario1.gapSpread}
              </Text>
              <Text className="text-slate-600 dark:text-slate-400 text-sm italic">
                {content.practicalExamples.scenario1.interpretation}
              </Text>
            </View>

            {/* Scenario 2 */}
            <View className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 mb-3">
              <Text className="text-slate-900 dark:text-white font-semibold mb-2">
                {content.practicalExamples.scenario2.title}
              </Text>
              <Text className="text-slate-600 dark:text-slate-400 text-sm mb-1">
                {content.practicalExamples.scenario2.rates}
              </Text>
              <Text className="text-blue-600 dark:text-blue-400 font-semibold text-sm mb-1">
                {content.practicalExamples.scenario2.purchasingPower}
              </Text>
              <Text className="text-purple-600 dark:text-purple-400 font-semibold text-sm mb-2">
                {content.practicalExamples.scenario2.gapSpread}
              </Text>
              <Text className="text-slate-600 dark:text-slate-400 text-sm italic">
                {content.practicalExamples.scenario2.interpretation}
              </Text>
            </View>

            {/* Scenario 3 */}
            <View className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
              <Text className="text-slate-900 dark:text-white font-semibold mb-2">
                {content.practicalExamples.scenario3.title}
              </Text>
              <Text className="text-slate-600 dark:text-slate-400 text-sm mb-1">
                {content.practicalExamples.scenario3.rates}
              </Text>
              <Text className="text-blue-600 dark:text-blue-400 font-semibold text-sm mb-1">
                {content.practicalExamples.scenario3.purchasingPower}
              </Text>
              <Text className="text-purple-600 dark:text-purple-400 font-semibold text-sm mb-2">
                {content.practicalExamples.scenario3.gapSpread}
              </Text>
              <Text className="text-slate-600 dark:text-slate-400 text-sm italic">
                {content.practicalExamples.scenario3.interpretation}
              </Text>
            </View>
          </View>

          {/* App Use Cases */}
          <View className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-lg mb-6">
            <Text className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              {content.appUseCases.title}
            </Text>

            <View className="gap-4">
              <View>
                <Text className="text-slate-900 dark:text-white font-semibold mb-2">
                  {content.appUseCases.monitoring.title}
                </Text>
                <Text className="text-slate-600 dark:text-slate-400 leading-6">
                  {content.appUseCases.monitoring.content}
                </Text>
              </View>

              <View>
                <Text className="text-slate-900 dark:text-white font-semibold mb-2">
                  {content.appUseCases.purchaseDecision.title}
                </Text>
                <Text className="text-slate-600 dark:text-slate-400 leading-6">
                  {content.appUseCases.purchaseDecision.content}
                </Text>
              </View>

              <View>
                <Text className="text-slate-900 dark:text-white font-semibold mb-2">
                  {content.appUseCases.arbitrage.title}
                </Text>
                <Text className="text-slate-600 dark:text-slate-400 leading-6">
                  {content.appUseCases.arbitrage.content}
                </Text>
              </View>

              <View>
                <Text className="text-slate-900 dark:text-white font-semibold mb-2">
                  {content.appUseCases.financialPlanning.title}
                </Text>
                <Text className="text-slate-600 dark:text-slate-400 leading-6">
                  {content.appUseCases.financialPlanning.content}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
