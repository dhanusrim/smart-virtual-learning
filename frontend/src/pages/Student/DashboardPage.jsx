import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { BookOpen, CheckSquare, TrendingUp, Bell, Sparkles, User } from 'lucide-react';

const StudentDashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ enrolledCourses: 0, completedAssessments: 0, overallProgress: 0 });
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, notifRes] = await Promise.all([
           api.get('/dashboard/stats'),
           api.get('/notifications')
        ]);
        
        setStats(statsRes.data?.data || { enrolledCourses: 0, completedAssessments: 0, overallProgress: 0 });
        setNotifications(notifRes.data?.data ? notifRes.data.data.slice(0, 4) : []);
      } catch (err) {
        console.error('Error fetching dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return (
      <div className="min-h-[50vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
  );

  const chartData = [
      { name: 'Enrolled Courses', count: stats.enrolledCourses },
      { name: 'Completed Assessments', count: stats.completedAssessments },
      { name: 'Overall Progress', count: stats.overallProgress }
  ];

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out] pl-8 pb-8 pr-4 max-w-7xl">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 rounded-2xl shadow-md p-6 sm:p-8 text-white">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-purple-400 opacity-20 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-md border border-white/40 rounded-full flex items-center justify-center text-xl font-bold shadow-inner hidden sm:flex">
                      {user?.name ? user.name.charAt(0).toUpperCase() : <User size={24} />}
                  </div>
                  <div>
                      <h1 className="text-xl font-bold tracking-tight mb-1 flex items-center">
                          Welcome back, {user?.name}! <Sparkles className="w-5 h-5 ml-2 text-yellow-300 animate-pulse" />
                      </h1>
                      <p className="text-indigo-100 text-sm font-medium">Ready to conquer your goals today?</p>
                  </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl mt-2 sm:mt-0 shadow-sm text-center">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-indigo-200">Scope</p>
                  <p className="text-sm font-bold tracking-wide">Student Portal</p>
              </div>
          </div>
      </div>

      {/* Colorful Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-50 flex items-center justify-between transition-all duration-300 hover:shadow-md hover:shadow-blue-500/10 hover:-translate-y-1 group">
            <div>
                <p className="text-blue-500 text-xs font-bold uppercase tracking-wider mb-1">Enrolled Courses</p>
                <p className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{stats?.enrolledCourses || 0}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow-inner group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-blue-600"/>
            </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-50 flex items-center justify-between transition-all duration-300 hover:shadow-md hover:shadow-green-500/10 hover:-translate-y-1 group">
            <div>
                <p className="text-green-500 text-xs font-bold uppercase tracking-wider mb-1">Assessments</p>
                <p className="text-2xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">{stats?.completedAssessments || 0}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl shadow-inner group-hover:scale-110 transition-transform">
                <CheckSquare className="w-6 h-6 text-green-600"/>
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-50 flex items-center justify-between transition-all duration-300 hover:shadow-md hover:shadow-purple-500/10 hover:-translate-y-1 group">
            <div>
                <p className="text-purple-500 text-xs font-bold uppercase tracking-wider mb-1">Overall Progress</p>
                <div className="flex items-end">
                    <p className="text-2xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors">{stats?.overallProgress || 0}</p>
                    <span className="text-sm font-bold text-gray-400 mb-0.5 ml-1">%</span>
                </div>
            </div>
            <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl shadow-inner group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-purple-600"/>
            </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Card */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
             <div className="flex justify-between items-center mb-6">
                <div>
                   <h2 className="text-base font-bold text-gray-800 tracking-tight">Learning Activity</h2>
                   <p className="text-xs font-medium text-gray-500 mt-1">Overview of your engagement.</p>
                </div>
             </div>
             
             <div className="h-[300px] bg-gray-50/50 p-4 rounded-xl border border-gray-100/50">
                 <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 25, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB"/>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#4B5563', fontWeight: 600, fontSize: 11}} dy={15} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontWeight: 500, fontSize: 11}} />
                    <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '13px', fontWeight: 'bold'}}/>
                    <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={60}>
                        <LabelList dataKey="count" position="top" fill="#4f46e5" fontWeight="bold" fontSize={14} offset={10} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
          
          {/* Notifications Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden transition-all hover:shadow-md">
             <div className="p-6 border-b border-gray-50 bg-gray-50/50 pb-5 relative overflow-hidden">
                 <div className="absolute top-0 right-0 -mt-6 -mr-6 w-20 h-20 bg-indigo-100 rounded-full blur-xl opacity-50"></div>
                 <div className="flex items-center justify-between relative z-10">
                     <div className="flex items-center">
                         <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg mr-3 shadow-sm"><Bell className="w-4 h-4"/></div>
                         <h2 className="text-base font-bold text-gray-800 tracking-tight">Recent Alerts</h2>
                     </div>
                     <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">{notifications.length}</span>
                 </div>
             </div>
             
             <div className="p-4 flex-1 bg-white">
                 {notifications.length === 0 ? (
                     <div className="h-full flex flex-col items-center justify-center text-gray-400 p-4 opacity-80">
                         <Bell className="w-8 h-8 mb-2 text-gray-200" />
                         <span className="font-bold text-sm text-gray-500">No new alerts</span>
                     </div>
                 ) : (
                     <div className="space-y-3">
                         {notifications.map(n => (
                             <div key={n._id} className="group p-4 rounded-xl border border-gray-100 bg-white hover:bg-indigo-50 hover:border-indigo-200 transition-all cursor-pointer relative overflow-hidden shadow-sm hover:shadow">
                                 {!n.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>}
                                 <h4 className={`font-bold text-sm leading-tight mb-1 ${!n.read ? 'text-indigo-900' : 'text-gray-800'}`}>{n.title}</h4>
                                 <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{n.message}</p>
                                 <div className="mt-2 flex items-center justify-between">
                                     <span className="text-[9px] text-gray-400 font-bold tracking-widest uppercase bg-gray-50 px-1.5 py-0.5 rounded text-xs">{new Date(n.createdAt).toLocaleDateString()}</span>
                                     <span className="text-[10px] text-indigo-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider text-xs">Details &rarr;</span>
                                 </div>
                             </div>
                         ))}
                     </div>
                 )}
             </div>
          </div>
      </div>
    </div>
  );
};
export default StudentDashboardPage;
