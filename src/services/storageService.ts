import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface StorageConfig {
  provider: 'supabase' | 'browser' | 'firebase';
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  bucketName?: string;
}

const STORAGE_CONFIG_KEY = 'the_recipe_vault_storage_config';

export class StorageService {
  private config: StorageConfig;
  private supabase: SupabaseClient | null = null;

  constructor() {
    this.config = this.loadConfig();
    this.initClient();
  }

  public loadConfig(): StorageConfig {
    try {
      const stored = localStorage.getItem(STORAGE_CONFIG_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read storage config:', e);
    }
    return {
      provider: 'browser',
      bucketName: 'recipe-vault-pdfs',
    };
  }

  public saveConfig(config: StorageConfig) {
    this.config = config;
    localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(config));
    this.initClient();
  }

  private initClient() {
    if (this.config.provider === 'supabase' && this.config.supabaseUrl && this.config.supabaseAnonKey) {
      try {
        this.supabase = createClient(this.config.supabaseUrl, this.config.supabaseAnonKey);
      } catch (err) {
        console.error('Failed to init Supabase client:', err);
      }
    } else {
      this.supabase = null;
    }
  }

  public async uploadPdfFile(file: File, folder: string = 'books'): Promise<{ url: string; size: string; name: string }> {
    const formattedSize = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    const cleanFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

    // 1. If Supabase free tier configured
    if (this.supabase && this.config.supabaseUrl) {
      try {
        const bucket = this.config.bucketName || 'recipe-vault-pdfs';
        const filePath = `${folder}/${cleanFileName}`;

        const { data, error } = await this.supabase.storage
          .from(bucket)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) {
          console.warn('Supabase upload error, falling back to local storage:', error);
        } else if (data) {
          const { data: publicData } = this.supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

          return {
            url: publicData.publicUrl,
            size: formattedSize,
            name: file.name,
          };
        }
      } catch (err) {
        console.warn('Supabase upload failed, using local browser fallback', err);
      }
    }

    // 2. Free Browser IndexedDB / Base64 Data URL fallback
    // Zero cost, 100% free, works offline immediately in mobile app & web
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Url = reader.result as string;
        // Save to IndexedDB if large or return data URL
        try {
          const fileRefKey = `vault_file_${cleanFileName}`;
          sessionStorage.setItem(fileRefKey, base64Url.slice(0, 1000)); // preview ref
        } catch {
          // ignore session quota
        }
        resolve({
          url: base64Url,
          size: formattedSize,
          name: file.name,
        });
      };
      reader.onerror = () => reject(new Error('Failed to read PDF file'));
      reader.readAsDataURL(file);
    });
  }

  public getConfig(): StorageConfig {
    return { ...this.config };
  }
}

export const storageService = new StorageService();
