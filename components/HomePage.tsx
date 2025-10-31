import React from 'react';
import FeaturesSection from './FeaturesSection';
import Button from './Button';
import Icon from './Icon';
// Fix: Import Chatbot component
import Chatbot from './Chatbot';

interface HomePageProps {
  onLogin: () => void;
  onSignUp: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onLogin, onSignUp }) => {
  return (
    <div className="bg-white text-gray-800">
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5 flex items-center gap-2">
              <span className="font-bold text-2xl text-cyan-600">CourseCraft</span>
            </a>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            <a href="#features" className="text-sm font-semibold leading-6 text-gray-900">Features</a>
            <a href="#" className="text-sm font-semibold leading-6 text-gray-900">Pricing</a>
            <a href="#" className="text-sm font-semibold leading-6 text-gray-900">About</a>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Button onClick={onLogin} variant="secondary">Log in <span aria-hidden="true">&rarr;</span></Button>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <div className="relative isolate pt-14">
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#80ff89] to-[#06b6d4] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'}}></div>
            </div>
            <div className="py-24 sm:py-32 lg:pb-40">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Your Expertise, Your Business, Your Platform.</h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600">CourseCraft is the all-in-one platform for digital creators. Sell courses, coaching, downloads, and build a community around your brand—no tech skills required.</p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Button onClick={onSignUp} size="lg">Get Started for Free</Button>
                            <Button onClick={onLogin} size="lg" variant="ghost">Live Demo <span aria-hidden="true">→</span></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Features Section */}
        <div id="features">
            <FeaturesSection />
        </div>
        
        {/* CTA Section */}
        <div className="bg-gray-900">
            <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:justify-between lg:px-8">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Ready to dive in?<br/>Start creating today.</h2>
                <div className="mt-10 flex items-center gap-x-6 lg:mt-0 lg:flex-shrink-0">
                    <Button onClick={onSignUp} size="lg">Get Started for Free</Button>
                    <Button onClick={onLogin} size="lg" variant="ghost" className="text-white hover:bg-gray-800">Contact Sales</Button>
                </div>
            </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white">
        <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
          <nav className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
            <div className="pb-6"><a href="#" className="text-sm leading-6 text-gray-600 hover:text-gray-900">About</a></div>
            <div className="pb-6"><a href="#" className="text-sm leading-6 text-gray-600 hover:text-gray-900">Blog</a></div>
            <div className="pb-6"><a href="#" className="text-sm leading-6 text-gray-600 hover:text-gray-900">Jobs</a></div>
            <div className="pb-6"><a href="#" className="text-sm leading-6 text-gray-600 hover:text-gray-900">Press</a></div>
            <div className="pb-6"><a href="#" className="text-sm leading-6 text-gray-600 hover:text-gray-900">Partners</a></div>
          </nav>
          <p className="mt-10 text-center text-xs leading-5 text-gray-500">&copy; 2024 CourseCraft, Inc. All rights reserved.</p>
        </div>
      </footer>
      <Chatbot />
    </div>
  );
};

export default HomePage;