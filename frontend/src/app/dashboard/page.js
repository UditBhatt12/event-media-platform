"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

export default function Dashboard() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [events, setEvents] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  // 👇 NEW: State to track how the user wants to sort the events
  const [sortBy, setSortBy] = useState('date'); 

  useEffect(() => {
    const fetchRealEvents = async (token) => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvents(res.data); 
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthorized(true);
      fetchRealEvents(token); 
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  // 👇 NEW: The Sorting Logic!
  const sortedEvents = [...events].sort((a, b) => {
    if (sortBy === 'date') {
      // Sort by newest date first
      return new Date(b.eventDate) - new Date(a.eventDate);
    } else if (sortBy === 'name') {
      // Sort alphabetically A-Z
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'category') {
      // Sort by category alphabetically
      return (a.category || "").localeCompare(b.category || "");
    }
    return 0;
  });

  if (!isAuthorized) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-500 animate-pulse">Loading secure dashboard...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-gray-900">Your Workspace</h1>
          <div className="flex gap-4">
            <Link 
              href="/dashboard/create-event"
              className="bg-green-50 text-green-700 hover:bg-green-100 px-4 py-2 rounded-md text-sm font-bold transition shadow-sm border border-green-200"
            >
              + Create Event
            </Link>
            <button 
              onClick={handleLogout}
              className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-md text-sm font-bold transition shadow-sm"
            >
              Log Out
            </button>
          </div>
        </div>
        
        {/* UI Actions */}
        <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/dashboard/upload" className="border-2 border-dashed border-indigo-200 bg-indigo-50/30 rounded-xl h-48 flex flex-col items-center justify-center text-indigo-500 hover:bg-indigo-50 transition cursor-pointer block">
            <svg className="w-12 h-12 mb-3 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            <span className="font-semibold text-center block">Upload Media</span>
          </Link>
          
          <div className="col-span-1 md:col-span-2 bg-gray-50 rounded-xl border border-gray-200 p-6 flex flex-col justify-center">
             <h2 className="text-xl font-bold text-gray-800 mb-2">Welcome to EventLens AI!</h2>
             <p className="text-gray-600">Start by creating an event, then upload photos to it. Our AI will automatically scan faces and objects to generate smart tags for easy searching.</p>
          </div>
        </div>

        {/* Real Events List Header with Dropdown */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Your Events</h2>
          
          {/* 👇 NEW: The Sorting Dropdown UI */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500 font-medium">Sort by:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 outline-none cursor-pointer"
            >
              <option value="date">Date (Newest)</option>
              <option value="name">Event Name (A-Z)</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>

        {/* 👇 UPDATED: Mapping over sortedEvents instead of raw events */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedEvents.length > 0 ? (
            sortedEvents.map(event => (
              <Link key={event._id} href={`/event/${event._id}`} className="block group">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group-hover:border-indigo-300">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                    {/* Render the category badge if it exists */}
                    {event.category && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                        {event.category}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                    {event.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {event.eventDate ? new Date(event.eventDate).toLocaleDateString() : ''} 
                    {event.location ? ` • ${event.location}` : ''}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-8 text-center text-gray-500 italic bg-gray-50 rounded-xl border border-dashed border-gray-300">
              No events found. Click "+ Create Event" to get started!
            </div>
          )}
        </div>

      </div>
    </div>
  );
}