/* eslint-env node */
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', 'nativewind/babel'],
    // IMPORTANT:
    // With NativeWind v4 (css-interop), do NOT put `nativewind/babel` under `plugins`.
    // Also, for Reanimated v4, css-interop already handles the needed worklets plugin.
    plugins: [],
  };
};
