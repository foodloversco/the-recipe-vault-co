import { AppSettings } from '../types';
import { APP_SUBHEADING } from '../data/initialBooks';

const SETTINGS_KEY = 'the_recipe_vault_settings_v1';

const DEFAULT_SETTINGS: AppSettings = {
  appName: 'The Recipe Vault Co.',
  subHeading: APP_SUBHEADING,
  paypalClientId: 'test',
  paypalMode: 'sandbox',
  storageProvider: 'cloudflare-r2', // Cloudflare R2: 10GB free + $0 egress bandwidth
  r2AccountId: '96919865db5f5c66d503f8cbe3abc1b5',
  r2AccessKeyId: '8391e9775eb64f2aa6c6d5996df49c19',
  r2SecretAccessKey: 'ee1b1f65dd2ca9fdfeafa753bb5cd3c23b7a269a350a51886f4fd3fcc300b639',
  r2BucketName: 'recipe-vault-books',
  r2PublicUrl: 'https://pub-152f26d662d94267bac96bce4bdcd35b.r2.dev',
  supabaseUrl: '',
  supabaseAnonKey: '',
  supabaseBucket: 'recipe-vault-pdfs',
  vercelLiveUrl: (import.meta as any).env?.VITE_VERCEL_URL || 'https://the-recipe-vault-co.vercel.app',
  hybridUpdateMode: 'both',
};

class SettingsStore {
  private settings: AppSettings = { ...DEFAULT_SETTINGS };

  constructor() {
    this.init();
  }

  private init() {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to load settings:', e);
    }
  }

  public getSettings(): AppSettings {
    return { ...this.settings };
  }

  public updateSettings(newSettings: Partial<AppSettings>): AppSettings {
    this.settings = { ...this.settings, ...newSettings };
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
    return this.settings;
  }
}

export const settingsStore = new SettingsStore();

