import React, { useState, useEffect, useRef } from 'react';
import { GiftIcon, UserPlusIcon, CopyIcon, CheckIcon } from '../components/IconComponents';
import Button from '../components/Button';
import { Referral } from '../types';

declare const gsap: any;

const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount).replace('NGN', '₦');

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color?: string }> = ({ title, value, icon, color = 'text-gray-900 dark:text-white' }) => (
    <div className="stat-card bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
            {icon}
        </div>
        <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </div>
);

export default function ReferralsPage() {
    const [email, setEmail] = useState("");
    const [copied, setCopied] = useState(false);
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [refCode, setRefCode] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const pageRef = useRef<HTMLDivElement>(null);

    const session = JSON.parse(localStorage.getItem('nuture_user_session') || '{}');
    const referralLink = `https://nuture.app/signup?ref=${refCode || 'LOADING'}`;

    useEffect(() => {
        const fetchReferralData = async () => {
            if (!session.uid) return;
            try {
                const response = await fetch(`http://localhost:5000/api/get-referrals/${session.uid}`);
                if (response.ok) {
                    const data = await response.json();
                    setRefCode(data.referralCode);
                    setReferrals(data.referrals || []);
                }
            } catch (error) {
                console.error("Failed to fetch referrals:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReferralData();
    }, [session.uid]);

    const copyLink = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !session.uid) return;

        try {
            const response = await fetch('http://localhost:5000/api/send-referral', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uid: session.uid, email }),
            });
            if (response.ok) {
                const data = await response.json();
                setReferrals([data.referral, ...referrals]);
                setEmail("");
                alert("Referral invitation sent!");
            }
        } catch (error) {
            alert("Error sending invitation.");
        }
    };

    if (isLoading) return <div className="text-center py-20 text-white animate-pulse">Loading Referral Program...</div>;

    const successfulReferrals = referrals.filter(r => r.status === 'completed').length;
    const totalRewards = successfulReferrals * 500;
    const pendingRewards = referrals.filter(r => r.status === 'pending').length * 500;

    return (
        <div ref={pageRef} className="py-12 px-4 max-w-7xl mx-auto">
            <div className="ref-header mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Referral Program</h1>
                <p className="text-gray-600 dark:text-gray-400">Invite NUTM students and earn rewards</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Referrals" value={referrals.length} icon={<UserPlusIcon className="h-4 w-4 text-gray-400" />} />
                <StatCard title="Successful Referrals" value={successfulReferrals} icon={<CheckIcon className="h-4 w-4 text-gray-400" />} />
                <StatCard title="Total Rewards" value={formatCurrency(totalRewards)} icon={<GiftIcon className="h-4 w-4 text-gray-400" />} color="text-brand-green" />
                <StatCard title="Pending Rewards" value={formatCurrency(pendingRewards)} icon={<GiftIcon className="h-4 w-4 text-gray-400" />} color="text-yellow-500" />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* How it Works Section */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h2 className="text-xl font-bold mb-6 text-white">How It Works</h2>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-brand-green/20 text-brand-green flex items-center justify-center font-bold">1</div>
                            <div>
                                <h3 className="font-semibold text-white">Share Your Link</h3>
                                <p className="text-sm text-gray-400">Use your unique code: <span className="text-brand-green font-mono">{refCode}</span></p>
                            </div>
                        </div>
                        {/* Step 2 and 3 can be added here following same pattern */}
                    </div>
                </div>

                {/* Share Box */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h2 className="text-xl font-bold mb-4 text-white">Share Link</h2>
                    <div className="flex gap-2 mb-6">
                        <input value={referralLink} readOnly className="font-mono text-xs bg-gray-900 border border-gray-700 rounded-lg w-full px-3 py-2 text-gray-300" />
                        <button onClick={copyLink} className="p-2 bg-gray-700 rounded-lg">
                            {copied ? <CheckIcon className="text-green-500" /> : <CopyIcon className="text-gray-400" />}
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <label className="text-xs text-gray-500 uppercase font-bold">Email Invite</label>
                        <div className="flex gap-2">
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="friend@nutm.edu.ng" className="bg-gray-900 border border-gray-700 rounded-lg w-full px-3 py-2 text-white text-sm" />
                            <Button type="submit" className="!px-3"><UserPlusIcon className="w-5 h-5" /></Button>
                        </div>
                    </form>
                </div>
            </div>

            {/* History Table */}
            <div className="mt-8 bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <h2 className="text-xl font-bold mb-4 text-white">Referral History</h2>
                {referrals.length > 0 ? (
                    <div className="space-y-4">
                        {referrals.map((ref) => (
                            <div key={ref.id} className="flex justify-between items-center p-4 bg-gray-900/50 rounded-xl border border-gray-700">
                                <div>
                                    <p className="text-white font-medium">{ref.email}</p>
                                    <p className="text-xs text-gray-500">{formatDate(ref.date)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-brand-green font-bold">+{formatCurrency(ref.reward)}</p>
                                    <span className="text-[10px] uppercase font-bold text-yellow-500">{ref.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-10">No referrals yet. Start sharing!</p>
                )}
            </div>
        </div>
    );
}