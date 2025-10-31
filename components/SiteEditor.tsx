import React, { useState } from 'react';
import type { User, Product, LandingPage, PageSection } from '../types';
import { HeroSection, AboutSection, ProductsGridSection, TestimonialsSection, FAQSection, CTASection } from './LandingPageSections';
import { PageSectionType } from '../types';
import Button from './Button';
import Icon from './Icon';
import Modal from './Modal';
import { generateImage } from '../services/geminiService';

interface SiteEditorProps {
    creator: User;
    products: Product[];
    onUpdateLandingPage: (page: LandingPage) => void;
    onExit: () => void;
}

const SectionEditModal: React.FC<{
    section: PageSection | null;
    onClose: () => void;
    onSave: (updatedSection: PageSection) => void;
}> = ({ section, onClose, onSave }) => {
    if (!section) return null;

    const [content, setContent] = useState(section.content);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [imagePrompt, setImagePrompt] = useState('');

    const handleChange = (field: string, value: string) => {
        setContent(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onSave({ ...section, content });
        onClose();
    };
    
    const handleGenerateImage = async () => {
        if (!imagePrompt.trim()) {
            alert("Please enter a prompt for the image.");
            return;
        }
        setIsGeneratingImage(true);
        try {
            const generatedImageUrl = await generateImage(imagePrompt, '16:9');
            handleChange('imageUrl', generatedImageUrl);
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            }
        } finally {
            setIsGeneratingImage(false);
        }
    };
    
    const handleImageUpload = (file: File | null) => {
        if (file) {
            const blobUrl = URL.createObjectURL(file);
            handleChange('imageUrl', blobUrl);
        }
    };

    const formFieldClasses = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500";
    const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

    return (
        <Modal isOpen={!!section} onClose={onClose} title={`Editing: ${section.type.charAt(0).toUpperCase() + section.type.slice(1)} Section`}>
            <div className="space-y-4">
                {Object.keys(content).map(key => {
                    if (['testimonials', 'items'].includes(key)) return null; // Handle complex types separately if needed

                    const value = content[key as keyof typeof content] as string;

                    if (key === 'imageUrl') {
                         return (
                            <div key={key}>
                                <label className={labelClasses}>Image</label>
                                <div className="mt-1 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                     <div className="w-full bg-gray-200 rounded-md flex items-center justify-center overflow-hidden shrink-0 mb-4 aspect-video">
                                        {isGeneratingImage ? (
                                            <p>Generating...</p>
                                        ) : value ? (
                                            <img src={value} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <p className="text-gray-500">No image</p>
                                        )}
                                    </div>
                                    <div className="space-y-3">
                                        <input type="file" accept="image/*" onChange={e => handleImageUpload(e.target.files ? e.target.files[0] : null)} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 cursor-pointer" />
                                        <div className="flex gap-2">
                                            <input type="text" placeholder="Or describe an image to generate with AI" value={imagePrompt} onChange={e => setImagePrompt(e.target.value)} className={formFieldClasses} />
                                            <Button onClick={handleGenerateImage} disabled={isGeneratingImage}><Icon name="ai" className="w-5 h-5"/></Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                         );
                    }
                    
                    const isTextArea = key === 'text' || key === 'quote';
                    const inputType = 'text';

                    return (
                        <div key={key}>
                            <label htmlFor={key} className={labelClasses}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                            {isTextArea ? (
                                <textarea id={key} value={value} onChange={e => handleChange(key, e.target.value)} className={`${formFieldClasses} min-h-[100px]`} />
                            ) : (
                                <input type={inputType} id={key} value={value} onChange={e => handleChange(key, e.target.value)} className={formFieldClasses} />
                            )}
                        </div>
                    );
                })}
            </div>
            <div className="mt-6 pt-4 border-t flex justify-end gap-3">
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave}>Save Changes</Button>
            </div>
        </Modal>
    );
};

const SiteEditor: React.FC<SiteEditorProps> = ({ creator, products, onUpdateLandingPage, onExit }) => {
    const [page, setPage] = useState<LandingPage>(creator.landingPage!);
    const [editingSection, setEditingSection] = useState<PageSection | null>(null);

    const handleUpdateSection = (updatedSection: PageSection) => {
        const newSections = page.sections.map(s => s.id === updatedSection.id ? updatedSection : s);
        setPage({ ...page, sections: newSections });
    };
    
    const handleSaveAndExit = () => {
        onUpdateLandingPage(page);
        onExit();
    };

    const renderSection = (section: PageSection) => {
        const props = {
            key: section.id,
            content: section.content,
            primaryColor: creator.storeBranding?.primaryColor || '#06B6D4',
            isEditorMode: true,
            onEdit: () => setEditingSection(section),
        };

        switch (section.type) {
            case PageSectionType.HERO: return <HeroSection {...props} />;
            case PageSectionType.ABOUT: return <AboutSection {...props} />;
            case PageSectionType.PRODUCTS: return <ProductsGridSection {...props} products={products} onViewProduct={()=>{}} onAddToCart={()=>{}} onGetFree={()=>{}} displayCurrency={creator.defaultCurrency || 'NGN'} />;
            case PageSectionType.TESTIMONIALS: return <TestimonialsSection {...props} />;
            case PageSectionType.FAQ: return <FAQSection {...props} />;
            case PageSectionType.CTA: return <CTASection {...props} />;
            default: return null;
        }
    };
    
    return (
        <div className="bg-gray-100 min-h-screen">
            <header className="bg-white p-4 shadow-md sticky top-0 z-30">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="font-bold text-xl text-gray-800">Site Editor</h1>
                        <p className="text-sm text-gray-500">Hover over a section and click "Edit" to make changes.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button onClick={onExit} variant="secondary">Exit Without Saving</Button>
                        <Button onClick={handleSaveAndExit}>
                            <Icon name="upload" className="w-5 h-5 mr-2" />
                            Save & Exit
                        </Button>
                    </div>
                </div>
            </header>
            <main className="py-8">
                 <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                    {page.sections.map(renderSection)}
                </div>
            </main>
            <SectionEditModal 
                section={editingSection} 
                onClose={() => setEditingSection(null)} 
                onSave={handleUpdateSection} 
            />
        </div>
    );
};

export default SiteEditor;