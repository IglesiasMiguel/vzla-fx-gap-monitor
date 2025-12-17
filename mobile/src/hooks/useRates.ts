import { useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchRates } from '@/services/api';
import { saveLastRates, getLastRates, getLastRefreshAt, shouldRefresh } from '@/utils/storage';
import { RatesResponse } from '@/types';

const THIRTY_MINUTES_MS = 30 * 60 * 1000;

export function useRates() {
  const queryClient = useQueryClient();
  const manualRefreshRef = useRef(false);

  const query = useQuery<RatesResponse, Error>({
    queryKey: ['rates'],
    queryFn: async () => {
      const now = Date.now();
      const lastRefreshAt = await getLastRefreshAt();
      const snapshot = await getLastRates();

      // If manual refresh was triggered, always fetch
      if (manualRefreshRef.current) {
        manualRefreshRef.current = false;
        const rates = await fetchRates();
        await saveLastRates(rates);
        return rates;
      }

      // If data is still fresh (< 30 min), return cached snapshot
      if (snapshot && lastRefreshAt && !shouldRefresh(lastRefreshAt, now)) {
        return snapshot;
      }

      // Otherwise, fetch fresh data
      const rates = await fetchRates();
      await saveLastRates(rates);
      return rates;
    },
    // Refetch every 30 minutes while app is in foreground
    refetchInterval: THIRTY_MINUTES_MS,
    refetchIntervalInBackground: false,
    // Treat data as fresh for 30 minutes
    staleTime: THIRTY_MINUTES_MS,
    gcTime: 24 * 60 * 60 * 1000, // Keep cache for 24 hours
    // Avoid aggressive retries to prevent hitting Binance too often
    retry: 0,
    // Use cached data as placeholder for instant display
    placeholderData: async () => {
      return await getLastRates();
    },
    placeholderDataUpdatedAt: async () => {
      const lastRefreshAt = await getLastRefreshAt();
      return lastRefreshAt || 0;
    },
  });

  // Override refetch to support manual refresh
  const originalRefetch = query.refetch;
  const manualRefetch = async () => {
    manualRefreshRef.current = true;
    // Invalidate to force refetch regardless of staleTime
    await queryClient.invalidateQueries({ queryKey: ['rates'] });
    return originalRefetch();
  };

  return {
    ...query,
    refetch: manualRefetch,
  };
}
