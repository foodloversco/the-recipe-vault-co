import { Capacitor } from '@capacitor/core';
import { settingsStore } from './settingsStore';

export interface HybridSyncStatus {
  isOnline: boolean;
  mode: 'both' | 'cloud-only' | 'offline-only';
  vercelLiveUrl: string;
  isNativeCapacitor: boolean;
}

export interface HybridSyncResult {
  synced: boolean;
  reason: 'offline-fallback' | 'no-url-configured' | 'already-on-live' | 'not-native' | 'redirecting' | 'unreachable';
}

class HybridSyncService {
  /**
   * Returns current connectivity, Capacitor platform, and hybrid sync configuration status.
   */
  public getStatus(): HybridSyncStatus {
    const settings = settingsStore.getSettings();
    const isNativeCapacitor =
      Capacitor.isNativePlatform() ||
      window.location.protocol === 'capacitor:' ||
      (window.location.hostname === 'localhost' && !window.location.port);

    return {
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      mode: settings.hybridUpdateMode || 'both',
      vercelLiveUrl: (settings.vercelLiveUrl || '').trim(),
      isNativeCapacitor,
    };
  }

  /**
   * Mode A + Mode B Hybrid Check:
   * When running inside the native APK on bundled assets and online, checks if the configured
   * live Vercel URL is reachable within 2.5s. If reachable, loads the live Vercel deployment;
   * if offline or unreachable, silently remains on the bundled offline APK assets.
   */
  public async checkAndSyncLiveUpdate(): Promise<HybridSyncResult> {
    const status = this.getStatus();

    if (status.mode === 'offline-only' || !status.isOnline) {
      console.info('[HybridSync] Offline / local bundle mode active.');
      return { synced: false, reason: 'offline-fallback' };
    }

    if (!status.vercelLiveUrl || !status.vercelLiveUrl.startsWith('https://')) {
      return { synced: false, reason: 'no-url-configured' };
    }

    let targetOrigin = '';
    try {
      targetOrigin = new URL(status.vercelLiveUrl).origin;
    } catch {
      return { synced: false, reason: 'no-url-configured' };
    }

    if (window.location.origin === targetOrigin) {
      return { synced: false, reason: 'already-on-live' };
    }

    if (!status.isNativeCapacitor) {
      return { synced: false, reason: 'not-native' };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    try {
      const normalizedUrl = status.vercelLiveUrl.replace(/\/+$/, '');
      await fetch(`${normalizedUrl}/index.html`, {
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-store',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.info('[HybridSync] Live Vercel deploy reachable — syncing to:', normalizedUrl);
      window.location.replace(normalizedUrl);
      return { synced: true, reason: 'redirecting' };
    } catch {
      clearTimeout(timeoutId);
      console.info('[HybridSync] Live Vercel deploy unreachable — continuing with offline APK bundle.');
      return { synced: false, reason: 'unreachable' };
    }
  }
}

export const hybridSyncService = new HybridSyncService();
