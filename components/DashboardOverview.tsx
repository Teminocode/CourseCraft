import React from 'react';
import { User, Product, Sale } from '../types';
import AnalyticsDashboard from './AnalyticsDashboard';

interface DashboardOverviewProps {
  currentUser: User;
  products: Product[];
  sales: Sale[];
  students: User[];
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ currentUser, products, sales, students }) => {

  const totalRevenue = sales.reduce((sum, sale) => {
      const rate = sale.currency === 'USD' ? 1000 : 1;
      return sum + sale.amount * rate;
  }, 0);
  
  const productSalesCount = sales.reduce((acc, sale) => {
      acc[sale.productId] = (acc[sale.productId] || 0) + 1;
      return acc;
  }, {} as Record<string, number>);

  const topProducts = [...products]
      .sort((a, b) => (productSalesCount[b.id] || 0) - (productSalesCount[a.id] || 0))
      .slice(0, 5)
      .map(p => ({
          name: p.name,
          sales: productSalesCount[p.id] || 0
      }));
      
  const salesByMonth = sales.reduce((acc, sale) => {
        const month = new Date(sale.date).toLocaleString('default', { month: 'short', year: '2-digit' });
        const rate = sale.currency === 'USD' ? 1000 : 1;
        if (!acc[month]) {
            acc[month] = 0;
        }
        acc[month] += sale.amount * rate;
        return acc;
    }, {} as Record<string, number>);
    
  const last5MonthsData = Object.entries(salesByMonth)
      .slice(-5)
      .map(([month, revenue]) => ({ month, revenue }));

  return (
    <AnalyticsDashboard
      totalRevenue={totalRevenue}
      totalStudents={students.length}
      productsSold={sales.length}
      topProducts={topProducts}
      salesByMonth={last5MonthsData}
      currency={currentUser.defaultCurrency || 'USD'}
    />
  );
};

export default DashboardOverview;