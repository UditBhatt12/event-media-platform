"use client";
import React, { use } from 'react'; // 👈 Added 'use' here
import Link from 'next/link';
import EventGallery from '@/components/EventGallery';

export default function EventDetailsPage({ params }) {
  // 🚨 NEW: Unwrap the params Promise using React.use()
  const resolvedParams = use(params);
  const currentEventId = resolvedParams.id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800 font-medium text-sm mb-2 inline-block">
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-4xl font-extrabold text-gray-900">Event Gallery</h1>
          <p className="text-gray-500 mt-1 flex gap-4">
            <span>Event ID: {currentEventId}</span>
          </p>
        </div>
        
        <Link 
          href="/dashboard/upload" 
          className="bg-indigo-600 text-white px-5 py-2 rounded-md font-medium hover:bg-indigo-700 transition shadow-sm"
        >
          + Upload More Photos
        </Link>
      </div>

      {/* Render the LIVE Photo Grid using the dynamic ID */}
      <EventGallery eventId={currentEventId} />
      
    </div>
  );
}