import { GoogleGenAI, Chat, Type } from "@google/genai";
// Fix: Use relative path for type imports
import { ProductType, CertificateDesign, AspectRatio, LandingPage, Product } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
let chat: Chat | null = null;

if (process.env.API_KEY) {
    chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `You are a friendly and helpful assistant for CourseCraft, a platform for creatives worldwide.
            Your goal is to answer questions about the platform, help users navigate its features, and provide tips on how to monetize their expertise.
            Keep your answers concise, encouraging, and use markdown for formatting if needed.`,
        },
    });
}

const handleApiError = (error: unknown, feature: string): Error => {
  console.error(`Error with Gemini API during ${feature}:`, error);
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    if (message.includes('quota') || message.includes('rate limit') || message.includes('resource has been exhausted')) {
      return new Error("API quota exceeded. You've made too many requests in a short time. Please wait a few moments and try again.");
    }
  }
  return new Error(`There was an error generating the ${feature}. Please try again.`);
};


export const generateDescription = async (
  title: string,
  type: ProductType,
  keywords: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("AI service is unavailable. Please configure your API key.");
  }

  const prompt = `
    You are an expert copywriter for digital creatives. 
    Generate a compelling and concise product description for a digital product.
    
    Product Title: "${title}"
    Product Type: ${type}
    Keywords: "${keywords}"
    
    The description should be engaging, highlight the key benefits for the target audience, and be under 100 words.
    Do not use markdown formatting. Output only the description text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    throw handleApiError(error, 'description');
  }
};

export const generateImage = async (prompt: string, aspectRatio: AspectRatio = '4:3'): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API key not available for image generation.");
  }
  const validAspectRatio = aspectRatio as '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `A vibrant, professional, and appealing digital product cover image for an online course/product. Style: minimalist, modern. Subject: ${prompt}`,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: validAspectRatio,
        },
    });
    
    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/png;base64,${base64ImageBytes}`;
    }
    throw new Error("No image was generated.");
  } catch (error) {
    throw handleApiError(error, 'image');
  }
};

export const generateCertificateDesign = async (prompt: string): Promise<CertificateDesign> => {
    if (!process.env.API_KEY) {
        throw new Error("AI service is unavailable. Please configure your API key.");
    }
    const fullPrompt = `Based on the user's prompt: "${prompt}", generate a color scheme and font family for a certificate of completion. Provide valid CSS color values (like '#RRGGBB' or 'rgb(r,g,b)') and a valid, elegant CSS font-family string. The design should be professional and appropriate for a certificate. For fontFamily, provide a primary font and a fallback (e.g., "'Georgia', serif").`;
    
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            prompt: { type: Type.STRING },
            backgroundColor: { type: Type.STRING, description: 'A light, professional CSS background color for the certificate, like #F9FAFB.' },
            textColor: { type: Type.STRING, description: 'A dark, readable CSS color for the main text, like #1F2937.' },
            accentColor: { type: Type.STRING, description: 'A vibrant CSS accent color for the student\'s name, like a deep blue or gold.' },
            borderColor: { type: Type.STRING, description: 'A CSS color for the main border, complementing other colors.' },
            fontFamily: { type: Type.STRING, description: 'A professional and elegant CSS font-family string, e.g., "\'Georgia\', serif".' },
            badgeColor: { type: Type.STRING, description: 'A CSS color for the award badge icon, should be eye-catching, like gold or silver.' },
        },
        required: ['backgroundColor', 'textColor', 'accentColor', 'borderColor', 'fontFamily', 'badgeColor', 'prompt'],
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema,
            },
        });
        const jsonResponse = JSON.parse(response.text);
        // Ensure the original prompt is stored
        jsonResponse.prompt = prompt;
        return jsonResponse;
    } catch (error) {
        throw handleApiError(error, 'certificate design');
    }
};

export const sendMessageToBot = async (message: string): Promise<string> => {
    if (!chat) {
        return "AI service is unavailable. Please configure your API key.";
    }
    try {
        const response = await chat.sendMessage({ message });
        return response.text.trim();
    } catch (error) {
        console.error("Error communicating with chatbot:", error);
         if (error instanceof Error) {
            const message = error.message.toLowerCase();
            if (message.includes('quota')) {
                return "I'm a bit busy right now due to high traffic. Please try again in a moment.";
            }
        }
        return "Sorry, I'm having trouble connecting right now. Please try again later.";
    }
};

export const generateLandingPage = async (
  prompt: string,
  creatorName: string,
  products: Product[]
): Promise<LandingPage> => {
  if (!process.env.API_KEY) {
    throw new Error("AI service is unavailable. Please configure your API key.");
  }

  const productInfo = products.map(p => `- ${p.name}: ${p.description.substring(0, 50)}...`).join('\n');

  const fullPrompt = `
    You are an expert web designer and copywriter. Your task is to generate the structure and content for a compelling landing page for a digital creator.
    
    Creator's Name: ${creatorName}
    Creator's Prompt: "${prompt}"
    Creator's Products:
    ${productInfo}

    Based on this, create a full landing page. It should include several sections in a logical order (e.g., Hero, Products, About, Testimonials, FAQ, Call to Action).
    Generate engaging, professional, and concise text for all titles, subtitles, and descriptions.
    For the testimonials, create 2-3 realistic and positive quotes.
    For the FAQ, create 3-4 relevant questions and answers.
    For imageUrl fields, provide a descriptive prompt for an AI image generator (e.g., "a vibrant abstract image representing a design course").
    The output must be a valid JSON object matching the provided schema. Each section must have a unique ID.
  `;
  
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
        sections: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "A unique identifier for the section, e.g., 'hero-123'." },
                    type: { type: Type.STRING, enum: ['hero', 'about', 'products', 'testimonials', 'faq', 'cta'] },
                    content: {
                        type: Type.OBJECT,
                        properties: {
                            // Common fields that can appear in multiple sections
                            title: { type: Type.STRING },
                            subtitle: { type: Type.STRING },
                            text: { type: Type.STRING },
                            ctaText: { type: Type.STRING },
                            imageUrl: { type: Type.STRING, description: "A descriptive prompt for an AI image generator. e.g. 'a vibrant abstract image representing creativity and learning'."},
                            // Testimonials-specific
                            testimonials: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        quote: { type: Type.STRING },
                                        author: { type: Type.STRING },
                                        role: { type: Type.STRING },
                                    },
                                    required: ['quote', 'author', 'role']
                                }
                            },
                            // FAQ-specific
                            items: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        question: { type: Type.STRING },
                                        answer: { type: Type.STRING },
                                    },
                                    required: ['question', 'answer']
                                }
                            }
                        },
                    }
                },
                required: ['id', 'type', 'content']
            }
        }
    },
    required: ['sections']
  };

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema,
        },
    });
    const jsonResponse = JSON.parse(response.text);
    return jsonResponse as LandingPage;
  } catch (error) {
    throw handleApiError(error, 'landing page');
  }
};