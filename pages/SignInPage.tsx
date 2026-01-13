import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Button from '../components/Button';

const SignInPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/dashboard';

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('nuture_user_session', JSON.stringify({ 
                    isLoggedIn: true, email: data.email, fullName: data.fullName, uid: data.uid 
                }));
                window.dispatchEvent(new Event('authChange'));
                navigate(from, { replace: true });
            } else {
                alert(data.error || 'Login failed');
            }
        } catch (error) {
            alert('Could not connect to server.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            alert("Enter your email address first.");
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/api/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            if (response.ok) alert("Reset instructions sent to your email.");
            else alert("Error: User not found.");
        } catch (error) {
            alert("Connection error.");
        }
    };

    return (
        <div className="flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h1>
                    <p className="text-gray-600 dark:text-gray-400">Sign in to access your dashboard</p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md">
                    <form onSubmit={handleSignIn} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-green"
                                placeholder="you@nutm.edu.ng"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                                <button type="button" onClick={handleForgotPassword} className="text-xs text-brand-green hover:underline">
                                    Forgot Password?
                                </button>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-green"
                                placeholder="••••••••"
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </Button>
                    </form>
                </div>
                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account? <Link to="/sign-up" className="font-medium text-brand-green hover:text-green-500">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default SignInPage;