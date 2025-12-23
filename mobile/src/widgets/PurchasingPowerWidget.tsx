import { getLastRates } from '@/utils/storage';
import { FlexWidget, TextWidget, type WidgetTaskHandler } from 'react-native-android-widget';

/**
 * Android widget task handler - 2x1 widget showing only purchasing power percentage.
 *
 * Note: Widgets can't be tested in Expo Go. This is meant for EAS/standalone builds.
 * The widget reads the last saved snapshot and never performs network calls.
 */
export const PurchasingPowerWidget: WidgetTaskHandler = async ({ renderWidget }) => {
  const rates = await getLastRates();

  const purchasingPowerText = rates ? `${rates.purchasing_power.toFixed(1)}%` : '--%';

  // Color coding based on purchasing power
  const getPurchasingPowerColor = () => {
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
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <TextWidget
        text="Purchasing Power"
        style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}
      />

      <TextWidget
        text={purchasingPowerText}
        style={{
          fontSize: 32,
          fontWeight: '700',
          color: getPurchasingPowerColor(),
        }}
      />

      {!rates && (
        <TextWidget
          text="No data available. Open the app to fetch rates."
          style={{ fontSize: 9, color: '#94a3b8', marginTop: 8, textAlign: 'center' }}
        />
      )}
    </FlexWidget>
  );
};
