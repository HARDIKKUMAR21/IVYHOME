import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFavourites, removeFavourite } from '../services/api';
import { formatPrice } from '../utils/format';
import { Heart, Trash2 } from 'lucide-react';

const Favourites = () => {
    const [favs, setFavs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFavs();
    }, []);

    const loadFavs = async () => {
        try {
            const data = await getFavourites();
            setFavs(data.results || []);
        } catch (error) {
            console.error("Failed to load favourites", error);
        }
        setLoading(false);
    };

    const handleRemove = async (id) => {
        try {
            await removeFavourite(id);
            setFavs(favs.filter(f => f.listing_id !== id));
        } catch (error) {
            console.error("Failed to remove favourite", error);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                Saved Properties
            </h1>
            
            {loading ? (
                <div>Loading...</div>
            ) : favs.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
                    <p className="text-gray-500">You haven't saved any properties yet.</p>
                    <Link to="/listings" className="text-blue-600 hover:underline mt-2 inline-block">Browse properties</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favs.map(listing => (
                        <div key={listing.listing_id} className="bg-white rounded-lg shadow-sm border overflow-hidden flex flex-col">
                            <div className="p-4 flex-1 flex flex-col relative">
                                <button onClick={() => handleRemove(listing.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                                <div className="text-xl font-bold text-blue-600 mb-1">{formatPrice(listing.price)}</div>
                                <h3 className="font-semibold text-lg truncate pr-8">{listing.apartment_name || 'Apartment'}</h3>
                                <p className="text-gray-500 text-sm mb-4">{listing.locality}</p>
                                
                                <div className="flex items-center gap-4 text-sm text-gray-600 mt-auto pt-4 border-t">
                                    <span>{listing.bedroom} BHK</span>
                                    <span>•</span>
                                    <span>{listing.super_built_up_area || listing.carpet_area} sqft</span>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-3 border-t text-center">
                                <Link to={`/listings/${listing.listing_id}`} className="text-blue-600 font-medium hover:underline">View Details</Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favourites;