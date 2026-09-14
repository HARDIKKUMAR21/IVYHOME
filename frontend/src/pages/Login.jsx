import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home } from 'lucide-react';

const DEMO_PASSWORD = 'f90f957386';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const performLogin = async (loginEmail, loginPassword) => {
        setError('');
        setIsLoggingIn(true);

        try {
            await login(loginEmail.trim(), loginPassword.trim());
            navigate('/');
        } catch (err) {
            const apiError = err.response?.data?.detail;
            setError(
                apiError ||
                (err.response
                    ? 'Invalid credentials'
                    : 'Unable to connect to the login server')
            );
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await performLogin(email, password);
    };

    // Demo buttons perform the login directly. This completely bypasses
    // Safari's autofill UI, so selecting Demo 1/2/3 does not depend on
    // React input values being updated by the browser.
    const loginWithDemo = async (demoEmail) => {
        setEmail(demoEmail);
        setPassword(DEMO_PASSWORD);
        await performLogin(demoEmail, DEMO_PASSWORD);
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

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800 space-y-2">
                    <p className="font-semibold text-blue-900">Quick Login with Demo Accounts:</p>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            disabled={isLoggingIn}
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={() => loginWithDemo('demo1@ivy.homes')}
                            className="flex-1 bg-white hover:bg-blue-100 active:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed text-blue-700 font-medium py-2 px-2 rounded border border-blue-300 text-xs transition cursor-pointer"
                        >
                            Demo 1
                        </button>
                        <button
                            type="button"
                            disabled={isLoggingIn}
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={() => loginWithDemo('demo2@ivy.homes')}
                            className="flex-1 bg-white hover:bg-blue-100 active:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed text-blue-700 font-medium py-2 px-2 rounded border border-blue-300 text-xs transition cursor-pointer"
                        >
                            Demo 2
                        </button>
                        <button
                            type="button"
                            disabled={isLoggingIn}
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={() => loginWithDemo('demo3@ivy.homes')}
                            className="flex-1 bg-white hover:bg-blue-100 active:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed text-blue-700 font-medium py-2 px-2 rounded border border-blue-300 text-xs transition cursor-pointer"
                        >
                            Demo 3
                        </button>
                    </div>
                    {isLoggingIn && (
                        <p className="text-center text-blue-700 pt-1">Signing in...</p>
                    )}
                </div>

                <form className="mt-4 space-y-4" onSubmit={handleSubmit} autoComplete="off">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-3">
                        <div>
                            <label htmlFor="ivy-login-email" className="block text-xs font-semibold text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                id="ivy-login-email"
                                type="email"
                                name="ivy-login-email"
                                autoComplete="off"
                                required
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="ivy-login-password" className="block text-xs font-semibold text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="ivy-login-password"
                                type="password"
                                name="ivy-login-password"
                                autoComplete="new-password"
                                required
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoggingIn}
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                    >
                        {isLoggingIn ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
