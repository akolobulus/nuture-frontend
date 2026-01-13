import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { plans } from '../lib/mockData';
import { Plan, Subscription } from '../types';
import Button from '../components/Button';
import { SpinnerIcon } from '../components/IconComponents';

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount).replace('NGN', '₦');

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
                navigate('/plans'); // Redirect if plan is invalid
            }
        } else {
            navigate('/plans'); // Redirect if no planId
        }
    }, [searchParams, navigate]);

    const handlePayment = () => {
        if (!plan) return;
        setIsProcessing(true);

        setTimeout(() => {
            const today = new Date();
            const endDate = new Date(today);
            endDate.setMonth(today.getMonth() + 1);

            const newSubscription: Subscription = {
                planId: plan.id,
                startDate: today.toISOString(),
                endDate: endDate.toISOString(),
                status: 'active'
            };

            localStorage.setItem('nuture_subscription', JSON.stringify(newSubscription));
            setIsProcessing(false);
            alert(`Payment for ${plan.name} plan successful!`);
            navigate('/dashboard');
        }, 2000);
    };

    if (!plan) {
        return <div className="flex items-center justify-center py-20"><SpinnerIcon className="w-8 h-8 text-brand-green" /></div>;
    }

    return (
        <div className="py-12 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white">Secure Checkout</h1>
                    <p className="mt-2 text-gray-400">Complete your payment to activate your plan.</p>
                </div>
                <div className="grid lg:grid-cols-2 gap-8 items-start">
                    {/* Payment Form */}
                    <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                        <h2 className="text-2xl font-bold text-white mb-6">Payment Method</h2>
                        <div className="flex border-b border-gray-700 mb-6">
                            {/* Tabs */}
                            <button onClick={() => setPaymentMethod('card')} className={`px-4 py-2 font-medium ${paymentMethod === 'card' ? 'text-brand-green border-b-2 border-brand-green' : 'text-gray-400'}`}>Card</button>
                            <button onClick={() => setPaymentMethod('bank')} className={`px-4 py-2 font-medium ${paymentMethod === 'bank' ? 'text-brand-green border-b-2 border-brand-green' : 'text-gray-400'}`}>Bank</button>
                            <button onClick={() => setPaymentMethod('ussd')} className={`px-4 py-2 font-medium ${paymentMethod === 'ussd' ? 'text-brand-green border-b-2 border-brand-green' : 'text-gray-400'}`}>USSD</button>
                        </div>

                        {/* Card Form */}
                        {paymentMethod === 'card' && (
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-300 mb-2">Card Number</label>
                                    <input type="text" id="cardNumber" placeholder="0000 0000 0000 0000" className="w-full bg-gray-700 border-gray-600 rounded-lg px-3 py-2 text-white" />
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label htmlFor="expiry" className="block text-sm font-medium text-gray-300 mb-2">Expiry Date</label>
                                        <input type="text" id="expiry" placeholder="MM / YY" className="w-full bg-gray-700 border-gray-600 rounded-lg px-3 py-2 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-300 mb-2">CVV</label>
                                        <input type="text" id="cvv" placeholder="123" className="w-full bg-gray-700 border-gray-600 rounded-lg px-3 py-2 text-white" />
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Bank Info */}
                        {paymentMethod === 'bank' && <div className="text-gray-400 text-center py-8">Bank transfer details would be displayed here.</div>}
                        {/* USSD Info */}
                        {paymentMethod === 'ussd' && <div className="text-gray-400 text-center py-8">Dial *123# to complete your payment.</div>}

                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-800 rounded-2xl p-8 border border-brand-green/30">
                        <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Plan:</span>
                                <span className="font-semibold text-white">{plan.name}</span>
                            </div>
                             <div className="flex justify-between items-center">
                                <span className="text-gray-400">Billing Cycle:</span>
                                <span className="font-semibold text-white">Monthly</span>
                            </div>
                            <div className="border-t border-gray-700 my-4"></div>
                            <div className="flex justify-between items-center text-xl">
                                <span className="font-bold text-white">Total</span>
                                <span className="font-extrabold text-brand-green">{formatCurrency(plan.price)}</span>
                            </div>
                        </div>
                         <Button onClick={handlePayment} disabled={isProcessing} className="w-full mt-8">
                            {isProcessing ? (
                                <>
                                    <SpinnerIcon className="mr-2 h-4 w-4" />
                                    Processing...
                                </>
                            ) : (
                                `Pay ${formatCurrency(plan.price)} Now`
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;