import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePaystackPayment } from 'react-paystack';
import { plans } from '../lib/mockData';
import Button from '../components/Button';

declare const gsap: any;

const PlanCard: React.FC<{ plan: typeof plans[0], onSelect: (plan: any) => void }> = ({ plan, onSelect }) => {
    const isPremium = plan.id === 'premium';
    return (
        <div className={`plan-card bg-white dark:bg-gray-800 p-8 rounded-2xl border-2 flex flex-col transition-all duration-300 ${isPremium ? 'border-brand-green shadow-glow-green' : 'border-gray-200 dark:border-gray-700 shadow-sm'}`}>
            {isPremium && <div className="text-center mb-4"><span className="bg-brand-green text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</span></div>}
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center transition-colors">{plan.name}</h3>
            <div className="my-6 text-center">
                <span className="text-5xl font-extrabold text-gray-900 dark:text-white transition-colors">₦{plan.price.toLocaleString()}</span>
                <span className="text-gray-500 dark:text-gray-400 text-lg transition-colors">/month</span>
            </div>
            <p className="text-center text-brand-green font-semibold">Covers up to ₦{plan.coverage.toLocaleString()}</p>
            <ul className="mt-8 space-y-4 text-gray-600 dark:text-gray-300 flex-grow transition-colors">
                {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start">
                        <svg className="flex-shrink-0 h-6 w-6 text-brand-green mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
            <div className="mt-10">
                <Button onClick={() => onSelect(plan)} variant={isPremium ? 'primary' : 'secondary'} className="w-full">
                    Choose {plan.name}
                </Button>
            </div>
        </div>
    );
};

const PlansPage: React.FC = () => {
    const navigate = useNavigate();
    const pageRef = useRef<HTMLDivElement>(null);
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    
    // Get user session data safely
    const sessionStr = localStorage.getItem('nuture_user_session');
    const user = sessionStr ? JSON.parse(sessionStr) : null;

    useEffect(() => {
        if (typeof gsap === 'undefined') return;
        const ctx = gsap.context(() => {
            gsap.fromTo(".plans-header", { opacity: 0, y: 20 }, { duration: 0.8, opacity: 1, y: 0 });
            gsap.fromTo(".plan-card", { opacity: 0, y: 30 }, { duration: 0.6, opacity: 1, y: 0, stagger: 0.1 });
        }, pageRef);
        return () => ctx.revert();
    }, []);

    // Paystack Configuration
    const paystackConfig = {
        reference: (new Date()).getTime().toString(),
        email: user?.email || "",
        amount: (selectedPlan?.price || 0) * 100, // Amount in kobo
        publicKey: 'pk_test_2b4b105d6b6c994e2c822b0475e2966d49b2f60b',
    };

    const initializePayment = usePaystackPayment(paystackConfig);

    // This handles the backend update after payment is successful
    const handleBackendSubscription = async (reference: any, planId: string) => {
        if (!user?.uid) {
            alert("User session not found. Please sign in again.");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    uid: user.uid,
                    planId: planId,
                    reference: reference.reference
                }),
            });

            const result = await response.json();

            if (response.ok) {
                // Save subscription to local storage for immediate UI update
                localStorage.setItem('nuture_subscription', JSON.stringify(result.subscription));
                window.dispatchEvent(new Event('storage'));
                alert("Payment Successful! Your policy is now active.");
                navigate('/dashboard');
            } else {
                alert("Error from server: " + (result.error || "Could not update subscription"));
            }
        } catch (error) {
            console.error("Subscription update failed:", error);
            alert("Connection error: Could not reach the backend server.");
        }
    };

    const handlePlanSelection = (plan: any) => {
        if (!user) {
            alert("Please sign in first.");
            navigate('/sign-in');
            return;
        }
        setSelectedPlan(plan);
    };

    // Trigger Paystack popup when a plan is selected
    useEffect(() => {
        if (selectedPlan) {
            // Store the planId locally to ensure it's available in the callback
            const currentPlanId = selectedPlan.id; 
            
            initializePayment({
                onSuccess: (reference: any) => handleBackendSubscription(reference, currentPlanId),
                onClose: () => alert("Transaction cancelled.")
            });
            
            setSelectedPlan(null); // Reset selection
        }
    }, [selectedPlan, initializePayment]);

    return (
        <div ref={pageRef} className="py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="plans-header text-center">
                    <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white transition-colors">Choose Your Plan</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400 transition-colors">
                        Simple, affordable plans designed for the dynamic life of a student.
                    </p>
                </div>
                <div className="mt-16 grid gap-8 lg:grid-cols-3 max-w-lg mx-auto lg:max-w-none">
                    {plans.map((plan) => (
                        <PlanCard key={plan.id} plan={plan} onSelect={handlePlanSelection} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PlansPage;