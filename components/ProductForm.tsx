import React, { useState, useEffect, useRef } from 'react';
// Fix: Use relative path for type imports
import { Product, Lesson, Resource, SchoolDay, CertificateDesign, AspectRatio, ProductType, Currency, ResourceType } from '../types';
import Button from './Button';
import Icon from './Icon';
import Certificate from './Certificate';
import { generateDescription, generateImage, generateCertificateDesign } from '../services/geminiService';

interface ProductFormProps {
  onSave: (product: Product) => void;
  onClose: () => void;
  productToEdit?: Product | null;
  defaultCurrency?: Currency;
  creatorId: string;
}

const getEmbedUrl = (url: string): string | null => {
    if (!url) return null;

    // Check if it's already a valid embed URL
    if (url.includes('youtube.com/embed/') || url.includes('player.vimeo.com/video/')) {
        return url;
    }

    let videoId;
    
    // YouTube
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch && youtubeMatch[1]) {
        videoId = youtubeMatch[1];
        return `https://www.youtube.com/embed/${videoId}`;
    }

    // Vimeo
    const vimeoRegex = /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(?:video\/)?(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch && vimeoMatch[1]) {
        videoId = vimeoMatch[1];
        return `https://player.vimeo.com/video/${videoId}`;
    }

    return null;
};

