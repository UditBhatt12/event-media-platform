"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function EventGallery({ eventId }) {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // 👇 NEW: State for the search bar
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/media/event/${eventId}`);
                setPhotos(res.data);
            } catch (error) {
                console.error("Error fetching gallery:", error);
            } finally {
                setLoading(false);
            }
        };

        if (eventId) {
            fetchPhotos();
        }
    }, [eventId]);

    // 👇 NEW: The Filtering Logic!
    const filteredPhotos = photos.filter((photo) => {
        // If the search query is empty, show everything
        if (!searchQuery) return true;

        const query = searchQuery.toLowerCase();

        // Check if ANY of the AI tags match the search query
        const matchesTag = photo.aiTags && photo.aiTags.some(tag => tag.toLowerCase().includes(query));
        
        // We can add more conditions here later (like date or user!)
        return matchesTag;
    });

    if (loading) {
        return <div className="text-center py-10 text-gray-500 font-medium">Loading smart gallery...</div>;
    }

    if (photos.length === 0) {
        return <div className="text-center py-10 text-gray-500">No photos uploaded to this event yet.</div>;
    }

    return (
        <div>
            {/* 👇 NEW: The Functional Search Bar */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-8 flex gap-4">
                <input 
                    type="text" 
                    placeholder="Search by AI tags (e.g., 'laptop', 'diagram')..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-gray-700 bg-gray-50 rounded-md px-4 py-2"
                />
            </div>

            {/* Render the FILTERED Photo Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPhotos.length > 0 ? (
                    filteredPhotos.map((photo) => (
                        <div key={photo._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group">
                            <div className="h-64 overflow-hidden relative bg-gray-100">
                                <img 
                                    src={photo.imageUrl} 
                                    alt="Event photo" 
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                />
                            </div>
                            
                            <div className="p-4">
                                <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">AI Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {photo.aiTags && photo.aiTags.length > 0 ? (
                                        photo.aiTags.map((tag, index) => {
                                            // Optional: Highlight the matching tag!
                                            const isMatch = searchQuery && tag.toLowerCase().includes(searchQuery.toLowerCase());
                                            return (
                                                <span 
                                                    key={index} 
                                                    className={`text-xs px-2 py-1 rounded-full border font-medium ${
                                                        isMatch ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                                                    }`}
                                                >
                                                    #{tag}
                                                </span>
                                            )
                                        })
                                    ) : (
                                        <span className="text-gray-400 text-xs italic">No tags generated</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-10 text-gray-500 italic bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        No photos match the search tag: "{searchQuery}"
                    </div>
                )}
            </div>
        </div>
    );
}