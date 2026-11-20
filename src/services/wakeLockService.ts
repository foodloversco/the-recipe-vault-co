// Screen Wake Lock Service: Prevents mobile screen from dimming/sleeping while cooking
class WakeLockService {
  private sentinel: any = null;
  private isRequested: boolean = false;
  private listeners: Set<(active: boolean) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      // Re-request wake lock when document becomes visible again (e.g. returning to reader)
      document.addEventListener('visibilitychange', async () => {
        if (this.isRequested && document.visibilityState === 'visible') {
          await this.acquire();
        }
      });
    }
  }

  public isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'wakeLock' in navigator;
  }

  public isActive(): boolean {
    return this.sentinel !== null && !this.sentinel.released;
  }

  public async acquire(): Promise<boolean> {
    this.isRequested = true;
    if (!this.isSupported()) {
      this.notify();
      return false;
    }
    try {
      if (this.sentinel && !this.sentinel.released) {
        this.notify();
        return true;
      }
      this.sentinel = await (navigator as any).wakeLock.request('screen');
      this.sentinel.addEventListener('release', () => {
        this.notify();
      });
      this.notify();
      return true;
    } catch (err) {
      console.warn('WakeLock request failed:', err);
      this.notify();
      return false;
    }
  }

  public async release(): Promise<void> {
    this.isRequested = false;
    if (this.sentinel) {
      try {
        await this.sentinel.release();
      } catch {}
      this.sentinel = null;
    }
    this.notify();
  }

  public async toggle(): Promise<boolean> {
    if (this.isActive()) {
      await this.release();
      return false;
    } else {
      return await this.acquire();
    }
  }

  public subscribe(listener: (active: boolean) => void): () => void {
    this.listeners.add(listener);
    listener(this.isActive());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const active = this.isActive();
    this.listeners.forEach((l) => {
      try {
        l(active);
      } catch (err) {
        console.error('Error in wakeLock listener:', err);
      }
    });
  }
}

export const wakeLockService = new WakeLockService();
