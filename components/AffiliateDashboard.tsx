
import React, { useState } from 'react';
// Fix: Use a regular import instead of 'import type' because Currency enum is used as a value.
import { User, Product, AffiliateClick, AffiliateSale, Currency } from '../types';
import Icon from './Icon';
import Button from './Button';

interface AffiliateDashboardProps {
  affiliate: User;
  creator: User;
  products: Product[];
  clicks: AffiliateClick[];
  sales: AffiliateSale[];
}

const StatCard: React.FC<{ icon: 'user' | 'cart' | 'share'; title: string; value: string | number; }> = ({ icon, title, value }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-start gap-4">
        <div className="bg-cyan-100 p-3 rounded-full">
            <Icon name={icon} className="w-6 h-6 text-cyan-600" />
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
);

const AffiliateDashboard: React.FC<AffiliateDashboardProps> = ({ affiliate, creator, products, clicks, sales }) => {
  const [selectedProductId, setSelectedProductId] = useState<string>('storefront');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  const totalEarnings = sales.reduce((sum, sale) => sum + sale.commissionAmount, 0);

  const formatCurrency = (amount: number, currency: Currency) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
  }

  const generateLink = () => {
    // In a real app, this would be the actual domain
    const baseUrl = `https://course-craft.com/store/${creator.id}`;
    const ref = `?ref=${affiliate.affiliateId}`;

    let link = '';
    if (selectedProductId === 'storefront') {
        link = baseUrl + ref;
    } else {
        link = `${baseUrl}/products/${selectedProductId}${ref}`;
    }
    setGeneratedLink(link);
  };
  
  const copyLink = () => {
      navigator.clipboard.writeText(generatedLink).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      });
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const recentActivity = [
      ...clicks.map(c => ({ type: 'Click', ...c })),
      ...sales.map(s => ({ type: 'Sale', ...s })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-12">
            <h1 className="text-3xl font-bold text-gray-900">Affiliate Dashboard</h1>
            <p className="mt-1 text-lg text-gray-600">Welcome, {affiliate.name}! Track your referrals and earnings.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatCard icon="share" title="Total Clicks" value={clicks.length} />
            <StatCard icon="cart" title="Total Sales" value={sales.length} />
            <StatCard icon="user" title="Total Earnings" value={formatCurrency(totalEarnings, Currency.USD)} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Link Generator */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Referral Link Generator</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="product-select" className="block text-sm font-medium text-gray-700 mb-1">Select a page to promote</label>
                        <select
                            id="product-select"
                            value={selectedProductId}
                            onChange={e => setSelectedProductId(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                        >
                            <option value="storefront">{creator.name}'s Storefront</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <Button onClick={generateLink} className="w-full">Generate Link</Button>

                    {generatedLink && (
                        <div className="pt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Your Referral Link</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    readOnly
                                    value={generatedLink}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                                />
                                <Button onClick={copyLink} variant="secondary" className="shrink-0">
                                    <Icon name={copied ? 'check-circle' : 'copy'} className="w-5 h-5" />
                                    <span className="ml-2">{copied ? 'Copied!' : 'Copy'}</span>
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                 <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentActivity.map(activity => (
                                <tr key={activity.id}>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${activity.type === 'Sale' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                            {activity.type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                        {activity.type === 'Sale' && `+${formatCurrency((activity as AffiliateSale).commissionAmount, (activity as AffiliateSale).currency)}`}
                                        {activity.type === 'Click' && `Product: ${products.find(p => p.id === (activity as AffiliateClick).productId)?.name || 'Storefront'}`}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatDate(activity.date)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {recentActivity.length === 0 && (
                        <div className="text-center py-10">
                            <p className="text-gray-500">No activity yet. Share your link to get started!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default AffiliateDashboard;
