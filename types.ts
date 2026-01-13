export interface Plan {
  id: 'basic' | 'standard' | 'premium';
  name: string;
  price: number;
  coverage: number;
  features: string[];
}

export interface Subscription {
  planId: 'basic' | 'standard' | 'premium';
  startDate: string;
  endDate: string;
  status: 'active' | 'expired';
}

export interface Claim {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  category: string;
  receipts?: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Referral {
  id: string;
  email: string;
  date: string;
  status: 'pending' | 'completed';
  reward: number;
}

export interface User {
  fullName: string;
  email: string;
  nutmId: string;
  verified: boolean;
  profilePictureUrl?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  bio?: string;
}

export interface GamificationStats {
    rank: "Novice" | "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond" | "Legend";
    totalPoints: number;
    currentStreak: number;
    longestStreak: number;
}

export interface VaultDocument {
    id: string;
    name: string;
    type: string; // 'pdf' | 'image'
    size: string;
    uploadDate: string;
    isEncrypted: boolean;
    cid: string; // IPFS Content ID simulation
}

export interface NextOfKin {
    id: string;
    name: string;
    email: string;
    walletAddress?: string; // Simulation of blockchain identity
    hasRequestedAccess: boolean; // Has this person tried to open the vault?
}

// Added NutureIQCard interface
export interface NutureIQCard {
    id: string;
    category: 'Nutrition' | 'Fitness' | 'Mental Health' | 'Hygiene' | 'Digital Wellness';
    content: string;
}