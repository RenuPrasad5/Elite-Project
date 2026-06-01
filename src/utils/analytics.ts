import { sendGAEvent } from '@next/third-parties/google';

/**
 * Utility to track custom events in Google Analytics.
 * This is a thin wrapper around `@next/third-parties/google` `sendGAEvent`
 * that ensures consistent event names and parameters.
 */
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    sendGAEvent({ event: eventName, ...params });
  }
};

// ==========================================
// Strongly Typed Event Tracking Helpers
// ==========================================

export const trackSignup = (method: string = 'email') => {
  trackEvent('signup', { method });
};

export const trackLogin = (method: string = 'email') => {
  trackEvent('login', { method });
};

export const trackSubscriptionPurchase = (
  planName: string, 
  value?: number, 
  currency: string = 'USD'
) => {
  trackEvent('subscription_purchase', { 
    plan_name: planName, 
    value, 
    currency 
  });
};

export const trackDashboardVisit = () => {
  trackEvent('dashboard_visit');
};

export const trackDownloadProduct = (productName: string) => {
  trackEvent('download_product', { product_name: productName });
};

export const trackWatchlistAdd = (symbol: string) => {
  trackEvent('watchlist_add', { symbol });
};

export const trackMarketOpen = () => {
  trackEvent('market_open');
};
