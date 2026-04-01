import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users as UsersIcon, Trash2, Edit2, Plus, X } from 'lucide-react';

const Users = () => {
    const [users, setUsers] = useState([]);
    
    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    // Form states
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Student'
    });
    const [selectedUserId, setSelectedUserId] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data.data);
        } catch(err) { console.error(err); }
    }

    const openCreateModal = () => {
        setIsEditing(false);
        setFormData({ name: '', email: '', password: '', role: 'Student' });
        setSelectedUserId(null);
        setShowModal(true);
    };

    const openEditModal = (user) => {
        setIsEditing(true);
        setFormData({ name: user.name, email: user.email, password: '', role: user.role });
        setSelectedUserId(user._id);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                // Remove password field if it's empty during edit
                const dataToUpdate = { ...formData };
                if (!dataToUpdate.password) delete dataToUpdate.password;

                await api.put(`/users/${selectedUserId}`, dataToUpdate);
            } else {
                // In a perfect system, user controller would have plain create, but creating via register or users works
                await api.post('/users', formData);
            }
            fetchUsers();
            setShowModal(false);
        } catch (err) {
            alert('Operation failed. Please check inputs.');
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if(!window.confirm("Delete this user?")) return;
        try {
            await api.delete(`/users/${id}`);
            fetchUsers();
        } catch(err) { alert('Failed to delete user'); }
    }

    return (
        <div className="animate-[fadeIn_0.5s_ease-out]">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
                <button 
                    onClick={openCreateModal}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-indigo-700 flex items-center transition"
                >
                    <Plus className="w-5 h-5 mr-2" /> Add User
                </button>
            </div>
            
            <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Joined</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map(u => (
                            <tr key={u._id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 flex items-center font-bold text-gray-800">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700 shadow-inner flex items-center justify-center mr-4">
                                        {u.name.charAt(0).toUpperCase()}
                                    </div>
                                    {u.name}
                                </td>
                                <td className="px-6 py-4 text-gray-600 font-medium">{u.email}</td>
                                <td className="px-6 py-4">
                                     <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-md shadow-sm border
                                        ${u.role === 'Admin' ? 'bg-red-50 text-red-700 border-red-200' : u.role === 'Faculty' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                                        {u.role}
                                      </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500 text-sm font-medium">{new Date(u.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-right space-x-3">
                                    <button onClick={() => openEditModal(u)} className="text-gray-400 hover:text-indigo-600 transition">
                                        <Edit2 className="w-5 h-5 inline"/>
                                    </button>
                                    <button onClick={() => handleDelete(u._id)} className="text-gray-400 hover:text-red-600 transition">
                                        <Trash2 className="w-5 h-5 inline"/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-[slideUp_0.3s_ease-out]">
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex justify-between items-center text-white">
                            <h2 className="text-xl font-bold">{isEditing ? 'Edit User' : 'Add New User'}</h2>
                            <button onClick={() => setShowModal(false)} className="hover:bg-white/20 p-1.5 rounded-full transition">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required/>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                                <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required/>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    {isEditing ? 'Password (leave blank to keep current)' : 'Password'}
                                </label>
                                <input type="password" minLength="6" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                                    value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required={!isEditing}/>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Role</label>
                                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                                    value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                                    <option value="Student">Student</option>
                                    <option value="Faculty">Faculty</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>

                            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition">Cancel</button>
                                <button type="submit" className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition shadow">
                                    {isEditing ? 'Update User' : 'Save User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <style jsx>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    )
}

export default Users;
