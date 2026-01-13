import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';

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
            const response = await fetch('http://localhost:5000/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('nuture_user_session', JSON.stringify({ 
                    isLoggedIn: true, email, fullName, uid: data.uid 
                }));
                window.dispatchEvent(new Event('authChange'));
                alert("Account created successfully!");
                navigate('/plans');
            } else {
                alert('Registration failed: ' + data.error);
            }
        } catch (error) {
            alert('Could not connect to the server.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-gray-400">Join Nuture to get affordable student insurance</p>
                </div>
                
                <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700">
                    <form onSubmit={handleSignUp} className="space-y-6">
                         <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                            <input
                                id="fullName"
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-brand-green outline-none"
                                placeholder="Alex Doe"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-brand-green outline-none"
                                placeholder="you@nutm.edu.ng"
                            />
                        </div>
                        <div>
                            <label htmlFor="password"className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-brand-green outline-none"
                                placeholder="••••••••"
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </form>
                </div>
                 <p className="mt-6 text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link to="/sign-in" className="font-medium text-brand-green hover:text-green-400">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUpPage;