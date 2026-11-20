import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface StorageConfig {
  provider: 'cloudflare-r2' | 'supabase' | 'browser';
  // Cloudflare R2 (100% Free Zero Egress Bandwidth)
  r2AccountId?: string;
  r2AccessKeyId?: string;
  r2SecretAccessKey?: string;
  r2BucketName?: string;
  r2PublicUrl?: string; // e.g. https://pub-xxxxxx.r2.dev
  // Supabase
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  supabaseBucket?: string;
}

const STORAGE_CONFIG_KEY = 'the_recipe_vault_storage_config_v2';

export class StorageService {
  private config: StorageConfig;
  private s3Client: S3Client | null = null;
  private supabase: SupabaseClient | null = null;

  constructor() {
    this.config = this.loadConfig();
    this.initClients();
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
      provider: 'cloudflare-r2',
      r2AccountId: '96919865db5f5c66d503f8cbe3abc1b5',
      r2BucketName: 'recipe-vault-books',
      r2PublicUrl: 'https://pub-152f26d662d94267bac96bce4bdcd35b.r2.dev',
    };
  }

  public saveConfig(config: StorageConfig) {
    this.config = config;
    localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(config));
    this.initClients();
  }

  private initClients() {
    // 1. Initialize Cloudflare R2 (S3 API with 0 Egress)
    if (
      this.config.r2AccountId &&
      this.config.r2AccessKeyId &&
      this.config.r2SecretAccessKey
    ) {
      try {
        this.s3Client = new S3Client({
          region: 'auto',
          endpoint: `https://${this.config.r2AccountId}.r2.cloudflarestorage.com`,
          credentials: {
            accessKeyId: this.config.r2AccessKeyId,
            secretAccessKey: this.config.r2SecretAccessKey,
          },
        });
      } catch (err) {
        console.error('Failed to init Cloudflare R2 client:', err);
        this.s3Client = null;
      }
    } else {
      this.s3Client = null;
    }

    // 2. Initialize Supabase if selected
    if (this.config.supabaseUrl && this.config.supabaseAnonKey) {
      try {
        this.supabase = createClient(this.config.supabaseUrl, this.config.supabaseAnonKey);
      } catch (err) {
        console.error('Failed to init Supabase client:', err);
        this.supabase = null;
      }
    } else {
      this.supabase = null;
    }
  }

  /**
   * Upload PDF using Cloudflare R2, Supabase, or device storage
   */
  public async uploadPdfFile(
    file: File,
    folder: string = 'books'
  ): Promise<{ url: string; size: string; name: string }> {
    const formattedSize = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    const cleanFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const objectKey = `${folder}/${cleanFileName}`;

    // 1. Primary: Cloudflare R2 (10GB Free Storage + UNLIMITED $0 Egress Bandwidth)
    if (this.s3Client && this.config.r2BucketName) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const command = new PutObjectCommand({
          Bucket: this.config.r2BucketName,
          Key: objectKey,
          Body: new Uint8Array(arrayBuffer),
          ContentType: 'application/pdf',
        });

        await this.s3Client.send(command);

        // Compute Public URL
        const publicBase = this.config.r2PublicUrl
          ? this.config.r2PublicUrl.replace(/\/$/, '')
          : `https://${this.config.r2BucketName}.${this.config.r2AccountId}.r2.dev`;

        const publicUrl = `${publicBase}/${objectKey}`;

        // Cache on local phone / device so repeated opens cost 0 network requests
        await this.cacheOnDevice(publicUrl, file);

        return {
          url: publicUrl,
          size: formattedSize,
          name: file.name,
        };
      } catch (err) {
        console.error('Cloudflare R2 upload error, falling back:', err);
      }
    }

    // 2. Supabase Storage Fallback
    if (this.supabase && this.config.supabaseUrl) {
      try {
        const bucket = this.config.supabaseBucket || 'recipe-vault-pdfs';
        const { data, error } = await this.supabase.storage
          .from(bucket)
          .upload(objectKey, file, { cacheControl: '3600', upsert: false });

        if (!error && data) {
          const { data: publicData } = this.supabase.storage.from(bucket).getPublicUrl(objectKey);
          return {
            url: publicData.publicUrl,
            size: formattedSize,
            name: file.name,
          };
        }
      } catch (err) {
        console.warn('Supabase fallback failed:', err);
      }
    }

    // 3. Device / Browser Local Fallback (100% Free, Zero Sign-up)
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Url = reader.result as string;
        await this.cacheOnDevice(cleanFileName, file);
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

  /**
   * Phone & Browser Cache: Saves downloaded books directly into device CacheStorage
   * Ensures 1,000+ visitors consume 0 repeated bandwidth!
   */
  public async cacheOnDevice(cacheKey: string, fileOrBlob: Blob): Promise<void> {
    if ('caches' in window) {
      try {
        const cache = await caches.open('recipe-vault-device-cache-v1');
        const response = new Response(fileOrBlob, {
          headers: {
            'Content-Type': 'application/pdf',
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
        await cache.put(cacheKey, response);
      } catch (e) {
        console.warn('Device cache storage warning:', e);
      }
    }
  }

  public getConfig(): StorageConfig {
    return { ...this.config };
  }
}

export const storageService = new StorageService();
