import AsyncStorage from '@react-native-async-storage/async-storage';
import { RatesResponse } from '@/types';

const STORAGE_KEYS = {
  LAST_RATES: '@vzla_fx_monitor:last_rates',
  LAST_REFRESH_AT: '@vzla_fx_monitor:last_refresh_at',
  DISPLAY_MODE: '@vzla_fx_monitor:display_mode',
} as const;

const THIRTY_MINUTES_MS = 30 * 60 * 1000;

export function shouldRefresh(lastRefreshAt: number | null, now: number): boolean {
  if (!lastRefreshAt) return true;
  return now - lastRefreshAt >= THIRTY_MINUTES_MS;
}

export async function saveLastRates(rates: RatesResponse): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_RATES, JSON.stringify(rates));
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_REFRESH_AT, Date.now().toString());
  } catch (error) {
    console.error('Error saving last rates:', error);
  }
}

export async function getLastRefreshAt(): Promise<number | null> {
  try {
    const timestamp = await AsyncStorage.getItem(STORAGE_KEYS.LAST_REFRESH_AT);
    return timestamp ? Number.parseInt(timestamp, 10) : null;
  } catch (error) {
    console.error('Error getting last refresh timestamp:', error);
    return null;
  }
}

export async function getLastRates(): Promise<RatesResponse | null> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.LAST_RATES);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting last rates:', error);
    return null;
  }
}

export async function saveDisplayMode(mode: 'purchasing_power' | 'gap_spread'): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.DISPLAY_MODE, mode);
  } catch (error) {
    console.error('Error saving display mode:', error);
  }
}

export async function getDisplayMode(): Promise<'purchasing_power' | 'gap_spread'> {
  try {
    const mode = await AsyncStorage.getItem(STORAGE_KEYS.DISPLAY_MODE);
    return (mode as 'purchasing_power' | 'gap_spread') || 'purchasing_power';
  } catch (error) {
    console.error('Error getting display mode:', error);
    return 'purchasing_power';
  }
}
