import React, { useState, useEffect } from 'react';
import { getRentals } from '../services/api';
import { formatPrice } from '../utils/format';

const Rentals = () => {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRentals = async () => {
            try {
                const data = await getRentals({ limit: 50, offset: 0 });
                setRentals(data.results || []);
            } catch (error) {
                console.error("Failed to load rentals", error);
            }
            setLoading(false);
        };
        fetchRentals();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Properties for Rent</h1>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rentals.map(rental => (
                        <div key={rental.listing_id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                            <div className="h-48 bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400">No Image</span>
                            </div>
                            <div className="p-4">
                                <div className="text-xl font-bold text-green-600 mb-1">{formatPrice(rental.price)} / mo</div>
                                <h3 className="font-semibold text-lg truncate">{rental.title || rental.apartment_name}</h3>
                                <p className="text-gray-500 text-sm mb-4">{rental.locality}</p>
                                
                                <div className="flex items-center gap-4 text-sm text-gray-600 border-t pt-4">
                                    <span>{rental.bedroom} BHK</span>
                                    <span>•</span>
                                    <span>Deposit: {formatPrice(rental.deposit)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Rentals;