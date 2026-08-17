import { submitForm } from './formDelivery';
// Newsletter subscription.
//
// Delivery goes through lib/formDelivery (a form service when
// VITE_FORM_ENDPOINT is set, otherwise a prefilled email). The welcome-email
// preview below is genuine product copy shown back to the subscriber — it is
// what they can expect to receive, not a simulation of sending.

export interface SubscribeResult {
  success: boolean;
  email: string;
  welcomeEmail: WelcomeEmail;
  error?: string;
}

export interface WelcomeEmail {
  subject: string;
  preheader: string;
  greeting: string;
  body: string;
  shloka: string;
  shlokaTranslation: string;
  cta: string;
  ctaUrl: string;
  signature: string;
}

const WELCOME_EMAILS: Record<string, WelcomeEmail> = {
  Ayurveda: {
    subject: 'Welcome to the Sanatan International Ayurveda Circle 🌿',
    preheader: 'Your first herb guide arrives next Tuesday.',
    greeting: 'Namaste, dear seeker',
    body: 'Thank you for joining our Ayurveda community. Each week, you will receive one evidence-based herb guide, one seasonal health tip, and one classical formulation from the Charaka Samhita — all written by our resident Ayurvedic physicians.',
    shloka: 'आयुर्वेदः अमृतानाम्',
    shlokaTranslation: 'Ayurveda is the nectar of immortality.',
    cta: 'Explore Ayurveda Research',
    ctaUrl: '/gurukul/ayurveda',
    signature: 'Dr. Vikram Nair, MD (Ayurveda)\nResearch Lead, Sanatan International',
  },
  Meditation: {
    subject: 'Welcome — Your 40-Day Sadhana Journey Begins 🕉️',
    preheader: 'Your first guided practice arrives this Sunday.',
    greeting: 'Om Namah Shivaya, dear practitioner',
    body: 'You have taken the first step on the path of Vedic meditation. Each week, you will receive one guided practice, one neuroscience insight, and one shloka for contemplation — curated by Swami Dharmananda, who has taught Vedic meditation for 31 years.',
    shloka: 'योगः चित्तवृत्तिनिरोधः',
    shlokaTranslation: 'Yoga is the cessation of the fluctuations of the mind. — Patanjali',
    cta: 'Join the Digital Gurukul',
    ctaUrl: '/gurukul/digital',
    signature: 'Swami Dharmananda\nVedic Meditation Teacher, Sanatan International',
  },
  Sanskrit: {
    subject: 'Welcome to the Sanskrit Circle — Your First Shloka Awaits 📜',
    preheader: 'Devanagari practice sheet included.',
    greeting: 'Namaste, dear student of the sacred language',
    body: 'Sanskrit is not a dead language — it is the most precisely engineered language in human history. Each week, you will receive one shloka with full transliteration and meaning, one grammar lesson from the Ashtadhyayi tradition, and one vocabulary set of 10 words.',
    shloka: 'विद्या ददाति विनयम्',
    shlokaTranslation: 'Knowledge bestows humility.',
    cta: 'Start the Sanskrit Foundation Course',
    ctaUrl: '/gurukul/programs',
    signature: 'Pandit Ramesh Shastri\nSanskrit Scholar, Sanatan International',
  },
  Campus: {
    subject: 'Welcome — You Are Now Part of the Campus Journey 🏛️',
    preheader: 'Land fund update: $347,500 raised of $2M goal.',
    greeting: 'Dear friend of the campus',
    body: 'Thank you for following the El Sabrante campus project. You will receive monthly updates on the land acquisition progress, milestone announcements, and behind-the-scenes glimpses of the site plan and architectural vision.',
    shloka: 'सर्वे भवन्तु सुखिनः',
    shlokaTranslation: 'May all beings be happy.',
    cta: 'View the Campus Plan',
    ctaUrl: '/donate',
    signature: 'The Sanatan International Team',
  },
  Philosophy: {
    subject: 'Welcome to the Vedic Philosophy Circle 📖',
    preheader: 'This week: Bhagavad Gita Chapter 2, verse 47.',
    greeting: 'Namaste, dear philosopher',
    body: 'You have joined a community of serious students of Vedic philosophy. Each week, you will receive one deep-dive commentary on a key verse from the Gita, Upanishads, or Brahma Sutras — written by credentialed scholars, not content farms.',
    shloka: 'तत् त्वम् असि',
    shlokaTranslation: 'That thou art. — Chandogya Upanishad',
    cta: 'Explore the Digital Library',
    ctaUrl: '/gurukul/digital',
    signature: 'Swami Dharmananda\nVedic Philosophy Teacher, Sanatan International',
  },
  default: {
    subject: 'Welcome to Sanatan International 🙏',
    preheader: 'Ancient wisdom, modern context — delivered weekly.',
    greeting: 'Namaste, dear seeker',
    body: 'Thank you for joining the Sanatan International community. Each week, you will receive carefully curated insights from Ayurveda, Sanskrit, Vedic meditation, and ancient philosophy — written by credentialed scholars and practitioners, not AI content farms.',
    shloka: 'ॐ तत् सत्',
    shlokaTranslation: 'Om — That is the Truth.',
    cta: 'Explore the Gurukul',
    ctaUrl: '/gurukul/foundation',
    signature: 'The Sanatan International Team\nCentre for Human Flourishing',
  },
};

export async function subscribeToNewsletter(email: string, category?: string): Promise<SubscribeResult> {
  const welcomeEmail = WELCOME_EMAILS[category || 'default'] || WELCOME_EMAILS.default;

  const result = await submitForm({
    formName: category ? `Newsletter signup — ${category}` : 'Newsletter signup',
    inbox: 'general',
    data: { email, list: category || 'general' },
  });

  if (!result.ok) {
    return { success: false, email, welcomeEmail, error: result.error };
  }
  return { success: true, email, welcomeEmail };
}
