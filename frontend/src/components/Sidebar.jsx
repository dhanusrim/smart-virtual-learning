import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { API_URL } from '../config';

// Example API call
const response = await fetch(`${API_URL}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  FileText, 
  CheckSquare, 
  TrendingUp, 
  BarChart, 
  Bell,
  Settings
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) return null;

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['Admin', 'Faculty', 'Student'] },
    { name: 'Users', path: '/users', icon: Users, roles: ['Admin'] },
    { name: 'Courses', path: '/courses', icon: BookOpen, roles: ['Admin', 'Faculty', 'Student'] },
    { name: 'Content', path: '/content', icon: FileText, roles: ['Faculty', 'Student'] },
    { name: 'Assessments', path: '/assessments', icon: CheckSquare, roles: ['Faculty', 'Student'] },
    { name: 'Progress', path: '/progress', icon: TrendingUp, roles: ['Faculty', 'Student'] },
    { name: 'Reports', path: '/reports', icon: BarChart, roles: ['Admin', 'Faculty'] },
    { name: 'Notifications', path: '/notifications', icon: Bell, roles: ['Admin', 'Faculty', 'Student'] },
    { name: 'System Settings', path: '/settings', icon: Settings, roles: ['Admin'] },
  ];

  const allowedLinks = links.filter(link => link.roles.includes(user.role));

  return (
    <div className="w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-indigo-950 text-white h-screen fixed left-0 top-16 shadow-xl overflow-y-auto border-r border-gray-800 z-10 transition-all pb-24">
      <div className="p-4">
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-3 px-3 drop-shadow-md">MAIN MENU</p>
        <ul className="space-y-1">
          {allowedLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname.startsWith(link.path);
            return (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group font-bold text-sm ${
                    isActive 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-3 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110 text-gray-400 group-hover:text-white'}`} />
                  <span className="tracking-wide block truncate">{link.name}</span>
                  {isActive && <div className="ml-auto w-1 h-5 bg-white rounded-full shadow-sm"></div>}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      
      <div className="mt-4 p-4">
         <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-4 rounded-xl border border-indigo-500/30 backdrop-blur-sm shadow-md relative overflow-hidden">
             <div className="absolute top-0 right-0 -mt-4 -mr-4 w-16 h-16 bg-indigo-500 opacity-20 rounded-full blur-xl"></div>
             <div className="flex items-center mb-2 relative z-10">
                 <div className="p-1.5 bg-indigo-500/30 rounded-md mr-2 shadow-inner">
                    <TrendingUp className="w-4 h-4 text-indigo-300" />
                 </div>
                 <h4 className="text-white font-bold text-sm tracking-wide">Keep Learning!</h4>
             </div>
             <p className="text-[11px] text-indigo-200 font-medium leading-relaxed relative z-10">Consistency is the key to mastering new skills.</p>
         </div>
      </div>
    </div>
  );
};

export default Sidebar;
