import { Plan, FAQItem, Referral, Claim, User, GamificationStats, NutureIQCard } from '../types';

export const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 2500,
    coverage: 7000,
    features: ['Up to ₦7,000 coverage/month', 'Health checkups', 'Pharmacy bills', '24/7 support'],
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 4000,
    coverage: 10000,
    features: ['Up to ₦10,000 coverage/month', 'Includes Basic plan features', 'Dental care', 'Specialist consultations'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 7500,
    coverage: 20000,
    features: ['Up to ₦20,000 coverage/month', 'Includes Standard plan features', 'Emergency services', 'Comprehensive optical'],
  },
];

export const faqItems: FAQItem[] = [
    {
        question: 'What is Nuture?',
        answer: 'Nuture is a web-based health insurance platform built exclusively for NUTM students. We offer simple, flexible, and affordable insurance plans designed for campus life.'
    },
    {
        question: 'What is the Health Vault?',
        answer: 'The Health Vault is a secure digital storage space for your medical records. You can upload prescriptions, lab results, and X-rays. It features an Emergency Access protocol where your designated Next of Kin can unlock the vault if a majority request access, ensuring your vital health data is available in critical moments.'
    },
    {
        question: 'Why do NUTM students need Nuture?',
        answer: "NUTM students currently lack affordable health insurance coverage. As a private university, NUTM is excluded from public university NHIS benefits. Nuture fills this gap by providing accessible, campus-focused health coverage."
    },
    {
        question: 'How do I submit a claim?',
        answer: 'Simply upload your prescription or receipt through our digital claim submission system. You can track your claim status in real-time with updates like Pending, Approved, or Rejected.'
    },
    {
        question: 'What is the referral program?',
        answer: 'Earn ₦500 when you refer a fellow NUTM student who subscribes to a plan. Your friend also gets a discount! Share your unique referral link to start earning rewards.'
    },
    {
        question: 'Can I transfer my policy?',
        answer: "Yes! Students can safely transfer unused coverage to another student. This feature promotes community support and ensures coverage doesn't go to waste."
    }
];

export const mockReferrals: Referral[] = [
  { id: 'ref1', email: 'jane.doe@nutm.edu.ng', date: new Date(Date.now() - 86400000 * 10).toISOString(), status: 'completed', reward: 500 },
  { id: 'ref2', email: 'john.smith@nutm.edu.ng', date: new Date(Date.now() - 86400000 * 3).toISOString(), status: 'pending', reward: 500 },
];

export const CLAIM_CATEGORIES = [
  "Consultation",
  "Pharmacy",
  "Dental",
  "Optical",
  "Emergency",
  "Specialist",
  "Lab Test",
];

export const mockClaims: Claim[] = [
    { id: 'claim1', date: new Date(Date.now() - 86400000 * 5).toISOString(), description: 'Malaria medication', amount: 3500, status: 'approved', category: 'Pharmacy', receipts: ['receipt01.pdf'] },
    { id: 'claim2', date: new Date(Date.now() - 86400000 * 2).toISOString(), description: 'Dental checkup', amount: 8000, status: 'pending', category: 'Dental' },
    { id: 'claim3', date: new Date(Date.now() - 86400000 * 12).toISOString(), description: 'Typhoid test', amount: 5000, status: 'rejected', category: 'Lab Test' },
];

export const mockUser: User = {
    fullName: "Alex Doe",
    email: "alex.doe@nutm.edu.ng",
    nutmId: "NUTM00123",
    verified: true,
    profilePictureUrl: `https://api.dicebear.com/8.x/initials/svg?seed=Alex%20Doe`,
    phoneNumber: "+234 801 234 5678",
    dateOfBirth: "",
    address: "NUTM Campus, Lagos, Nigeria",
    bio: "Computer Science student passionate about building cool things. Trying to stay healthy between coding sessions.",
};

export const mockGamificationStats: GamificationStats = {
    rank: "Gold",
    totalPoints: 2450,
    currentStreak: 12,
    longestStreak: 25,
};

// Added nutureIQCards mock data
export const nutureIQCards: NutureIQCard[] = [
    { id: '1', category: 'Nutrition', content: 'Drinking water before meals can aid digestion and help with weight management.' },
    { id: '2', category: 'Fitness', content: 'Just 30 minutes of brisk walking daily can significantly improve cardiovascular health.' },
    { id: '3', category: 'Mental Health', content: 'Practicing mindfulness for 10 minutes a day can reduce stress and improve focus.' },
    { id: '4', category: 'Hygiene', content: 'Washing your hands for at least 20 seconds is one of the best ways to prevent the spread of germs.' },
    { id: '5', category: 'Digital Wellness', content: 'The 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds to reduce eye strain.' },
    { id: '6', category: 'Nutrition', content: 'Leafy greens like spinach and kale are packed with vitamins A, C, and K, as well as fiber.' },
    { id: '7', category: 'Mental Health', content: 'Quality sleep (7-9 hours) is crucial for cognitive function and emotional regulation.' },
];