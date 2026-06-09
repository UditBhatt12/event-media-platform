"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

export default function UploadMedia() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState(''); 

  useEffect(() => {
    const fetchEvents = async (token) => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvents(res.data);
        
        if (res.data.length > 0) {
          setEventId(res.data[0]._id);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchEvents(token);
    }
  }, [router]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    if (!eventId) {
      setStatus({ type: 'error', message: 'Please select an event first.' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    const formData = new FormData();
    formData.append('files', file); 
    formData.append('eventId', eventId); 

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/media/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` 
        }
      });
      
      setStatus({ type: 'success', message: 'Upload complete! AI tags generated.' });
      setFile(null);
      setPreview(null);
      
      setTimeout(() => {
        router.push(`/event/${eventId}`);
      }, 1500);

    } catch (error) {
      console.error(error);
      // 👇 FIXED: Now displays the EXACT error message sent by the backend Bouncer!
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.message || 'Upload failed. Try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center space-x-4 mb-8">
        <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800 font-medium">
          &larr; Back to Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900">Upload Media</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <form onSubmit={handleUpload} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Event</label>
            {events.length > 0 ? (
              <select
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="" disabled>Choose an event...</option>
                {events.map((evt) => (
                  <option key={evt._id} value={evt._id}>
                    {evt.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-sm text-red-500 p-3 bg-red-50 rounded-md border border-red-100">
                You need to create an event in your dashboard before uploading photos!
              </div>
            )}
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center hover:bg-gray-50 transition-colors relative">
            <input 
              type="file" 
              onChange={handleFileChange} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/*"
              required
            />
            {preview ? (
              <div className="flex flex-col items-center">
                <img src={preview} alt="Preview" className="h-48 object-cover rounded-md mb-4 shadow-sm" />
                <p className="text-sm text-indigo-600 font-medium">Click to change photo</p>
              </div>
            ) : (
              <div>
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                <p className="text-gray-600 font-medium">Click to browse or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG up to 10MB</p>
              </div>
            )}
          </div>

          {status.message && (
            <div className={`p-4 rounded-md text-sm font-medium ${status.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
              {status.message}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading || events.length === 0}
            className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white font-bold transition-colors ${
              loading || events.length === 0 ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Uploading & AI Tagging...' : 'Upload Photo'}
          </button>
        </form>
      </div>
    </div>
  );
}