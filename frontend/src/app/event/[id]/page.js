"use client";
import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import EventGallery from '@/components/EventGallery';

export default function EventDetailsPage({ params }) {
  const resolvedParams = use(params);
  const currentEventId = resolvedParams.id;

  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Event Data & Access Level
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/events/${currentEventId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEventData(res.data);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [currentEventId]);

  // Action: Request to Join
  const handleRequestJoin = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/events/${currentEventId}/request`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Optimistically update UI
      setEventData(prev => ({ ...prev, isPending: true }));
      alert("Request sent successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send request.");
    }
  };

  // Action: Owner Approves a Member
  const handleApprove = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/events/${currentEventId}/approve`, { userId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Remove them from the pending list in the UI
      setEventData(prev => ({
        ...prev,
        pendingRequests: prev.pendingRequests.filter(u => u._id !== userId)
      }));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to approve user.");
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-indigo-500 font-bold animate-pulse">Scanning Event Security...</div>;
  }

  if (!eventData) {
    return <div className="text-center py-20 text-red-500">Event not found.</div>;
  }

  // Calculate if they are allowed to see the gallery and upload
  const canViewGallery = !eventData.isPrivate || eventData.isApproved || eventData.isOwner;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800 font-medium text-sm mb-2 inline-block">
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-4xl font-extrabold text-gray-900">{eventData.name || "Event Gallery"}</h1>
          <div className="flex gap-3 mt-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${eventData.isPrivate ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {eventData.isPrivate ? '🔒 Private Event' : '🌍 Public Event'}
            </span>
            {eventData.isOwner && <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">👑 You are the Owner</span>}
          </div>
        </div>
        
        {/* Only show Upload button if they are approved or the owner */}
        {canViewGallery && (
          <Link 
            href="/dashboard/upload" 
            className="bg-indigo-600 text-white px-5 py-2 rounded-md font-medium hover:bg-indigo-700 transition shadow-sm"
          >
            + Upload More Photos
          </Link>
        )}
      </div>

      {/* 👑 THE OWNER DASHBOARD: Approve Pending Requests */}
      {eventData.isOwner && eventData.pendingRequests?.length > 0 && (
        <div className="mb-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-amber-800 mb-4 flex items-center gap-2">
            ⚠️ Pending Join Requests ({eventData.pendingRequests.length})
          </h3>
          <div className="space-y-3">
            {eventData.pendingRequests.map(user => (
              <div key={user._id} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-amber-100">
                <div>
                  <p className="font-bold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <button 
                  onClick={() => handleApprove(user._id)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-bold text-sm transition shadow-sm"
                >
                  Approve Access
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🚧 ACCESS CONTROL LOGIC */}
      {canViewGallery ? (
        <EventGallery eventId={currentEventId} />
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center max-w-2xl mx-auto mt-10">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">This is a Private Event</h2>
          <p className="text-gray-500 mb-8">You need permission from the event owner to view or upload photos to this gallery.</p>
          
          {eventData.isPending ? (
            <div className="bg-amber-100 text-amber-800 px-6 py-3 rounded-full font-bold inline-block border border-amber-200">
              ⏳ Your request is pending approval...
            </div>
          ) : (
            <button 
              onClick={handleRequestJoin}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-bold transition shadow-md"
            >
              Request to Join Event
            </button>
          )}
        </div>
      )}
    </div>
  );
}