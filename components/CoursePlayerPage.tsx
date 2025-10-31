import React, { useState, useEffect, useMemo } from 'react';
// Fix: Use relative path for type imports
import { Product, Lesson, User, ProductType, ResourceType } from '../types';
import Button from './Button';
import Icon from './Icon';
import Modal from './Modal';
import Certificate from './Certificate';
import ReviewForm from './ReviewForm';

interface CoursePlayerPageProps {
  product: Product;
  currentUser: User;
  onBack: () => void;
  onAddReview: (productId: string, rating: number, comment: string) => void;
}

const CoursePlayerPage: React.FC<CoursePlayerPageProps> = ({ product, currentUser, onBack, onAddReview }) => {
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [showCertificate, setShowCertificate] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const isLessonBased = product.type === ProductType.COURSE || product.type === ProductType.SCHOOL;
  
  const userHasReviewed = product.reviews?.some(review => review.userId === currentUser?.id) ?? false;

  const allLessons = useMemo(() => {
    if (product.type === 'School' && product.schoolDays) {
        return product.schoolDays.flatMap(day => day.lessons);
    }
    return product.lessons || [];
  }, [product]);

  useEffect(() => {
    if (allLessons.length > 0) {
      setActiveLesson(allLessons[0]);
    }
  }, [allLessons]);

  const handleMarkAsComplete = () => {
    if (activeLesson) {
        setCompletedLessons(prev => new Set(prev).add(activeLesson.id));
        const currentIndex = allLessons.findIndex(l => l.id === activeLesson.id);
        if (currentIndex < allLessons.length - 1) {
            setActiveLesson(allLessons[currentIndex + 1]);
        }
    }
  };
  
  const handleReviewSubmit = (rating: number, comment: string) => {
    onAddReview(product.id, rating, comment);
    setIsReviewModalOpen(false);
  };

  const totalLessons = allLessons.length;
  const progressPercentage = totalLessons > 0 ? (completedLessons.size / totalLessons) * 100 : 0;
  
  const isAllComplete = completedLessons.size === totalLessons;

  const renderSidebarContent = () => {
    if (product.type === 'School' && product.schoolDays) {
        return product.schoolDays.map(day => (
            <div key={day.id} className="py-2">
                <h3 className="font-bold px-3 pb-2 text-gray-800">{day.title}</h3>
                <ul className="space-y-1">
                    {day.lessons.map(lesson => renderLessonLink(lesson))}
                </ul>
            </div>
        ));
    }
    return <ul className="space-y-2">{allLessons.map(lesson => renderLessonLink(lesson))}</ul>;
  }

  const renderLessonLink = (lesson: Lesson) => {
    const isCompleted = completedLessons.has(lesson.id);
    const isActive = activeLesson?.id === lesson.id;
    return (
        <li key={lesson.id}>
            <button
                onClick={() => setActiveLesson(lesson)}
                className={`w-full text-left p-3 rounded-md flex items-start gap-3 transition-colors ${isActive ? 'bg-cyan-100' : 'hover:bg-gray-100'}`}
            >
                <Icon name={isCompleted ? 'check-circle' : 'play-circle'} className={`w-6 h-6 shrink-0 mt-0.5 ${isCompleted ? 'text-green-500' : (isActive ? 'text-cyan-600' : 'text-gray-400')}`} />
                <div className={isCompleted ? 'opacity-60' : ''}>
                    <p className={`font-semibold ${isActive ? 'text-cyan-800' : ''}`}>{lesson.title}</p>
                </div>
            </button>
        </li>
    );
  }
  
  const renderResourceList = (resources: Product['resources'] = []) => (
     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {resources.map(resource => {
            const isDownload = resource.type === ResourceType.FILE && resource.accessType === 'download';
            const iconName = resource.type === ResourceType.VIDEO ? 'video-camera' : (isDownload ? 'document-download' : 'external-link');
            const actionText = resource.type === ResourceType.VIDEO ? 'Watch' : (isDownload ? 'Download' : 'View');

            return (
                <a 
                    key={resource.id}
                    href={resource.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    download={isDownload ? resource.fileName || resource.name : undefined}
                    className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border hover:bg-gray-50 transition-colors group"
                >
                   <div className="flex items-center gap-3">
                        <Icon name={iconName} className="w-6 h-6 text-cyan-600" />
                        <span className="font-medium text-gray-800">{resource.name}</span>
                   </div>
                   <span className="text-sm font-semibold text-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        {actionText}
                   </span>
                </a>
            );
        })}
    </div>
  )

  return (
    <>
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow-md p-4 flex justify-between items-center z-10 shrink-0">
        <div>
            <h1 className="text-xl font-bold text-gray-900">{product.name}</h1>
            {isLessonBased && <p className="text-sm text-gray-500">{activeLesson?.title}</p>}
        </div>
        <Button onClick={onBack} variant="secondary">
            <Icon name="library" className="w-5 h-5 mr-2" /> Back to Library
        </Button>
      </header>
      <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
        {/* Main Content */}
        <main className="flex-grow p-4 md:p-8 overflow-y-auto">
            {isAllComplete && isLessonBased && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md" role="alert">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                            <p className="font-bold">Congratulations!</p>
                            <p>You have completed all the lessons in this {product.type}. You've graduated!</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                             {product.certificateEnabled && (
                                <Button size="sm" onClick={() => setShowCertificate(true)}>
                                    <Icon name="award" className="w-5 h-5 mr-2"/>
                                    Get Certificate
                                </Button>
                            )}
                            {!userHasReviewed && (
                                <Button size="sm" variant="secondary" onClick={() => setIsReviewModalOpen(true)}>
                                    Leave a Review
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
            
            {/* Membership Content */}
            {product.type === ProductType.MEMBERSHIP && (
                <div>
                     <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl sm:text-3xl font-bold">Membership Resources</h2>
                        {product.certificateEnabled && (
                            <Button onClick={() => setShowCertificate(true)}>
                                <Icon name="award" className="w-5 h-5 mr-2"/>
                                Get Certificate
                            </Button>
                        )}
                    </div>
                    {product.resources && product.resources.length > 0 ? renderResourceList(product.resources) : <p>No resources available yet.</p>}
                </div>
            )}

            {isLessonBased && activeLesson && (
                <div>
                    {/* Video Player */}
                    <div className="aspect-video bg-black rounded-lg shadow-lg overflow-hidden mb-6">
                        <iframe
                            className="w-full h-full"
                            src={activeLesson.videoUrl}
                            title={activeLesson.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>

                    {/* Completion Button */}
                    <div className="flex justify-between items-center">
                         <h2 className="text-2xl sm:text-3xl font-bold">{activeLesson.title}</h2>
                         {completedLessons.has(activeLesson.id) ? (
                            <Button variant="secondary" disabled>
                                <Icon name="check-circle" className="w-5 h-5 mr-2 text-green-500" />
                                Completed
                            </Button>
                         ) : (
                            <Button onClick={handleMarkAsComplete}>
                                Mark as Complete
                            </Button>
                         )}
                    </div>

                    {/* Resources */}
                    {activeLesson.resources.length > 0 && (
                        <div className="mt-8">
                            <h3 className="text-xl sm:text-2xl font-bold mb-4">Lesson Resources</h3>
                            {renderResourceList(activeLesson.resources)}
                        </div>
                    )}
                </div>
            )}
            
            {!isLessonBased && product.type !== ProductType.MEMBERSHIP && !activeLesson && <p>Select a lesson to begin.</p>}
        </main>
        
        {/* Lesson Sidebar */}
        {isLessonBased && (
            <aside className="w-full md:w-80 lg:w-96 bg-white border-l p-4 overflow-y-auto shrink-0">
                <h2 className="text-lg font-bold">{product.type} Progress</h2>
                 <div className="mt-2 mb-4">
                    <div className="flex justify-between items-center text-sm font-medium text-gray-600">
                        <span>{Math.round(progressPercentage)}% Complete</span>
                        <span>{completedLessons.size} / {totalLessons} Lessons</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                        <div className="bg-cyan-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                </div>
                {renderSidebarContent()}
            </aside>
        )}
      </div>
    </div>

     <Modal isOpen={showCertificate} onClose={() => setShowCertificate(false)} title="Certificate of Completion">
        <Certificate 
            studentName={currentUser.name} 
            courseName={product.name}
            date={new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            design={product.certificateDesign}
        />
    </Modal>
    <Modal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} title={`Review "${product.name}"`}>
        <ReviewForm onSubmit={handleReviewSubmit} />
    </Modal>
    </>
  );
};

export default CoursePlayerPage;