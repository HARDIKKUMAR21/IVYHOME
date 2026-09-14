import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Building, Key, Heart, LogOut } from 'lucide-react';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link to="/" className="text-xl font-bold text-blue-600 flex items-center gap-2">
                        <Home className="w-6 h-6" />
                        Ivy Homes
                    </Link>
                    
                    <nav className="hidden md:flex items-center gap-6">
                        <Link to="/listings" className="text-gray-600 hover:text-blue-600 font-medium">Sale</Link>
                        <Link to="/rentals" className="text-gray-600 hover:text-blue-600 font-medium">Rent</Link>
                        <Link to="/projects" className="text-gray-600 hover:text-blue-600 font-medium">Projects</Link>
                        {user ? (
                            <>
                                <Link to="/favourites" className="text-gray-600 hover:text-blue-600 font-medium flex items-center gap-1">
                                    <Heart className="w-4 h-4" /> Favs
                                </Link>
                                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
                                    <span className="text-sm text-gray-500">{user.email}</span>
                                    <button onClick={handleLogout} className="text-gray-500 hover:text-red-600">
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium">
                                Login
                            </Link>
                        )}
                    </nav>
                </div>
            </header>
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;