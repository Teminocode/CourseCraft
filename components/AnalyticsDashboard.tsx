import React from 'react';
import Icon from './Icon';
// Fix: Use relative path for type imports
import { Currency } from '../types';

export interface TopProduct {
  name: string;
  sales: number;
}

export interface MonthlySale {
  month: string;
  revenue: number;
}

interface AnalyticsDashboardProps {
  totalRevenue: number;
  totalStudents: number;
  productsSold: number;
  topProducts: TopProduct[];
  salesByMonth: MonthlySale[];
  currency: Currency;
}

const StatCard: React.FC<{ icon: 'user' | 'cart' | 'store'; title: string; value: string | number; }> = ({ icon, title, value }) => (
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

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ totalRevenue, totalStudents, productsSold, topProducts, salesByMonth, currency }) => {
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            notation: 'compact',
            compactDisplay: 'short'
        }).format(amount);
    }

    const maxRevenue = Math.max(...salesByMonth.map(s => s.revenue), 1); // Use 1 to avoid division by zero

    return (
        <div className="space-y-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon="store" title="Total Revenue" value={formatCurrency(totalRevenue)} />
                <StatCard icon="user" title="Total Students" value={totalStudents} />
                <StatCard icon="cart" title="Products Sold" value={productsSold} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Over Last 5 Months</h3>
                    <div className="h-64 flex items-end justify-around gap-2 pt-4">
                        {salesByMonth.length > 0 ? salesByMonth.map(monthData => (
                           <div key={monthData.month} className="flex flex-col items-center flex-1 h-full">
                               <div className="w-full flex items-end h-full">
                                    <div 
                                        className="w-full bg-cyan-200 hover:bg-cyan-400 rounded-t-md transition-all duration-300"
                                        style={{ height: `${(monthData.revenue / maxRevenue) * 100}%` }}
                                        title={`${formatCurrency(monthData.revenue)}`}
                                    ></div>
                               </div>
                               <p className="text-xs text-gray-500 mt-2 shrink-0">{monthData.month}</p>
                           </div>
                        )) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <p className="text-gray-500">No sales data to display.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
                    {topProducts.length > 0 ? (
                        <ul className="space-y-3">
                           {topProducts.map((product, index) => (
                               <li key={index} className="flex justify-between items-center">
                                   <p className="text-sm font-medium text-gray-800 truncate pr-2">{product.name}</p>
                                   <p className="text-sm font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md shrink-0">{product.sales} sales</p>
                               </li>
                           ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">No sales yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;