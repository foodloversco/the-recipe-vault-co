import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles, Check, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const AppInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    ) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Capture standard PWA install event (Android Chrome, Edge, Desktop Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 10-Second Timer requested by user: "after 10sec on teh web to downlaod the app"
    const timer = setTimeout(() => {
      const dismissed = sessionStorage.getItem('pwa_install_dismissed_v1');
      if (!dismissed) {
        setIsVisible(true);
      }
    }, 10000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSInstructions(true);
    } else {
      // Direct Chrome / Web fallback
      alert('To install The Recipe Vault Co. on your phone:\n\n1. Tap your browser menu (⋮ or ⎋)\n2. Select "Add to Home Screen" or "Install App"');
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('pwa_install_dismissed_v1', 'true');
  };

  if (!isVisible || isInstalled) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-5 pointer-events-none animate-in fade-in slide-in-from-bottom duration-500">
      <div className="max-w-md mx-auto bg-[#1a1714]/95 backdrop-blur-xl border border-[#cf7b3e]/40 rounded-2xl shadow-2xl p-4 sm:p-5 pointer-events-auto text-white relative ring-1 ring-white/10">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1.5 rounded-full text-[#9c9388] hover:text-white bg-[#26211c] hover:bg-[#342b23] transition-colors"
          aria-label="Dismiss app download prompt"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="flex items-start gap-3.5 pr-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#cf7b3e] to-[#8d471b] p-0.5 shadow-lg flex-shrink-0 flex items-center justify-center">
            <img
              src="/assets/images/logo.png"
              alt="The Recipe Vault Co."
              className="w-full h-full object-contain rounded-lg"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#dea374] bg-[#cf7b3e]/20 px-2 py-0.5 rounded-full border border-[#cf7b3e]/30">
                OFFICIAL APP
              </span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                <Sparkles className="w-3 h-3" /> Offline Ready
              </span>
            </div>

            <h3 className="font-serif font-bold text-sm sm:text-base text-white leading-tight">
              Install The Recipe Vault Co. App
            </h3>
            <p className="text-xs text-[#cbc3b6] mt-1 leading-snug">
              Install to your home screen for full offline recipe cards, screen wake lock &amp; instant 1-tap grocery checklists!
            </p>
          </div>
        </div>

        {/* iOS Step-by-Step Instructions Sheet */}
        {showIOSInstructions && (
          <div className="mt-3 p-3 rounded-xl bg-[#241e18] border border-[#cf7b3e]/30 text-xs text-[#e6ded3] space-y-2 animate-in fade-in">
            <p className="font-bold text-[#dea374] flex items-center gap-1.5">
              <Share className="w-4 h-4 text-[#dea374]" /> How to install on Apple iPhone / iPad:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-[#cfc7bc]">
              <li>Tap the <strong className="text-white">Share</strong> button (box with upward arrow <Share className="w-3 h-3 inline text-white" />) at the bottom of Safari.</li>
              <li>Scroll down and tap <strong className="text-white">"Add to Home Screen"</strong>.</li>
              <li>Tap <strong className="text-emerald-400">"Add"</strong> in the top right corner.</li>
            </ol>
          </div>
        )}

        {/* Quick Feature Perks */}
        <div className="grid grid-cols-2 gap-2 my-3 text-[11px] text-[#aaa195] border-t border-[#2d261e] pt-2.5">
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>Zero App Store login</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>Screen stays awake</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleInstallClick}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#cf7b3e] to-[#b8612b] hover:brightness-110 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#cf7b3e]/30 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{isIOS ? 'Install on iPhone' : 'Download / Install App'}</span>
          </button>

          <button
            onClick={handleDismiss}
            className="py-2.5 px-3 rounded-xl bg-[#25201a] hover:bg-[#322a22] text-[#9c9388] hover:text-white font-medium text-xs transition-colors"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};
