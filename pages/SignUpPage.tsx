import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';

// Fix for 'Property env does not exist on type ImportMeta'
const API_URL = (import.meta as any).env.VITE_API_URL;

const SignUpPage: React.FC = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName || !email || !password) {
            alert('Please fill in all fields.');
            return;
        }

        setIsLoading(true);
        try {
            // Updated to use the dynamic Render API URL
            const response = await fetch(`${API_URL}/api/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, email, password }),
            });

            const data = await response.json();
            
            if (response.ok) {
                // Store the session locally for immediate access
                localStorage.setItem('nuture_user_session', JSON.stringify({ 
                    isLoggedIn: true, 
                    email, 
                    fullName, 
                    uid: data.uid 
                }));
                
                // Trigger a global event so the Header updates the "Sign In" button to "Dashboard"
                window.dispatchEvent(new Event('authChange'));
                
                alert("Account created successfully!");
                navigate('/plans');
            } else {
                alert('Registration failed: ' + (data.error || 'Unknown error occurred'));
            }
        } catch (error) {
            console.error("Signup error:", error);
            alert('Could not connect to the server. Please check your internet connection.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center py-12 px-4 min-h-[80vh]">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h1>
                    <p className="text-gray-600 dark:text-gray-400">Join Nuture to get affordable student insurance</p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl transition-colors">
                    <form onSubmit={handleSignUp} className="space-y-6">
                         <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                            <input
                                id="fullName"
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-green outline-none"
                                placeholder="Alex Doe"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-green outline-none"
                                placeholder="you@nutm.edu.ng"
                            />
                        </div>
                        <div>
                            <label htmlFor="password"className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-green outline-none"
                                placeholder="••••••••"
                            />
                        </div>
                        <Button type="submit" className="w-full shadow-lg shadow-brand-green/20" disabled={isLoading}>
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </form>
                </div>
                 <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link to="/sign-in" className="font-bold text-brand-green hover:text-green-400">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUpPage;