import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, User, LogIn } from 'lucide-react';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

export const Navbar: React.FC = () => {
  const [user] = useAuthState(auth);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const handleLogout = () => signOut(auth);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-orange-600 p-1.5 rounded-lg">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              NK Staff <span className="text-orange-600">Solution</span>
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.email === 'neerajkumarkhatri.ai@gmail.com' && (
                  <Link 
                    to="/admin" 
                    className="hidden md:flex items-center bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-all text-sm font-bold shadow-lg shadow-orange-100"
                  >
                    Post a Job
                  </Link>
                )}
                <Link 
                  to="/admin" 
                  className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors"
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-2">
                  <img 
                    src={user.photoURL || ''} 
                    alt={user.displayName || ''} 
                    className="w-8 h-8 rounded-full border border-gray-200"
                  />
                  <button 
                    onClick={handleLogout}
                    className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={handleLogin}
                className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all text-sm font-medium"
              >
                <LogIn className="w-4 h-4" />
                <span>Admin Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
