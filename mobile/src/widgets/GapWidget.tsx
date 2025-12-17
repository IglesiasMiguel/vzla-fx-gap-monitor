import { getLastRates } from '@/utils/storage';
import { FlexWidget, TextWidget, type WidgetTaskHandler } from 'react-native-android-widget';

/**
 * Android widget task handler.
 *
 * Note: Widgets can't be tested in Expo Go. This is meant for EAS/standalone builds.
 * The widget reads the last saved snapshot and never performs network calls.
 */
export const GapWidget: WidgetTaskHandler = async ({ renderWidget }) => {
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
        flexDirection: 'column',
        padding: 16,
        backgroundColor: '#ffffff',
        borderRadius: 16,
      }}
    >
      <TextWidget
        text="Vzla FX Monitor"
        style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}
      />

      <FlexWidget style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <FlexWidget style={{ flexDirection: 'column' }}>
          <TextWidget text="BCV" style={{ fontSize: 10, color: '#94a3b8' }} />
          <TextWidget
            text={bcvText}
            style={{ fontSize: 18, fontWeight: '700', color: '#0f172a' }}
          />
        </FlexWidget>

        <FlexWidget style={{ flexDirection: 'column', alignItems: 'center' }}>
          <TextWidget text="Binance" style={{ fontSize: 10, color: '#94a3b8' }} />
          <TextWidget
            text={binanceText}
            style={{ fontSize: 18, fontWeight: '700', color: '#0f172a' }}
          />
        </FlexWidget>

        <FlexWidget style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
          <TextWidget text="Gap" style={{ fontSize: 10, color: '#94a3b8' }} />
          <TextWidget
            text={gapText}
            style={{ fontSize: 18, fontWeight: '700', color: getGapColor() }}
          />
        </FlexWidget>
      </FlexWidget>

      {!rates && (
        <TextWidget
          text="No data available. Open the app to fetch rates."
          style={{ fontSize: 10, color: '#94a3b8', marginTop: 8, textAlign: 'center' }}
        />
      )}
    </FlexWidget>
  );
};
