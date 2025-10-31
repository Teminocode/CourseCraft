import React, { useState } from 'react';
import HomePage from './components/HomePage';
import Chatbot from './components/Chatbot';
import { mockCreator, mockProducts, allUsers as initialUsers } from './data/mockData';
import { mockAffiliateClicks, mockAffiliateSales } from './data/affiliateData';
import { mockSales } from './data/analytics';
import { User, Product } from './types';
import CoursePlayerPage from './components/CoursePlayerPage';
import SiteEditor from './components/SiteEditor';
import Onboarding from './components/Onboarding';
import CreatorSettings from './components/CreatorSettings';
import CreatorLayout from './components/CreatorLayout';
import DashboardOverview from './components/DashboardOverview';
import ProductManagement from './components/ProductManagement';
import StudentManagement from './components/StudentManagement';
import MarketingPage from './components/MarketingPage';
import Storefront from './components/Storefront';
import StudentLibrary from './components/StudentLibrary';
import AffiliateDashboard from './components/AffiliateDashboard';
import Modal from './components/Modal';
import ProductForm from './components/ProductForm';
import AuthPage from './components/AuthPage';


export type View =
  | 'dashboard'
  | 'products'
  | 'students'
  | 'marketing'
  | 'settings'
  | 'storefront'
  | 'student_library'
  | 'affiliate_dashboard'
  | 'course_player'
  | 'site_editor';

interface OnboardingDetails {
  name: string;
}

type Page = 'home' | 'auth' | 'onboarding' | 'app';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [allUsers, setAllUsers] = useState<User[]>(initialUsers);
  
  // State for inside the creator app
  const [dashboardView, setDashboardView] = useState<View>('dashboard');
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const handleGoToAuth = () => setPage('auth');
  const handleBackToHome = () => setPage('home');

  const handleSignIn = (email: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => { // Simulate network delay
        const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (user && user.password === password) {
          setCurrentUser(user);
          setPage('app');
          setDashboardView('dashboard'); // Reset to dashboard on login
          resolve();
        } else {
          reject(new Error('Invalid email or password.'));
        }
      }, 500);
    });
  };

  const handleSignUp = (email: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const userExists = allUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
            if (userExists) {
                reject(new Error('An account with this email already exists.'));
            } else {
                const newUser: User = {
                    ...mockCreator, // Use mock as a template for a new creator
                    id: `user-${new Date().getTime()}`,
                    email,
                    password,
                    name: 'New Creator', // Placeholder name
                    role: 'creator',
                    landingPage: mockCreator.landingPage // Give them a default landing page
                };
                setAllUsers(prev => [...prev, newUser]);
                setCurrentUser(newUser);
                setPage('onboarding');
                resolve();
            }
        }, 500);
    });
  };

  const handleOnboardingComplete = (details: OnboardingDetails) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, name: details.name };
    setCurrentUser(updatedUser);
    // Also update the user in the main list
    setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    setPage('app');
    setDashboardView('dashboard');
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
    setPage('home');
  };

  const handleAddNewProduct = () => {
    setProductToEdit(null);
    setIsProductFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setProductToEdit(product);
    setIsProductFormOpen(true);
  };

  const handleSaveProduct = (product: Product) => {
    setProducts(prev => {
      const index = prev.findIndex(p => p.id === product.id);
      if (index > -1) {
        const newProducts = [...prev];
        newProducts[index] = product;
        return newProducts;
      }
      return [product, ...prev];
    });
    setIsProductFormOpen(false);
    setProductToEdit(null);
  };

  const handleViewContent = (product: Product) => {
    setSelectedProduct(product);
    setDashboardView('course_player');
  };

  const renderDashboardView = () => {
    if (!currentUser) return null;
    
    const students = allUsers.filter(u => u.role === 'student');

    switch (dashboardView) {
      case 'dashboard':
        return <DashboardOverview 
            sales={mockSales}
            students={students}
            products={products}
            currentUser={currentUser}
        />;
      case 'products':
          return <ProductManagement 
            products={products}
            onEditProduct={handleEditProduct}
            onDeleteProduct={() => { /* Implement delete */}}
          />;
      case 'students':
          return <StudentManagement />;
      case 'marketing':
          return <MarketingPage />;
      case 'settings':
        return <CreatorSettings currentUser={currentUser} onUpdateSettings={() => {}} onNavigateToSiteEditor={() => setDashboardView('site_editor')} />;
      case 'site_editor':
        return <SiteEditor creator={currentUser} products={products} onUpdateLandingPage={() => {}} onExit={() => setDashboardView('settings')} />;
      case 'storefront':
        return <Storefront creator={currentUser} products={products} onViewProduct={() => {}} onAddToCart={() => {}} onGetFree={() => {}} />;
      case 'student_library':
        return <StudentLibrary products={products} onViewContent={handleViewContent} />;
      case 'affiliate_dashboard':
        const affiliateUser = allUsers.find(u => u.role === 'affiliate')!;
        return <AffiliateDashboard affiliate={affiliateUser} creator={currentUser} products={products} clicks={mockAffiliateClicks} sales={mockAffiliateSales} />;
      case 'course_player':
        if (selectedProduct) {
          return <CoursePlayerPage product={selectedProduct} currentUser={currentUser} onBack={() => setDashboardView('student_library')} onAddReview={() => {}} />;
        }
        return <StudentLibrary products={products} onViewContent={handleViewContent} />; // Fallback
      default:
        return <DashboardOverview sales={mockSales} students={students} products={products} currentUser={currentUser} />;
    }
  };

  const renderPage = () => {
      switch(page) {
          case 'home':
              return <HomePage onLogin={handleGoToAuth} onSignUp={handleGoToAuth} />;
          case 'auth':
              return <AuthPage onSignIn={handleSignIn} onSignUp={handleSignUp} onBackToHome={handleBackToHome} />;
          case 'onboarding':
              return <Onboarding onComplete={handleOnboardingComplete} />;
          case 'app':
              if (!currentUser) {
                  setPage('home');
                  return null;
              }
              return (
                <>
                  <div className="min-h-screen bg-gray-100">
                    <CreatorLayout
                        currentUser={currentUser}
                        view={dashboardView}
                        setView={setDashboardView}
                        onLogout={handleLogout}
                        onAddNewProduct={handleAddNewProduct}
                    >
                        {renderDashboardView()}
                    </CreatorLayout>
                    <Chatbot />
                  </div>

                   <Modal 
                        isOpen={isProductFormOpen} 
                        onClose={() => setIsProductFormOpen(false)} 
                        title={productToEdit ? 'Edit Product' : 'Add a New Product'}
                    >
                      <ProductForm 
                          onSave={handleSaveProduct}
                          onClose={() => setIsProductFormOpen(false)}
                          creatorId={currentUser.id}
                          defaultCurrency={currentUser.defaultCurrency}
                          productToEdit={productToEdit}
                      />
                  </Modal>
                </>
              );
      }
  };
  
  return renderPage();
};

export default App;