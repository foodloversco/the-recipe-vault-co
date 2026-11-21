import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.therecipevault.app',
  appName: 'The Recipe Vault Co.',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: false,
    url: 'https://the-recipe-vault-co-six.vercel.app',
  },
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#100f0e',
      overlaysWebView: false,
    },
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: true,
      backgroundColor: '#100f0e',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
  },
};

export default config;
