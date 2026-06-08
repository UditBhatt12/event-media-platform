"use client";
import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function AISearch() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!file) return alert("Please select a selfie first!");

        setLoading(true);
        setSearched(true);
        
        const formData = new FormData();
        formData.append('file', file); // We must send it as a file payload

        try {
            const token = localStorage.getItem('token');
            // 👇 Hitting your brand new AI search route!
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/media/search-face`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            
            setResults(res.data);
        } catch (error) {
            console.error("AI Search Error:", error);
            alert(error.response?.data?.message || "Failed to search faces.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800 font-medium mb-2 inline-block">
                        &larr; Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-extrabold text-gray-900">AI Face Search</h1>
                    <p className="text-gray-500 mt-1">Upload a selfie to find all photos you appear in.</p>
                </div>
            </div>

            {/* Upload Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8 text-center">
                <form onSubmit={handleSearch} className="flex flex-col items-center">
                    <div className="mb-6">
                        {preview ? (
                            <img src={preview} alt="Selfie Preview" className="w-48 h-48 object-cover rounded-full border-4 border-indigo-100 shadow-md" />
                        ) : (
                            <div className="w-48 h-48 rounded-full bg-gray-100 flex items-center justify-center border-4 border-dashed border-gray-300">
                                <span className="text-gray-400 font-medium">No Selfie</span>
                            </div>
                        )}
                    </div>
                    
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        className="mb-6 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                    />

                    <button 
                        type="submit" 
                        disabled={loading || !file}
                        className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                        {loading ? 'Scanning Neural Network...' : 'Find My Photos 🔍'}
                    </button>
                </form>
            </div>

            {/* Results Section */}
            {searched && !loading && (
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        {results.length > 0 ? `Found ${results.length} matches!` : 'No matches found.'}
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {results.map((photo) => (
                            <div key={photo._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="h-64 overflow-hidden bg-gray-100">
                                    <img src={photo.imageUrl} alt="Match" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}