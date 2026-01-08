import { getLastRates, saveLastRates } from '@/utils/storage';
import { fetchRates } from '@/services/api';
import { FlexWidget, TextWidget, type WidgetTaskHandler } from 'react-native-android-widget';

/**
 * Android widget task handler.
 *
 * Note: Widgets can't be tested in Expo Go. This is meant for EAS/standalone builds.
 * The widget reads the last saved snapshot and never performs network calls.
 */
export const GapWidget: WidgetTaskHandler = async ({ renderWidget, clickAction }) => {
  if (clickAction === 'REFRESH') {
    try {
      const newRates = await fetchRates();
      await saveLastRates(newRates);
    } catch (error) {
      // Fail silently or log if possible, but keep old data
      // console.error('Widget refresh failed', error);
    }
  }

  const rates = await getLastRates();

  const bcvText = rates ? rates.bcv.toFixed(2) : '--';
  const binanceText = rates ? rates.binance.toFixed(2) : '--';
  const gapText = rates ? `${rates.purchasing_power.toFixed(1)}%` : '--%';

  // Color coding based on recommendation
  const getGapColor = () => {
    if (!rates) return '#64748b'; // Gray for no data
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
        padding: 8,
        borderRadius: 16,
      }}
      clickAction="REFRESH"
    >
      <TextWidget
        text="Vzla FX Monitor"
        style={{ fontSize: 10, color: '#64748b', marginBottom: 4 }}
      />

      <FlexWidget style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <FlexWidget style={{ flexDirection: 'column' }}>
          <TextWidget text="BCV" style={{ fontSize: 9, color: '#94a3b8' }} />
          <TextWidget
            text={bcvText}
            style={{ fontSize: 14, fontWeight: '700', color: '#0f172a' }}
          />
        </FlexWidget>

        <FlexWidget style={{ flexDirection: 'column', alignItems: 'center' }}>
          <TextWidget text="Binance" style={{ fontSize: 9, color: '#94a3b8' }} />
          <TextWidget
            text={binanceText}
            style={{ fontSize: 14, fontWeight: '700', color: '#0f172a' }}
          />
        </FlexWidget>

        <FlexWidget style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
          <TextWidget text="Gap" style={{ fontSize: 9, color: '#94a3b8' }} />
          <TextWidget
            text={gapText}
            style={{ fontSize: 14, fontWeight: '700', color: getGapColor() }}
          />
        </FlexWidget>
      </FlexWidget>

      {!rates && (
        <TextWidget
          text="No data available. Open the app to fetch rates."
          style={{ fontSize: 9, color: '#94a3b8', marginTop: 4, textAlign: 'center' }}
        />
      )}
    </FlexWidget>
  );
};
