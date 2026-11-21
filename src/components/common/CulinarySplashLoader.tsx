import React, { useEffect, useState } from 'react';
import { SplashScreen } from '@capacitor/splash-screen';

/**
 * In-app Culinary Montage Splash Loader.
 * Mirrors the native Android composite splash (3-panel darkened culinary collage + circular crest)
 * and coordinates with Capacitor's SplashScreen.hide() for a seamless launch transition.
 */
export const CulinarySplashLoader: React.FC = () => {
  const [progressWidth, setProgressWidth] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const [unmounted, setUnmounted] = useState(false);

  useEffect(() => {
    // Hand off cleanly from native OS splash screen into the webview montage
    SplashScreen.hide().catch(() => {
      // Ignored when running in a standard desktop/mobile browser
    });

    const raf = requestAnimationFrame(() => {
      setProgressWidth(true);
    });

    // 3-second display requested by user before smooth fadeout
    const fadeTimer = setTimeout(() => {
      setFadingOut(true);
    }, 2800);

    const unmountTimer = setTimeout(() => {
      setUnmounted(true);
    }, 3500);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (unmounted) return null;

  return (
    <div
      aria-hidden={fadingOut}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#100f0e] overflow-hidden select-none transition-opacity duration-700 ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background 3-Panel Culinary Photography Collage */}
      <div className="absolute inset-0 grid grid-rows-[58%_42%] grid-cols-2">
        <div className="col-span-2 relative overflow-hidden border-b border-[#cf7b3e]/30">
          <img
            src="/assets/images/realistic_culinary_food_photography_of_a_thick_cut_grilled_beef_rump_steak.png"
            alt=""
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="relative overflow-hidden border-r border-[#cf7b3e]/30">
          <img
            src="/assets/images/karoo_lamb_chops.png"
            alt=""
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="relative overflow-hidden">
          <img
            src="/assets/images/recipe-card-sample.png"
            alt=""
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>

      {/* Dark Charcoal Smoky Vignette Overlay */}
      <div
        className="absolute inset-0 bg-[#100f0e]/80"
        style={{
          backgroundImage:
            'radial-gradient(circle at center, rgba(16,15,14,0.65) 0%, rgba(16,15,14,0.88) 70%, rgba(10,9,8,0.96) 100%)',
        }}
      />

      {/* Luxury Inset Border Frame */}
      <div className="absolute inset-3 sm:inset-5 border border-[#cf7b3e]/35 pointer-events-none" />

      {/* Center Circular Heritage Medallion Crest & Title */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <div className="p-1.5 rounded-full bg-[#0a0908]/90 shadow-[0_0_50px_rgba(207,123,62,0.35)]">
          <div className="w-40 h-40 sm:w-48 sm:h-48 overflow-hidden rounded-full border-2 border-[#dea374]/80 bg-[#100f0e]">
            <img
              src="/assets/images/logo.png"
              alt="The Recipe Vault Co."
              className="w-full h-full rounded-full object-cover scale-[1.18]"
            />
          </div>
        </div>

        <h1
          className="mt-6 text-lg sm:text-xl font-bold tracking-[0.25em] text-[#dea374] uppercase"
          style={{ fontFamily: "'Cinzel', Georgia, serif" }}
        >
          THE RECIPE VAULT CO.
        </h1>

        <p className="mt-1.5 text-[10px] sm:text-xs tracking-[0.28em] text-[#c4bcae]/80 uppercase">
          HERITAGE CULINARY COLLECTION • EST.
        </p>

        {/* Animated Gold Progress Bar (Smooth 2.8s Fill) */}
        <div className="mt-6 w-48 sm:w-56 h-[2px] bg-[#2a241e] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#b8612b] via-[#dea374] to-[#ffd700] transition-all duration-[2800ms] ease-out"
            style={{ width: progressWidth ? '100%' : '0%' }}
          />
        </div>
      </div>
    </div>
  );
};
