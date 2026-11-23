export interface TelegramConfig {
  botToken: string;
  chatId: string;
  username: string;
  enabled: boolean;
}

const TELEGRAM_CONFIG_KEY = 'the_recipe_vault_telegram_v1';

class TelegramService {
  private config: TelegramConfig = {
    botToken: '9002281093:AAH32gRNpbE8CKKMqE6SC3krwDKj-kldm34',
    chatId: '6920006386',
    username: 'RecipeVaultSales_bot',
    enabled: true,
  };

  constructor() {
    this.load();
  }

  private load() {
    try {
      const stored = localStorage.getItem(TELEGRAM_CONFIG_KEY);
      if (stored) {
        this.config = { ...this.config, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Could not load Telegram config:', e);
    }
  }

  public saveConfig(newConfig: Partial<TelegramConfig>) {
    this.config = { ...this.config, ...newConfig };
    try {
      localStorage.setItem(TELEGRAM_CONFIG_KEY, JSON.stringify(this.config));
    } catch (e) {
      console.warn('Could not save Telegram config:', e);
    }
  }

  public getConfig(): TelegramConfig {
    return { ...this.config };
  }

  public async autoDiscoverChatId(): Promise<string | null> {
    if (!this.config.botToken) return null;
    try {
      const res = await fetch(`https://api.telegram.org/bot${this.config.botToken}/getUpdates`);
      const data = await res.json();
      if (data.ok && data.result && data.result.length > 0) {
        // Find latest update with a chat id
        for (let i = data.result.length - 1; i >= 0; i--) {
          const upd = data.result[i];
          const foundId = upd.message?.chat?.id || upd.my_chat_member?.chat?.id || upd.callback_query?.message?.chat?.id;
          if (foundId) {
            const chatIdStr = String(foundId);
            this.saveConfig({ chatId: chatIdStr });
            return chatIdStr;
          }
        }
      }
    } catch (e) {
      console.warn('Auto discover Telegram chat ID error:', e);
    }
    return null;
  }

  public async sendMessage(text: string): Promise<boolean> {
    if (!this.config.botToken) {
      return false;
    }

    let targetChatId = this.config.chatId;
    if (!targetChatId) {
      targetChatId = (await this.autoDiscoverChatId()) || '';
    }

    if (!targetChatId) {
      return false;
    }

    try {
      const url = `https://api.telegram.org/bot${this.config.botToken}/sendMessage`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: targetChatId,
          text,
          parse_mode: 'HTML',
        }),
      });
      return res.ok;
    } catch (e) {
      console.error('Failed to send Telegram message:', e);
      return false;
    }
  }

  public async sendCustomerSupportInquiry(name: string, email: string, token: string, msg: string): Promise<boolean> {
    const text = `📬 <b>New Customer Support Inquiry</b>\n\n` +
      `👤 <b>Name:</b> ${name || 'Website Visitor'}\n` +
      `📧 <b>Email:</b> ${email}\n` +
      (token ? `🔑 <b>Token:</b> <code>${token}</code>\n` : '') +
      `\n💬 <b>Message:</b>\n${msg}\n\n` +
      `<i>The Recipe Vault Co. Contact Portal</i>`;
    return this.sendMessage(text);
  }

  public async sendSaleNotification(sale: {
    itemTitle: string;
    amount: number;
    currency: string;
    buyerName?: string;
    buyerEmail: string;
    unlockToken: string;
    orderId?: string;
  }): Promise<boolean> {
    const text = `🎉 <b>NEW SALE COMPLETED!</b>\n\n` +
      `📖 <b>Book:</b> ${sale.itemTitle}\n` +
      `💰 <b>Amount:</b> ${sale.currency === 'ZAR' ? `R${sale.amount}` : `$${sale.amount.toFixed(2)} USD`}\n` +
      `👤 <b>Buyer:</b> ${sale.buyerName || 'Valued Chef'} (<code>${sale.buyerEmail}</code>)\n` +
      `🔑 <b>Unlock Key:</b> <code>${sale.unlockToken}</code>\n` +
      (sale.orderId ? `💳 <b>Order:</b> <code>${sale.orderId}</code>\n` : '') +
      `\n<i>The Recipe Vault Co. Live Checkout</i>`;
    return this.sendMessage(text);
  }
}

export const telegramService = new TelegramService();
