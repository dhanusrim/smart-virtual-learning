import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const FacultyProgressPage = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [progressData, setProgressData] = useState([]);

    useEffect(() => {
        api.get('/courses').then(res => {
            setCourses(res.data.data);
            if(res.data.data.length > 0) setSelectedCourse(res.data.data[0]._id);
        }).catch(console.error);
    }, []);

    useEffect(() => {
        if(!selectedCourse) return;
        api.get(`/progress/${selectedCourse}`).then(res => setProgressData(res.data.data)).catch(console.error);
    }, [selectedCourse]);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Student Progress</h1>
            <select className="p-2 border rounded font-bold mb-6" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                <option value="" disabled>Select Course</option>
                {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
            </select>
            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="p-3">Student Name</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Progress %</th>
                            <th className="p-3">Completed Content</th>
                            <th className="p-3">Completed Assessments</th>
                            <th className="p-3">Last Accessed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {progressData.map(prog => (
                            <tr key={prog._id} className="border-b">
                                <td className="p-3 font-bold">{prog.student?.name}</td>
                                <td className="p-3">{prog.student?.email}</td>
                                <td className="p-3">
                                    <div className="flex flex-col">
                                        <span className="font-bold">{prog.completionPercentage}%</span>
                                        <div className="w-full h-2 bg-gray-200 rounded-full">
                                            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${Math.min(prog.completionPercentage, 100)}%` }}></div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-3 font-bold text-center">{prog.completedContent?.length || 0}</td>
                                <td className="p-3 font-bold text-center">{prog.completedAssessments?.length || 0}</td>
                                <td className="p-3 text-sm">{new Date(prog.lastAccessed).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default FacultyProgressPage;
