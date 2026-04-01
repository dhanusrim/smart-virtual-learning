import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FileText, Link as LinkIcon, Download, Video as VideoIcon, BookOpen, ExternalLink, Play, CheckCircle } from 'lucide-react';

const StudentContentPage = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [contents, setContents] = useState([]);
    const [completedContents, setCompletedContents] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchEnrolled = async () => {
            try {
                const res = await api.get('/courses/enrolled');
                setCourses(res.data.data);
            } catch (err) { console.error(err); }
        };
        fetchEnrolled();
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            fetchContents(selectedCourse);
        } else {
            setContents([]);
        }
    }, [selectedCourse]);

    const fetchContents = async (courseId) => {
        setLoading(true);
        try {
            const [contentRes, progressRes] = await Promise.all([
                api.get(`/content/course/${courseId}`),
                api.get(`/progress/${courseId}`)
            ]);
            setContents(contentRes.data.data);
            setCompletedContents(progressRes.data?.data?.completedContent || []);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const handleContentClick = async (contentId) => {
        if (!completedContents.includes(contentId)) {
            setCompletedContents(prev => [...prev, contentId]);
            try {
                await api.post('/progress/update', { courseId: selectedCourse, contentId });
            } catch (err) {
                console.error('Failed to update progress', err);
            }
        }
    };

    const getYouTubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url?.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto pl-8 pb-8 pr-4 animate-[fadeIn_0.5s_ease-out]">
            <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight mb-1">Learning Materials</h1>
                <p className="text-sm text-gray-500 font-medium">Access your course documents, videos, and external resources.</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center shadow-indigo-500/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-6 -mr-6 w-24 h-24 bg-indigo-50/50 rounded-full blur-2xl"></div>
                
                <div className="flex-1 relative z-10">
                    <label className="block text-xs font-bold text-indigo-900 mb-2 uppercase tracking-wider flex items-center">
                        <BookOpen className="w-3 h-3 mr-1.5 text-indigo-500" /> Course Selector
                    </label>
                    <select 
                        className="w-full md:w-2/3 lg:w-1/2 p-3 text-sm font-bold text-gray-800 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none"
                        value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}
                    >
                        <option value="" disabled>-- Choose an enrolled course --</option>
                        {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="py-16 flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-indigo-600 mb-3"></div>
                    <p className="text-sm text-gray-500 font-bold">Fetching materials...</p>
                </div>
            ) : selectedCourse ? (
                <div className="space-y-6">
                    {contents.length === 0 ? (
                        <div className="bg-white py-16 text-center rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100 shadow-inner">
                                <FileText className="w-8 h-8 text-gray-300" />
                            </div>
                            <h3 className="text-base font-bold text-gray-800 mb-1">No materials found</h3>
                            <p className="text-gray-500 font-medium text-sm">Instructors haven't posted any materials for this course yet.</p>
                        </div>
                    ) : (
                        contents.map(item => {
                            const isYouTube = item.contentType?.toLowerCase() === 'youtube' || (item.url && item.url.includes('youtube.com')) || (item.url && item.url.includes('youtu.be'));
                            const yTId = isYouTube ? getYouTubeId(item.url) : null;
                            const isVideo = item.contentType?.toLowerCase() === 'video' && !isYouTube;
                            const isDocument = item.contentType?.toLowerCase() === 'document' || item.contentType?.toLowerCase() === 'pdf';
                            const isCompleted = completedContents.includes(item._id);

                            return (
                                <div key={item._id} className={`bg-white rounded-2xl shadow-sm border ${isCompleted ? 'border-green-500 shadow-green-500/10 ring-1 ring-green-500' : 'border-gray-100'} overflow-hidden transform transition-all duration-300 hover:shadow-md hover:shadow-indigo-500/10 hover:-translate-y-1 z-0 relative`}>
                                    <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-start gap-4">
                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner ${
                                            isCompleted ? 'bg-gradient-to-br from-green-100 to-green-200 text-green-600' :
                                            isDocument ? 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600' : 
                                            (isVideo || isYouTube) ? 'bg-gradient-to-br from-red-100 to-red-200 text-red-600' : 
                                            'bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-600'
                                        }`}>
                                            {isCompleted ? <CheckCircle className="w-6 h-6 drop-shadow-sm"/> :
                                             isDocument ? <FileText className="w-6 h-6 drop-shadow-sm"/> : 
                                             (isVideo || isYouTube) ? <Play className="w-6 h-6 drop-shadow-sm ml-1"/> : 
                                             <LinkIcon className="w-6 h-6 drop-shadow-sm"/>}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <span className={`text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full shadow-sm border border-white/50 ${
                                                    isCompleted ? 'bg-green-50 text-green-700' :
                                                    isDocument ? 'bg-blue-50 text-blue-700' : 
                                                    (isVideo || isYouTube) ? 'bg-red-50 text-red-700' : 
                                                    'bg-emerald-50 text-emerald-700'
                                                }`}>
                                                    {isCompleted ? 'Viewed' : isDocument ? 'Document' : (isYouTube ? 'YouTube Video' : (isVideo ? 'Video' : 'External Link'))}
                                                </span>
                                            </div>
                                            <h3 className="text-base font-bold text-gray-900 leading-tight mb-1 flex items-center">
                                                {item.title}
                                                {isCompleted && <CheckCircle className="w-5 h-5 text-green-500 ml-2 animate-[fadeIn_0.3s_ease-out]" />}
                                            </h3>
                                            {item.description && <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-3xl">{item.description}</p>}
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gray-50/50 p-6 flex flex-col justify-center items-center">
                                        {isYouTube && yTId ? (
                                            <div className="w-full">
                                                <div className="w-full max-w-3xl mx-auto bg-black rounded-xl overflow-hidden shadow-lg border border-gray-800 relative aspect-video mb-4">
                                                    <iframe 
                                                        className="absolute inset-0 w-full h-full"
                                                        src={`https://www.youtube.com/embed/${yTId}`} 
                                                        title={item.title}
                                                        frameBorder="0" 
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                                        allowFullScreen
                                                    ></iframe>
                                                </div>
                                                {!isCompleted && (
                                                    <button onClick={() => handleContentClick(item._id)} className="px-6 py-2 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-lg font-bold text-sm hover:bg-indigo-100 transition-all block mx-auto">
                                                        Mark as Viewed
                                                    </button>
                                                )}
                                            </div>
                                        ) : isVideo ? (
                                            <div className="w-full max-w-3xl flex flex-col items-center">
                                                <div className="w-full bg-black rounded-xl overflow-hidden shadow-lg border border-gray-800 mb-4">
                                                    <video controls className="w-full" onPlay={() => handleContentClick(item._id)}>
                                                        <source src={item.url} type="video/mp4" />
                                                        Your browser does not support HTML video.
                                                    </video>
                                                </div>
                                                {!isCompleted && (
                                                    <button onClick={() => handleContentClick(item._id)} className="px-6 py-2 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-lg font-bold text-sm hover:bg-indigo-100 transition-all">
                                                        Mark as Viewed
                                                    </button>
                                                )}
                                            </div>
                                        ) : isDocument ? (
                                            <a href={item.url} target="_blank" rel="noreferrer" onClick={() => handleContentClick(item._id)} className="flex items-center justify-center w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                                                <Download className="w-4 h-4 mr-2" /> Download / View Document
                                            </a>
                                        ) : (
                                            <a href={item.url} target="_blank" rel="noreferrer" onClick={() => handleContentClick(item._id)} className="flex items-center justify-center w-full md:w-auto px-8 py-3 bg-white border border-emerald-500 text-emerald-600 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                                                <ExternalLink className="w-4 h-4 mr-2" /> Visit External Link
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            ) : (
                <div className="py-16 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 border border-gray-100">
                        <BookOpen className="w-8 h-8 text-indigo-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Select a Course</h3>
                    <p className="text-gray-500 font-medium text-sm">Choose a course from the dropdown above to view its contents.</p>
                </div>
            )}
        </div>
    );
};
export default StudentContentPage;
