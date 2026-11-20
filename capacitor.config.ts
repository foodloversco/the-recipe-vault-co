import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.therecipevault.app',
  appName: 'The Recipe Vault Co.',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;

