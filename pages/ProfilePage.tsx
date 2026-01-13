import React, { useState, useEffect, useRef } from "react";
import { CameraIcon, UserIcon, TrophyIcon, FlameIcon, SpinnerIcon } from "../components/IconComponents";
import { User, GamificationStats } from "../types";
import { mockUser as dataUser, mockGamificationStats as dataStats } from "../lib/mockData";

declare const gsap: any;

// Fix for 'Property env does not exist on type ImportMeta'
const API_URL = (import.meta as any).env.VITE_API_URL;

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<GamificationStats | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for an existing saved profile
    const storedUser = localStorage.getItem('nuture_user_profile');
    
    if (storedUser) {
      const userProfile = JSON.parse(storedUser);
      setUser(userProfile);
      setFormData(userProfile);
    } else {
      // If no profile exists, create one from the active session data
      const sessionData = localStorage.getItem('nuture_user_session');
      if (sessionData) {
          const { fullName, email, uid } = JSON.parse(sessionData);
          const newUserProfile: User = { 
            ...dataUser, 
            id: uid,
            fullName: fullName || dataUser.fullName, 
            email: email || dataUser.email, 
            profilePictureUrl: `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(fullName || 'User')}` 
          };
          setUser(newUserProfile); 
          setFormData(newUserProfile);
          localStorage.setItem('nuture_user_profile', JSON.stringify(newUserProfile));
      } else {
          setUser(dataUser); 
          setFormData(dataUser);
      }
    }

    // Load Gamification stats
    const storedStats = localStorage.getItem('nuture_user_stats');
    setStats(storedStats ? JSON.parse(storedStats) : dataStats);
  }, []);

  useEffect(() => {
    if (!user || typeof gsap === 'undefined') return;
    const ctx = gsap.context(() => {
        gsap.fromTo(".profile-card", 
          { opacity: 0, y: 15 }, 
          { duration: 0.6, opacity: 1, y: 0, ease: "power2.out", stagger: 0.1 }
        );
    }, pageRef);
    return () => ctx.revert();
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedUser = { ...user!, profilePictureUrl: reader.result as string };
        setUser(updatedUser); 
        setFormData(updatedUser);
        localStorage.setItem('nuture_user_profile', JSON.stringify(updatedUser));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user || !stats) return (
    <div className="flex-1 flex items-center justify-center py-20">
      <SpinnerIcon className="w-8 h-8 text-brand-green animate-spin" />
    </div>
  );

  const getRankColor = (rank: string) => {
    const colors: Record<string, string> = { 
      "Novice": "bg-gray-500/20 text-gray-400", 
      "Gold": "bg-yellow-500/20 text-yellow-400", 
      "Legend": "bg-purple-500/20 text-purple-400" 
    };
    return colors[rank] || "bg-gray-500/20 text-gray-400";
  };

  return (
    <div ref={pageRef} className="py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 transition-colors">My Profile</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Profile Info */}
          <div className="profile-card lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden ring-4 ring-brand-green/20 transition-all">
                                {user.profilePictureUrl ? (
                                  <img src={user.profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                  <UserIcon className="w-12 h-12 text-gray-400 mx-auto mt-6" />
                                )}
                            </div>
                            <button 
                              onClick={() => fileInputRef.current?.click()} 
                              className="absolute bottom-0 right-0 p-2 bg-brand-green rounded-full text-white hover:bg-green-600 shadow-lg transition-transform hover:scale-110"
                            >
                              <CameraIcon className="w-4 h-4" />
                            </button>
                            <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">{user.fullName}</h3>
                            <p className="text-gray-500 dark:text-gray-400 transition-colors">{user.email}</p>
                        </div>
                    </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-gray-100 dark:border-gray-700">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                      <p className="text-lg text-gray-900 dark:text-white font-semibold">{user.fullName}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">NUTM ID</label>
                      <p className="text-lg text-gray-900 dark:text-white font-mono font-bold">{user.nutmId || 'NUTM-2024-001'}</p>
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Bio</label>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
                        {user.bio || 'NUTM Student dedicated to excellence and community health.'}
                      </p>
                    </div>
                </div>
            </div>
          </div>

          {/* Gamification Sidebar */}
          <div className="profile-card space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-8">
                  <TrophyIcon className="w-6 h-6 text-brand-green" /> Achievement Stats
                </h2>
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 font-medium">Global Rank</span>
                      <span className={`px-4 py-1 text-xs font-black uppercase tracking-widest rounded-full ${getRankColor(stats.rank)}`}>
                        {stats.rank}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 font-medium">Total XP</span>
                      <span className="text-3xl font-black text-brand-green">{stats.totalPoints}</span>
                    </div>
                    
                    <div className="bg-orange-500/10 p-5 rounded-2xl border border-orange-500/20 group hover:bg-orange-500/20 transition-colors">
                        <div className="flex items-center gap-2 mb-4">
                          <FlameIcon className="w-6 h-6 text-orange-500" />
                          <span className="font-bold text-gray-900 dark:text-white uppercase text-xs tracking-widest">Active Streak</span>
                        </div>
                        <p className="text-4xl font-black text-gray-900 dark:text-white">
                          {stats.currentStreak} <span className="text-sm font-normal text-gray-500 uppercase tracking-tighter">Days</span>
                        </p>
                    </div>
                </div>
              </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;