import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Target, CheckCircle, Circle, Library, FileCheck, Clock, Award, Sparkles } from 'lucide-react';

const StudentProgressPage = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [progress, setProgress] = useState(null);
    const [contentList, setContentList] = useState([]);
    const [assessmentList, setAssessmentList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get('/courses').then(res => setCourses(res.data.data));
    }, []);

    useEffect(() => {
        if(selectedCourse) {
            setLoading(true);
            Promise.all([
                api.get(`/progress/${selectedCourse}`),
                api.get(`/content/course/${selectedCourse}`),
                api.get(`/assessments/course/${selectedCourse}`)
            ]).then(([pRes, cRes, aRes]) => {
                setProgress(pRes.data.data);
                setContentList(cRes.data.data);
                setAssessmentList(aRes.data.data);
            }).catch(console.error).finally(()=>setLoading(false));
        }
    }, [selectedCourse]);

    return (
        <div className="space-y-6 max-w-6xl mx-auto pl-8 pb-8 pr-4 animate-[fadeIn_0.5s_ease-out]">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4 pt-2">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight mb-1">My Progress</h1>
                    <p className="text-sm text-gray-500 font-medium">Track your learning journey and milestones.</p>
                </div>
                {progress?.completionPercentage === 100 && (
                    <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-4 py-2 rounded-xl shadow-md flex items-center font-bold text-sm animate-bounce shadow-amber-500/20">
                        <Award className="w-5 h-5 mr-1.5" /> Course Completed!
                    </div>
                )}
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center gap-4 relative overflow-hidden z-0">
                <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-indigo-500 opacity-5 rounded-full blur-2xl z-[-1]"></div>
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 text-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner z-10">
                    <Target className="w-6 h-6" />
                </div>
                <div className="flex-1 z-10">
                    <label className="block text-[10px] font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Select Enrolled Course</label>
                    <div className="relative">
                        <select className="w-full md:w-2/3 p-3 text-sm font-bold bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all outline-none appearance-none" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                            <option value="" disabled>-- Choose a course --</option>
                            {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 md:right-[34%] flex items-center px-3 text-gray-500">
                             <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="py-16 flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mb-3"></div>
                    <p className="text-gray-500 font-bold text-sm">Loading your progress profile...</p>
                </div>
            ) : selectedCourse && progress ? (
                <div className="space-y-6 animate-[fadeIn_0.5s_ease-out] pb-6">
                    <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 -mt-6 -mr-6 p-4 opacity-[0.02] group-hover:scale-105 transition-transform duration-700 pointer-events-none">
                            <Target className="w-48 h-48" />
                        </div>
                        
                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                    Overall Course Progress
                                </h2>
                                <div className="flex items-baseline space-x-1 bg-purple-50 px-4 py-2 rounded-xl border border-purple-100 shadow-inner">
                                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 drop-shadow-sm">
                                        {progress.completionPercentage || 0}
                                    </span>
                                    <span className="text-sm font-bold text-purple-400">%</span>
                                </div>
                            </div>
                            
                            <div className="w-full bg-gray-100 rounded-full h-6 mb-8 shadow-inner border border-gray-200 overflow-hidden relative">
                                <div 
                                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-end px-3 relative overflow-hidden" 
                                    style={{ width: `${progress.completionPercentage || 0}%` }}
                                >
                                    <div className="absolute inset-0 w-full h-full bg-white/20 animate-[shimmer_2s_infinite] -translate-x-full mix-blend-overlay"></div>
                                    {progress.completionPercentage > 5 && (
                                        <span className="text-white text-[10px] font-bold tracking-widest drop-shadow-sm z-10">
                                            {progress.completionPercentage}%
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 flex flex-col shadow-sm transform transition duration-300 hover:shadow hover:-translate-y-1 group/card text-center justify-center items-center relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                                    <div className="p-3 bg-white rounded-full shadow text-blue-500 mb-4 group-hover/card:scale-110 transition-transform border border-blue-50">
                                        <Library className="w-6 h-6"/>
                                    </div>
                                    <h3 className="text-blue-800 font-bold text-base mb-1">Learning Materials</h3>
                                    <div className="flex items-baseline space-x-1.5">
                                        <span className="text-2xl font-bold text-blue-600 drop-shadow-sm">{(progress.completedContent?.length || 0)}</span>
                                        <span className="text-sm font-bold text-blue-400">/ {contentList.length}</span>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 p-6 rounded-2xl border border-purple-100 flex flex-col shadow-sm transform transition duration-300 hover:shadow hover:-translate-y-1 group/card text-center justify-center items-center relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-purple-500"></div>
                                    <div className="p-3 bg-white rounded-full shadow text-purple-500 mb-4 group-hover/card:scale-110 transition-transform border border-purple-50">
                                        <FileCheck className="w-6 h-6"/>
                                    </div>
                                    <h3 className="text-purple-800 font-bold text-base mb-1">Assessments</h3>
                                    <div className="flex items-baseline space-x-1.5">
                                        <span className="text-2xl font-bold text-purple-600 drop-shadow-sm">{(progress.completedAssessments?.length || 0)}</span>
                                        <span className="text-sm font-bold text-purple-400">/ {assessmentList.length}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-gray-400 font-bold text-[10px] tracking-widest uppercase gap-3">
                                <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
                                    <Clock className="w-3 h-3 mr-1.5 text-gray-500" />
                                    Last Activity: <span className="ml-1.5 text-gray-600">{new Date(progress.lastAccessed).toLocaleString()}</span>
                                </div>
                                {progress.completionPercentage > 0 && (
                                    <div className="flex items-center text-indigo-500 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 text-[10px]">
                                        <Sparkles className="w-3 h-3 mr-1.5 text-yellow-500" /> Keep up the good work!
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                            <h3 className="text-base font-bold text-gray-800">Content Checklist</h3>
                            <p className="text-gray-500 font-medium text-xs mt-1">Track your granular progress.</p>
                        </div>
                        <div className="divide-y divide-gray-100 bg-white">
                            {contentList.length === 0 ? (
                                <div className="p-12 text-center flex flex-col items-center justify-center bg-gray-50/50">
                                    <div className="p-4 bg-white rounded-full shadow-sm mb-3 border border-gray-100">
                                        <Library className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <p className="text-gray-500 font-bold text-sm">No content assigned yet.</p>
                                </div>
                            ) : contentList.map(item => {
                                const isDone = progress.completedContent?.includes(item._id);
                                return (
                                    <div key={item._id} className={`p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between transition-colors duration-200 gap-3 ${isDone ? 'bg-emerald-50/30' : 'hover:bg-gray-50'}`}>
                                        <div className="flex items-center flex-1">
                                            {isDone ? (
                                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center mr-3 flex-shrink-0 shadow-sm border border-emerald-200">
                                                    <CheckCircle className="w-4 h-4" />
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center mr-3 flex-shrink-0 bg-gray-50 text-gray-300 shadow-inner">
                                                    <Circle className="w-4 h-4" />
                                                </div>
                                            )}
                                            <span className={`text-sm font-bold leading-tight ${isDone ? 'text-gray-900' : 'text-gray-500'}`}>{item.title}</span>
                                        </div>
                                        <div className="flex sm:justify-end pl-11 sm:pl-0">
                                            <span className={`text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest flex items-center shadow-sm ${
                                                isDone 
                                                ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white border-none' 
                                                : 'bg-white border border-gray-200 text-gray-400'
                                            }`}>
                                                {isDone ? '✅ Finished' : '⬜ Pending'}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="py-16 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 border border-gray-100">
                        <Target className="w-8 h-8 text-indigo-300" />
                    </div>
                    <h3 className="text-base font-bold text-gray-800 mb-1">Progress Overview</h3>
                    <p className="text-gray-500 font-medium text-sm">Select a course to view details.</p>
                </div>
            )}
            <style jsx>{`
                @keyframes shimmer {
                    100% {
                        transform: translateX(100%);
                    }
                }
            `}</style>
        </div>
    )
}
export default StudentProgressPage;
