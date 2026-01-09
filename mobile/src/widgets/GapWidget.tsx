import { getLastRates, saveLastRates, getLanguage } from '@/utils/storage';
import { fetchRates } from '@/services/api';
import { FlexWidget, TextWidget, type WidgetTaskHandler } from 'react-native-android-widget';

/**
 * Helper function to render the widget UI.
 */
const renderWidgetUI = (
  renderWidget: (widget: React.ReactElement) => void,
  rates: { bcv: number; binance: number; purchasing_power: number } | null,
  label: string,
  isLoading: boolean = false
) => {
  const bcvText = rates ? rates.bcv.toFixed(2) : '--';
  const binanceText = rates ? rates.binance.toFixed(2) : '--';
  const gapText = rates ? `${rates.purchasing_power.toFixed(1)}%` : '--%';

  // Color coding based on recommendation
  const getGapColor = () => {
    if (isLoading) return '#fbbf24'; // Amber for loading
    if (!rates) return '#9ca3af'; // Light gray for no data
    if (rates.purchasing_power < 60) return '#10b981'; // Green for good opportunity
    if (rates.purchasing_power > 90) return '#ef4444'; // Red for caution
    return '#f59e0b'; // Yellow for neutral
  };

  renderWidget(
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        flexDirection: 'column',
        paddingHorizontal: 22,
        justifyContent: 'center',
        borderRadius: 16,
        backgroundColor: '#111827cc',
      }}
      clickAction="REFRESH"
    >
      <FlexWidget
        style={{ flexDirection: 'row', justifyContent: 'space-between', width: 'match_parent' }}
      >
        <FlexWidget style={{ flexDirection: 'column' }}>
          <TextWidget text="BCV" style={{ fontSize: 12, color: '#9ca3af' }} />
          <TextWidget
            text={isLoading ? '...' : bcvText}
            style={{ fontSize: 22, fontWeight: '700', color: '#ffffff' }}
          />
        </FlexWidget>

        <FlexWidget style={{ flexDirection: 'column', alignItems: 'center' }}>
          <TextWidget text="Binance" style={{ fontSize: 12, color: '#9ca3af' }} />
          <TextWidget
            text={isLoading ? '...' : binanceText}
            style={{ fontSize: 22, fontWeight: '700', color: '#ffffff' }}
          />
        </FlexWidget>

        <FlexWidget style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
          <TextWidget text={label} style={{ fontSize: 12, color: '#9ca3af' }} />
          <TextWidget
            text={isLoading ? '...' : gapText}
            style={{ fontSize: 22, fontWeight: '700', color: getGapColor() }}
          />
        </FlexWidget>
      </FlexWidget>

      {!rates && !isLoading && (
        <TextWidget
          text="No data available. Open the app to fetch rates."
          style={{ fontSize: 9, color: '#9ca3af', marginTop: 4, textAlign: 'center' }}
        />
      )}
    </FlexWidget>
  );
};

/**
 * Android widget task handler.
 *
 * Note: Widgets can't be tested in Expo Go. This is meant for EAS/standalone builds.
 * The widget reads the last saved snapshot and never performs network calls.
 */
export const GapWidget: WidgetTaskHandler = async ({ renderWidget, clickAction }) => {
  const currentRates = await getLastRates();
  const language = await getLanguage();
  const label = language === 'es' ? 'Poder' : 'Power';

  if (clickAction === 'REFRESH') {
    // 1. Show loading state immediately
    renderWidgetUI(renderWidget, currentRates, label, true);

    try {
      // 2. Perform fetch
      const newRates = await fetchRates();
      await saveLastRates(newRates);

      // 3. Show success state
      renderWidgetUI(renderWidget, newRates, label, false);
    } catch (error) {
      // 4. On error, revert to old data
      renderWidgetUI(renderWidget, currentRates, label, false);
    }
  } else {
    // Initial load / update
    renderWidgetUI(renderWidget, currentRates, label, false);
  }
};
