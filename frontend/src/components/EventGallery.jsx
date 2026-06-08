"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function EventGallery({ eventId }) {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal and Comment State
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [commentText, setCommentText] = useState("");
    const [commenting, setCommenting] = useState(false);

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

    const filteredPhotos = photos.filter((photo) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return photo.aiTags && photo.aiTags.some(tag => tag.toLowerCase().includes(query));
    });

    const handleLike = async (photoId, e) => {
        if (e) e.stopPropagation(); 
        
        try {
            const token = localStorage.getItem('token');
            if (!token) return alert("You must be logged in to like photos!");

            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/media/${photoId}/like`,
                {}, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setPhotos(photos.map(photo => {
                if (photo._id === photoId) return { ...photo, likes: res.data.likes };
                return photo;
            }));
            
            // If the modal is open, instantly update the like count there too
            if (selectedPhoto && selectedPhoto._id === photoId) {
                setSelectedPhoto(prev => ({ ...prev, likes: res.data.likes }));
            }
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    // Cloudinary Dynamic Watermark Download
    const handleDownload = async (imageUrl) => {
        try {
            // 1. Create the Cloudinary watermark transformation string
            // We use standard Arial, size 40, bold, white color, 70% opacity, placed bottom-right (south_east)
            const watermarkString = "l_text:Arial_40_bold:EventLens%20AI,co_white,g_south_east,x_20,y_20,o_70";
            
            // 2. Inject the watermark instruction into the middle of the Cloudinary URL
            const urlParts = imageUrl.split('/upload/');
            const watermarkedUrl = `${urlParts[0]}/upload/${watermarkString}/${urlParts[1]}`;

            // 3. Fetch the image as a Blob (this forces a download instead of just opening a new tab)
            const response = await fetch(watermarkedUrl);
            const blob = await response.blob();
            
            // 4. Create a temporary invisible link to trigger the file download
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `eventlens_watermarked_${Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error downloading image:", error);
            alert("Failed to download image safely.");
        }
    };

    // Handle submitting a comment
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        setCommenting(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/media/${selectedPhoto._id}/comment`,
                { text: commentText },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Instantly update the main grid
            setPhotos(photos.map(photo => {
                if (photo._id === selectedPhoto._id) return { ...photo, comments: res.data.comments };
                return photo;
            }));
            
            // Instantly update the open modal
            setSelectedPhoto(prev => ({ ...prev, comments: res.data.comments }));
            setCommentText(""); // Clear the input box
        } catch (error) {
            console.error("Error posting comment:", error);
            alert("Failed to post comment.");
        } finally {
            setCommenting(false);
        }
    };

    if (loading) return <div className="text-center py-10 text-gray-500 font-medium">Loading smart gallery...</div>;
    if (photos.length === 0) return <div className="text-center py-10 text-gray-500">No photos uploaded to this event yet.</div>;

    return (
        <div>
            {/* Search Bar */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-8 flex gap-4">
                <input 
                    type="text" 
                    placeholder="Search by AI tags (e.g., 'laptop', 'diagram')..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-gray-700 bg-gray-50 rounded-md px-4 py-2 outline-none"
                />
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPhotos.length > 0 ? (
                    filteredPhotos.map((photo) => (
                        <div key={photo._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group">
                            
                            {/* Clicking the image opens the modal */}
                            <div 
                                className="h-64 overflow-hidden relative bg-gray-100 cursor-pointer"
                                onClick={() => setSelectedPhoto(photo)}
                            >
                                <img src={photo.imageUrl} alt="Event photo" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                                
                                {/* Overlay Indicators */}
                                <div className="absolute top-3 right-3 flex gap-2">
                                    {photo.comments && photo.comments.length > 0 && (
                                        <span className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"></path></svg>
                                            {photo.comments.length}
                                        </span>
                                    )}
                                </div>

                                <div className="absolute bottom-3 right-3">
                                    <button 
                                        onClick={(e) => handleLike(photo._id, e)} // Pass 'e' to stop propagation
                                        className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full hover:bg-black/70 transition-all shadow-sm"
                                    >
                                        <svg className={`w-5 h-5 transition-colors ${photo.likes && photo.likes.length > 0 ? 'text-red-500 fill-current' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                        <span className="text-sm font-semibold">{photo.likes ? photo.likes.length : 0}</span>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="p-4">
                                <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">AI Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {photo.aiTags && photo.aiTags.length > 0 ? (
                                        photo.aiTags.map((tag, index) => (
                                            <span key={index} className="text-xs px-2 py-1 rounded-full border font-medium bg-indigo-50 text-indigo-700 border-indigo-100">#{tag}</span>
                                        ))
                                    ) : <span className="text-gray-400 text-xs italic">No tags</span>}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-10 text-gray-500 italic bg-gray-50 rounded-lg border border-dashed border-gray-300">No photos match the search tag: "{searchQuery}"</div>
                )}
            </div>

            {/* The Interactive Lightbox Modal */}
            {selectedPhoto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-6 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden relative shadow-2xl relative">
                        
                        {/* Close Button */}
                        <button 
                            onClick={() => setSelectedPhoto(null)} 
                            className="absolute top-4 right-4 bg-white/20 backdrop-blur-md hover:bg-gray-200 text-gray-800 p-2 rounded-full z-10 transition border border-gray-200 shadow-sm"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>

                        {/* Left Side: Full Image */}
                        <div className="w-full md:w-3/5 bg-gray-900 flex items-center justify-center p-4 relative group">
                            <img src={selectedPhoto.imageUrl} alt="Selected" className="max-h-[40vh] md:max-h-[85vh] object-contain rounded-lg" />
                            
                            {/* Bottom Left: Like Button */}
                            <div className="absolute bottom-6 left-6">
                                 <button onClick={(e) => handleLike(selectedPhoto._id, e)} className="flex items-center gap-2 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full hover:bg-black/80 transition-all shadow-lg border border-white/10">
                                    <svg className={`w-6 h-6 transition-colors ${selectedPhoto.likes && selectedPhoto.likes.length > 0 ? 'text-red-500 fill-current' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                    <span className="font-bold">{selectedPhoto.likes ? selectedPhoto.likes.length : 0} Likes</span>
                                </button>
                            </div>

                            {/* Bottom Right: Download Button */}
                            <div className="absolute bottom-6 right-6">
                                <button 
                                    onClick={() => handleDownload(selectedPhoto.imageUrl)} 
                                    className="flex items-center gap-2 bg-indigo-600/90 backdrop-blur-md text-white px-4 py-2 rounded-full hover:bg-indigo-500 transition-all shadow-lg border border-white/10"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                    <span className="font-bold">Download</span>
                                </button>
                            </div>
                        </div>

                        {/* Right Side: Comments Section */}
                        <div className="w-full md:w-2/5 flex flex-col bg-white h-[50vh] md:h-[90vh]">
                            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <h3 className="font-extrabold text-lg text-gray-900">Comments</h3>
                            </div>
                            
                            {/* Comments List */}
                            <div className="flex-1 overflow-y-auto p-5 space-y-4">
                                {selectedPhoto.comments && selectedPhoto.comments.length > 0 ? (
                                    selectedPhoto.comments.map((comment, i) => (
                                        <div key={i} className="bg-gray-50 p-4 rounded-xl text-sm border border-gray-100">
                                            <div className="font-bold text-indigo-600 mb-1 flex justify-between items-center">
                                                User
                                                <span className="text-[10px] text-gray-400 font-normal">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="text-gray-700 break-words">{comment.text}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3">
                                        <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                                        <p className="italic text-sm">No comments yet. Be the first!</p>
                                    </div>
                                )}
                            </div>

                            {/* Comment Input Box */}
                            <form onSubmit={handleCommentSubmit} className="p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                                <div className="flex gap-2 relative">
                                    <input 
                                        type="text" 
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="Add a comment..." 
                                        className="flex-1 bg-gray-100 border-transparent rounded-full px-5 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={commenting || !commentText.trim()} 
                                        className="absolute right-1.5 top-1.5 bottom-1.5 bg-indigo-600 text-white px-4 rounded-full font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all"
                                    >
                                        {commenting ? '...' : 'Post'}
                                    </button>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}