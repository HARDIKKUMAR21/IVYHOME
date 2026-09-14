import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getListing } from '../services/api';
import { formatPrice } from '../utils/format';
import { MapPin, Bed, Bath, Maximize, Calendar } from 'lucide-react';

const ListingDetail = () => {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const data = await getListing(id);
                setListing(data);
            } catch (error) {
                console.error("Failed to load listing detail", error);
            }
            setLoading(false);
        };
        fetchListing();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!listing) return <div>Listing not found</div>;

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{listing.apartment_name || 'Apartment'}</h1>
                    <p className="text-gray-500 flex items-center gap-1 mt-2">
                        <MapPin className="w-4 h-4" /> {listing.locality}
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">{formatPrice(listing.price)}</div>
                    <p className="text-gray-500">{listing.property_type}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
                    <Bed className="w-6 h-6 text-gray-400" />
                    <div>
                        <div className="text-sm text-gray-500">Bedrooms</div>
                        <div className="font-semibold">{listing.bedroom}</div>
                    </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
                    <Bath className="w-6 h-6 text-gray-400" />
                    <div>
                        <div className="text-sm text-gray-500">Bathrooms</div>
                        <div className="font-semibold">{listing.bathroom}</div>
                    </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
                    <Maximize className="w-6 h-6 text-gray-400" />
                    <div>
                        <div className="text-sm text-gray-500">Area</div>
                        <div className="font-semibold">{listing.super_built_up_area || listing.carpet_area} sqft</div>
                    </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-gray-400" />
                    <div>
                        <div className="text-sm text-gray-500">Posted At</div>
                        <div className="font-semibold">{new Date(listing.posted_at).toLocaleDateString()}</div>
                    </div>
                </div>
            </div>

            <div className="prose max-w-none">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-600 whitespace-pre-wrap">{listing.description}</p>
            </div>
            
            <div className="mt-8 border-t pt-8">
                <h2 className="text-xl font-semibold mb-4">Property Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                    <div className="flex"><span className="text-gray-500 w-40">Furnishing:</span> <span className="font-medium capitalize">{listing.furnishing}</span></div>
                    <div className="flex"><span className="text-gray-500 w-40">Floor:</span> <span className="font-medium">{listing.floor} / {listing.total_floors}</span></div>
                    <div className="flex"><span className="text-gray-500 w-40">Facing:</span> <span className="font-medium capitalize">{listing.facing_direction}</span></div>
                    <div className="flex"><span className="text-gray-500 w-40">Balcony:</span> <span className="font-medium">{listing.balcony}</span></div>
                    <div className="flex"><span className="text-gray-500 w-40">Parking:</span> <span className="font-medium">{listing.covered_parking}</span></div>
                </div>
            </div>
        </div>
    );
};

export default ListingDetail;