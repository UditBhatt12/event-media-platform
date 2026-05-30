import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
        Relive Your Events <br className="hidden md:block" />
        <span className="text-indigo-600">Powered by AI</span>
      </h1>
      
      <p className="mt-4 max-w-2xl text-lg md:text-xl text-gray-600 mb-10">
        Upload high-quality event media, automatically tag photos, and instantly find pictures of yourself using our smart facial recognition engine.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/register" 
          className="px-8 py-3 text-base font-medium text-white bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 transition"
        >
          Create an Account
        </Link>
        <Link 
          href="/login" 
          className="px-8 py-3 text-base font-medium text-indigo-600 bg-white border border-indigo-200 rounded-lg shadow-sm hover:bg-indigo-50 transition"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}