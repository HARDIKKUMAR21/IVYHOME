import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('demo1@ivy.homes');
    const [password, setPassword] = useState('f90f957386');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setError('');
        try {
            await login(email.trim(), password.trim());
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.detail || 'Invalid credentials');
        }
    };

    const selectDemo = (demoEmail) => {
        setEmail(demoEmail);
        setPassword('f90f957386');
        setError('');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div className="text-center">
                    <div className="flex justify-center">
                        <Home className="h-12 w-12 text-blue-600" />
                    </div>
                    <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Ivy Homes</h2>
                    <p className="mt-2 text-sm text-gray-600">Sign in with one of the issued demo accounts</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800 space-y-1">
                    <p className="font-semibold text-blue-900">Quick Login with Demo Accounts:</p>
                    <div className="flex gap-2 pt-1">
                        <button
                            type="button"
                            onClick={() => selectDemo('demo1@ivy.homes')}
                            className="flex-1 bg-white hover:bg-blue-100 text-blue-700 font-medium py-1.5 px-2 rounded border border-blue-300 text-xs transition"
                        >
                            demo1
                        </button>
                        <button
                            type="button"
                            onClick={() => selectDemo('demo2@ivy.homes')}
                            className="flex-1 bg-white hover:bg-blue-100 text-blue-700 font-medium py-1.5 px-2 rounded border border-blue-300 text-xs transition"
                        >
                            demo2
                        </button>
                        <button
                            type="button"
                            onClick={() => selectDemo('demo3@ivy.homes')}
                            className="flex-1 bg-white hover:bg-blue-100 text-blue-700 font-medium py-1.5 px-2 rounded border border-blue-300 text-xs transition"
                        >
                            demo3
                        </button>
                    </div>
                </div>

                <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                required
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="demo1@ivy.homes"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                required
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="f90f957386"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                        >
                            Sign In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;