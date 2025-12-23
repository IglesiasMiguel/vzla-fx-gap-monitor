import { registerRootComponent } from 'expo';
import './global.css';
import App from './App';
// Widgets cannot run in Expo Go. This is guarded so the app can boot in Expo Go.
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { registerWidgetTaskHandler } = require('react-native-android-widget');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { GapWidget, PurchasingPowerWidget } = require('./src/widgets');
  registerWidgetTaskHandler(GapWidget);
  registerWidgetTaskHandler(PurchasingPowerWidget);
} catch {
  // Ignore: running in Expo Go (no native widget runtime)
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
