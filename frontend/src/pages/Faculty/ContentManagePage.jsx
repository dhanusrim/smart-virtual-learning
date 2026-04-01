import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { UploadCloud, Youtube, Edit, Trash2, Plus } from 'lucide-react';

const ContentManagePage = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [contents, setContents] = useState([]);
    
    // Upload/Edit Form State
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [activeContentId, setActiveContentId] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [contentType, setContentType] = useState('document');
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [file, setFile] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await api.get('/courses');
                setCourses(res.data.data);
                if(res.data.data.length > 0) setSelectedCourse(res.data.data[0]._id);
            } catch (err) { console.error(err); }
        };
        fetchCourses();
    }, []);

    useEffect(() => {
        if (selectedCourse) fetchContents();
    }, [selectedCourse]);

    const fetchContents = async () => {
        try {
            const res = await api.get(`/content/course/${selectedCourse}`);
            setContents(res.data.data);
        } catch (err) { console.error(err); }
    };

    const handleEditClick = (item) => {
        setTitle(item.title);
        setDescription(item.description);
        // Map backend enums to frontend states
        const typeLower = item.contentType.toLowerCase();
        if(typeLower === 'youtube') {
            setContentType('youtube');
            setYoutubeUrl(item.url);
        } else if(typeLower === 'video') {
            setContentType('video');
        } else {
            setContentType('document');
        }
        setActiveContentId(item._id);
        setEditMode(true);
        setShowForm(true);
        setFile(null); // Reset file selection for editing
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        
        try {
            if (contentType === 'youtube') {
                const payload = {
                    title,
                    description,
                    course: selectedCourse,
                    contentType: 'YouTube',
                    url: youtubeUrl
                };
                if (editMode && activeContentId) {
                    await api.put(`/content/${activeContentId}`, payload);
                } else {
                    await api.post('/content', payload);
                }
            } else {
                // File upload
                if (!editMode && !file) return alert('Please select a file to upload when creating new content.');
                
                const formData = new FormData();
                formData.append('title', title);
                formData.append('description', description);
                formData.append('course', selectedCourse);
                formData.append('contentType', contentType.charAt(0).toUpperCase() + contentType.slice(1));
                if (file) formData.append('file', file); // Optional on Edit

                if (editMode && activeContentId) {
                    await api.put(`/content/${activeContentId}`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                } else {
                    await api.post('/content', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                }
            }
            
            // Reset form
            setTitle(''); setDescription(''); setYoutubeUrl(''); setFile(null);
            setShowForm(false); setEditMode(false); setActiveContentId(null);
            fetchContents();
            alert(editMode ? 'Content updated successfully!' : 'Content uploaded successfully!');
        } catch(err) {
            console.error(err);
            alert(err.response?.data?.message || 'Transaction failed');
        }
    };

    const handleDelete = async (id) => {
        if(!window.confirm('Delete this content material?')) return;
        try {
            await api.delete(`/content/${id}`);
            fetchContents();
        } catch(err) { console.error(err); }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Manage Course Content</h1>
                <button 
                  onClick={() => { setShowForm(!showForm); setEditMode(false); setTitle(''); setDescription(''); setContentType('document'); setFile(null); setYoutubeUrl(''); }} 
                  disabled={!selectedCourse}
                  className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
                >
                    <Plus className="w-5 h-5 mr-1" /> Add Content
                </button>
            </div>

            <div className="mb-6 bg-white p-4 rounded-lg shadow">
                <label className="block text-gray-700 mb-2 font-medium">Select Course</label>
                <select 
                    className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:ring-indigo-500 font-medium"
                    value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}
                >
                    <option value="" disabled>Select a course</option>
                    {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                </select>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow-lg mb-8 border-t-4 border-indigo-500 animate-in slide-in-from-top-4 duration-300">
                    <h2 className="text-xl font-bold mb-4 flex items-center">{editMode ? <><Edit className="w-5 h-5 mr-2 text-indigo-500" /> Edit Existing Material</> : <><Plus className="w-5 h-5 mr-2 text-indigo-500"/> Upload New Material</>}</h2>
                    <form onSubmit={handleSave}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block mb-1 text-gray-700 font-medium">Title</label>
                                <input type="text" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" value={title} onChange={e=>setTitle(e.target.value)} required/>
                            </div>
                            <div>
                                <label className="block mb-1 text-gray-700 font-medium">Content Type</label>
                                <select className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" value={contentType} onChange={e=>setContentType(e.target.value)}>
                                    <option value="document">Document (PDF/DOCX)</option>
                                    <option value="video">Video Upload (MP4)</option>
                                    <option value="youtube">YouTube Link</option>
                                </select>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-gray-700 font-medium">Description</label>
                            <textarea className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" rows="3" value={description} onChange={e=>setDescription(e.target.value)} required></textarea>
                        </div>

                        {contentType === 'youtube' ? (
                            <div className="mb-4 animate-in fade-in">
                                <label className="block mb-1 text-gray-700 flex items-center font-medium"><Youtube className="w-5 h-5 mr-2 text-red-500"/> YouTube URL Structure</label>
                                <input type="url" placeholder="https://www.youtube.com/watch?v=..." className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" value={youtubeUrl} onChange={e=>setYoutubeUrl(e.target.value)} required/>
                            </div>
                        ) : (
                            <div className="mb-6 animate-in fade-in">
                                <label className="block mb-2 text-gray-700 flex items-center font-medium"><UploadCloud className="w-5 h-5 mr-2 text-blue-500"/> {editMode ? 'Replace File (Optional Update)' : 'File Binary Target'}
                                    <span className="text-xs text-gray-400 ml-2 font-normal bg-gray-100 px-2 py-1 rounded-full">({contentType === 'video' ? 'Max 100MB, .mp4 container' : 'Max 100MB, .pdf, .docx, .doc streams'})</span>
                                </label>
                                <input 
                                    type="file" 
                                    accept={contentType === 'video' ? 'video/mp4' : '.pdf,.docx,.doc'} 
                                    className="w-full p-2 border rounded-lg bg-gray-50 focus:outline-none transition block file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" 
                                    onChange={e=>setFile(e.target.files[0])} 
                                    required={!editMode} 
                                />
                            </div>
                        )}
                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <button type="button" onClick={()=>{setShowForm(false); setEditMode(false);}} className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-lg mr-3 hover:bg-gray-50 font-medium transition shadow-sm">Cancel Operation</button>
                            <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition shadow">{editMode ? 'Commit Resource Updates' : 'Execute Upload Sequence'}</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-100 uppercase tracking-wider text-gray-500 text-xs text-left">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Title Information</th>
                            <th className="px-6 py-4 font-semibold">Classification Type</th>
                            <th className="px-6 py-4 font-semibold">Origin Timestamp</th>
                            <th className="px-6 py-4 font-semibold text-right">Administrative Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {contents.map(item => (
                            <tr key={item._id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4">
                                    <p className="font-bold text-gray-800">{item.title}</p>
                                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{item.description}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full shadow-sm 
                                        ${item.contentType === 'YouTube' ? 'bg-red-50 text-red-600 border border-red-200' : 
                                          item.contentType === 'Video' ? 'bg-purple-50 text-purple-600 border border-purple-200' : 'bg-blue-50 text-blue-600 border border-blue-200'}`}>
                                        {item.contentType}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500 text-sm font-medium">{new Date(item.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end space-x-2">
                                        <button onClick={() => handleEditClick(item)} className="p-2 bg-white text-blue-500 rounded-md hover:bg-blue-50 hover:text-blue-700 border border-gray-200 hover:border-blue-200 transition shadow-sm">
                                            <Edit className="w-4 h-4"/>
                                        </button>
                                        <button onClick={() => handleDelete(item._id)} className="p-2 bg-white text-red-500 rounded-md hover:bg-red-50 hover:text-red-700 border border-gray-200 hover:border-red-200 transition shadow-sm">
                                            <Trash2 className="w-4 h-4"/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {contents.length === 0 && <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-500 font-medium bg-gray-50">No content uploaded to this course yet.</td></tr>}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default ContentManagePage;
