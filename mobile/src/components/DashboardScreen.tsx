import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useRates } from '@/hooks/useRates';
import { useLanguage } from '@/hooks/useLanguage';
import { RateCard } from './RateCard';
import { GapIndicator } from './GapIndicator';
import { ModeSelector } from './ModeSelector';
import { WidgetPreview } from './WidgetPreview';
import { getDisplayMode, saveDisplayMode, getLastRefreshAt } from '@/utils/storage';
import { DisplayMode } from '@/types';

interface DashboardScreenProps {
  onShowDocumentation: () => void;
}

const THIRTY_MINUTES_MS = 30 * 60 * 1000;

export function DashboardScreen({ onShowDocumentation }: DashboardScreenProps) {
  const { data: rates, isLoading, error, refetch, isRefetching } = useRates();
  const { language, changeLanguage, t } = useLanguage();
  const [displayMode, setDisplayMode] = useState<DisplayMode>('purchasing_power');
  const [lastRefreshAt, setLastRefreshAt] = useState<number | null>(null);
  const [hasCachedData, setHasCachedData] = useState(false);

  const formatNextRefreshTime = (lastRefreshAt: number | null): string => {
    if (!lastRefreshAt) return t.dashboard.now;
    const nextRefresh = lastRefreshAt + THIRTY_MINUTES_MS;
    const now = Date.now();
    const diffMs = nextRefresh - now;

    if (diffMs <= 0) return t.dashboard.now;

    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return t.dashboard.lessThanMinute;
    return t.dashboard.inMinutes(minutes);
  };

  useEffect(() => {
    getDisplayMode().then(setDisplayMode);
    getLastRefreshAt().then(timestamp => {
      setLastRefreshAt(timestamp);
      setHasCachedData(!!timestamp);
    });
  }, []);

  useEffect(() => {
    // Update last refresh timestamp when rates update
    if (rates?.last_update) {
      getLastRefreshAt().then(setLastRefreshAt);
    }
  }, [rates?.last_update]);

  const handleModeChange = async (mode: DisplayMode) => {
    setDisplayMode(mode);
    await saveDisplayMode(mode);
  };

  const handleManualRefresh = async () => {
    // Force refresh bypassing 30-minute check
    try {
      await refetch();
    } catch (error) {
      // Error is handled by React Query, we just need to catch it
      console.error('Refresh error:', error);
    }
    const timestamp = await getLastRefreshAt();
    setLastRefreshAt(timestamp);
  };

  const displayValue =
    displayMode === 'purchasing_power' ? (rates?.purchasing_power ?? 0) : (rates?.gap_spread ?? 0);

  // Show loading only if no cached data exists
  if (isLoading && !rates && !hasCachedData) {
    return (
      <View className="flex-1 bg-slate-50 dark:bg-slate-900 items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-slate-600 dark:text-slate-400 mt-4">{t.dashboard.loadingRates}</Text>
      </View>
    );
  }

  // Show error only if no cached data exists
  if (error && !rates) {
    return (
      <View className="flex-1 bg-slate-50 dark:bg-slate-900 items-center justify-center p-6">
        <Text className="text-red-600 dark:text-red-400 text-lg font-semibold mb-2">
          {t.dashboard.connectionError}
        </Text>
        <Text className="text-slate-600 dark:text-slate-400 text-center mb-4">
          {t.dashboard.failedToFetch}
        </Text>
        <Text className="text-slate-500 dark:text-slate-500 text-xs text-center">
          {error.message}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-slate-50 dark:bg-slate-900"
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={handleManualRefresh} />}
    >
      <View className="p-4 pt-12">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-3xl font-bold text-slate-900 dark:text-white">Vzla FX Monitor</Text>
          <View className="flex-row gap-2 items-center">
            {/* Language Selector */}
            <View className="flex-row gap-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
              <TouchableOpacity
                onPress={() => changeLanguage('es')}
                className={`px-2 py-1 rounded ${
                  language === 'es' ? 'bg-blue-600 dark:bg-blue-500' : ''
                }`}
              >
                <Text
                  className={`text-xs font-medium ${
                    language === 'es' ? 'text-white' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  ES
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => changeLanguage('en')}
                className={`px-2 py-1 rounded ${
                  language === 'en' ? 'bg-blue-600 dark:bg-blue-500' : ''
                }`}
              >
                <Text
                  className={`text-xs font-medium ${
                    language === 'en' ? 'text-white' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  EN
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={onShowDocumentation}
              className="bg-slate-100 dark:bg-slate-700 px-3 py-2 rounded-lg min-w-[80px] items-center justify-center"
            >
              <Text className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                {t.dashboard.help}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="mb-6">
          <Text className="text-slate-500 dark:text-slate-400 text-sm">
            {t.dashboard.lastUpdate}{' '}
            {rates?.last_update
              ? new Date(rates.last_update).toLocaleTimeString()
              : t.dashboard.never}
          </Text>
          {lastRefreshAt && (
            <Text className="text-slate-400 dark:text-slate-500 text-xs mt-1">
              {t.dashboard.nextAutoRefresh} {formatNextRefreshTime(lastRefreshAt)}
            </Text>
          )}
        </View>

        {/* Show warning banner if error occurred but cached data exists */}
        {error && rates && (
          <View className="bg-yellow-100 dark:bg-yellow-900/30 rounded-lg p-3 mb-4 border border-yellow-300 dark:border-yellow-700">
            <Text className="text-yellow-800 dark:text-yellow-200 text-sm font-medium">
              {t.dashboard.usingCachedData}
            </Text>
            <Text className="text-yellow-700 dark:text-yellow-300 text-xs mt-1">
              {t.dashboard.refreshFailed} {error.message}. {t.dashboard.pullDownToRetry}
            </Text>
          </View>
        )}

        <View className="gap-4 mb-4">
          <View className="flex-row gap-4">
            <RateCard
              label={t.dashboard.bcvRate}
              value={rates?.bcv ?? 0}
              currency="VES"
              className="flex-1"
            />
            <RateCard
              label={t.dashboard.binanceRate}
              value={rates?.binance ?? 0}
              currency="VES"
              className="flex-1"
              amountUsed={rates?.binanceAmountUsed}
              amountUsedLabel={t.dashboard.amountUsed}
            />
          </View>

          <GapIndicator
            value={displayValue}
            mode={displayMode}
            recommendation={rates?.recommendation ?? 'NEUTRAL'}
            language={language}
          />

          <ModeSelector
            selectedMode={displayMode}
            onModeChange={handleModeChange}
            language={language}
          />

          <WidgetPreview rates={rates} language={language} />
        </View>
      </View>
    </ScrollView>
  );
}
