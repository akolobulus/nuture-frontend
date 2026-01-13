import React, { useState, useEffect } from 'react';
import { FileTextIcon, FilterIcon } from '../components/IconComponents';
import { Claim } from '../types';
import Button from '../components/Button';

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
      // Handles Firebase Timestamp objects
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
            const response = await fetch(`http://localhost:5000/api/get-claims/${session.uid}`);
            if (response.ok) {
                const data = await response.json();
                console.log("Claims data received:", data); // Check your browser console!
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
        <div className="text-xl font-medium text-brand-green animate-pulse">Loading claims...</div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Claims Tracking</h1>
            <p className="text-gray-600 dark:text-gray-400">Monitor your submitted insurance claims</p>
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
                <FilterIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select 
                  value={statusFilter} 
                  onChange={e => setStatusFilter(e.target.value)} 
                  className="w-full sm:w-[180px] bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-green"
                >
                    <option value="all">All Claims</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>
            <Button as="link" to="/submit-claim" className="!px-6 !py-2 whitespace-nowrap">New Claim</Button>
          </div>
        </div>
        
        {filteredClaims.length > 0 ? (
          <div className="grid gap-6">
            {filteredClaims.map((claim) => (
              <div key={claim.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:border-brand-green/30">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">{claim.description}</h2>
                      <span className={`px-3 py-0.5 text-[10px] uppercase tracking-widest font-bold rounded-full ${getStatusColor(claim.status)}`}>
                        {claim.status || 'pending'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Category: <span className="text-gray-700 dark:text-gray-200">{claim.category}</span> • 
                      Submitted on <span className="text-gray-700 dark:text-gray-200">{formatDateTime(claim.date)}</span>
                    </p>
                  </div>
                  <div className="flex flex-col md:items-end">
                    <p className="text-xs text-gray-500 mb-0.5 uppercase font-bold tracking-tighter">Claim Amount</p>
                    <p className="text-2xl font-black text-brand-green">{formatCurrency(claim.amount)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-20 text-center border-2 border-dashed border-gray-200 dark:border-gray-700">
            <FileTextIcon className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">No Claims Visible</h3>
            <p className="text-gray-500 mt-2">If you see claims in Firebase but not here, check the Backend Terminal for a "Create Index" link.</p>
            <div className="mt-8">
              <Button as="link" to="/submit-claim" variant="secondary">Submit New Claim</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimsListPage;