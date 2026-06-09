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
  const [sortBy, setSortBy] = useState('date'); 

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchData = async (token) => {
      try {
        const eventRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvents(eventRes.data); 

        const notifRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(notifRes.data);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthorized(true);
      fetchData(token); 
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const sortedEvents = [...events].sort((a, b) => {
    if (sortBy === 'date') return new Date(b.eventDate) - new Date(a.eventDate);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'category') return (a.category || "").localeCompare(b.category || "");
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
          
          <div className="flex items-center gap-4">
            {/* The Notification Bell UI */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-500 hover:text-indigo-600 transition bg-gray-50 rounded-full hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">Notifications</h3>
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-bold">{notifications.length} New</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(notif => (
                        <div key={notif._id} className="p-4 border-b border-gray-50 hover:bg-gray-50 flex gap-3 items-start transition cursor-pointer">
                          {notif.mediaId?.imageUrl ? (
                            <img src={notif.mediaId.imageUrl} alt="thumbnail" className="w-12 h-12 rounded-lg object-cover shadow-sm border border-gray-200" />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-400">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                            </div>
                          )}
                          <div>
                            <p className="text-sm text-gray-800">
                              <span className="font-bold text-indigo-600">{notif.sender?.name || 'Someone'}</span> {notif.message.replace('Someone ', '')}
                            </p>
                            <span className="text-xs text-gray-400 font-medium">{new Date(notif.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-sm text-gray-500 italic">No new notifications.</div>
                    )}
                  </div>
                </div>
              )}
            </div>

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
        
        {/* 👇 FIXED: UI Actions with the new AI Face Search Button */}
        <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/dashboard/upload" className="border-2 border-dashed border-indigo-200 bg-indigo-50/30 rounded-xl h-48 flex flex-col items-center justify-center text-indigo-500 hover:bg-indigo-50 transition cursor-pointer block">
            <svg className="w-10 h-10 mb-3 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            <span className="font-semibold text-center block">Upload Media</span>
          </Link>

          <Link href="/dashboard/search-face" className="border-2 border-solid border-purple-200 bg-purple-50/50 rounded-xl h-48 flex flex-col items-center justify-center text-purple-600 hover:bg-purple-100 transition cursor-pointer block shadow-sm">
            <svg className="w-10 h-10 mb-3 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
            <span className="font-semibold text-center block">AI Face Search</span>
          </Link>
          
          <div className="col-span-1 bg-gray-50 rounded-xl border border-gray-200 p-6 flex flex-col justify-center">
             <h2 className="text-lg font-bold text-gray-800 mb-2">Welcome!</h2>
             <p className="text-sm text-gray-600">Upload photos or use our AI to instantly find pictures of yourself.</p>
          </div>
        </div>

        {/* Real Events List Header with Dropdown */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Your Events</h2>
          
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

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedEvents.length > 0 ? (
            sortedEvents.map(event => (
              <Link key={event._id} href={`/event/${event._id}`} className="block group">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group-hover:border-indigo-300">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
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