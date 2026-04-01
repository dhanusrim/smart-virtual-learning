import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Video, FileText, Link as LinkIcon, Plus, Trash2 } from 'lucide-react';
import StudentContentPage from '../Student/ContentPage';

const Content = () => {
  const { user } = useContext(AuthContext);
  if (user?.role === 'Student') return <StudentContentPage />;
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [contents, setContents] = useState([]);
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', contentType: 'Video', url: '' });

  useEffect(() => {
    // Fetch courses to populate dropdown
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses');
        setCourses(res.data.data);
        if(res.data.data.length > 0) {
          setSelectedCourse(res.data.data[0]._id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchContents(selectedCourse);
    }
  }, [selectedCourse]);

  const fetchContents = async (courseId) => {
    setLoading(true);
    try {
      const res = await api.get(`/content/course/${courseId}`);
      setContents(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/content', { ...formData, course: selectedCourse });
      setShowModal(false);
      setFormData({ title: '', description: '', contentType: 'Video', url: '' });
      fetchContents(selectedCourse);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to create content');
    }
  };

  const handleDelete = async (id) => {
     if(!window.confirm('Delete content?')) return;
     try {
       await api.delete(`/content/${id}`);
       fetchContents(selectedCourse);
     } catch (err) {
       console.error(err);
     }
  };

  const markProgress = async (contentId) => {
     if(user.role !== 'Student') return;
     try {
        await api.put(`/progress/${selectedCourse}`, { contentId });
        // Optional alert
     } catch(err) {
        console.error(err);
     }
  };

  const getIcon = (type) => {
    if (type === 'Video') return <Video className="w-6 h-6 text-red-500" />;
    if (type === 'Document') return <FileText className="w-6 h-6 text-blue-500" />;
    return <LinkIcon className="w-6 h-6 text-green-500" />;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Learning Content</h1>
        {(user.role === 'Faculty' || user.role === 'Admin') && (
          <button onClick={() => setShowModal(true)} disabled={!selectedCourse} className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
            <Plus className="w-5 h-5 mr-1" /> Add Content
          </button>
        )}
      </div>

      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <label className="block text-gray-700 mb-2 font-medium">Select Course</label>
        <select 
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:ring-indigo-500"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="" disabled>Select a course</option>
          {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contents.length === 0 ? <p className="text-gray-500">No content available for this course.</p> : null}
          {contents.map(item => (
            <div key={item._id} className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4">
              <div className="p-3 bg-gray-50 rounded-full">
                {getIcon(item.contentType)}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
                <p className="text-gray-600 mt-1 mb-3">{item.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <a href={item.url} target="_blank" rel="noreferrer" onClick={() => markProgress(item._id)} className="text-indigo-600 hover:underline font-medium">
                    View {item.contentType}
                  </a>
                  {(user.role === 'Faculty' || user.role === 'Admin') && (
                    <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5"/>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add Course Content</h2>
            <form onSubmit={handleCreate}>
              <div className="mb-4">
                <label className="block mb-1">Title</label>
                <input type="text" className="w-full px-3 py-2 border rounded" value={formData.title} onChange={e=>setFormData({...formData, title:e.target.value})} required/>
              </div>
              <div className="mb-4">
                 <label className="block mb-1">Type</label>
                 <select className="w-full px-3 py-2 border rounded" value={formData.contentType} onChange={e=>setFormData({...formData, contentType:e.target.value})}>
                    <option value="Video">Video</option>
                    <option value="Document">Document</option>
                    <option value="Link">External Link</option>
                 </select>
              </div>
              <div className="mb-4">
                 <label className="block mb-1">URL / Link</label>
                 <input type="url" className="w-full px-3 py-2 border rounded" value={formData.url} onChange={e=>setFormData({...formData, url:e.target.value})} required/>
              </div>
              <div className="mb-4">
                 <label className="block mb-1">Description</label>
                 <textarea className="w-full px-3 py-2 border rounded" rows="3" value={formData.description} onChange={e=>setFormData({...formData, description:e.target.value})}></textarea>
              </div>
              <div className="flex justify-end space-x-2">
                 <button type="button" onClick={()=>setShowModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                 <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Add Content</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Content;
