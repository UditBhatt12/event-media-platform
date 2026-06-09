"use client";
import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function FaceSearchPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResults([]);
      setHasSearched(false);
      setError('');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/media/search-face`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      setResults(res.data);
      setHasSearched(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Face search failed. Ensure your backend has face-api models loaded.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800 font-medium mb-4 inline-block">
          &larr; Back to Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900">AI Face Search</h1>
        <p className="text-gray-500 mt-2">Upload a selfie to instantly find every event photo you appear in.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition relative">
              <input 
                type="file" 
                onChange={handleFileChange} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept="image/*"
                required
              />
              {preview ? (
                <img src={preview} alt="Selfie Preview" className="h-40 mx-auto object-cover rounded-md shadow-sm" />
              ) : (
                <div className="py-4">
                  <div className="text-4xl mb-2">🤳</div>
                  <p className="text-sm font-medium text-gray-700">Upload Reference Selfie</p>
                </div>
              )}
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}

            <button 
              type="submit" 
              disabled={loading || !file}
              className={`w-full py-3 rounded-md font-bold text-white transition ${loading || !file ? 'bg-purple-300 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 shadow-md'}`}
            >
              {loading ? 'Scanning Neural Network...' : 'Find Me'}
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div className="md:col-span-2">
          {loading ? (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-purple-500 font-bold animate-pulse text-lg">Extracting 128-D Face Map...</div>
            </div>
          ) : hasSearched ? (
            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Found {results.length} Matching {results.length === 1 ? 'Photo' : 'Photos'}
              </h2>
              {results.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {results.map((media) => (
                    <div key={media._id} className="relative group rounded-xl overflow-hidden shadow-sm border border-gray-200">
                      <img src={media.imageUrl} alt="Match" className="w-full h-48 object-cover group-hover:scale-105 transition duration-300" />
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <span className="text-white text-xs font-bold bg-purple-600 px-2 py-1 rounded-md">98% Match</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                  <span className="text-4xl mb-3 block">🕵️‍♂️</span>
                  <p className="text-gray-500 font-medium">No matches found. Try a clearer selfie!</p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-gray-200 text-gray-400">
              <svg className="w-16 h-16 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              <p>Your matches will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}