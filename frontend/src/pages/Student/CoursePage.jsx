import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { BookOpen, User as UserIcon, CheckCircle, Clock, Star, Layout } from 'lucide-react';

const StudentCoursePage = () => {
    const { user } = useContext(AuthContext);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCourses = async () => {
        try {
            const res = await api.get('/courses');
            setCourses(res.data.data);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleEnroll = async (id) => {
        try {
            await api.post(`/courses/${id}/enroll`);
            setCourses(courses.map(c => 
                c._id === id ? { ...c, students: [...c.students, user.id] } : c
            ));
        } catch (err) {
            alert(err.response?.data?.message || 'Enrollment failed');
        }
    };

    if (loading) return (
        <div className="min-h-[50vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto pl-8 pb-8 pr-4 animate-[fadeIn_0.5s_ease-out] relative z-0">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pt-2">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight mb-1">Course Catalog</h1>
                    <p className="text-sm text-gray-500 font-medium">Discover top-tier courses to advance your skills.</p>
                </div>
                <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                    <Layout className="w-4 h-4 text-indigo-500" />
                    <span className="font-bold text-sm text-gray-700">{courses.length} Available</span>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course, index) => {
                    const isEnrolled = course.students.includes(user.id);
                    const gradients = [
                        'from-indigo-600 to-purple-600',
                        'from-blue-500 to-cyan-500',
                        'from-purple-500 to-pink-600',
                        'from-emerald-500 to-teal-500'
                    ];
                    const gradClass = gradients[index % gradients.length];

                    return (
                        <div key={course._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1 group relative z-0">
                            {/* Card Header Background */}
                            <div className={`h-32 bg-gradient-to-br ${gradClass} p-6 flex flex-col justify-end relative overflow-hidden`}>
                                <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-white opacity-10 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500"></div>
                                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center shadow-sm border border-white/30">
                                    <Star className="w-3 h-3 text-yellow-300 mr-1 fill-yellow-300 drop-shadow-sm" />
                                    <span className="text-xs font-bold text-white drop-shadow-sm">4.9</span>
                                </div>
                                <h3 className="text-base font-bold text-white leading-tight drop-shadow-md z-10 truncate">{course.title}</h3>
                            </div>
                            
                            {/* Card Body */}
                            <div className="p-6 flex-1 flex flex-col bg-white">
                                <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1 line-clamp-3 group-hover:text-gray-700 transition-colors">{course.description}</p>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-600 flex items-center justify-center font-bold text-xs mr-3 shadow-inner">
                                                {course.faculty?.name ? course.faculty.name.charAt(0).toUpperCase() : 'F'}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[9px] uppercase font-bold tracking-widest text-gray-400 mb-0.5">Instructor</span>
                                                <span className="text-sm font-bold text-gray-800 tracking-wide truncate">{course.faculty?.name || 'Expert Faculty'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-1">
                                        <div className="flex items-center bg-gray-50 px-2.5 py-1 rounded-md">
                                            <Clock className="w-3 h-3 mr-1.5 text-gray-500" />
                                            8 Weeks
                                        </div>
                                        <div className="flex items-center bg-gray-50 px-2.5 py-1 rounded-md">
                                            <UserIcon className="w-3 h-3 mr-1.5 text-gray-500" />
                                            {course.students.length} Enrolled
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                {isEnrolled ? (
                                    <button disabled className="w-full flex items-center justify-center py-2.5 rounded-xl font-bold text-sm bg-green-50 text-green-700 border border-green-200 transition-all shadow-inner">
                                        <CheckCircle className="w-4 h-4 mr-1.5" /> Enrolled ✓
                                    </button>
                                ) : (
                                    <button onClick={() => handleEnroll(course._id)} className="w-full relative overflow-hidden flex items-center justify-center py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md shadow-indigo-300/50 hover:shadow-indigo-500/50 group/btn">
                                        <span className="relative z-10 flex items-center tracking-wide">
                                            <BookOpen className="w-4 h-4 mr-1.5" /> Enroll Now
                                        </span>
                                        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:[animation:shimmer_1.5s_infinite]"></div>
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
                {courses.length === 0 && (
                    <div className="col-span-full py-16 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <BookOpen className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="text-base text-gray-700 font-bold mb-1">No courses available.</p>
                        <p className="text-sm text-gray-500">Please check back later.</p>
                    </div>
                )}
            </div>
            <style jsx>{`
                @keyframes shimmer {
                    100% {
                        transform: translateX(100%);
                    }
                }
            `}</style>
        </div>
    );
};
export default StudentCoursePage;
