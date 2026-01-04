import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8">
        
        <h1 className="text-4xl  text-gray-800 mb-4">
          
        </h1>

        <p className="text-gray-600 mb-8">
          click bellow to see the products
        </p>

        <Link to="/dashboard">
          <button className="px-3 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-500 text-white font-semibold text-lg shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
            Go to Dashboard
          </button>
        </Link>

      </div>
    </div>
  );
}
