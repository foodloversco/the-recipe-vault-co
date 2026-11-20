import type { CapacitorConfig } from '@capacitor/cli';

const liveVercelUrl = process.env.VITE_VERCEL_URL?.trim();

const config: CapacitorConfig = {
  appId: 'com.therecipevault.app',
  appName: 'The Recipe Vault Co.',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: false,
    ...(liveVercelUrl ? { url: liveVercelUrl } : {}),
  },
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#100f0e',
      overlaysWebView: false,
    },
    SplashScreen: {
      launchShowDuration: 1800,
      launchAutoHide: true,
      backgroundColor: '#100f0e',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
  },
};

export default config;
