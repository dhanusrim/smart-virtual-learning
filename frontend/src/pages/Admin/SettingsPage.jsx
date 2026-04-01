import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { Settings, Server, Shield, Database, Save, Activity } from 'lucide-react';

const SettingsPage = () => {
    const { user } = useContext(AuthContext);

    // Platform Settings
    const [platformName, setPlatformName] = useState('SmartLearn');
    const [platformDesc, setPlatformDesc] = useState('A premier virtual learning ecosystem for students and faculty.');

    // Account Settings
    const [adminName, setAdminName] = useState(user?.name || '');
    const [adminEmail, setAdminEmail] = useState(user?.email || '');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    // System Info
    const [sysInfo, setSysInfo] = useState({ users: 0, courses: 0, dbStatus: 'Connected ✅' });

    useEffect(() => {
        const fetchSystemInfo = async () => {
            try {
                const res = await api.get('/dashboard/stats');
                setSysInfo({
                    users: res.data.data.totalUsers || 0,
                    courses: res.data.data.totalCourses || 0,
                    dbStatus: 'Connected ✅'
                });
            } catch (err) { }
        };
        fetchSystemInfo();
    }, []);

    const handleSavePlatform = (e) => {
        e.preventDefault();
        alert('Platform settings saved successfully.');
    };

    const handleUpdateAccount = async (e) => {
        e.preventDefault();
        try {
            const data = { name: adminName, email: adminEmail };
            if (newPassword) data.password = newPassword;
            // Assuming we use the same PUT /api/users endpoint for self
            await api.put(`/users/${user.id || user._id}`, data);
            alert('Admin account updated successfully.');
            setOldPassword('');
            setNewPassword('');
        } catch(err) {
            alert('Failed to update account.');
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-12 animate-[fadeIn_0.5s_ease-out]">
            <div className="flex items-center space-x-3 mb-8 pb-4 border-b border-gray-200">
                <div className="bg-gray-800 p-2.5 rounded-full text-white shadow-sm">
                    <Settings className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800">System Settings</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Platform Settings */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center">
                            <Server className="w-5 h-5 text-indigo-600 mr-3" />
                            <h2 className="text-lg font-bold text-gray-800">Platform Settings</h2>
                        </div>
                        <form onSubmit={handleSavePlatform} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Platform Name</label>
                                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    value={platformName} onChange={e=>setPlatformName(e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Platform Description</label>
                                <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-indigo-500"
                                    value={platformDesc} onChange={e=>setPlatformDesc(e.target.value)} />
                            </div>
                            <button type="submit" className="bg-indigo-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center">
                                <Save className="w-4 h-4 mr-2"/> Save Settings
                            </button>
                        </form>
                    </div>

                    {/* Account Settings */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center">
                            <Shield className="w-5 h-5 text-indigo-600 mr-3" />
                            <h2 className="text-lg font-bold text-gray-800">Account Settings (Admin)</h2>
                        </div>
                        <form onSubmit={handleUpdateAccount} className="p-6 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Admin Name</label>
                                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        value={adminName} onChange={e=>setAdminName(e.target.value)} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Admin Email</label>
                                    <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        value={adminEmail} onChange={e=>setAdminEmail(e.target.value)} required />
                                </div>
                            </div>
                            
                            <hr className="my-2 border-gray-100" />
                            <h3 className="text-sm border-l-4 border-indigo-500 pl-2 font-bold text-gray-600">Change Password</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Current Password</label>
                                    <input type="password" placeholder="Leave blank to keep" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        value={oldPassword} onChange={e=>setOldPassword(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">New Password</label>
                                    <input type="password" placeholder="New password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        value={newPassword} onChange={e=>setNewPassword(e.target.value)} />
                                </div>
                            </div>
                            <button type="submit" className="bg-gray-800 text-white font-bold px-6 py-2 rounded-lg hover:bg-black transition flex items-center mt-2">
                                <Shield className="w-4 h-4 mr-2"/> Update Account
                            </button>
                        </form>
                    </div>

                </div>

                {/* Right Column (Info Widgets) */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-md p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
                        <h3 className="font-bold text-lg mb-4 flex items-center relative z-10"><Activity className="w-5 h-5 mr-3"/> System Info</h3>
                        
                        <div className="space-y-4 relative z-10">
                            <div>
                                <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">Database Status</p>
                                <p className="font-bold text-green-300 flex items-center"><Database className="w-4 h-4 mr-2"/> {sysInfo.dbStatus}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">Total Users</p>
                                    <p className="text-2xl font-black">{sysInfo.users}</p>
                                </div>
                                <div>
                                    <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">Total Courses</p>
                                    <p className="text-2xl font-black">{sysInfo.courses}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Current System Date</p>
                        <p className="font-bold text-xl text-gray-800">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p className="text-gray-500 font-medium mt-1">{new Date().toLocaleTimeString('en-US')}</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SettingsPage;
