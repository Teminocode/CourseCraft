import { LandingPage, PageSectionType } from '../types';

export const defaultLandingPage: LandingPage = {
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
    {
      id: 'cta-1',
      type: PageSectionType.CTA,
      content: {
        title: "Ready to Start Learning?",
        text: "Join hundreds of students and start your journey today.",
        ctaText: "Sign Up Now"
      }
    }
  ],
};

export const templates: LandingPage[] = [
  {
    templateId: 'minimalist',
    sections: [
      {
        id: 'hero-minimalist',
        type: PageSectionType.HERO,
        content: {
          subtitle: 'Expert Insights',
          title: 'Clarity in Complexity',
          text: 'Master new skills with focused, high-quality courses designed for modern professionals.',
          ctaText: 'Browse Courses',
        },
      },
      {
        id: 'about-minimalist',
        type: PageSectionType.ABOUT,
        content: {
          title: 'About The Creator',
          text: `With over a decade of experience in the industry, I'm passionate about sharing knowledge and helping others achieve their goals. My approach is simple: break down complex topics into actionable steps that you can apply immediately. I believe learning should be engaging, practical, and inspiring.`,
          imageUrl: 'a professional headshot of a person in a minimalist office, smiling warmly, soft natural light'
        }
      },
      {
        id: 'products-minimalist',
        type: PageSectionType.PRODUCTS,
        content: {
          title: 'My Digital Products',
        },
      },
      {
        id: 'faq-minimalist',
        type: PageSectionType.FAQ,
        content: {
            title: "Frequently Asked Questions",
            items: [
                { question: "What do I get when I purchase a course?", answer: "You get lifetime access to all course materials, including videos, downloadable resources, and future updates." },
                { question: "Can I get a refund if I'm not satisfied?", answer: "Absolutely. We offer a 30-day money-back guarantee, no questions asked." },
                { question: "How do I access the course content?", answer: "Once purchased, you can access your courses anytime through your personal library on this website." }
            ]
        }
      },
    ],
  },
  {
    templateId: 'creative',
    sections: [
      {
        id: 'hero-creative',
        type: PageSectionType.HERO,
        content: {
          subtitle: 'Unleash Your Potential',
          title: 'Create. Inspire. Monetize.',
          text: 'A collection of resources, courses, and tools designed to fuel your creative journey.',
          ctaText: 'Start Creating',
        },
      },
      {
        id: 'products-creative',
        type: PageSectionType.PRODUCTS,
        content: {
          title: 'My Creative Toolkit',
        },
      },
      {
        id: 'testimonials-creative',
        type: PageSectionType.TESTIMONIALS,
        content: {
            title: "What My Students Are Saying",
            testimonials: [
                { quote: "This was a game-changer for my workflow. The techniques are practical and immediately applicable.", author: "Alex Johnson", role: "Graphic Designer" },
                { quote: "I've taken many online courses, and this one stands out for its clarity and depth. Highly recommended!", author: "Maria Garcia", role: "Illustrator" },
                { quote: "The community aspect is fantastic. It's great to learn and connect with other creatives.", author: "Sam Lee", role: "Photographer" }
            ]
        }
      },
      {
        id: 'cta-creative',
        type: PageSectionType.CTA,
        content: {
          title: "Join The Creative Community",
          text: "Get access to exclusive content and connect with fellow creators.",
          ctaText: "Become a Member"
        }
      }
    ]
  },
];
