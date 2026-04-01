import React, { useEffect, useState, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import StudentDashboardPage from '../Student/DashboardPage';
import { Users, BookOpen, GraduationCap, Presentation, CheckSquare, FileText } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
      <div className="min-h-[50vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
  );
  if (user?.role === 'Student') return <StudentDashboardPage />;

  let chartData = [];
  let cards = [];

  if (user.role === 'Admin' && stats) {
    chartData = [
      { name: 'Users', count: stats.totalUsers || 0, color: '#3b82f6' },
      { name: 'Courses', count: stats.totalCourses || 0, color: '#a855f7' },
      { name: 'Students', count: stats.totalStudents || 0, color: '#22c55e' },
      { name: 'Faculty', count: stats.totalFaculty || 0, color: '#f97316' },
      { name: 'Assessments', count: stats.totalAssessments || 0, color: '#6366f1' },
      { name: 'Submissions', count: stats.totalSubmissions || 0, color: '#ec4899' }
    ];

    cards = [
      { name: 'Total Users', count: stats.totalUsers, icon: Users, colorClass: 'bg-blue-100 text-blue-600', border: 'border-blue-200' },
      { name: 'Total Courses', count: stats.totalCourses, icon: BookOpen, colorClass: 'bg-purple-100 text-purple-600', border: 'border-purple-200' },
      { name: 'Total Students', count: stats.totalStudents, icon: GraduationCap, colorClass: 'bg-green-100 text-green-600', border: 'border-green-200' },
      { name: 'Total Faculty', count: stats.totalFaculty, icon: Presentation, colorClass: 'bg-orange-100 text-orange-600', border: 'border-orange-200' },
      { name: 'Total Assessments', count: stats.totalAssessments, icon: CheckSquare, colorClass: 'bg-indigo-100 text-indigo-600', border: 'border-indigo-200' },
      { name: 'Total Submissions', count: stats.totalSubmissions, icon: FileText, colorClass: 'bg-pink-100 text-pink-600', border: 'border-pink-200' }
    ];
  } else if (user.role === 'Faculty' && stats) {
     chartData = [
      { name: 'My Courses', count: stats.myCourses, color: '#4f46e5' },
      { name: 'My Assessments', count: stats.myAssessments, color: '#10b981' }
    ];
    cards = [
      { name: 'My Courses', count: stats.myCourses, icon: BookOpen, colorClass: 'bg-indigo-100 text-indigo-600', border: 'border-indigo-200' },
      { name: 'My Assessments', count: stats.myAssessments, icon: CheckSquare, colorClass: 'bg-emerald-100 text-emerald-600', border: 'border-emerald-200' }
    ];
  }

  return (
    <div className="animate-[fadeIn_0.5s_ease-out] w-full max-w-7xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 pb-4 border-b border-gray-200">Welcome back, {user.name}!</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {cards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className={`bg-white p-6 rounded-2xl shadow-sm border ${stat.border} flex items-center justify-between transition hover:shadow-md hover:-translate-y-1`}>
              <div>
                <p className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-2">{stat.name}</p>
                <p className="text-3xl font-black text-gray-800">{stat.count}</p>
              </div>
              <div className={`p-4 rounded-xl ${stat.colorClass} shadow-inner`}>
                <Icon size={28} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-[400px]">
         <h2 className="text-xl font-bold text-gray-800 mb-6">Overview Activity</h2>
         <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontWeight: 600, fontSize: 12, fill: '#6b7280'}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fontWeight: 600, fontSize: 12, fill: '#6b7280'}} />
            <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', fontWeight: 'bold'}} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={50}>
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
