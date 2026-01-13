import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Subscription, Plan } from '../types';
import { plans } from '../lib/mockData';
import Button from '../components/Button';
import { VaultIcon } from '../components/IconComponents';

declare const gsap: any;

// Fix for 'Property env does not exist on type ImportMeta'
const API_URL = (import.meta as any).env.VITE_API_URL;

const ShieldCheckBadge = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="text-brand-green"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const formatCurrency = (amount: number) => 
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' })
    .format(amount)
    .replace('NGN', '₦');

const DashboardPage: React.FC = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [coverageUsed, setCoverageUsed] = useState(0);
  const [isVaultSecured, setIsVaultSecured] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dashRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const sessionStr = localStorage.getItem('nuture_user_session');
      const session = sessionStr ? JSON.parse(sessionStr) : {};
      
      // Safety check: redirect to sign-in if no valid session exists
      if (!session.uid || !session.isLoggedIn) {
        navigate('/sign-in');
        return;
      }

      try {
        // Fetch subscription details from Render Backend
        const subRes = await fetch(`${API_URL}/api/get-subscription/${session.uid}`);
        if (subRes.ok) {
          const data = await subRes.json();
          setSubscription(data.subscription);
          setCoverageUsed(data.coverageUsed || 0);
          
          const activePlan = plans.find(p => p.id === data.subscription.planId);
          if (activePlan) setPlan(activePlan);
        }

        // Check if documents exist in the Vault to show the "Secured" badge
        const vaultRes = await fetch(`${API_URL}/api/vault/get/${session.uid}`);
        if (vaultRes.ok) {
          const vaultData = await vaultRes.json();
          setIsVaultSecured(vaultData.length > 0); 
        }

      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (isLoading || !subscription || !plan || typeof gsap === 'undefined') return;

    const ctx = gsap.context(() => {
      gsap.fromTo(".dash-title", { opacity: 0, x: -20 }, { duration: 0.6, opacity: 1, x: 0 });
      gsap.fromTo(".dash-card", { opacity: 0, y: 20 }, { duration: 0.8, opacity: 1, y: 0, stagger: 0.1, delay: 0.2 });
    }, dashRef);
    return () => ctx.revert();
  }, [subscription, plan, isLoading]);
  
  const formatDateString = (dateVal: any) => {
    if (!dateVal) return "N/A";
    const date = dateVal?.seconds ? new Date(dateVal.seconds * 1000) : new Date(dateVal);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const coveragePercentage = plan ? (coverageUsed / plan.coverage) * 100 : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-brand-green animate-pulse font-black text-xl tracking-tighter uppercase">
          Initializing Dashboard...
        </div>
      </div>
    );
  }

  if (!subscription || !plan) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="bg-white dark:bg-gray-800 p-12 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">No Active Policy Found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 transition-colors">
            It looks like you haven't subscribed to a health plan yet. Get protected today to access your medical dashboard.
          </p>
          <Button as="link" to="/plans" variant="primary" className="px-10">View Plans</Button>
        </div>
      </div>
    );
  }

  return (
    <div ref={dashRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
            <h1 className="dash-title text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">My Dashboard</h1>
            <Link to="/" className="text-xs font-bold text-gray-400 hover:text-brand-green transition-colors uppercase tracking-widest">Back to Home</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Primary Subscription Card */}
            <div className="dash-card lg:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-brand-green/30 shadow-lg">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 transition-colors">
                      Active Plan: <span className="text-brand-green">{plan.name}</span>
                    </h2>
                    <p className="text-sm text-gray-500 flex items-center">
                      <span className="w-2.5 h-2.5 bg-brand-green rounded-full mr-2 animate-pulse"></span>
                      Status: <span className="capitalize ml-1 font-semibold">{subscription.status}</span>
                    </p>
                  </div>
                  {isVaultSecured && (
                    <div className="flex items-center gap-2 bg-brand-green/10 px-4 py-2 rounded-full border border-brand-green/30">
                        <ShieldCheckBadge />
                        <span className="text-[10px] font-black text-brand-green uppercase tracking-tighter">On-Chain Secured</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-xl border border-gray-100 dark:border-gray-700">
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Coverage Limit</p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white transition-colors">{formatCurrency(plan.coverage)}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-xl border border-gray-100 dark:border-gray-700">
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Effective Date</p>
                        <p className="text-lg font-bold text-gray-700 dark:text-gray-300 transition-colors">{formatDateString(subscription.startDate)}</p>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-end mb-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white transition-colors">Coverage Utilization</h3>
                      <span className="text-brand-green font-black text-xl">{Math.round(coveragePercentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-5 overflow-hidden border border-gray-200 dark:border-gray-600">
                        <div 
                          className="bg-brand-green h-full rounded-full transition-all duration-1000 ease-out shadow-inner" 
                          style={{ width: `${Math.min(coveragePercentage, 100)}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between mt-3">
                       <p className="text-xs text-gray-500 font-medium">Spent: {formatCurrency(coverageUsed)}</p>
                       <p className="text-xs text-gray-500 font-medium">Remaining: {formatCurrency(plan.coverage - coverageUsed)}</p>
                    </div>
                </div>
            </div>

            {/* Sidebar Management Card */}
            <div className="dash-card bg-white dark:bg-gray-800 p-8 rounded-2xl h-fit border border-gray-200 dark:border-gray-700 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-8 transition-colors">Policy Management</h2>
                <div className="flex flex-col gap-4">
                    <Button as="link" to="/submit-claim" variant="primary" className="w-full flex items-center justify-center py-4">
                      Submit Medical Claim
                    </Button>
                    <Button as="link" to="/vault" variant="secondary" className="w-full flex items-center justify-center py-4">
                      <VaultIcon className="w-5 h-5 mr-3" /> Digital Health Vault
                    </Button>
                    <Button as="link" to="/referrals" variant="secondary" className="w-full flex items-center justify-center py-4">
                      Refer & Earn Rewards
                    </Button>
                </div>

                <div className="mt-10 p-5 bg-brand-green/5 rounded-2xl border border-brand-green/20">
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400 leading-relaxed">
                      Need help? Access 24/7 student support via the <Link to="/faq" className="text-brand-green font-bold hover:underline">Help Center</Link>
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default DashboardPage;