import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const CoursePage = () => {
    const [courses, setCourses] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const [activeCourseId, setActiveCourseId] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [showStudentsModal, setShowStudentsModal] = useState(false);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        api.get('/courses').then(res => setCourses(res.data.data));
    }, []);

    const handleEditClick = (c) => { setTitle(c.title); setDescription(c.description); setActiveCourseId(c._id); setShowEdit(true); };
    const handleSaveEdit = async (e) => {
        e.preventDefault();
        await api.put(`/courses/${activeCourseId}`, { title, description });
        setShowEdit(false);
        api.get('/courses').then(res => setCourses(res.data.data));
    };

    const handleDelete = async (id) => {
        if(!window.confirm('Confirm delete?')) return;
        await api.delete(`/courses/${id}`);
        api.get('/courses').then(res => setCourses(res.data.data));
    };

    const handleViewStudents = async (c) => {
        const res = await api.get(`/progress/${c._id}`);
        setStudents(res.data.data);
        setShowStudentsModal(true);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Course Cards</h1>
            <div className="grid grid-cols-3 gap-6">
                {courses.map(course => (
                    <div key={course._id} className="bg-white rounded-xl shadow border overflow-hidden flex flex-col justify-between h-56">
                        <div className="p-6">
                            <h3 className="font-bold text-xl mb-2">{course.title}</h3>
                            <p className="text-gray-500 text-sm line-clamp-2">{course.description}</p>
                        </div>
                        <div className="bg-gray-50 flex border-t divide-x">
                            <button onClick={() => handleEditClick(course)} className="flex-1 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50">✏️ Edit</button>
                            <button onClick={() => handleViewStudents(course)} className="flex-1 py-2 text-sm font-bold text-green-600 hover:bg-green-50">👥 View Students</button>
                            <button onClick={() => handleDelete(course._id)} className="flex-1 py-2 text-sm font-bold text-red-600 hover:bg-red-50">🗑️ Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {showEdit && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-xl shadow w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Edit Modal</h2>
                        <form onSubmit={handleSaveEdit}>
                            <input className="w-full p-2 border mb-4 bg-gray-50 font-bold" value={title} onChange={e=>setTitle(e.target.value)} required />
                            <textarea className="w-full p-2 border mb-4 bg-gray-50 h-32" value={description} onChange={e=>setDescription(e.target.value)} required></textarea>
                            <button type="submit" className="bg-indigo-600 text-white font-bold px-4 py-2 rounded w-full">Save Edit</button>
                            <button type="button" onClick={()=>setShowEdit(false)} className="mt-2 text-gray-500 w-full p-2">Close</button>
                        </form>
                    </div>
                </div>
            )}

            {showStudentsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded shadow w-full max-w-2xl overflow-hidden">
                        <div className="flex justify-between items-center bg-gray-900 text-white p-4">
                            <h2 className="font-bold">👥 View Students</h2>
                            <button onClick={()=>setShowStudentsModal(false)} className="bg-red-500 px-2 py-1 rounded">X</button>
                        </div>
                        <div className="max-h-[60vh] overflow-y-auto">
                            <table className="w-full text-left bg-white">
                                <thead className="bg-gray-100 sticky top-0">
                                    <tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Progress %</th></tr>
                                </thead>
                                <tbody>
                                    {students.map(s => (
                                        <tr key={s._id} className="border-b">
                                            <td className="p-3 font-bold">{s.student?.name}</td>
                                            <td className="p-3">{s.student?.email}</td>
                                            <td className="p-3 font-bold text-indigo-600">{s.completionPercentage}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default CoursePage;
