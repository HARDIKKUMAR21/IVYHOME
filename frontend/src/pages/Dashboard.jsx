import React from 'react';
import { Link } from 'react-router-dom';
import { Building, Key, Home as HomeIcon } from 'lucide-react';

const Dashboard = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Welcome to Ivy Homes</h1>
            <p className="text-lg text-gray-600">Find your dream property across our wide range of listings.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <Link to="/listings" className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <HomeIcon className="w-10 h-10 text-blue-600 mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Properties for Sale</h2>
                    <p className="text-gray-500">Browse apartments and villas available for purchase.</p>
                </Link>
                
                <Link to="/rentals" className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <Key className="w-10 h-10 text-green-600 mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Properties for Rent</h2>
                    <p className="text-gray-500">Find the perfect rental home that fits your lifestyle.</p>
                </Link>
                
                <Link to="/projects" className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <Building className="w-10 h-10 text-purple-600 mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Builder Projects</h2>
                    <p className="text-gray-500">Explore new developments and upcoming projects.</p>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;