const ProductForm: React.FC<ProductFormProps> = ({ onSave, onClose, productToEdit, defaultCurrency, creatorId }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<ProductType>(ProductType.COURSE);
  const [price, setPrice] = useState(0);
  const [currency, setCurrency] = useState<Currency>(defaultCurrency || Currency.NGN);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [schoolDays, setSchoolDays] = useState<SchoolDay[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [certificateEnabled, setCertificateEnabled] = useState(false);
  const [certificateDesign, setCertificateDesign] = useState<CertificateDesign | undefined>();

  const [aiKeywords, setAiKeywords] = useState('');
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [imagePrompt, setImagePrompt] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingCert, setIsGeneratingCert] = useState(false);
  const [imageInputMethod, setImageInputMethod] = useState<'ai' | 'upload'>('ai');
  const [imageAspectRatio, setImageAspectRatio] = useState<AspectRatio>('4:3');
  
  const objectUrls = useRef<string[]>([]);

  const defaultCertificateDesign: CertificateDesign = {
      prompt: 'A modern, professional design',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
      accentColor: '#06B6D4',
      borderColor: '#374151',
      fontFamily: "'Inter', sans-serif",
      badgeColor: '#FBBF24',
  };

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setType(productToEdit.type);
      setPrice(productToEdit.price);
      setCurrency(productToEdit.currency);
      setDescription(productToEdit.description);
      setImageUrl(productToEdit.imageUrl);
      setLessons(productToEdit.lessons?.map(l => ({
          ...l,
          videoInputMethod: l.videoInputMethod || 'url',
          resources: l.resources.map(r => ({ ...r, type: r.type || ResourceType.FILE, resourceInputMethod: r.resourceInputMethod || 'url', accessType: r.accessType || 'download' }))
      })) || []);
      setSchoolDays(productToEdit.schoolDays?.map(day => ({
          ...day,
          lessons: day.lessons.map(l => ({
              ...l,
              videoInputMethod: l.videoInputMethod || 'url',
              resources: l.resources.map(r => ({...r, type: r.type || ResourceType.FILE, resourceInputMethod: r.resourceInputMethod || 'url', accessType: r.accessType || 'download' }))
          }))
      })) || []);
      setResources(productToEdit.resources?.map(r => ({ ...r, type: r.type || ResourceType.FILE, resourceInputMethod: r.resourceInputMethod || 'url', accessType: r.accessType || 'download' })) || []);
      setCertificateEnabled(productToEdit.certificateEnabled || false);
      setCertificateDesign(productToEdit.certificateDesign || defaultCertificateDesign);
      setImagePrompt(productToEdit.name);
      setImageInputMethod('upload');
    } else {
      // Reset form
      setName('');
      setType(ProductType.COURSE);
      setPrice(0);
      setCurrency(defaultCurrency || Currency.NGN);
      setDescription('');
      setImageUrl('');
      setLessons([]);
      setSchoolDays([]);
      setResources([]);
      setCertificateEnabled(false);
      setCertificateDesign(defaultCertificateDesign);
      setImagePrompt('');
      setAiKeywords('');
      setImageInputMethod('ai');
      setImageAspectRatio('4:3');
    }
  }, [productToEdit, defaultCurrency]);

  useEffect(() => {
    // Cleanup function to revoke all created object URLs when the component unmounts
    return () => {
      objectUrls.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const handleGenerateDescription = async () => {
      if (!name) {
          alert("Please enter a product title first.");
          return;
      }
      setIsGeneratingDesc(true);
      try {
          const generatedDesc = await generateDescription(name, type, aiKeywords);
          setDescription(generatedDesc);
      } catch (error) {
          if (error instanceof Error) {
            alert(error.message);
          }
      } finally {
          setIsGeneratingDesc(false);
      }
  };

  const handleGenerateImage = async () => {
      if (!imagePrompt.trim()) {
          alert("Please enter a prompt for the image.");
          return;
      }
      setIsGeneratingImage(true);
      try {
          const generatedImageUrl = await generateImage(imagePrompt, imageAspectRatio);
          setImageUrl(generatedImageUrl);
      } catch (error) {
          if (error instanceof Error) {
            alert(error.message);
          }
      } finally {
          setIsGeneratingImage(false);
      }
  };

  const handleCropImage = () => {
    if (!imageUrl) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        alert("Could not process image. Your browser may not support this feature.");
        return;
      }

      const [targetW, targetH] = imageAspectRatio.split(':').map(Number);
      const targetRatio = targetW / targetH;
      
      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = img.width;
      let sourceHeight = img.height;
      const sourceRatio = img.width / img.height;

      if (sourceRatio > targetRatio) {
        sourceWidth = img.height * targetRatio;
        sourceX = (img.width - sourceWidth) / 2;
      } else if (sourceRatio < targetRatio) {
        sourceHeight = img.width / targetRatio;
        sourceY = (img.height - sourceHeight) / 2;
      }
      
      const MAX_DIMENSION = 1200;
      let outputWidth = sourceWidth;
      let outputHeight = sourceHeight;

      if (outputWidth > MAX_DIMENSION || outputHeight > MAX_DIMENSION) {
        if (outputWidth > outputHeight) {
          outputHeight = (MAX_DIMENSION / outputWidth) * outputHeight;
          outputWidth = MAX_DIMENSION;
        } else {
          outputWidth = (MAX_DIMENSION / outputHeight) * outputWidth;
          outputHeight = MAX_DIMENSION;
        }
      }

      canvas.width = outputWidth;
      canvas.height = outputHeight;

      ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, outputWidth, outputHeight);

      const croppedImageUrl = canvas.toDataURL('image/png');

      if (imageUrl.startsWith('blob:')) {
          URL.revokeObjectURL(imageUrl);
          objectUrls.current = objectUrls.current.filter(url => url !== imageUrl);
      }

      setImageUrl(croppedImageUrl);
    };
    img.onerror = () => {
        alert("Failed to load image for cropping. The image might be inaccessible.");
    };
    img.src = imageUrl;
  };
  
  const handleGenerateCertificate = async () => {
    if (!certificateDesign?.prompt) {
        alert("Please enter a design prompt.");
        return;
    }
    setIsGeneratingCert(true);
    try {
        const design = await generateCertificateDesign(certificateDesign.prompt);
        setCertificateDesign(design);
    } catch(e) {
        if (e instanceof Error) {
            alert(e.message);
        }
    } finally {
        setIsGeneratingCert(false);
    }
  };

  const handleImageUpload = (file: File | null) => {
    if (file) {
        if (imageUrl.startsWith('blob:')) {
            URL.revokeObjectURL(imageUrl);
            objectUrls.current = objectUrls.current.filter(url => url !== imageUrl);
        }
        const blobUrl = URL.createObjectURL(file);
        objectUrls.current.push(blobUrl);
        setImageUrl(blobUrl);
    }
  };


  // --- Course Lesson Handlers ---
  const handleAddLesson = () => {
    setLessons([...lessons, { id: new Date().toISOString(), title: '', videoUrl: '', videoFileName: '', resources: [], videoInputMethod: 'upload' }]);
  };

  const handleLessonChange = (index: number, field: keyof Lesson, value: any) => {
    const newLessons = [...lessons];
    (newLessons[index] as any)[field] = value;
    setLessons(newLessons);
  };
  
  const handleDeleteLesson = (index: number) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      setLessons(lessons.filter((_, i) => i !== index));
    }
  };
  
  const handleLessonVideoUpload = (index: number, file: File | null) => {
    const newLessons = [...lessons];
    if(file) {
      const blobUrl = URL.createObjectURL(file);
      objectUrls.current.push(blobUrl);
      newLessons[index].videoUrl = blobUrl;
      newLessons[index].videoFileName = file.name;
    } else {
      newLessons[index].videoUrl = '';
      newLessons[index].videoFileName = '';
    }
    setLessons(newLessons);
  };

  const handleAddResourceToLesson = (lessonIndex: number) => {
    const newLessons = [...lessons];
    newLessons[lessonIndex].resources.push({ id: new Date().toISOString(), name: '', type: ResourceType.FILE, fileUrl: '', fileName: '', resourceInputMethod: 'upload', accessType: 'download' });
    setLessons(newLessons);
  };

  const handleResourceChangeInLesson = (lessonIndex: number, resourceIndex: number, field: keyof Resource, value: any) => {
    const newLessons = [...lessons];
    (newLessons[lessonIndex].resources[resourceIndex] as any)[field] = value;
    setLessons(newLessons);
  };

  const handleResourceFileUploadInLesson = (lessonIndex: number, resourceIndex: number, file: File | null) => {
    const newLessons = [...lessons];
    if(file) {
      const blobUrl = URL.createObjectURL(file);
      objectUrls.current.push(blobUrl);
      newLessons[lessonIndex].resources[resourceIndex].fileUrl = blobUrl;
      newLessons[lessonIndex].resources[resourceIndex].fileName = file.name;
    } else {
      newLessons[lessonIndex].resources[resourceIndex].fileUrl = '';
      newLessons[lessonIndex].resources[resourceIndex].fileName = '';
    }
    setLessons(newLessons);
  };

  const handleDeleteResourceFromLesson = (lessonIndex: number, resourceIndex: number) => {
    const newLessons = [...lessons];
    newLessons[lessonIndex].resources = newLessons[lessonIndex].resources.filter((_, i) => i !== resourceIndex);
    setLessons(newLessons);
  };

  
  // --- School Day and Nested Lesson Handlers ---
  const handleAddSchoolDay = () => {
    const newDayNumber = schoolDays.length + 1;
    setSchoolDays([...schoolDays, { id: new Date().toISOString(), day: newDayNumber, title: `Day ${newDayNumber}`, lessons: [] }]);
  };
  
  const handleSchoolDayChange = (dayIndex: number, value: string) => {
    const newSchoolDays = [...schoolDays];
    newSchoolDays[dayIndex].title = value;
    setSchoolDays(newSchoolDays);
  };

  const handleDeleteSchoolDay = (dayIndex: number) => {
    if (window.confirm('Are you sure you want to delete this day and all its lessons?')) {
        setSchoolDays(schoolDays.filter((_, i) => i !== dayIndex));
    }
  };
  
  const handleAddLessonToDay = (dayIndex: number) => {
    const newSchoolDays = [...schoolDays];
    newSchoolDays[dayIndex].lessons.push({ id: new Date().toISOString(), title: '', videoUrl: '', videoFileName: '', resources: [], videoInputMethod: 'upload' });
    setSchoolDays(newSchoolDays);
  };

  const handleDeleteLessonFromDay = (dayIndex: number, lessonIndex: number) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
        const newSchoolDays = [...schoolDays];
        newSchoolDays[dayIndex].lessons = newSchoolDays[dayIndex].lessons.filter((_, i) => i !== lessonIndex);
        setSchoolDays(newSchoolDays);
    }
  };
  
  const handleSchoolLessonChange = (dayIndex: number, lessonIndex: number, field: keyof Lesson, value: string) => {
    const newSchoolDays = [...schoolDays];
    (newSchoolDays[dayIndex].lessons[lessonIndex] as any)[field] = value;
    setSchoolDays(newSchoolDays);
  };
  
  const handleSchoolLessonVideoUpload = (dayIndex: number, lessonIndex: number, file: File | null) => {
    const newSchoolDays = [...schoolDays];
    const lesson = newSchoolDays[dayIndex].lessons[lessonIndex];
    if(file) {
      const blobUrl = URL.createObjectURL(file);
      objectUrls.current.push(blobUrl);
      lesson.videoUrl = blobUrl;
      lesson.videoFileName = file.name;
    } else {
      lesson.videoUrl = '';
      lesson.videoFileName = '';
    }
    setSchoolDays(newSchoolDays);
  };

  const handleAddResourceToSchoolLesson = (dayIndex: number, lessonIndex: number) => {
    const newSchoolDays = [...schoolDays];
    newSchoolDays[dayIndex].lessons[lessonIndex].resources.push({ id: new Date().toISOString(), name: '', type: ResourceType.FILE, fileUrl: '', fileName: '', resourceInputMethod: 'upload', accessType: 'download' });
    setSchoolDays(newSchoolDays);
  };

  const handleResourceChangeInSchoolLesson = (dayIndex: number, lessonIndex: number, resourceIndex: number, field: keyof Resource, value: any) => {
    const newSchoolDays = [...schoolDays];
    (newSchoolDays[dayIndex].lessons[lessonIndex].resources[resourceIndex] as any)[field] = value;
    setSchoolDays(newSchoolDays);
  };

  const handleResourceFileUploadInSchoolLesson = (dayIndex: number, lessonIndex: number, resourceIndex: number, file: File | null) => {
    const newSchoolDays = [...schoolDays];
    const resource = newSchoolDays[dayIndex].lessons[lessonIndex].resources[resourceIndex];
    if(file) {
      const blobUrl = URL.createObjectURL(file);
      objectUrls.current.push(blobUrl);
      resource.fileUrl = blobUrl;
      resource.fileName = file.name;
    } else {
      resource.fileUrl = '';
      resource.fileName = '';
    }
    setSchoolDays(newSchoolDays);
  };

  const handleDeleteResourceFromSchoolLesson = (dayIndex: number, lessonIndex: number, resourceIndex: number) => {
    const newSchoolDays = [...schoolDays];
    newSchoolDays[dayIndex].lessons[lessonIndex].resources = newSchoolDays[dayIndex].lessons[lessonIndex].resources.filter((_, i) => i !== resourceIndex);
    setSchoolDays(newSchoolDays);
  };

  
  // --- Generic Resource Handlers ---
  const createResourceUI = (resources: Resource[], setResourcesFn: React.Dispatch<React.SetStateAction<Resource[]>>) => {
    
    const handleAdd = () => {
        setResourcesFn([...resources, { id: new Date().toISOString(), name: '', type: ResourceType.FILE, fileUrl: '', fileName: '', resourceInputMethod: 'upload', accessType: 'download' }]);
    };
    
    const handleDelete = (index: number) => {
        setResourcesFn(resources.filter((_, i) => i !== index));
    };

    const handleChange = (index: number, field: keyof Resource, value: any) => {
        const newResources = [...resources];
        (newResources[index] as any)[field] = value;
        setResourcesFn(newResources);
    };

    const handleFileUpload = (index: number, file: File | null) => {
        const newResources = [...resources];
        if (file) {
            const blobUrl = URL.createObjectURL(file);
            objectUrls.current.push(blobUrl);
            newResources[index].fileUrl = blobUrl;
            newResources[index].fileName = file.name;
        } else {
            newResources[index].fileUrl = '';
            newResources[index].fileName = '';
        }
        setResourcesFn(newResources);
    };

    return (
        <div className="space-y-4">
            {resources.map((resource, index) => (
                 <div key={resource.id} className="p-3 bg-white rounded-md border space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-600">Resource {index + 1}</label>
                        <Button type="button" variant="ghost" onClick={() => handleDelete(index)} className="!p-1 text-red-500 hover:bg-red-50">
                            <Icon name="trash" className="w-4 h-4" />
                        </Button>
                    </div>
                    <input type="text" value={resource.name} onChange={(e) => handleChange(index, 'name', e.target.value)} className={`${formFieldClasses}`} placeholder="Resource Name (e.g., Workbook.pdf)" />
                    
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={() => handleChange(index, 'resourceInputMethod', 'upload')} className={inputMethodButton(resource.resourceInputMethod === 'upload')}>Upload File</button>
                        <button type="button" onClick={() => handleChange(index, 'resourceInputMethod', 'url')} className={inputMethodButton(resource.resourceInputMethod === 'url')}>Enter URL</button>
                    </div>

                    {resource.resourceInputMethod === 'upload' ? (
                        resource.fileName ? (
                            <div className="flex items-center justify-between p-2 bg-gray-100 border rounded-md text-sm">
                                <div className="flex items-center gap-2 truncate">
                                <Icon name="paper-clip" className="w-4 h-4 text-gray-500 shrink-0" />
                                <span className="truncate text-gray-700">{resource.fileName}</span>
                                </div>
                                <button type="button" onClick={() => handleFileUpload(index, null)} className="ml-2 text-red-500 hover:text-red-700 shrink-0">
                                <Icon name="close" className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <label className="w-full">
                                <span className="sr-only">Choose resource file</span>
                                <input type="file" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 cursor-pointer" onChange={(e) => handleFileUpload(index, e.target.files ? e.target.files[0] : null)} />
                            </label>
                        )
                    ) : (
                        <input type="url" value={resource.fileUrl.startsWith('blob:') ? '' : resource.fileUrl} onChange={(e) => handleChange(index, 'fileUrl', e.target.value)} className={formFieldClasses} placeholder="https://drive.google.com/..." />
                    )}
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Access Type</label>
                        <div className="flex gap-4">
                            <label className="flex items-center text-sm">
                                <input type="radio" name={`access-type-gen-${index}`} value="download" checked={resource.accessType === 'download'} onChange={() => handleChange(index, 'accessType', 'download')} className="focus:ring-cyan-500 h-4 w-4 text-cyan-600 border-gray-300" />
                                <span className="ml-2 text-gray-700">Download</span>
                            </label>
                            <label className="flex items-center text-sm">
                                <input type="radio" name={`access-type-gen-${index}`} value="view" checked={resource.accessType === 'view'} onChange={() => handleChange(index, 'accessType', 'view')} className="focus:ring-cyan-500 h-4 w-4 text-cyan-600 border-gray-300" />
                                <span className="ml-2 text-gray-700">View Online Only</span>
                            </label>
                        </div>
                    </div>
                </div>
            ))}
             <Button type="button" size="sm" variant="secondary" onClick={handleAdd} className="mt-3">
                <Icon name="plus" className="w-4 h-4 mr-1" /> Add Resource
            </Button>
        </div>
    );
  }

  // This is a generic lesson handler that can be reused
  const createLessonUI = (lesson: Lesson, onLessonChange: any, onInputMethodChange: any, onVideoUpload: any, onResourceAdd: any, onResourceChange: any, onResourceInputMethodChange: any, onResourceFileUpload: any, onResourceDelete: any, onLessonDelete: any) => {
     const embedUrl = getEmbedUrl(lesson.videoUrl);
     return (
        <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
            <div className="flex justify-between items-center">
                <input type="text" value={lesson.title} onChange={(e) => onLessonChange('title', e.target.value)} className={formFieldClasses} placeholder="e.g., Introduction to Design" />
                <Button type="button" variant="ghost" size="sm" onClick={onLessonDelete} className="text-red-600 hover:bg-red-50 ml-2">
                    <Icon name="trash" className="w-4 h-4" />
                </Button>
            </div>
            <div>
                <label className={labelClasses}>Lesson Video</label>
                <div className="flex items-center gap-2 mb-2">
                    <button type="button" onClick={() => onInputMethodChange('upload')} className={inputMethodButton(lesson.videoInputMethod === 'upload')}>Upload File</button>
                    <button type="button" onClick={() => onInputMethodChange('url')} className={inputMethodButton(lesson.videoInputMethod === 'url')}>Embed Video</button>
                </div>

                {lesson.videoInputMethod === 'upload' ? (
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <Icon name="video-camera" className="mx-auto h-12 w-12 text-gray-400" />
                            {lesson.videoFileName ? (
                                <>
                                <p className="text-sm text-gray-600 font-medium">{lesson.videoFileName}</p>
                                <button type="button" onClick={() => onVideoUpload(null)} className="text-xs text-red-600 hover:underline font-semibold">Remove Video</button>
                                </>
                            ) : (
                                <>
                                <div className="flex text-sm text-gray-600">
                                    <label htmlFor={`video-upload-${lesson.id}`} className="relative cursor-pointer bg-white rounded-md font-medium text-cyan-600 hover:text-cyan-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-cyan-500">
                                    <span>Upload a video</span>
                                    <input id={`video-upload-${lesson.id}`} type="file" className="sr-only" accept="video/*" onChange={(e) => onVideoUpload(e.target.files ? e.target.files[0] : null)} />
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500">MP4, MOV, etc.</p>
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        <input type="url" value={lesson.videoUrl.startsWith('blob:') ? '' : lesson.videoUrl} onChange={(e) => onLessonChange('videoUrl', e.target.value)} className={formFieldClasses} placeholder="Paste a YouTube or Vimeo link here" />
                        {embedUrl ? (
                            <div className="mt-4 aspect-video bg-gray-200 rounded-lg overflow-hidden border">
                                <iframe
                                    className="w-full h-full"
                                    src={embedUrl}
                                    title="Lesson Video Preview"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        ) : (
                           lesson.videoUrl && <p className="text-xs text-red-500 mt-1">Invalid or unsupported video URL. Please use a valid YouTube or Vimeo link.</p>
                        )}
                    </>
                )}
            </div>
            <div>
                <h5 className="font-semibold text-sm mb-2">Resources for this lesson</h5>
                <div className="space-y-3">
                    {lesson.resources.map((resource, resourceIndex) => (
                       <div key={resource.id} className="p-3 bg-white rounded-md border space-y-3">
                            <div className="flex items-center justify-between">
                                <select value={resource.type} onChange={(e) => onResourceChange(resourceIndex, 'type', e.target.value as ResourceType)} className="p-1 border-gray-300 rounded-md text-sm font-medium text-gray-700 focus:ring-cyan-500 focus:border-cyan-500">
                                    <option value={ResourceType.FILE}>File Resource</option>
                                    <option value={ResourceType.VIDEO}>Video Resource</option>
                                </select>
                                <Button type="button" variant="ghost" onClick={() => onResourceDelete(resourceIndex)} className="!p-1 text-red-500 hover:bg-red-50">
                                <Icon name="trash" className="w-4 h-4" />
                                </Button>
                            </div>
                            <input type="text" value={resource.name} onChange={(e) => onResourceChange(resourceIndex, 'name', e.target.value)} className={`${formFieldClasses}`} placeholder={resource.type === ResourceType.VIDEO ? "Video Title (e.g., Bonus Tutorial)" : "Resource Name (e.g., Workbook.pdf)"} />
                            
                            <div className="flex items-center gap-2">
                                <button type="button" onClick={() => onResourceInputMethodChange(resourceIndex, 'upload')} className={inputMethodButton(resource.resourceInputMethod === 'upload')}>Upload</button>
                                <button type="button" onClick={() => onResourceInputMethodChange(resourceIndex, 'url')} className={inputMethodButton(resource.resourceInputMethod === 'url')}>URL</button>
                            </div>

                            {resource.resourceInputMethod === 'upload' ? (
                                resource.fileName ? (
                                    <div className="flex items-center justify-between p-2 bg-gray-100 border rounded-md text-sm">
                                        <div className="flex items-center gap-2 truncate">
                                        <Icon name={resource.type === ResourceType.VIDEO ? 'video-camera' : 'paper-clip'} className="w-4 h-4 text-gray-500 shrink-0" />
                                        <span className="truncate text-gray-700">{resource.fileName}</span>
                                        </div>
                                        <button type="button" onClick={() => onResourceFileUpload(resourceIndex, null)} className="ml-2 text-red-500 hover:text-red-700 shrink-0">
                                        <Icon name="close" className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="w-full">
                                        <span className="sr-only">Choose resource file</span>
                                        <input type="file" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 cursor-pointer" onChange={(e) => onResourceFileUpload(resourceIndex, e.target.files ? e.target.files[0] : null)} accept={resource.type === ResourceType.VIDEO ? "video/*" : "*"} />
                                    </label>
                                )
                            ) : (
                                <input type="url" value={resource.fileUrl.startsWith('blob:') ? '' : resource.fileUrl} onChange={(e) => onResourceChange(resourceIndex, 'fileUrl', e.target.value)} className={formFieldClasses} placeholder={resource.type === ResourceType.VIDEO ? "https://youtube.com/watch?v=..." : "https://drive.google.com/..."} />
                            )}
                            
                            {resource.type === ResourceType.FILE && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Access Type</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center text-sm">
                                            <input type="radio" name={`access-type-${lesson.id}-${resourceIndex}`} value="download" checked={resource.accessType === 'download'} onChange={() => onResourceChange(resourceIndex, 'accessType', 'download')} className="focus:ring-cyan-500 h-4 w-4 text-cyan-600 border-gray-300" />
                                            <span className="ml-2 text-gray-700">Download</span>
                                        </label>
                                        <label className="flex items-center text-sm">
                                            <input type="radio" name={`access-type-${lesson.id}-${resourceIndex}`} value="view" checked={resource.accessType === 'view'} onChange={() => onResourceChange(resourceIndex, 'accessType', 'view')} className="focus:ring-cyan-500 h-4 w-4 text-cyan-600 border-gray-300" />
                                            <span className="ml-2 text-gray-700">View Online Only</span>
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <Button type="button" size="sm" variant="secondary" onClick={onResourceAdd} className="mt-3">
                    <Icon name="plus" className="w-4 h-4 mr-1" /> Add Resource
                </Button>
            </div>
        </div>
     );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || price < 0) {
      alert('Please fill in product name and a valid price (0 is allowed for free products).');
      return;
    }
    
    // Process lessons to convert video URLs to embeddable format before saving
    const processLesson = (lesson: Lesson): Lesson => ({
        ...lesson,
        videoUrl: lesson.videoInputMethod === 'url' 
            ? (getEmbedUrl(lesson.videoUrl) || lesson.videoUrl) 
            : lesson.videoUrl
    });

    const processedLessons = lessons.map(processLesson);
    const processedSchoolDays = schoolDays.map(day => ({
        ...day,
        lessons: day.lessons.map(processLesson)
    }));
    
    const commonData = {
      id: productToEdit?.id || new Date().toISOString(),
      creatorId,
      name,
      type,
      price,
      currency,
      description,
      imageUrl: imageUrl || `https://picsum.photos/seed/${name}/400/300`,
      certificateEnabled,
    };

    let productData: Product;

    // Use a switch to construct the product data based on its type
    // This ensures no unnecessary data (like empty lessons array for a digital product) is saved
    switch (type) {
      case ProductType.COURSE:
        productData = { 
            ...commonData, 
            lessons: processedLessons, 
            certificateDesign: certificateEnabled ? certificateDesign : undefined 
        };
        break;
      case ProductType.SCHOOL:
        productData = { 
            ...commonData, 
            schoolDays: processedSchoolDays, 
            certificateDesign: certificateEnabled ? certificateDesign : undefined 
        };
        break;
      case ProductType.MEMBERSHIP:
        productData = { 
            ...commonData, 
            resources, 
            certificateDesign: certificateEnabled ? defaultCertificateDesign : undefined 
        };
        break;
      default:
        // For Digital Product, Coaching, etc.
        productData = commonData;
        break;
    }

    onSave(productData);
  };
  
  const formFieldClasses = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";
  const inputMethodButton = (isActive: boolean) => `px-3 py-1 text-sm rounded-md border ${isActive ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-white text-gray-600 hover:bg-gray-100'}`;
  
  const aspectRatios: { value: AspectRatio; label: string }[] = [
    { value: '4:3', label: 'Landscape (4:3)' },
    { value: '3:4', label: 'Portrait (3:4)' },
    { value: '1:1', label: 'Square (1:1)' },
    { value: '16:9', label: 'Widescreen (16:9)' },
    { value: '9:16', label: 'Tall (9:16)' },
  ];
  const aspectRatioButton = (value: AspectRatio) => `px-3 py-1.5 text-sm rounded-md border ${imageAspectRatio === value ? 'bg-cyan-600 text-white border-cyan-600 font-semibold' : 'bg-white text-gray-600 hover:bg-gray-100'}`;


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Info Fields */}
        <div>
            <label htmlFor="name" className={labelClasses}>Product Name</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className={formFieldClasses} required />
        </div>
        <div>
            <label htmlFor="type" className={labelClasses}>Product Type</label>
            <select id="type" value={type} onChange={(e) => setType(e.target.value as ProductType)} className={formFieldClasses}>
            {Object.values(ProductType).map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
            <label htmlFor="price" className={labelClasses}>Price</label>
            <input type="number" id="price" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} className={formFieldClasses} required min="0" />
            </div>
            <div>
            <label htmlFor="currency" className={labelClasses}>Currency</label>
            <select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className={formFieldClasses}>
                {Object.values(Currency).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            </div>
        </div>
        <div>
            <label className={labelClasses}>Product Image</label>
            <div className="mt-1 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="w-full bg-gray-200 rounded-md flex items-center justify-center overflow-hidden shrink-0 mb-4" style={{ aspectRatio: imageAspectRatio.replace(':', ' / ') }}>
                    {isGeneratingImage ? (
                        <div className="text-center text-gray-500">
                           <svg className="animate-spin h-8 w-8 text-cyan-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="text-xs mt-2">Generating...</p>
                        </div>
                    ) : imageUrl ? (
                        <img src={imageUrl} alt="Product preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-center text-gray-500 p-4">
                            <Icon name="upload" className="w-10 h-10 mx-auto" />
                            <span className="text-sm font-medium">Image Preview</span>
                            <p className="text-xs">Recommended: {imageAspectRatio}</p>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 mb-4">
                    <button type="button" onClick={() => setImageInputMethod('upload')} className={inputMethodButton(imageInputMethod === 'upload')}>
                        Upload Image
                    </button>
                    <button type="button" onClick={() => setImageInputMethod('ai')} className={inputMethodButton(imageInputMethod === 'ai')}>
                        Generate with AI
                    </button>
                </div>
                
                {imageInputMethod === 'upload' ? (
                    <div>
                        <label htmlFor="image-upload" className="sr-only">Choose image</label>
                        <input 
                            id="image-upload"
                            type="file" 
                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 cursor-pointer" 
                            accept="image/png, image/jpeg, image/webp"
                            onChange={(e) => handleImageUpload(e.target.files ? e.target.files[0] : null)}
                        />
                    </div>
                ) : (
                    <div>
                        <label htmlFor="imagePrompt" className={labelClasses}>AI Image Prompt</label>
                        <input type="text" id="imagePrompt" placeholder="e.g., A minimalist logo for a design course" value={imagePrompt} onChange={(e) => setImagePrompt(e.target.value)} className={formFieldClasses} />
                        <Button type="button" variant="secondary" onClick={handleGenerateImage} disabled={isGeneratingImage} className="mt-2 w-full">
                            <Icon name="ai" className="w-5 h-5"/>
                            {isGeneratingImage ? 'Generating...' : 'Generate Image'}
                        </Button>
                    </div>
                )}

                 <div className="mt-4 pt-4 border-t">
                    <label className={`${labelClasses} mb-2`}>Image Tools</label>
                    <div className="space-y-3">
                        <div>
                            <p className="text-xs text-gray-500 mb-2">Select an aspect ratio for AI generation or cropping.</p>
                            <div className="flex flex-wrap gap-2">
                                {aspectRatios.map(ratio => (
                                    <button
                                        key={ratio.value}
                                        type="button"
                                        onClick={() => setImageAspectRatio(ratio.value)}
                                        className={aspectRatioButton(ratio.value)}
                                    >
                                        {ratio.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {imageUrl && (
                            <Button type="button" variant="secondary" onClick={handleCropImage} className="w-full">
                                Crop Image to {imageAspectRatio}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
        <div>
            <label htmlFor="description" className={labelClasses}>Description</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className={`${formFieldClasses} min-h-[120px]`} rows={5}></textarea>
            
            <div className="mt-3 p-3 bg-cyan-50 border border-cyan-200 rounded-lg">
                <p className="text-sm font-semibold text-cyan-800 mb-2">Need inspiration?</p>
                <div className="flex flex-col sm:flex-row gap-2">
                    <input type="text" placeholder="Enter keywords (e.g. 'for beginners, social media')" value={aiKeywords} onChange={(e) => setAiKeywords(e.target.value)} className={`${formFieldClasses} flex-grow`} />
                    <Button type="button" variant="secondary" onClick={handleGenerateDescription} disabled={isGeneratingDesc}>
                        <Icon name="ai" className="w-5 h-5"/>
                        {isGeneratingDesc ? 'Generating...' : 'Generate with AI'}
                    </Button>
                </div>
            </div>
        </div>
      
        {/* Additional Options */}
        {(type === ProductType.SCHOOL || type === ProductType.MEMBERSHIP || type === ProductType.COURSE) && (
             <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Options</h3>
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border">
                    <div>
                        <label htmlFor="certificate" className="font-medium text-gray-800">Issue a Certificate</label>
                        <p className="text-sm text-gray-500">Allow students to receive a certificate upon completion.</p>
                    </div>
                    <label htmlFor="certificate" className="flex items-center cursor-pointer">
                        <div className="relative">
                            <input type="checkbox" id="certificate" className="sr-only" checked={certificateEnabled} onChange={() => setCertificateEnabled(!certificateEnabled)} />
                            <div className="block bg-gray-300 w-12 h-7 rounded-full"></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${certificateEnabled ? 'translate-x-full !bg-cyan-600' : ''}`}></div>
                        </div>
                    </label>
                </div>

                {certificateEnabled && type !== ProductType.MEMBERSHIP && (
                    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                        <h4 className="font-semibold text-gray-800 mb-2">Certificate Designer</h4>
                        <p className="text-sm text-gray-500 mb-4">Describe the look and feel of the certificate, and let AI design it for you.</p>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                            <div>
                                <label htmlFor="cert-prompt" className={labelClasses}>Design Prompt</label>
                                <input 
                                    type="text" 
                                    id="cert-prompt"
                                    placeholder="e.g., A formal, elegant design with gold borders" 
                                    value={certificateDesign?.prompt || ''} 
                                    onChange={(e) => setCertificateDesign(prev => ({...(prev || defaultCertificateDesign), prompt: e.target.value }))}
                                    className={formFieldClasses} 
                                />
                                <Button type="button" variant="secondary" onClick={handleGenerateCertificate} disabled={isGeneratingCert} className="mt-2 w-full">
                                    <Icon name="ai" className="w-5 h-5"/>
                                    {isGeneratingCert ? 'Generating...' : 'Generate Design'}
                                </Button>
                            </div>
                            <div className="scale-[0.8] origin-top-left lg:origin-top lg:scale-100">
                                <p className={labelClasses + " mb-2"}>Design Preview</p>
                                {isGeneratingCert ? (
                                    <div className="h-60 flex items-center justify-center border rounded-lg bg-white"><p className="text-sm text-gray-500">Generating design...</p></div>
                                ) : (
                                    <Certificate studentName="Student Name" courseName={name || "Product Name"} date="Oct 26, 2023" design={certificateDesign} previewMode />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )}

        {/* Course Content Builder */}
        {type === ProductType.COURSE && (
            <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Course Content</h3>
                <div className="space-y-4">
                    {lessons.map((lesson, lessonIndex) => (
                        <div key={lesson.id} className="p-4 border rounded-lg bg-gray-50">
                            <h4 className="font-semibold mb-4">Lesson {lessonIndex + 1}</h4>
                            {createLessonUI(
                                lesson,
                                (field: keyof Lesson, value: any) => handleLessonChange(lessonIndex, field, value),
                                (method: 'upload' | 'url') => handleLessonChange(lessonIndex, 'videoInputMethod', method),
                                (file: File | null) => handleLessonVideoUpload(lessonIndex, file),
                                () => handleAddResourceToLesson(lessonIndex),
                                (resIndex: number, field: keyof Resource, value: any) => handleResourceChangeInLesson(lessonIndex, resIndex, field, value),
                                (resIndex: number, method: 'upload' | 'url') => handleResourceChangeInLesson(lessonIndex, resIndex, 'resourceInputMethod', method),
                                (resIndex: number, file: File | null) => handleResourceFileUploadInLesson(lessonIndex, resIndex, file),
                                (resIndex: number) => handleDeleteResourceFromLesson(lessonIndex, resIndex),
                                () => handleDeleteLesson(lessonIndex)
                            )}
                        </div>
                    ))}
                </div>
                <Button type="button" variant="secondary" onClick={handleAddLesson} className="mt-4">
                    <Icon name="plus" className="w-5 h-5 mr-2" /> Add Lesson
                </Button>
            </div>
        )}

        {/* School Content Builder */}
        {type === ProductType.SCHOOL && (
            <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">School Curriculum</h3>
                <div className="space-y-6">
                    {schoolDays.map((day, dayIndex) => (
                        <div key={day.id} className="p-4 border rounded-lg bg-gray-50">
                            <div className="flex justify-between items-center mb-4">
                                <input 
                                    type="text" 
                                    value={day.title}
                                    onChange={(e) => handleSchoolDayChange(dayIndex, e.target.value)}
                                    className={`${formFieldClasses} font-semibold !p-2 !border-gray-200`}
                                />
                                <Button type="button" variant="ghost" size="sm" onClick={() => handleDeleteSchoolDay(dayIndex)} className="text-red-600 hover:bg-red-50 ml-4">
                                    <Icon name="trash" className="w-4 h-4 mr-1" /> Delete Day
                                </Button>
                            </div>
                            <div className="space-y-4 pl-4 border-l-2">
                                {day.lessons.map((lesson, lessonIndex) => (
                                    <div key={lesson.id}>
                                       {createLessonUI(
                                            lesson, 
                                            (field: keyof Lesson, value: any) => handleSchoolLessonChange(dayIndex, lessonIndex, field, value), 
                                            (method: 'upload' | 'url') => handleSchoolLessonChange(dayIndex, lessonIndex, 'videoInputMethod', method),
                                            (file: File | null) => handleSchoolLessonVideoUpload(dayIndex, lessonIndex, file),
                                            () => handleAddResourceToSchoolLesson(dayIndex, lessonIndex),
                                            (resIndex: number, field: keyof Resource, value: any) => handleResourceChangeInSchoolLesson(dayIndex, lessonIndex, resIndex, field, value),
                                            (resIndex: number, method: 'upload' | 'url') => handleResourceChangeInSchoolLesson(dayIndex, lessonIndex, resIndex, 'resourceInputMethod', method),
                                            (resIndex: number, file: File | null) => handleResourceFileUploadInSchoolLesson(dayIndex, lessonIndex, resIndex, file),
                                            (resIndex: number) => handleDeleteResourceFromSchoolLesson(dayIndex, lessonIndex, resIndex),
                                            () => handleDeleteLessonFromDay(dayIndex, lessonIndex)
                                        )}
                                    </div>
                                ))}
                                <Button type="button" variant="secondary" size="sm" onClick={() => handleAddLessonToDay(dayIndex)}>
                                    <Icon name="plus" className="w-4 h-4 mr-1" /> Add Lesson to Day {day.day}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
                <Button type="button" variant="secondary" onClick={handleAddSchoolDay} className="mt-4">
                    <Icon name="plus" className="w-5 h-5 mr-2" /> Add Day
                </Button>
            </div>
        )}
        
        {/* Membership Resources */}
        {type === ProductType.MEMBERSHIP && (
            <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Membership Resources</h3>
                <p className="text-sm text-gray-500 mb-4">Add files, links, and other resources that will be available to all members.</p>
                <div className="p-4 border rounded-lg bg-gray-50">
                    {createResourceUI(resources, setResources)}
                </div>
            </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t mt-6">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary">{productToEdit ? 'Save Changes' : 'Create Product'}</Button>
        </div>
    </form>
  );
};

export default ProductForm;