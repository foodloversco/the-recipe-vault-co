import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import confetti from 'canvas-confetti';
import { salesStore } from '../../services/salesStore';
import { bookStore } from '../../services/bookStore';
import { settingsStore } from '../../services/settingsStore';
import { promoStore } from '../../services/promoStore';
import { PromoCode } from '../../types';
import { currencyStore } from '../../services/currencyStore';
import { telegramService } from '../../services/telegramService';
import { 
  X, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  CreditCard, 
  Lock, 
  Download, 
  BookOpen, 
  FileCheck,
  Tag,
  Check,
  SendHorizontal,
  Smartphone
} from 'lucide-react';

interface CheckoutItem {
  id: string;
  type: 'book' | 'bundle';
  title: string;
  price: number;
  originalPrice?: number;
  priceZAR?: number;
}

interface PayPalCheckoutModalProps {
  item: CheckoutItem;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (token: string) => void;
}

export const PayPalCheckoutModal: React.FC<PayPalCheckoutModalProps> = ({
  item,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [paymentCurrency, setPaymentCurrency] = useState<'USD' | 'ZAR'>(() => currencyStore.getCurrency());
  const [buyerEmail, setBuyerEmail] = useState<string>('');
  const [buyerName, setBuyerName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [purchaseComplete, setPurchaseComplete] = useState<boolean>(false);
  const [generatedToken, setGeneratedToken] = useState<string>('');
  const [useInstantTestPay, setUseInstantTestPay] = useState<boolean>(false);
  const [promoCodeInput, setPromoCodeInput] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoFeedback, setPromoFeedback] = useState<{ text: string; isError: boolean } | null>(null);
  const [showPromoField, setShowPromoField] = useState<boolean>(false);
  const [paymentRefCode] = useState<string>(() => `RV-${Math.random().toString(36).substring(2, 6).toUpperCase()}`);

  if (!isOpen) return null;

  const settings = settingsStore.getSettings();
  const paypalClientId = settings.paypalClientId || 'test';

  const effectivePriceUSD = appliedPromo ? appliedPromo.promoPrice : item.price;
  const effectivePriceZAR = item.priceZAR ?? 20;
  const effectivePrice = paymentCurrency === 'ZAR' ? effectivePriceZAR : effectivePriceUSD;
  const strikethroughPrice = appliedPromo ? appliedPromo.regularPrice : item.originalPrice;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) return;

    const res = promoStore.validateCode(promoCodeInput, item.id);
    if (res.valid && res.promo) {
      setAppliedPromo(res.promo);
      setPromoFeedback({ text: res.message, isError: false });
    } else {
      setPromoFeedback({ text: res.message, isError: true });
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCodeInput('');
    setPromoFeedback(null);
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#cf7b3e', '#dea374', '#ffd700', '#ffffff'],
    });
  };

  const handleCompleteTransaction = (
    orderId: string,
    paypalTxId: string,
    email: string,
    name: string,
    overrideCurrency?: 'USD' | 'ZAR',
    overrideAmount?: number
  ) => {
    const cur = overrideCurrency || paymentCurrency;
    const amt = overrideAmount !== undefined ? overrideAmount : (cur === 'ZAR' ? effectivePriceZAR : effectivePriceUSD);
    const token = `RV-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedToken(token);

    if (appliedPromo) {
      promoStore.incrementUsage(appliedPromo.code);
    }

    // 1. Record sale into sales store
    salesStore.recordSale({
      orderId: orderId,
      paypalTransactionId: paypalTxId,
      buyerEmail: email || 'customer@therecipevault.co',
      buyerName: name || 'Valued Chef',
      itemType: item.type,
      itemId: item.id,
      itemTitle: item.title,
      amount: amt,
      currency: cur,
      status: 'COMPLETED',
      unlockToken: token,
    });

    // 2. Unlock in book store and increment soldCount by +1
    bookStore.unlockItem(item.id, token, true);

    // 3. Real-time Telegram Sales Alert (if configured)
    telegramService.sendSaleNotification({
      itemTitle: item.title,
      amount: amt,
      currency: cur,
      buyerName: name,
      buyerEmail: email,
      unlockToken: token,
      orderId: paypalTxId || orderId
    }).catch((err) => console.warn('Telegram notify error:', err));

    // 4. Celebrate
    triggerCelebration();
    setPurchaseComplete(true);
    setIsProcessing(false);
    onSuccess(token);
  };

  const handleInstantSimulatedCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerEmail) {
      alert('Please enter your email to receive your access token and receipt.');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      const mockOrderId = paymentCurrency === 'ZAR' ? `ZA-EFT-${Date.now().toString().slice(-6)}` : `PP-SIM-${Date.now().toString().slice(-6)}`;
      const mockTxId = `TX-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      handleCompleteTransaction(mockOrderId, mockTxId, buyerEmail, buyerName || 'Gourmet Cook');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#181614] border border-[#383129] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative text-[#f5f2eb]">
        {/* Header */}
        <div className="p-5 border-b border-[#29241e] flex items-center justify-between bg-gradient-to-r from-[#211b15] to-[#181614]">
          <div className="flex items-center gap-2.5">
            <img 
              src="/assets/images/logo.png" 
              alt="The Recipe Vault Co." 
              className="w-8 h-8 rounded-lg object-contain border border-[#cf7b3e]/40" 
            />
            <div>
              <h3 className="font-serif font-bold text-white text-base">
                {purchaseComplete ? 'Purchase Successful!' : 'Secure PayPal Checkout'}
              </h3>
              <p className="text-[11px] text-[#dea374]">
                The Recipe Vault Co. • 100% Instant Delivery
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full text-[#888] hover:text-white hover:bg-[#25201b]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {purchaseComplete ? (
            /* Success State */
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-[11px] uppercase font-bold tracking-widest text-emerald-400">
                  COLLECTION UNLOCKED
                </span>
                <h2 className="font-serif text-xl font-bold text-white mt-1">
                  Ready in your Recipe Vault!
                </h2>
                <p className="text-xs text-[#a8a196] mt-1">
                  You now have complete access to flip through all pages and print cards.
                </p>
              </div>

              {/* Unlock Token Box */}
              <div className="bg-[#241f19] p-3.5 rounded-2xl border border-[#3f3529] text-left">
                <div className="flex items-center justify-between text-xs text-[#a8a196] mb-1">
                  <span>Your Permanent Unlock Token:</span>
                  <span className="text-[10px] text-emerald-400 font-mono">SAVED</span>
                </div>
                <div className="font-mono font-bold text-sm text-[#dea374] bg-[#141210] p-2 rounded-lg border border-[#2d251c] text-center select-all">
                  {generatedToken}
                </div>
                <p className="text-[10px] text-[#857d72] mt-1.5 text-center">
                  A confirmation receipt was sent to {buyerEmail || 'your email'}.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#cf7b3e] to-[#b8612b] text-white font-bold text-sm shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Open Kindle Flip Reader Now</span>
                </button>
              </div>
            </div>
          ) : (
            /* Purchase Flow */
            <div className="space-y-4">
              {/* Currency Selector: USD Global vs South Africa ZAR */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#12100e] rounded-xl border border-[#2b241c]">
                <button
                  type="button"
                  onClick={() => setPaymentCurrency('USD')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    paymentCurrency === 'USD'
                      ? 'bg-[#cf7b3e] text-white shadow-md'
                      : 'text-[#9c9388] hover:text-white'
                  }`}
                >
                  <span>🇺🇸 Global (USD ${effectivePriceUSD.toFixed(2)})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentCurrency('ZAR')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    paymentCurrency === 'ZAR'
                      ? 'bg-emerald-700 text-white shadow-md'
                      : 'text-[#9c9388] hover:text-white'
                  }`}
                >
                  <span>🇿🇦 South Africa (R{effectivePriceZAR} ZAR)</span>
                </button>
              </div>

              {/* Item Summary Box */}
              <div className="bg-[#211b15] p-3.5 rounded-2xl border border-[#352c22] flex items-center justify-between">
                <div className="max-w-[65%]">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#dea374]">
                    {item.type === 'bundle' ? '3-BOOK BUNDLE' : 'DIGITAL RECIPE PACK'}
                  </span>
                  <h4 className="font-serif font-bold text-white text-sm truncate">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-[#9c9388]">30 Phone-Ready Cards + Grocery Checklists</p>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline justify-end gap-1.5">
                    {paymentCurrency === 'USD' && strikethroughPrice && (
                      <span className="text-sm line-through text-[#8e8578] font-semibold">
                        ${strikethroughPrice.toFixed(2)}
                      </span>
                    )}
                    <div className="text-2xl font-extrabold text-white">
                      {paymentCurrency === 'ZAR' ? `R${effectivePriceZAR}` : `$${effectivePriceUSD.toFixed(2)}`}
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-[10px] text-[#dea374] font-semibold">
                      {paymentCurrency}
                    </span>
                    {paymentCurrency === 'USD' && appliedPromo && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                        PROMO
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* South African SARB Guidance Note */}
              {paymentCurrency === 'ZAR' && (
                <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-3 text-[11px] text-emerald-200/90 leading-snug">
                  <strong className="text-emerald-300 block mb-0.5 font-semibold">
                    🇿🇦 Local South African Checkout (SARB Compliant)
                  </strong>
                  Per SARB regulations, domestic South African buyers pay directly via local Debit/Credit Card or Instant EFT in ZAR — no foreign currency fees or domestic PayPal blocks!
                </div>
              )}

              {/* Promo Code Input Section */}
              <div className="bg-[#1b1714] p-3 rounded-xl border border-[#2d251d]">
                {!showPromoField && !appliedPromo ? (
                  <button
                    type="button"
                    onClick={() => setShowPromoField(true)}
                    className="text-xs text-[#dea374] hover:text-[#ffd700] font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    <span>Have a promo code? Click here to apply discount</span>
                  </button>
                ) : (
                  <div>
                    {appliedPromo ? (
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-1.5 text-emerald-400 font-medium truncate">
                          <Check className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">
                            Code <strong>{appliedPromo.code}</strong> applied (${appliedPromo.promoPrice.toFixed(2)})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemovePromo}
                          className="text-[11px] text-[#888] hover:text-white underline flex-shrink-0"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyPromo} className="space-y-1.5">
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            value={promoCodeInput}
                            onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                            placeholder="Enter Promo Code (e.g. TASTE299)"
                            className="flex-1 bg-[#121110] border border-[#3b3227] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-[#686055] uppercase focus:outline-none focus:border-[#cf7b3e]"
                          />
                          <button
                            type="submit"
                            className="px-3 py-1.5 rounded-lg bg-[#cf7b3e] hover:bg-[#b8612b] text-white text-xs font-bold transition-all"
                          >
                            Apply
                          </button>
                        </div>
                      </form>
                    )}

                    {promoFeedback && (
                      <p
                        className={`text-[11px] mt-1.5 font-medium ${
                          promoFeedback.isError ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {promoFeedback.text}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Customer Contact Input for Token Receipt */}
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-medium text-[#c4bcae] mb-1">
                    Your Email (for digital receipt & access key)
                  </label>
                  <input
                    type="email"
                    required
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="chef@example.com"
                    className="w-full bg-[#121110] border border-[#3b3227] rounded-xl px-3 py-2 text-xs text-white placeholder-[#686055] focus:outline-none focus:border-[#cf7b3e]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#c4bcae] mb-1">
                    Your Full Name (optional)
                  </label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full bg-[#121110] border border-[#3b3227] rounded-xl px-3 py-2 text-xs text-white placeholder-[#686055] focus:outline-none focus:border-[#cf7b3e]"
                  />
                </div>
              </div>

              {/* Payment Actions based on Selected Currency & Region */}
              <div className="pt-2">
                {paymentCurrency === 'ZAR' ? (
                  /* South African Domestic Capitec Pay, Instant EFT & Card Checkout */
                  <form onSubmit={handleInstantSimulatedCheckout} className="space-y-3">
                    {/* Capitec Bank & Cellphone Banking Box */}
                    <div className="bg-[#151210] p-3 rounded-2xl border border-emerald-500/40 text-left space-y-1.5 shadow-md">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1">
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>Capitec Bank / Cellphone Payment</span>
                        </span>
                        <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          R20.00 Fixed
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                        <div className="bg-[#1f1914] p-2 rounded-xl border border-[#30271e]">
                          <span className="text-[10px] text-[#8e8578] block">Bank Name</span>
                          <strong className="text-white text-xs">Capitec Bank</strong>
                        </div>
                        <div className="bg-[#1f1914] p-2 rounded-xl border border-[#30271e]">
                          <span className="text-[10px] text-[#8e8578] block">Cellphone / Capitec Pay</span>
                          <strong className="text-emerald-300 text-xs font-mono">084 344 1313</strong>
                        </div>
                      </div>

                      <div className="bg-[#1f1914] p-2 rounded-xl border border-[#30271e] flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-[#8e8578] block">Your Payment Reference</span>
                          <span className="text-amber-300 font-mono font-bold text-xs">{paymentRefCode}</span>
                        </div>
                        <a
                          href="https://t.me/RecipeVaultSales_bot"
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm transition-all"
                        >
                          <SendHorizontal className="w-3 h-3" />
                          <span>Telegram Proof</span>
                        </a>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-emerald-700 hover:brightness-110 text-white shadow-lg shadow-emerald-950/50 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <CreditCard className="w-4 h-4 text-emerald-200" />
                      <span>
                        {isProcessing ? 'Verifying & Unlocking...' : `Verify & Unlock Collection (R${effectivePriceZAR}.00)`}
                      </span>
                    </button>

                    <div className="text-center text-[10px] text-[#888] space-y-0.5">
                      <p className="text-[#a39c90]">
                        Instant token receipt sent to {buyerEmail || 'your email'} upon unlock.
                      </p>
                    </div>
                  </form>
                ) : paypalClientId && paypalClientId !== 'test' && !useInstantTestPay ? (
                  <PayPalScriptProvider options={{ clientId: paypalClientId, currency: 'USD' }}>
                    <div className="min-h-[140px]">
                      <PayPalButtons
                        key={`paypal-btn-${effectivePriceUSD}`}
                        style={{ layout: 'vertical', shape: 'rect', color: 'gold' }}
                        createOrder={(_data, actions) => {
                          return actions.order.create({
                            intent: 'CAPTURE',
                            purchase_units: [
                              {
                                description: item.title,
                                amount: {
                                  currency_code: 'USD',
                                  value: effectivePriceUSD.toFixed(2),
                                },
                              },
                            ],
                          });
                        }}
                        onApprove={async (_data, actions) => {
                          if (actions.order) {
                            const details = await actions.order.capture();
                            const captureId = details.id || `PP-${Date.now()}`;
                            const payerEmail = details.payer?.email_address || buyerEmail;
                            const payerName = details.payer?.name?.given_name || buyerName;
                            handleCompleteTransaction(captureId, captureId, payerEmail, payerName, 'USD', effectivePriceUSD);
                          }
                        }}
                        onError={(err) => {
                          console.error('PayPal Checkout error:', err);
                          setUseInstantTestPay(true);
                        }}
                      />
                    </div>
                  </PayPalScriptProvider>
                ) : (
                  /* Fast One-Click PayPal Instant Sandbox & Card simulation */
                  <form onSubmit={handleInstantSimulatedCheckout} className="space-y-2">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-[#ffc439] hover:bg-[#f4bb33] text-[#111] shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <img 
                        src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" 
                        alt="PayPal" 
                        className="h-5 rounded" 
                      />
                      <span>
                        {isProcessing ? 'Processing Payment...' : `Pay $${effectivePriceUSD.toFixed(2)} with PayPal`}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleInstantSimulatedCheckout}
                      disabled={isProcessing}
                      className="w-full py-2.5 px-4 rounded-xl font-medium text-xs bg-[#2c2e30] hover:bg-[#393b3e] text-white border border-[#444] transition-all flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                      <span>Debit or Credit Card</span>
                    </button>
                  </form>
                )}
              </div>

              {/* Guarantees */}
              <div className="pt-2 border-t border-[#29231c] flex items-center justify-between text-[10px] text-[#878074]">
                <div className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>256-bit Encrypted SSL</span>
                </div>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#dea374]" />
                  <span>Instant Phone Access</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

