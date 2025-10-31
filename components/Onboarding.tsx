import React, { useState } from 'react';
import Button from './Button';
import Icon from './Icon';

interface OnboardingProps {
    onComplete: (details: { name: string }) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');

    const handleNext = () => {
        setStep(2);
    };
    
    const handleFinish = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onComplete({ name: name.trim() });
        }
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transition-all duration-300">
                {step === 1 && (
                    <div className="text-center animate-fade-in">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100 mb-4">
                             <Icon name="store" className="h-6 w-6 text-cyan-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Welcome to CourseCraft!</h1>
                        <p className="mt-4 text-gray-600">
                            You're just a few steps away from launching your digital store. Let's get you set up.
                        </p>
                        <Button onClick={handleNext} size="lg" className="mt-8 w-full">
                            Let's Get Started
                        </Button>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-fade-in">
                        <div className="text-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Tell us about yourself</h2>
                            <p className="mt-2 text-sm text-gray-500">This will be used to personalize your new store.</p>
                        </div>
                        <form onSubmit={handleFinish} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Your Name or Brand Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                                    placeholder="e.g., Alex Designs"
                                    required
                                    autoFocus
                                />
                            </div>
                            <Button type="submit" size="lg" className="w-full" disabled={!name.trim()}>
                                Finish Setup
                            </Button>
                        </form>
                    </div>
                )}
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default Onboarding;