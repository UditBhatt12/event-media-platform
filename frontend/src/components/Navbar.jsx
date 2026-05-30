import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md w-full sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              EventLens AI
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-4">
            <Link 
              href="/dashboard" 
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition"
            >
              Dashboard
            </Link>
            <Link 
              href="/login" 
              className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition shadow-sm"
            >
              Login
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}