import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getListings, addFavourite, getFavourites } from '../services/api';
import { formatPrice } from '../utils/format';
import { Heart } from 'lucide-react';

const Listings = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favs, setFavs] = useState(new Set());
    
    // Filters
    const [locality, setLocality] = useState('');
    const [bhk, setBhk] = useState('');
    
    useEffect(() => {
        loadData();
    }, [locality, bhk]);

    const loadData = async () => {
        setLoading(true);
        try {
            const params = { limit: 50, offset: 0 };
            if (locality) params.locality = locality;
            if (bhk) params.bhk = bhk;
            
            const [data, favData] = await Promise.all([
                getListings(params),
                getFavourites()
            ]);
            setListings(data.results || []);
            setFavs(new Set(favData.results.map(f => f.listing_id)));
        } catch (error) {
            console.error("Failed to load listings", error);
        }
        setLoading(false);
    };

    const handleFav = async (e, id) => {
        e.preventDefault();
        try {
            await addFavourite(id);
            setFavs(prev => {
                const newSet = new Set(prev);
                newSet.add(id);
                return newSet;
            });
        } catch (error) {
            console.error("Failed to favourite", error);
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-64 bg-white p-4 rounded-lg shadow-sm h-fit">
                <h2 className="font-semibold text-lg mb-4">Filters</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Locality</label>
                        <input type="text" className="w-full border rounded-md p-2" value={locality} onChange={e => setLocality(e.target.value)} placeholder="e.g. Whitefield" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">BHK</label>
                        <select className="w-full border rounded-md p-2" value={bhk} onChange={e => setBhk(e.target.value)}>
                            <option value="">Any</option>
                            <option value="1">1 BHK</option>
                            <option value="2">2 BHK</option>
                            <option value="3">3 BHK</option>
                            <option value="4">4 BHK</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div className="flex-1">
                <h1 className="text-2xl font-bold mb-6">Properties for Sale</h1>
                
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {listings.map(listing => (
                            <Link key={listing.listing_id} to={`/listings/${listing.listing_id}`} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition flex flex-col">
                                <div className="h-48 bg-gray-200 flex items-center justify-center relative">
                                    <span className="text-gray-400">No Image</span>
                                    <button onClick={(e) => handleFav(e, listing.listing_id)} className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50">
                                        <Heart className={`w-5 h-5 ${favs.has(listing.listing_id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                                    </button>
                                </div>
                                <div className="p-4 flex-1 flex flex-col">
                                    <div className="text-xl font-bold text-blue-600 mb-1">{formatPrice(listing.price)}</div>
                                    <h3 className="font-semibold text-lg truncate">{listing.apartment_name || 'Apartment'}</h3>
                                    <p className="text-gray-500 text-sm mb-4">{listing.locality}</p>
                                    
                                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-auto pt-4 border-t">
                                        <span>{listing.bedroom} BHK</span>
                                        <span>•</span>
                                        <span>{listing.super_built_up_area || listing.carpet_area} sqft</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Listings;