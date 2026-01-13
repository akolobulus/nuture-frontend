import React, { useState, useEffect } from 'react';
import { FileTextIcon, FilterIcon } from '../components/IconComponents';
import { Claim } from '../types';
import Button from '../components/Button';

// Fix for 'Property env does not exist on type ImportMeta'
// This ensures the app pulls the dynamic Render URL instead of localhost
const API_URL = (import.meta as any).env.VITE_API_URL;

const formatCurrency = (amount: number) => 
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' })
    .format(amount)
    .replace('NGN', '₦');

// ULTRA-SAFE Date Formatter
const formatDateTime = (dateVal: any) => {
  if (!dateVal) return "Date Pending";
  
  try {
    let date: Date;
    
    if (dateVal?.seconds) {
      // Handles Firebase Timestamp objects (common in the backend)
      date = new Date(dateVal.seconds * 1000);
    } else if (typeof dateVal === 'string') {
      // Handles ISO strings
      date = new Date(dateVal);
    } else {
      date = new Date(dateVal);
    }

    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  } catch (e) {
    return "Invalid Date";
  }
};

const getStatusColor = (status: string) => {
  const s = status?.toLowerCase() || 'pending';
  switch (s) {
    case 'approved': return 'bg-green-500/20 text-green-400 border border-green-500/30';
    case 'pending': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
    case 'rejected': return 'bg-red-500/20 text-red-400 border border-red-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
  }
};

const ClaimsListPage: React.FC = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchClaims = async () => {
        const sessionStr = localStorage.getItem('nuture_user_session');
        const session = sessionStr ? JSON.parse(sessionStr) : {};
        
        if (!session.uid) return;

        try {
            // Fixed: Now using the dynamic API_URL for production deployment
            const response = await fetch(`${API_URL}/api/get-claims/${session.uid}`);
            if (response.ok) {
                const data = await response.json();
                setClaims(data);
            }
        } catch (error) {
            console.error("Error fetching claims:", error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchClaims();
  }, []);
  
  const filteredClaims = statusFilter === 'all' 
    ? claims 
    : claims.filter(c => c.status?.toLowerCase() === statusFilter.toLowerCase());

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-xl font-black text-brand-green animate-pulse uppercase tracking-tighter">
          Loading Claims History...
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">Claims Tracking</h1>
            <p className="text-gray-600 dark:text-gray-400">Monitor your submitted insurance claims and reimbursements</p>
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
                <FilterIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select 
                  value={statusFilter} 
                  onChange={e => setStatusFilter(e.target.value)} 
                  className="w-full sm:w-[180px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-green transition-all"
                >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>
            <Button as="link" to="/submit-claim" className="!px-6 !py-2.5 whitespace-nowrap shadow-lg shadow-brand-green/20">
              New Claim
            </Button>
          </div>
        </div>
        
        {filteredClaims.length > 0 ? (
          <div className="grid gap-6">
            {filteredClaims.map((claim) => (
              <div key={claim.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50 shadow-sm transition-all hover:border-brand-green/30 hover:shadow-md group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-brand-green transition-colors">{claim.description}</h2>
                      <span className={`px-3 py-0.5 text-[10px] uppercase tracking-widest font-black rounded-full ${getStatusColor(claim.status)}`}>
                        {claim.status || 'pending'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Category: <span className="text-gray-900 dark:text-gray-200 font-medium">{claim.category}</span> • 
                      Submitted on <span className="text-gray-900 dark:text-gray-200 font-medium">{formatDateTime(claim.date)}</span>
                    </p>
                  </div>
                  <div className="flex flex-col md:items-end bg-gray-50 dark:bg-gray-900/40 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                    <p className="text-[10px] text-gray-500 mb-0.5 uppercase font-black tracking-widest">Requested Amount</p>
                    <p className="text-2xl font-black text-brand-green">{formatCurrency(claim.amount)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-20 text-center border-2 border-dashed border-gray-200 dark:border-gray-700">
            <div className="bg-brand-green/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
               <FileTextIcon className="w-10 h-10 text-brand-green" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">No Claims Visible</h3>
            <p className="text-gray-500 mt-2 max-w-sm mx-auto">You haven't submitted any insurance claims yet. Once you do, you can track their approval status right here.</p>
            <div className="mt-10">
              <Button as="link" to="/submit-claim" variant="secondary" className="px-10">Submit Your First Claim</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimsListPage;