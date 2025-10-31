import React, { useState, useEffect, useRef } from 'react';

const featuresData = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 16.5V7.5C4 6.94772 4.44772 6.5 5 6.5H19C19.5523 6.5 20 6.94772 20 7.5V16.5C20 17.0523 19.5523 17.5 19 17.5H5C4.44772 17.5 4 17.0523 4 16.5Z" stroke="currentColor" strokeWidth="1.5"/><path d="M14.5 10.5L10.5 13.5L14.5 16.5V10.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    title: 'Host All Your Content',
    description: 'Enjoy generous storage for your videos, audio files, PDFs, and more. Focus on creating, not on upload limits.',
  },
  {
    icon: (
     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 20V4M7 20V4M12 20V4M4 8H20M4 16H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    title: 'Track Student Progress',
    description: 'Gain insights into how your students are engaging with your content. Manage your community and export data with ease.',
  },
  {
    icon: (
     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 12H16M12 8V16M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    title: 'Offline Access Management',
    description: 'Seamlessly manage your course and manually grant access to customers who purchase through offline channels.',
  },
  {
    icon: (
       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 15L12 3M12 15L15 12M12 15L9 12M19.4999 15C20.3283 15 20.9999 15.6716 20.9999 16.5V19.5C20.9999 20.3284 20.3283 21 19.4999 21H4.5C3.67157 21 3 20.3284 3 19.5V16.5C3 15.6716 3.67157 15 4.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    title: 'Award Custom Certificates',
    description: 'Automatically issue beautiful, customized certificates of completion to reward your students for finishing a course.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 8L7 16M12 5L12 19M17 11L17 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    title: 'On-Demand Streaming',
    description: 'Deliver a high-quality, seamless streaming experience for your video and audio content on any device, anywhere.',
  },
  {
    icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M15 12L10.5 9L10.5 15L15 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    title: 'Secure Your Content',
    description: 'Protect your valuable work. Our robust security features prevent unauthorized downloading and sharing of your videos.',
  },
  {
    icon: (
       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V6Z" stroke="currentColor" strokeWidth="1.5" /><path d="M10 9L14 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="10" cy="15" r="1" fill="currentColor" /><circle cx="14" cy="9" r="1" fill="currentColor" /></svg>
    ),
    title: 'Drip Your Content',
    description: 'Keep students engaged by scheduling your content to be released over time, either on specific dates or based on their enrollment.',
  },
  {
    icon: (
       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 10H16M8 14H14M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    title: 'Foster Community',
    description: 'Build a vibrant learning community. Enable comments on your lectures to boost engagement and facilitate discussions.',
  },
  {
    icon: (
       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6H20M4 12H20M4 18H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    title: 'Flexible Curriculum Builder',
    description: 'Design your course curriculum your way. Our intuitive builder lets you structure lessons and add downloadable resources easily.',
  },
];

const FeaturesSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // For swipe gestures
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const minSwipeDistance = 50;

  useEffect(() => {
    const activeTab = tabRefs.current[activeIndex];
    if (activeTab) {
      activeTab.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeIndex]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev === featuresData.length - 1 ? 0 : prev + 1));
  };
  
  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? featuresData.length - 1 : prev - 1));
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0); // Clear previous touch end
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
    
    // Reset touch values
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Everything you need to succeed</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            We provide the tools to help you create, market, and sell your digital products, all in one place.
          </p>
        </div>
        <div className="mt-16 md:flex md:gap-8 lg:gap-16 items-start">
          {/* Tabs */}
          <div className="md:w-1/3">
            {/* Mobile Tabs - Horizontal Scroll */}
            <div className="md:hidden pb-4 mb-8 border-b relative">
              <div
                className="flex overflow-x-auto space-x-2 scroll-container"
              >
                {featuresData.map((feature, index) => (
                  <button
                    key={feature.title}
                    ref={(el) => (tabRefs.current[index] = el)}
                    onClick={() => setActiveIndex(index)}
                    className={`px-3 py-2 text-sm font-semibold rounded-md whitespace-nowrap flex items-center gap-2 transition-colors ${
                      activeIndex === index ? 'bg-cyan-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {feature.icon}
                    <span>{feature.title}</span>
                  </button>
                ))}
              </div>
              {/* Visual fade to indicate more content */}
              <div className="absolute top-0 right-0 bottom-4 w-12 bg-gradient-to-l from-white pointer-events-none"></div>
            </div>
            {/* Desktop Tabs - Vertical */}
            <div className="hidden md:flex flex-col space-y-2">
              {featuresData.map((feature, index) => (
                <button
                  key={feature.title}
                  onClick={() => setActiveIndex(index)}
                  className={`w-full p-4 text-left rounded-lg flex items-center gap-4 transition-all duration-200 ${
                    activeIndex === index ? 'bg-cyan-50 shadow-sm scale-105' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${activeIndex === index ? 'bg-cyan-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                    {feature.icon}
                  </div>
                  <span className={`font-semibold ${activeIndex === index ? 'text-cyan-700' : 'text-gray-800'}`}>{feature.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Swipeable Content */}
          <div className="md:w-2/3 mt-8 md:mt-0 relative">
             {/* Arrow Buttons for Desktop */}
            <button onClick={handlePrev} aria-label="Previous feature" className="hidden md:block absolute top-1/2 -left-5 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors -translate-y-1/2 text-gray-600 hover:text-gray-900">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={handleNext} aria-label="Next feature" className="hidden md:block absolute top-1/2 -right-5 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors -translate-y-1/2 text-gray-600 hover:text-gray-900">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
            <div
              className="overflow-hidden"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {featuresData.map((feature) => (
                  <div key={feature.title} className="w-full flex-shrink-0 px-1">
                    <div className="bg-gray-50 border border-gray-200 p-8 sm:p-12 rounded-2xl min-h-[300px] flex items-center">
                      <div>
                        <div className="p-3 rounded-lg bg-cyan-600 text-white inline-block mb-4">
                          {feature.icon}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                        <p className="text-lg leading-relaxed text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        /* Subtle scrollbar for mobile tabs */
        .scroll-container::-webkit-scrollbar {
            height: 4px;
        }
        .scroll-container::-webkit-scrollbar-track {
            background: #f1f5f9; /* bg-slate-100 */
        }
        .scroll-container::-webkit-scrollbar-thumb {
            background: #cbd5e1; /* bg-slate-300 */
            border-radius: 2px;
        }
        .scroll-container::-webkit-scrollbar-thumb:hover {
            background: #94a3b8; /* bg-slate-400 */
        }
        .scroll-container {
            scrollbar-width: thin;
            scrollbar-color: #cbd5e1 #f1f5f9;
        }
      `}</style>
    </div>
  );
};

export default FeaturesSection;