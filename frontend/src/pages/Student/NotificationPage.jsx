import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Bell } from 'lucide-react';

const StudentNotificationPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data.data);
        } catch(err) { console.error(err); } finally { setLoading(false); }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (id, isRead) => {
        if(isRead) return;
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
        } catch(err) { console.error(err); }
    }

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="space-y-6 max-w-5xl px-6 pb-10 animate-[fadeIn_0.5s_ease-out]">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 mt-2">
                <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-2.5 rounded-full text-purple-600">
                        <Bell className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
                </div>
                {unreadCount > 0 && (
                    <div className="bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                        {unreadCount} Unread
                    </div>
                )}
            </div>

            {loading ? (
                <div className="text-center py-16 flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mb-3"></div>
                    <p className="text-gray-500 font-bold text-sm">Loading your notifications...</p>
                </div>
            ) : notifications.length === 0 ? (
                <div className="bg-white p-16 text-center rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                    <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                        <Bell className="w-8 h-8 text-purple-400" />
                    </div>
                    <p className="text-gray-500 text-base font-semibold">No notifications yet</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Unread Section */}
                    {notifications.filter(n => !n.read).length > 0 && (
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">Today</h3>
                            <div className="space-y-4">
                                {notifications.filter(n => !n.read).map(note => (
                                    <div 
                                        key={note._id} 
                                        onClick={() => markAsRead(note._id, note.read)}
                                        className="bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-indigo-500 p-5 flex items-start gap-4 cursor-pointer hover:shadow-md transition-all"
                                    >
                                        <div className="bg-purple-100 p-2.5 rounded-full text-purple-600 flex-shrink-0 mt-1">
                                            <Bell className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800 text-base mb-1">{note.title}</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed mb-4">{note.message}</p>
                                            <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                                                <div className="flex items-center text-indigo-700 bg-indigo-50 px-2.5 py-1.5 rounded-md font-semibold font-sans">
                                                    👤 Sent by: {note.sender?.name || 'SmartLearn Team'}
                                                </div>
                                                <span>{new Date(note.createdAt).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Read Section */}
                    {notifications.filter(n => n.read).length > 0 && (
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">Earlier</h3>
                            <div className="space-y-4">
                                {notifications.filter(n => n.read).map(note => (
                                    <div 
                                        key={note._id} 
                                        className="bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-gray-300 p-5 flex items-start gap-4 hover:shadow-md transition-all opacity-80 hover:opacity-100"
                                    >
                                        <div className="bg-gray-100 p-2.5 rounded-full text-gray-500 flex-shrink-0 mt-1">
                                            <Bell className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800 text-base mb-1">{note.title}</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed mb-4">{note.message}</p>
                                            <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                                                <div className="flex items-center text-gray-600 bg-gray-50 px-2.5 py-1.5 rounded-md font-semibold font-sans">
                                                    👤 Sent by: {note.sender?.name || 'SmartLearn Team'}
                                                </div>
                                                <span>{new Date(note.createdAt).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
export default StudentNotificationPage;
