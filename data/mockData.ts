

import { User, Product, ProductType, Currency, ResourceType, Review, PageSectionType, LandingPage } from '../types';

export const mockCreator: User = {
    id: 'creator-01',
    name: 'Alex Designs',
    email: 'alex@example.com',
    password: 'password123',
    role: 'creator',
    bio: 'Helping designers level up their skills with practical courses and resources.',
    defaultCurrency: Currency.USD,
    storeBranding: {
        primaryColor: '#06B6D4', // cyan-500
    },
    payoutDetails: {
        bankName: 'Creative Bank',
        accountName: 'Alex Designs LLC',
        accountNumber: '1234567890'
    },
    affiliateProgram: {
        enabled: true,
        commissionRate: 30,
    },
    landingPage: {
        templateId: 'default',
        sections: [
          {
            id: 'hero-1',
            type: PageSectionType.HERO,
            content: {
              subtitle: 'Welcome to My Store',
              title: 'Share Your Knowledge, Grow Your Business',
              text: 'This is your place to sell amazing digital products and connect with your audience. Start building your creative empire today.',
              ctaText: 'Explore Products',
            },
          },
          {
            id: 'products-1',
            type: PageSectionType.PRODUCTS,
            content: {
              title: 'Featured Products',
            },
          },
        ]
    }
};

export const mockReviews: Review[] = [
    { id: 'rev-1', userId: 'student-01', userName: 'Jane Doe', rating: 5, comment: 'This course was amazing! So much value.', date: new Date().toISOString() },
    { id: 'rev-2', userId: 'student-02', userName: 'John Smith', rating: 4, comment: 'Great content, but I wish there were more examples in the last section.', date: new Date().toISOString() },
];

export const mockProducts: Product[] = [
    {
        id: '1',
        creatorId: 'creator-01',
        name: 'Ultimate Figma Masterclass',
        type: ProductType.COURSE,
        price: 50,
        currency: Currency.USD,
        description: 'A comprehensive course to take you from Figma beginner to expert. Covers everything from basics to advanced prototyping and design systems.',
        imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800',
        lessons: [
            { id: 'l1', title: 'Introduction', videoUrl: 'https://www.youtube.com/embed/e_TCk_aY-EA', resources: [] },
            { id: 'l2', title: 'Advanced Components', videoUrl: 'https://www.youtube.com/embed/e_TCk_aY-EA', resources: [] },
        ],
        certificateEnabled: true,
        reviews: mockReviews,
    },
    {
        id: '2',
        creatorId: 'creator-01',
        name: 'Designer\'s Resource Pack',
        type: ProductType.DIGITAL_PRODUCT,
        price: 25,
        currency: Currency.USD,
        description: 'A pack of 100+ high-quality icons, mockups, and templates to speed up your design workflow.',
        imageUrl: 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?q=80&w=800',
        resources: [
            { id: 'r1', name: 'Icon Set', type: ResourceType.FILE, fileUrl: '#' },
            { id: 'r2', name: 'Mockup Templates', type: ResourceType.FILE, fileUrl: '#' },
        ]
    },
    {
        id: '3',
        creatorId: 'creator-01',
        name: 'The Creative Hub',
        type: ProductType.MEMBERSHIP,
        price: 15,
        currency: Currency.USD,
        description: 'Join a community of designers. Get access to exclusive content, monthly Q&As, and a private Discord server.',
        imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800',
    }
];

// Fix: Export allUsers to resolve import error in App.tsx
const studentUsers: User[] = [
    { id: 'student-01', name: 'Jane Doe', email: 'jane.d@example.com', password: 'password123', role: 'student' },
    { id: 'student-02', name: 'John Smith', email: 'john.s@example.com', password: 'password123', role: 'student' },
    { id: 'student-03', name: 'Peter Jones', email: 'peter.j@example.com', password: 'password123', role: 'student' },
    { id: 'student-04', name: 'Mary Anne', email: 'mary.a@example.com', password: 'password123', role: 'student' },
    { id: 'student-05', name: 'Chris Green', email: 'chris.g@example.com', password: 'password123', role: 'student' },
    { id: 'student-06-new', name: 'New Student A', email: 'new.a@example.com', password: 'password123', role: 'student' },
    { id: 'student-07-new', name: 'New Student B', email: 'new.b@example.com', password: 'password123', role: 'student' },
];

const affiliateUser: User = {
    id: 'affiliate-01',
    name: 'Sam Promo',
    email: 'sam@promo.com',
    password: 'password123',
    role: 'affiliate',
    affiliateId: 'sam-promo',
};

export const allUsers: User[] = [
    mockCreator,
    ...studentUsers,
    affiliateUser,
];