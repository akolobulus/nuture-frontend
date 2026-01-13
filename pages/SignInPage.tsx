import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Button from '../components/Button';

// Fix for 'Property env does not exist on type ImportMeta'
// This pulls your Render URL from the Vercel/Local environment
const API_URL = (import.meta as any).env.VITE_API_URL;

const SignInPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect user back to where they were trying to go, or the dashboard
    const from = location.state?.from?.pathname || '/dashboard';

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Updated to use the dynamic Render API URL
            const response = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                // Save session for persistent login
                localStorage.setItem('nuture_user_session', JSON.stringify({ 
                    isLoggedIn: true, 
                    email: data.email, 
                    fullName: data.fullName, 
                    uid: data.uid 
                }));
                
                // Alert the rest of the app (Header, etc.) that the user is logged in
                window.dispatchEvent(new Event('authChange'));
                
                // Go to the intended page
                navigate(from, { replace: true });
            } else {
                alert(data.error || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error("SignIn error:", error);
            alert('Could not connect to the live server. Please check your internet connection.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            alert("Please enter your email address first so we know where to send the link.");
            return;
        }
        try {
            const response = await fetch(`${API_URL}/api/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            if (response.ok) {
                alert("Reset instructions have been sent to your NUTM email.");
            } else {
                alert("User not found. Please verify your email or sign up.");
            }
        } catch (error) {
            alert("Connection error: Backend is currently offline.");
        }
    };

    return (
        <div className="flex items-center justify-center py-12 px-4 min-h-[80vh]">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h1>
                    <p className="text-gray-600 dark:text-gray-400">Sign in to access your student health dashboard</p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl transition-colors">
                    <form onSubmit={handleSignIn} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-green"
                                placeholder="you@nutm.edu.ng"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                                <button type="button" onClick={handleForgotPassword} className="text-xs font-bold text-brand-green hover:underline">
                                    Forgot Password?
                                </button>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-green"
                                placeholder="••••••••"
                            />
                        </div>
                        <Button type="submit" className="w-full shadow-lg shadow-brand-green/20" disabled={isLoading}>
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </Button>
                    </form>
                </div>
                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account? <Link to="/sign-up" className="font-bold text-brand-green hover:text-green-500">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default SignInPage;