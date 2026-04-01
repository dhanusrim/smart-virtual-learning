import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, BookOpen, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 px-8 py-4 flex justify-between items-center h-16 w-full fixed z-20 top-0 transition-all">
      <div className="flex items-center text-indigo-700 font-bold text-xl tracking-tight">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 rounded-lg mr-2 shadow-sm">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        Smart<span className="text-purple-600">Learn</span>
      </div>
      {user && (
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex items-center bg-gray-50 rounded-full pr-4 pl-1.5 py-1 border border-gray-100 shadow-sm">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-inner mr-2">
              {user.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
            </div>
            <div className="flex flex-col">
              <span className="text-gray-800 font-bold text-sm leading-tight">{user.name}</span>
              <span className="text-indigo-600 text-[10px] font-bold uppercase tracking-widest">{user.role}</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center bg-red-50 text-red-600 px-3 py-1.5 rounded-lg font-bold hover:bg-red-100 hover:text-red-700 transition shadow-sm text-sm"
          >
            <LogOut className="w-4 h-4 md:mr-1.5" />
            <span className="hidden md:block">Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
