import React from 'react';
import type { PageSection, Product, Currency, Testimonial, FAQItem } from '../types';
import ProductCard from './ProductCard';
import Button from './Button';
import Icon from './Icon';

interface EditorProps {
  isEditorMode?: boolean;
  onEdit?: () => void;
}

interface SectionProps extends EditorProps {
  content: PageSection['content'];
  primaryColor: string;
}

const SectionWrapper: React.FC<{children: React.ReactNode, isEditorMode?: boolean, onEdit?: () => void, buttonText: string}> = ({children, isEditorMode, onEdit, buttonText}) => {
  return (
    <div className="relative group">
      {isEditorMode && (
        <>
          <div className="absolute inset-0 bg-cyan-500 bg-opacity-10 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-2 border-dashed border-cyan-400 rounded-lg"></div>
          <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button onClick={onEdit} size="sm" className="bg-white hover:bg-gray-100 text-gray-800 shadow-lg">
              <Icon name="edit" className="w-4 h-4 mr-2" /> Edit {buttonText}
            </Button>
          </div>
        </>
      )}
      {children}
    </div>
  );
};

export const HeroSection: React.FC<SectionProps> = ({ content, primaryColor, isEditorMode, onEdit }) => (
  <SectionWrapper isEditorMode={isEditorMode} onEdit={onEdit} buttonText="Hero">
    <section className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold tracking-wide uppercase" style={{ color: primaryColor }}>
            {content.subtitle}
          </h2>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            {content.title}
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            {content.text}
          </p>
          {content.ctaText && (
            <div className="mt-8">
              <Button size="lg" style={{ backgroundColor: primaryColor }} className="hover:opacity-90 focus:ring-offset-2 focus:ring-2" focusable="false">{content.ctaText}</Button>
            </div>
          )}
        </div>
      </div>
    </section>
  </SectionWrapper>
);

export const AboutSection: React.FC<SectionProps> = ({ content, isEditorMode, onEdit }) => (
  <SectionWrapper isEditorMode={isEditorMode} onEdit={onEdit} buttonText="About">
    <section className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">{content.title}</h2>
          <p className="mt-4 text-lg text-gray-600 whitespace-pre-line">{content.text}</p>
        </div>
        {content.imageUrl && (
          <div className="order-1 md:order-2">
            <img src={content.imageUrl} alt={content.title || 'About section image'} className="rounded-lg shadow-lg aspect-square object-cover" />
          </div>
        )}
      </div>
    </section>
  </SectionWrapper>
);

interface ProductsGridProps extends SectionProps {
  products: Product[];
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onGetFree: (product: Product) => void;
  displayCurrency: Currency;
  isStandalone?: boolean;
}

export const ProductsGridSection: React.FC<ProductsGridProps> = ({ content, products, onViewProduct, onAddToCart, onGetFree, displayCurrency, isStandalone=true, isEditorMode, onEdit }) => (
  <SectionWrapper isEditorMode={isEditorMode} onEdit={onEdit} buttonText="Products">
    <section className={`${isStandalone ? 'bg-gray-50 py-16 sm:py-24' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">{content.title}</h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard 
                key={product.id}
                product={product}
                context="storefront"
                onView={onViewProduct}
                onAddToCart={onAddToCart}
                onGetFree={onGetFree}
                displayCurrency={displayCurrency}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10 border-2 border-dashed rounded-lg">
            <p>Your products will be displayed here once you add them.</p>
          </div>
        )}
      </div>
    </section>
  </SectionWrapper>
);

export const TestimonialsSection: React.FC<SectionProps> = ({ content, isEditorMode, onEdit }) => (
  <SectionWrapper isEditorMode={isEditorMode} onEdit={onEdit} buttonText="Testimonials">
    <section className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">{content.title}</h2>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(content.testimonials || []).map((testimonial: Testimonial, index: number) => (
            <div key={index} className="bg-gray-50 p-8 rounded-lg">
              <blockquote className="text-lg text-gray-700">“{testimonial.quote}”</blockquote>
              <p className="mt-4 font-semibold text-gray-900">{testimonial.author}</p>
              <p className="text-sm text-gray-600">{testimonial.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </SectionWrapper>
);

export const FAQSection: React.FC<SectionProps> = ({ content, isEditorMode, onEdit }) => (
  <SectionWrapper isEditorMode={isEditorMode} onEdit={onEdit} buttonText="FAQ">
    <section className="bg-gray-50 py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">{content.title}</h2>
        <div className="space-y-4">
          {(content.items || []).map((item: FAQItem, index: number) => (
            <details key={index} className="bg-white p-6 rounded-lg shadow-sm group">
              <summary className="font-semibold text-lg cursor-pointer flex justify-between items-center">
                {item.question}
                <span className="transform group-open:rotate-45 transition-transform text-cyan-500 text-2xl font-light">+</span>
              </summary>
              <p className="mt-4 text-gray-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  </SectionWrapper>
);

export const CTASection: React.FC<SectionProps> = ({ content, primaryColor, isEditorMode, onEdit }) => (
  <SectionWrapper isEditorMode={isEditorMode} onEdit={onEdit} buttonText="CTA">
    <section style={{ backgroundColor: primaryColor }}>
      <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          <span className="block">{content.title}</span>
        </h2>
        <p className="mt-4 text-lg leading-6" style={{color: 'rgba(255,255,255,0.8)'}}>{content.text}</p>
        {content.ctaText && (
          <div className="mt-8">
             <Button size="lg" variant="secondary" focusable="false">{content.ctaText}</Button>
          </div>
        )}
      </div>
    </section>
  </SectionWrapper>
);