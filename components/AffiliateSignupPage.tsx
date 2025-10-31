
import React from 'react';
import Button from './Button';
// Fix: Use relative path for type imports
import type { User } from '../types';

interface AffiliateSignupPageProps {
  creator: User;
}

const AffiliateSignupPage: React.FC<AffiliateSignupPageProps> = ({ creator }) => {
  return (
    <div className="max-w-2xl mx-auto p-8 text-center">
      <h1 className="text-3xl font-bold">Become an Affiliate</h1>
      <p className="mt-4 text-lg text-gray-600">
        Partner with {creator.name} and earn a {creator.affiliateProgram?.commissionRate}% commission on every sale you refer!
      </p>
      <Button size="lg" className="mt-8">Sign Up Now</Button>
    </div>
  );
};

export default AffiliateSignupPage;
