import { AppSettings } from '../types';
import { APP_SUBHEADING } from '../data/initialBooks';

const SETTINGS_KEY = 'the_recipe_vault_settings_v1';

const DEFAULT_SETTINGS: AppSettings = {
  appName: 'The Recipe Vault Co.',
  subHeading: APP_SUBHEADING,
  paypalClientId: 'test',
  paypalMode: 'sandbox',
  storageProvider: 'cloudflare-r2', // Cloudflare R2: 10GB free + $0 egress bandwidth
  r2AccountId: '',
  r2AccessKeyId: '',
  r2SecretAccessKey: '',
  r2BucketName: 'recipe-vault-books',
  r2PublicUrl: '',
  supabaseUrl: '',
  supabaseAnonKey: '',
  supabaseBucket: 'recipe-vault-pdfs',
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

