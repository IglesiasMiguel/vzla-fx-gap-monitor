import { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { useRates } from '@/hooks/useRates';
import { RateCard } from './RateCard';
import { GapIndicator } from './GapIndicator';
import { ModeSelector } from './ModeSelector';
import { WidgetPreview } from './WidgetPreview';
import { getDisplayMode, saveDisplayMode, getLastRefreshAt } from '@/utils/storage';
import { DisplayMode } from '@/types';

const THIRTY_MINUTES_MS = 30 * 60 * 1000;

function formatNextRefreshTime(lastRefreshAt: number | null): string {
  if (!lastRefreshAt) return 'Now';
  const nextRefresh = lastRefreshAt + THIRTY_MINUTES_MS;
  const now = Date.now();
  const diffMs = nextRefresh - now;

  if (diffMs <= 0) return 'Now';

  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'Less than a minute';
  return `In ${minutes} minute${minutes !== 1 ? 's' : ''}`;
}

export function DashboardScreen() {
  const { data: rates, isLoading, error, refetch, isRefetching } = useRates();
  const [displayMode, setDisplayMode] = useState<DisplayMode>('purchasing_power');
  const [lastRefreshAt, setLastRefreshAt] = useState<number | null>(null);
  const [hasCachedData, setHasCachedData] = useState(false);

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
    await refetch({ throwOnError: false });
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
        <Text className="text-slate-600 dark:text-slate-400 mt-4">Loading rates...</Text>
      </View>
    );
  }

  // Show error only if no cached data exists
  if (error && !rates) {
    return (
      <View className="flex-1 bg-slate-50 dark:bg-slate-900 items-center justify-center p-6">
        <Text className="text-red-600 dark:text-red-400 text-lg font-semibold mb-2">
          Connection Error
        </Text>
        <Text className="text-slate-600 dark:text-slate-400 text-center mb-4">
          Failed to fetch rates. Please check the logs, Miguel.
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
        <Text className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
          Vzla FX Monitor
        </Text>
        <View className="mb-6">
          <Text className="text-slate-500 dark:text-slate-400 text-sm">
            Last update:{' '}
            {rates?.last_update ? new Date(rates.last_update).toLocaleTimeString() : 'Never'}
          </Text>
          {lastRefreshAt && (
            <Text className="text-slate-400 dark:text-slate-500 text-xs mt-1">
              Next auto refresh: {formatNextRefreshTime(lastRefreshAt)}
            </Text>
          )}
        </View>

        {/* Show warning banner if error occurred but cached data exists */}
        {error && rates && (
          <View className="bg-yellow-100 dark:bg-yellow-900/30 rounded-lg p-3 mb-4 border border-yellow-300 dark:border-yellow-700">
            <Text className="text-yellow-800 dark:text-yellow-200 text-sm font-medium">
              Using cached data
            </Text>
            <Text className="text-yellow-700 dark:text-yellow-300 text-xs mt-1">
              Refresh failed: {error.message}. Pull down to retry.
            </Text>
          </View>
        )}

        <View className="gap-4 mb-4">
          <View className="flex-row gap-4">
            <RateCard label="BCV Rate" value={rates?.bcv ?? 0} currency="VES" className="flex-1" />
            <RateCard
              label="Binance Rate"
              value={rates?.binance ?? 0}
              currency="VES"
              className="flex-1"
            />
          </View>

          <GapIndicator
            value={displayValue}
            mode={displayMode}
            recommendation={rates?.recommendation ?? 'NEUTRAL'}
          />

          <ModeSelector selectedMode={displayMode} onModeChange={handleModeChange} />

          <WidgetPreview rates={rates} />
        </View>
      </View>
    </ScrollView>
  );
}
