import { getLastRates, saveLastRates } from '@/utils/storage';
import { fetchRates } from '@/services/api';
import { FlexWidget, TextWidget, type WidgetTaskHandler } from 'react-native-android-widget';

/**
 * Android widget task handler - 2x1 widget showing only purchasing power percentage.
 *
 * Note: Widgets can't be tested in Expo Go. This is meant for EAS/standalone builds.
 * The widget reads the last saved snapshot and never performs network calls.
 */
const renderWidgetUI = (
  renderWidget: (widget: React.ReactElement) => void,
  rates: { purchasing_power: number } | null,
  isLoading: boolean = false
) => {
  const purchasingPowerText = rates ? `${rates.purchasing_power.toFixed(1)}%` : '--%';

  // Color coding based on purchasing power
  const getPurchasingPowerColor = () => {
    if (isLoading) return '#fbbf24'; // Amber for loading
    if (!rates) return '#9ca3af'; // Light gray for no data
    if (rates.purchasing_power < 60) return '#10b981'; // Green for good opportunity
    if (rates.purchasing_power > 90) return '#ef4444'; // Red for caution
    return '#f59e0b'; // Yellow for neutral
  };

  const titleText = isLoading ? 'Refreshing...' : 'Purchasing Power';

  renderWidget(
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        flexDirection: 'column',
        padding: 8,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#111827cc',
      }}
      clickAction="REFRESH"
    >
      <TextWidget text={titleText} style={{ fontSize: 10, color: '#d1d5db', marginBottom: 4 }} />

      <TextWidget
        text={isLoading ? '...' : purchasingPowerText}
        style={{
          fontSize: 24,
          fontWeight: '700',
          color: getPurchasingPowerColor(),
        }}
      />

      {!rates && !isLoading && (
        <TextWidget
          text="No data available. Open the app to fetch rates."
          style={{ fontSize: 8, color: '#9ca3af', marginTop: 4, textAlign: 'center' }}
        />
      )}
    </FlexWidget>
  );
};

export const PurchasingPowerWidget: WidgetTaskHandler = async ({ renderWidget, clickAction }) => {
  const currentRates = await getLastRates();

  if (clickAction === 'REFRESH') {
    // 1. Show loading state immediately with current data (if any)
    renderWidgetUI(renderWidget, currentRates, true);

    try {
      // 2. Perform fetch
      const newRates = await fetchRates();
      await saveLastRates(newRates);

      // 3. Show success state with new data
      renderWidgetUI(renderWidget, newRates, false);
    } catch (error) {
      // 4. On error, revert to showing old data (or current state) without loading indicator
      renderWidgetUI(renderWidget, currentRates, false);
    }
  } else {
    // Initial load / resize / update
    renderWidgetUI(renderWidget, currentRates, false);
  }
};
