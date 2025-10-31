import React, { useState } from 'react';
import Button from './Button';
import Icon from './Icon';

interface AuthPageProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
  onBackToHome: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onSignIn, onSignUp, onBackToHome }) => {
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (mode === 'signIn') {
        await onSignIn(email, password);
      } else {
        await onSignUp(email, password);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleMode = () => {
      setMode(mode === 'signIn' ? 'signUp' : 'signIn');
      setError('');
      setEmail('');
      setPassword('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-sm mx-auto">
        <button onClick={onBackToHome} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold mb-4 transition-colors">
            &larr; Back to Home
        </button>
        <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                    {mode === 'signIn' ? 'Welcome Back!' : 'Create an Account'}
                </h1>
                <p className="text-gray-500 mt-2">
                    {mode === 'signIn' ? 'Sign in to continue to your dashboard.' : 'Start your journey with CourseCraft.'}
                </p>
            </div>
          
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-6" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email address
                    </label>
                    <div className="mt-1">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="password"className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <div className="mt-1">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                        />
                    </div>
                </div>
                <div>
                    <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                         {isLoading ? 'Processing...' : (mode === 'signIn' ? 'Sign In' : 'Create Account')}
                    </Button>
                </div>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
                {mode === 'signIn' ? "Don't have an account?" : 'Already have an account?'}
                <button onClick={toggleMode} className="font-semibold text-cyan-600 hover:text-cyan-500 ml-1">
                    {mode === 'signIn' ? 'Sign up' : 'Sign in'}
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
