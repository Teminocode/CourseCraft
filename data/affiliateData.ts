import { AffiliateClick, AffiliateSale, Currency } from '../types';

export const mockAffiliateClicks: AffiliateClick[] = [
  // Clicks for affiliate-01 ('sam-promo')
  { id: 'click-1', affiliateId: 'sam-promo', productId: '1', date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() }, // 1 hour ago
  { id: 'click-2', affiliateId: 'sam-promo', productId: null, date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() }, // 3 hours ago
  { id: 'click-3', affiliateId: 'sam-promo', productId: '4', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() }, // 1 day ago
  { id: 'click-4', affiliateId: 'sam-promo', productId: '2', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }, // 2 days ago
  { id: 'click-5', affiliateId: 'sam-promo', productId: '1', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }, // 2 days ago
  { id: 'click-6', affiliateId: 'sam-promo', productId: '5', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() }, // 4 days ago
];

export const mockAffiliateSales: AffiliateSale[] = [
  // Sales for affiliate-01 ('sam-promo')
  // Commission is 30% of the sale amount
  { 
    id: 'aff-sale-1', 
    affiliateId: 'sam-promo', 
    productId: '1', 
    saleAmount: 50000, 
    commissionAmount: 15000, 
    currency: Currency.NGN, 
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
  },
  { 
    id: 'aff-sale-2', 
    affiliateId: 'sam-promo', 
    productId: '2', 
    saleAmount: 250, 
    commissionAmount: 75, 
    currency: Currency.USD, 
    date: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString() // 2.5 days ago
  },
   { 
    id: 'aff-sale-3', 
    affiliateId: 'sam-promo', 
    productId: '5', 
    saleAmount: 50, 
    commissionAmount: 15, 
    currency: Currency.USD, 
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
  },
];
