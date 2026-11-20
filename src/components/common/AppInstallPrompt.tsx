import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles, Check, Share, ShieldCheck } from 'lucide-react';

export const AppInstallPrompt: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Check if running inside standalone Capacitor native app
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    ) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // 10-Second Timer requested by user: triggers prompt after 10 seconds of browsing
    const timer = setTimeout(() => {
      const dismissed = sessionStorage.getItem('apk_install_dismissed_v1');
      if (!dismissed) {
        setIsVisible(true);
      }
    }, 10000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('apk_install_dismissed_v1', 'true');
  };

  if (!isVisible || isInstalled) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-5 pointer-events-none animate-in fade-in slide-in-from-bottom duration-500">
      <div className="max-w-md mx-auto bg-[#181512]/95 backdrop-blur-xl border border-[#cf7b3e]/40 rounded-2xl shadow-2xl p-4 sm:p-5 pointer-events-auto text-white relative ring-1 ring-white/10">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1.5 rounded-full text-[#9c9388] hover:text-white bg-[#251f1a] hover:bg-[#332b23] transition-colors"
          aria-label="Dismiss app download prompt"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with App Logo */}
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

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#dea374] bg-[#cf7b3e]/20 px-2 py-0.5 rounded-full border border-[#cf7b3e]/30">
                CAPACITOR ANDROID APP
              </span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                <Sparkles className="w-3 h-3" /> Offline Ready
              </span>
            </div>

            <h3 className="font-serif font-bold text-sm sm:text-base text-white leading-tight">
              Download The Recipe Vault Co. APK
            </h3>
            <p className="text-xs text-[#cbc3b6] mt-1 leading-snug">
              Download the official Android App file (.apk) directly to your phone for offline cooking, kitchen timers &amp; screen wake lock!
            </p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-2 gap-2 my-3 text-[11px] text-[#aaa195] border-t border-[#2b241c] pt-2.5">
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>Direct APK installation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>Screen WakeLock active</span>
          </div>
        </div>

        {/* iOS Notice (if user is on Apple iPhone) */}
        {isIOS ? (
          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-[#221c17] border border-amber-500/30 text-xs text-[#d1c7ba]">
              <p className="font-bold text-amber-300 flex items-center gap-1.5">
                <Share className="w-4 h-4 text-amber-400" /> iPhone / iPad user?
              </p>
              <p className="text-[11px] text-[#b8b0a5] mt-1">
                Tap <strong>Share ⎋</strong> in Safari &rarr; <strong>"Add to Home Screen"</strong> for instant offline app access!
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="w-full py-2.5 rounded-xl bg-[#26201a] hover:bg-[#322a22] text-[#c2bcaf] font-semibold text-xs"
            >
              Close
            </button>
          </div>
        ) : (
          /* Android Direct APK Download Button */
          <div className="flex items-center gap-2 pt-1">
            <a
              href="https://pub-152f26d662d94267bac96bce4bdcd35b.r2.dev/apps/The_Recipe_Vault_Co.apk"
              download="The_Recipe_Vault_Co.apk"
              onClick={handleDismiss}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#cf7b3e] to-[#b8612b] hover:brightness-110 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#cf7b3e]/30 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Android APK (.apk)</span>
            </a>

            <button
              onClick={handleDismiss}
              className="py-2.5 px-3 rounded-xl bg-[#241f1a] hover:bg-[#322a22] text-[#9c9388] hover:text-white font-medium text-xs transition-colors"
            >
              Later
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
