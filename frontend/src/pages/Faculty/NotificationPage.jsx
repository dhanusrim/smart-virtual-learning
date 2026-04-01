import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Trash2, BellPlus, Bell, ChevronDown, ChevronUp } from 'lucide-react';

const FacultyNotificationPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    
    // Form state
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [targetAudience, setTargetAudience] = useState('All Students');
    const [targetCourse, setTargetCourse] = useState('All Courses');
    const [courseId, setCourseId] = useState('');
    const [studentId, setStudentId] = useState('');

    useEffect(() => {
        fetchData();
    }, []);
    
    const fetchData = async () => {
        try {
            const [notifRes, coursesRes, studentsRes] = await Promise.all([
                api.get('/notifications'),
                api.get('/courses'),
                api.get('/users/students')
            ]);
            setNotifications(notifRes.data.data);
            setCourses(coursesRes.data.data);
            setStudents(studentsRes.data.data);
        } catch (error) { console.error('Error fetching data', error); }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        try {
            if (targetCourse === 'Specific Course' && !courseId) return alert('Select a course');
            if (targetAudience === 'Specific Student' && !studentId) return alert('Select a student');
            
            await api.post('/notifications', { 
                title, 
                message, 
                targetAudience, 
                targetCourse,
                courseId: targetCourse === 'Specific Course' ? courseId : undefined,
                studentId: targetAudience === 'Specific Student' ? studentId : undefined
            });
            
            setTitle(''); setMessage(''); setTargetAudience('All Students'); setTargetCourse('All Courses'); setCourseId(''); setStudentId(''); setShowForm(false);
            const res = await api.get('/notifications');
            setNotifications(res.data.data);
        } catch(err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if(!window.confirm('Delete this notification?')) return;
        try {
            await api.delete(`/notifications/${id}`);
            const res = await api.get('/notifications');
            setNotifications(res.data.data);
        } catch(err) { console.error(err); }
    };

    return (
        <div className="max-w-5xl px-6 pb-12 animate-[fadeIn_0.5s_ease-out]">
            <div className="flex justify-between items-center mb-8 pt-2">
                <div className="flex items-center space-x-3">
                    <div className="bg-indigo-100 p-2.5 rounded-full text-indigo-600">
                        <Bell className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Sent Notifications</h1>
                </div>
                <button 
                    onClick={() => setShowForm(!showForm)} 
                    className="bg-indigo-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all flex items-center"
                >
                    <BellPlus className="w-4 h-4 mr-2" />
                    {showForm ? 'Cancel Creation' : 'Create Notification'}
                    {showForm ? <ChevronUp className="w-4 h-4 ml-2 opacity-70" /> : <ChevronDown className="w-4 h-4 ml-2 opacity-70" />}
                </button>
            </div>
            
            {/* Sliding Form */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showForm ? 'max-h-[1000px] opacity-100 mb-8' : 'max-h-0 opacity-0 mb-0'}`}>
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-indigo-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Compose New Alert</h3>
                    <form onSubmit={handleSend}>
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Notification Title</label>
                            <input type="text" placeholder="e.g., Assignment Deadline Update" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium" value={title} onChange={e=>setTitle(e.target.value)} required/>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Target Audience</label>
                                <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium" value={targetAudience} onChange={e=>{setTargetAudience(e.target.value); if(e.target.value !== 'Specific Student') setStudentId('');}}>
                                    <option value="All Students">All Students</option>
                                    <option value="Specific Student">Specific Student</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Target Course</label>
                                <select 
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium transition-all" 
                                    value={targetCourse} 
                                    onChange={e=>{setTargetCourse(e.target.value); if(e.target.value !== 'Specific Course') setCourseId('');}}
                                >
                                    <option value="All Courses">All Courses</option>
                                    <option value="Specific Course">Specific Course</option>
                                </select>
                            </div>
                        </div>

                        {/* Conditional Dropdowns Row */}
                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${targetAudience === 'Specific Student' || targetCourse === 'Specific Course' ? 'mb-6' : ''}`}>
                            {targetAudience === 'Specific Student' ? (
                                <div className="animate-fade-in-up">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Select Student</label>
                                    <select className="w-full px-4 py-2.5 bg-purple-50 border border-purple-200 text-purple-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-medium" value={studentId} onChange={e=>setStudentId(e.target.value)} required>
                                        <option value="" disabled>-- Select a Student --</option>
                                        {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.email})</option>)}
                                    </select>
                                </div>
                            ) : <div className="hidden md:block"></div>}
                            
                            {targetCourse === 'Specific Course' && (
                                <div className="animate-fade-in-up md:-order-none">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Select Course</label>
                                    <select className="w-full px-4 py-2.5 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium" value={courseId} onChange={e=>setCourseId(e.target.value)} required>
                                        <option value="" disabled>-- Select a Course --</option>
                                        {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                            <textarea placeholder="Enter the detailed message body here..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl h-28 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium resize-none" value={message} onChange={e=>setMessage(e.target.value)} required></textarea>
                        </div>
                        
                        <div className="flex justify-end items-center gap-3">
                            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-bold text-sm transition-colors">Cancel</button>
                            <button type="submit" className="bg-indigo-600 text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-indigo-700 shadow flex items-center transition-colors">
                                Send Notification
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className="bg-white p-16 text-center rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-200">
                            <Bell className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="text-gray-500 text-base font-semibold">No notifications sent yet</p>
                    </div>
                ) : (
                    notifications.map(note => (
                        <div key={note._id} className="bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-indigo-500 p-5 pl-6 hover:shadow-md transition-all flex flex-col">
                            <h4 className="font-bold text-base text-gray-800 mb-1">{note.title}</h4>
                            <p className="text-sm text-gray-600 leading-relaxed max-w-4xl mb-6">{note.message}</p>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-auto gap-4 pt-4 border-t border-gray-50">
                                <div className="flex items-center flex-wrap gap-2 text-sm font-semibold text-gray-700">
                                    <span className="mr-1">👥 Sent to:</span>
                                    
                                    {/* Handle legacy formats alongside new format natively */}
                                    {(!note.targetAudience && note.target === 'All Students') || note.targetAudience === 'All Students' ? (
                                        <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-md text-xs tracking-wide shadow-sm border border-green-200">
                                            🟢 All Students
                                        </span>
                                    ) : (
                                        <span className="bg-purple-100 text-purple-700 px-2.5 py-1 rounded-md text-xs tracking-wide shadow-sm border border-purple-200">
                                            🟣 {note.targetAudienceDetails || note.targetDetails || 'Specific Student'}
                                        </span>
                                    )}

                                    {(!note.targetCourse && !note.course && (note.target === 'All Students' || note.target === 'Student' || note.target === 'Specific Student')) || note.targetCourse === 'All Courses' ? (
                                        <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md text-xs tracking-wide shadow-sm border border-blue-200">
                                            📘 All Courses
                                        </span>
                                    ) : (
                                        <span className="bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-md text-xs tracking-wide shadow-sm border border-indigo-200">
                                            📚 {note.targetCourseDetails || note.targetDetails || 'Specific Course'}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-semibold text-gray-400">📅 {new Date(note.createdAt).toLocaleString()}</span>
                                    <button 
                                        onClick={() => handleDelete(note._id)} 
                                        className="text-red-500 bg-red-50 hover:bg-red-500 hover:text-white p-2 rounded-lg transition-colors flex items-center shadow-sm"
                                        title="Delete Notification"
                                    >
                                        <Trash2 className="w-4 h-4"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <style jsx>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
            `}</style>
        </div>
    )
}
export default FacultyNotificationPage;
