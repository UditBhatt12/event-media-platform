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


  const [eventId, setEventId] = useState('652c56a81e3a4b7f9d8a5c31'); // Dummy MongoDB ID

  // Security Check: Kick out users without a token
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login');
    }
  }, [router]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // Create a temporary local preview
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setStatus({ type: '', message: '' });

    const formData = new FormData();
    formData.append('files', file); // Appending the file to the form data
    formData.append('eventId',eventId);///////////This is added new
    try {
      const token = localStorage.getItem('token');
      
      // Send to your live Render backend
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/media/upload`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data' // Required for file uploads
        }
      });
      
      setStatus({ type: 'success', message: '✅ Photo uploaded successfully! AI tagging initiated.' });
      
      // Clear the form and send them back to the dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: '❌ Upload failed: ' + (err.response?.data?.message || 'Server error') 
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
        {status.message && (
          <div className={`p-4 rounded-md mb-6 ${status.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {status.message}
          </div>
        )}
        
        <form onSubmit={handleUpload} className="space-y-6">

          

          {/* Event ID Input */}
       <div>
         <label className="block text-sm font-medium text-gray-700 mb-1">
           Event ID (Testing)
         </label>
         <input
           type="text"
           required
           value={eventId}
           onChange={(e) => setEventId(e.target.value)}
           className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
         />
       </div>


          {/* Drag & Drop Area / File Input */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex justify-center items-center h-64 bg-gray-50 hover:bg-gray-100 transition relative">
            {preview ? (
              <img src={preview} alt="Preview" className="h-full object-contain rounded-md" />
            ) : (
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="mt-4 flex text-sm text-gray-600 justify-center">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 p-1">
                    <span>Upload a file</span>
                    <input type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                  </label>
                  <p className="pl-1 pt-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!file || loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Uploading to Cloudinary & Running AI...' : 'Upload Photo'}
          </button>
        </form>
      </div>
    </div>
  );
}