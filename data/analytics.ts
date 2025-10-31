// Fix: Use relative path for type imports
// Fix: Import Sale type from types.ts
import { Currency, User, Sale } from '../types';

// Corresponds to the initialProducts in App.tsx
// id 1: 50000 NGN
// id 2: 250 USD
// id 3: 15000 NGN
// id 4: 150000 NGN
// id 5: 50 USD
// id 6: 0 NGN (Free)

export const mockSales: Sale[] = [
  // This month
  { id: 'sale-1', productId: '1', studentId: 'student-01', amount: 50000, currency: Currency.NGN, date: new Date().toISOString() },
  { id: 'sale-2', productId: '4', studentId: 'student-05', amount: 150000, currency: Currency.NGN, date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() }, // 3 days ago
  { id: 'sale-3', productId: '2', studentId: 'student-02', amount: 250, currency: Currency.USD, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() }, // 5 days ago

  // Last month
  { id: 'sale-4', productId: '1', studentId: 'student-02', amount: 50000, currency: Currency.NGN, date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString() },
  { id: 'sale-5', productId: '5', studentId: 'student-04', amount: 50, currency: Currency.USD, date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString() },
  { id: 'sale-11', productId: '1', studentId: 'student-04', amount: 50000, currency: Currency.NGN, date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString() },


  // 2 months ago
  { id: 'sale-6', productId: '3', studentId: 'student-01', amount: 15000, currency: Currency.NGN, date: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString() },
  { id: 'sale-7', productId: '4', studentId: 'student-01', amount: 150000, currency: Currency.NGN, date: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString() },
  { id: 'sale-12', productId: '5', studentId: 'student-01', amount: 50, currency: Currency.USD, date: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString() },


  // 3 months ago
  { id: 'sale-8', productId: '2', studentId: 'student-03', amount: 250, currency: Currency.USD, date: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString() },
  { id: 'sale-9', productId: '1', studentId: 'student-06-new', amount: 50000, currency: Currency.NGN, date: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString() },

  // 4 months ago
  { id: 'sale-10', productId: '4', studentId: 'student-07-new', amount: 150000, currency: Currency.NGN, date: new Date(new Date().setMonth(new Date().getMonth() - 4)).toISOString() },
];
