import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { plans } from '../lib/mockData';
import { Plan, Subscription } from '../types';
import Button from '../components/Button';
import { SpinnerIcon } from '../components/IconComponents';

// Fix for 'Property env does not exist on type ImportMeta'
const API_URL = (import.meta as any).env.VITE_API_URL;

const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' })
        .format(amount)
        .replace('NGN', '₦');

const CheckoutPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [plan, setPlan] = useState<Plan | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'ussd'>('card');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const planId = searchParams.get('planId');
        if (planId) {
            const selectedPlan = plans.find(p => p.id === planId);
            if (selectedPlan) {
                setPlan(selectedPlan);
            } else {
                navigate('/plans');
            }
        } else {
            navigate('/plans');
        }
    }, [searchParams, navigate]);

    const handlePayment = async () => {
        if (!plan) return;

        const sessionStr = localStorage.getItem('nuture_user_session');
        const session = sessionStr ? JSON.parse(sessionStr) : {};

        if (!session.uid) {
            alert("Please sign in to complete your purchase.");
            navigate('/sign-in');
            return;
        }

        setIsProcessing(true);

        try {
            // Real API Call to your Render Backend
            const response = await fetch(`${API_URL}/api/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    uid: session.uid,
                    planId: plan.id,
                    // In a live app, this reference comes from Paystack
                    reference: `DEMO_${Date.now()}` 
                }),
            });

            const result = await response.json();

            if (response.ok) {
                // Save subscription locally so the UI updates immediately
                localStorage.setItem('nuture_subscription', JSON.stringify(result.subscription));
                window.dispatchEvent(new Event('storage'));
                
                alert(`Payment for ${plan.name} successful!`);
                navigate('/dashboard');
            } else {
                alert("Payment Error: " + (result.error || "Could not activate plan."));
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Connection error: Could not reach the payment server.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (!plan) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <SpinnerIcon className="w-10 h-10 text-brand-green animate-spin" />
            </div>
        );
    }

    return (
        <div className="py-12 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Secure Checkout</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Complete your payment to activate your student coverage.</p>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-8 items-start">
                    {/* Payment Form */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl transition-colors">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Payment Method</h2>
                        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                            <button onClick={() => setPaymentMethod('card')} className={`px-6 py-2 font-bold text-sm uppercase tracking-widest transition-all ${paymentMethod === 'card' ? 'text-brand-green border-b-2 border-brand-green' : 'text-gray-400 hover:text-gray-600'}`}>Card</button>
                            <button onClick={() => setPaymentMethod('bank')} className={`px-6 py-2 font-bold text-sm uppercase tracking-widest transition-all ${paymentMethod === 'bank' ? 'text-brand-green border-b-2 border-brand-green' : 'text-gray-400 hover:text-gray-600'}`}>Bank</button>
                            <button onClick={() => setPaymentMethod('ussd')} className={`px-6 py-2 font-bold text-sm uppercase tracking-widest transition-all ${paymentMethod === 'ussd' ? 'text-brand-green border-b-2 border-brand-green' : 'text-gray-400 hover:text-gray-600'}`}>USSD</button>
                        </div>

                        {paymentMethod === 'card' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase mb-2">Card Number</label>
                                    <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-green outline-none" />
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-xs font-black text-gray-400 uppercase mb-2">Expiry</label>
                                        <input type="text" placeholder="MM / YY" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-green outline-none" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs font-black text-gray-400 uppercase mb-2">CVV</label>
                                        <input type="text" placeholder="123" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-green outline-none" />
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {paymentMethod !== 'card' && (
                            <div className="text-gray-500 text-center py-10 italic text-sm">
                                {paymentMethod === 'bank' ? 'Transfer to: Providus Bank - 1234567890 (Nuture)' : 'Dial *737*000*123# on your mobile'}
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 border border-brand-green/30 shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 font-medium">Selected Plan:</span>
                                <span className="font-bold text-gray-900 dark:text-white">{plan.name}</span>
                            </div>
                             <div className="flex justify-between items-center">
                                <span className="text-gray-500 font-medium">Billing Cycle:</span>
                                <span className="font-bold text-gray-900 dark:text-white">Monthly</span>
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-900 dark:text-white">Total Amount</span>
                                <span className="text-3xl font-black text-brand-green">{formatCurrency(plan.price)}</span>
                            </div>
                        </div>

                        <Button 
                            onClick={handlePayment} 
                            disabled={isProcessing} 
                            className="w-full mt-10 py-4 shadow-xl shadow-brand-green/20"
                        >
                            {isProcessing ? (
                                <div className="flex items-center justify-center">
                                    <SpinnerIcon className="mr-3 h-5 w-5 animate-spin" />
                                    Verifying Transaction...
                                </div>
                            ) : (
                                `Confirm & Pay ${formatCurrency(plan.price)}`
                            )}
                        </Button>
                        
                        <p className="text-[10px] text-center text-gray-500 mt-4 uppercase tracking-widest font-bold">
                            Secured by Paystack & AES-256 Encryption
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;