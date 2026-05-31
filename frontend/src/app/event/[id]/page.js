"use client";
import Link from 'next/link';

export default function EventGallery({ params }) {
  // We will eventually fetch real data using params.id
  // For now, here is mock data so we can design the UI!
  const mockEvent = {
    title: "Summer Tech Hackathon 2026",
    date: "2026-07-15",
    location: "New Delhi",
  };

  const mockPhotos = [
    { id: 1, url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d", tags: ["people", "technology", "laptop"] },
    { id: 2, url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87", tags: ["crowd", "stage", "lighting"] },
    { id: 3, url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b", tags: ["presentation", "screen"] },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800 font-medium text-sm mb-2 inline-block">
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-4xl font-extrabold text-gray-900">{mockEvent.title}</h1>
          <p className="text-gray-500 mt-1 flex gap-4">
            <span>📅 {mockEvent.date}</span>
            <span>📍 {mockEvent.location}</span>
          </p>
        </div>
        
        <Link 
          href="/dashboard/upload" 
          className="bg-indigo-600 text-white px-5 py-2 rounded-md font-medium hover:bg-indigo-700 transition shadow-sm"
        >
          + Upload More Photos
        </Link>
      </div>

      {/* Search & Filter Bar (UI Only) */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-8 flex gap-4">
        <input 
          type="text" 
          placeholder="Search AI tags (e.g., 'laptop', 'crowd')..." 
          className="flex-1 border-none focus:ring-0 text-gray-700 bg-gray-50 rounded-md px-4 py-2"
        />
        <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-200 font-medium text-sm">
          Filter
        </button>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPhotos.map((photo) => (
          <div key={photo.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group">
            {/* Image */}
            <div className="h-64 overflow-hidden relative bg-gray-100">
              <img 
                src={photo.url} 
                alt="Event photo" 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
            </div>
            
            {/* AI Tags */}
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">AI Tags</h3>
              <div className="flex flex-wrap gap-2">
                {photo.tags.map(tag => (
                  <span key={tag} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-full border border-indigo-100 font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}