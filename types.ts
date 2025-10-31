

export enum Currency {
  USD = 'USD',
  NGN = 'NGN',
}

export enum ProductType {
  COURSE = 'Course',
  SCHOOL = 'School',
  MEMBERSHIP = 'Membership',
  DIGITAL_PRODUCT = 'Digital Product',
  COACHING = 'Coaching',
}

export enum ResourceType {
  FILE = 'File',
  VIDEO = 'Video',
}

export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  fileUrl: string;
  fileName?: string;
  resourceInputMethod?: 'upload' | 'url';
  accessType?: 'download' | 'view';
}

export interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  videoFileName?: string;
  resources: Resource[];
  videoInputMethod?: 'upload' | 'url';
}

export interface SchoolDay {
  id: string;
  day: number;
  title: string;
  lessons: Lesson[];
}

export interface CertificateDesign {
  prompt: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  borderColor: string;
  fontFamily: string;
  badgeColor: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  creatorId: string;
  name: string;
  type: ProductType;
  price: number;
  currency: Currency;
  description: string;
  imageUrl: string;
  lessons?: Lesson[];
  schoolDays?: SchoolDay[];
  resources?: Resource[];
  certificateEnabled?: boolean;
  certificateDesign?: CertificateDesign;
  reviews?: Review[];
}

export interface PayoutDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
}

export interface AffiliateProgram {
  enabled: boolean;
  commissionRate: number; // percentage
}

export interface StoreBranding {
  primaryColor: string;
  logoUrl?: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export enum PageSectionType {
  HERO = 'hero',
  ABOUT = 'about',
  PRODUCTS = 'products',
  TESTIMONIALS = 'testimonials',
  FAQ = 'faq',
  CTA = 'cta',
}

export interface PageSection {
  id: string;
  type: PageSectionType;
  content: {
    title?: string;
    subtitle?: string;
    text?: string;
    ctaText?: string;
    imageUrl?: string;
    testimonials?: Testimonial[];
    items?: FAQItem[];
  };
}

export interface LandingPage {
  templateId: string;
  sections: PageSection[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'creator' | 'student' | 'affiliate';
  bio?: string;
  defaultCurrency?: Currency;
  storeBranding?: StoreBranding;
  payoutDetails?: PayoutDetails;
  affiliateProgram?: AffiliateProgram;
  landingPage?: LandingPage;
  affiliateId?: string;
}

export interface Sale {
  id: string;
  productId: string;
  studentId: string;
  amount: number;
  currency: Currency;
  date: string;
}

export interface TopProduct {
  name: string;
  sales: number;
}

export interface MonthlySale {
  month: string;
  revenue: number;
}

export interface AffiliateClick {
  id: string;
  affiliateId: string;
  productId: string | null;
  date: string;
}

export interface AffiliateSale {
  id: string;
  affiliateId: string;
  productId: string;
  saleAmount: number;
  commissionAmount: number;
  currency: Currency;
  date: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface Notification {
    id: string;
    type: 'sale' | 'review' | 'milestone';
    message: string;
    date: string;
    read: boolean;
}