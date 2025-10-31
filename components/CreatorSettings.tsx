import React, { useState } from 'react';
import type { User, PayoutDetails, AffiliateProgram, StoreBranding } from '../types';
import { Currency } from '../types';
import Button from './Button';
import Icon from './Icon';

interface CreatorSettingsProps {
  currentUser: User;
  onUpdateSettings: (settings: Partial<User>) => void;
  onNavigateToSiteEditor: () => void;
}

const CreatorSettings: React.FC<CreatorSettingsProps> = ({ currentUser, onUpdateSettings, onNavigateToSiteEditor }) => {
  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [defaultCurrency, setDefaultCurrency] = useState(currentUser.defaultCurrency || Currency.NGN);
  
  const [storeBranding, setStoreBranding] = useState<StoreBranding>(currentUser.storeBranding || { primaryColor: '#06B6D4', logoUrl: '' });
  const [payoutDetails, setPayoutDetails] = useState<PayoutDetails>(currentUser.payoutDetails || { bankName: '', accountName: '', accountNumber: '' });
  const [affiliateProgram, setAffiliateProgram] = useState<AffiliateProgram>(currentUser.affiliateProgram || { enabled: false, commissionRate: 20 });
  
  const formFieldClasses = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
        name,
        bio,
        defaultCurrency,
        storeBranding,
        payoutDetails,
        affiliateProgram
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
      
      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Profile Section */}
        <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Profile</h2>
            <div>
                <label htmlFor="name" className={labelClasses}>Full Name</label>
                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className={formFieldClasses} />
            </div>
             <div>
                <label htmlFor="bio" className={labelClasses}>Bio / Tagline</label>
                <textarea id="bio" rows={3} value={bio} onChange={e => setBio(e.target.value)} className={formFieldClasses} placeholder="e.g., Helping creators monetize their passion."></textarea>
            </div>
        </section>

        {/* Store Settings */}
        <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Store Settings</h2>
            <div>
                <label htmlFor="currency" className={labelClasses}>Default Currency</label>
                <select id="currency" value={defaultCurrency} onChange={e => setDefaultCurrency(e.target.value as Currency)} className={formFieldClasses}>
                    {Object.values(Currency).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
             <div>
                <label htmlFor="primaryColor" className={labelClasses}>Primary Brand Color</label>
                <div className="flex items-center gap-2">
                    <input type="color" id="primaryColor" value={storeBranding.primaryColor} onChange={e => setStoreBranding({...storeBranding, primaryColor: e.target.value})} className="h-10 w-14 p-1 border border-gray-300 rounded-md" />
                    <input type="text" value={storeBranding.primaryColor} onChange={e => setStoreBranding({...storeBranding, primaryColor: e.target.value})} className={formFieldClasses} />
                </div>
            </div>
            <div>
                 <Button type="button" variant="secondary" onClick={onNavigateToSiteEditor}>
                    <Icon name="edit" className="w-5 h-5 mr-2" />
                    Launch Site Editor
                </Button>
            </div>
        </section>

        {/* Payout Details */}
         <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Payout Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="bankName" className={labelClasses}>Bank Name</label>
                    <input type="text" id="bankName" value={payoutDetails.bankName} onChange={e => setPayoutDetails({...payoutDetails, bankName: e.target.value})} className={formFieldClasses} />
                </div>
                <div>
                    <label htmlFor="accountNumber" className={labelClasses}>Account Number</label>
                    <input type="text" id="accountNumber" value={payoutDetails.accountNumber} onChange={e => setPayoutDetails({...payoutDetails, accountNumber: e.target.value})} className={formFieldClasses} />
                </div>
            </div>
            <div>
                <label htmlFor="accountName" className={labelClasses}>Account Name</label>
                <input type="text" id="accountName" value={payoutDetails.accountName} onChange={e => setPayoutDetails({...payoutDetails, accountName: e.target.value})} className={formFieldClasses} />
            </div>
        </section>

        {/* Affiliate Program */}
        <section className="space-y-6">
             <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Affiliate Program</h2>
             <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border">
                <div>
                    <label htmlFor="affiliate-enabled" className="font-medium text-gray-800">Enable Affiliate Program</label>
                    <p className="text-sm text-gray-500">Allow others to promote your products for a commission.</p>
                </div>
                <label htmlFor="affiliate-enabled" className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input type="checkbox" id="affiliate-enabled" className="sr-only" checked={affiliateProgram.enabled} onChange={() => setAffiliateProgram({...affiliateProgram, enabled: !affiliateProgram.enabled})} />
                        <div className="block bg-gray-300 w-12 h-7 rounded-full"></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${affiliateProgram.enabled ? 'translate-x-full !bg-cyan-600' : ''}`}></div>
                    </div>
                </label>
            </div>
            {affiliateProgram.enabled && (
                <div>
                    <label htmlFor="commissionRate" className={labelClasses}>Commission Rate (%)</label>
                    <input type="number" id="commissionRate" value={affiliateProgram.commissionRate} onChange={e => setAffiliateProgram({...affiliateProgram, commissionRate: parseInt(e.target.value, 10)})} className={formFieldClasses} min="1" max="90" />
                </div>
            )}
        </section>

        <div className="pt-6 border-t">
          <Button type="submit" size="lg">Save Settings</Button>
        </div>
      </form>
    </div>
  );
};

export default CreatorSettings;