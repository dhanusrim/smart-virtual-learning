import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const FacultyReportPage = () => {
    const [reports, setReports] = useState([]);
    const [courses, setCourses] = useState([]);
    const [title, setTitle] = useState('');
    const [courseId, setCourseId] = useState('');

    useEffect(() => {
        api.get('/reports').then(res => setReports(res.data.data));
        api.get('/courses').then(res => {
            setCourses(res.data.data);
            if(res.data.data.length > 0) setCourseId(res.data.data[0]._id);
        });
    }, []);

    const handleGenerate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/reports', { title, type: 'Course', courseId });
            setTitle('');
            api.get('/reports').then(res => setReports(res.data.data));
        } catch(err) { console.error(err); }
    };

    const handleExportCSV = (report) => {
        if (!report.data || report.data.length === 0) {
            return alert('No student progress data found for this course');
        }
        
        const headerMap = {
            studentName: 'Student Name',
            email: 'Email',
            course: 'Course',
            completedContent: 'Completed Content',
            completedAssessments: 'Completed Assessments',
            progressPercent: 'Progress %',
            lastAccessed: 'Last Accessed'
        };
        
        const rawKeys = Object.keys(report.data[0]);
        const headers = rawKeys.map(k => headerMap[k] || k);
        let csvRows = [headers.join(',')];
        
        for (const row of report.data) {
            csvRows.push(rawKeys.map(key => {
                let val = row[key];
                // format date if it's the last accessed block
                if (key === 'lastAccessed' && val) val = new Date(val).toLocaleString();
                // append % if progress block
                if (key === 'progressPercent' && val) val = val + '%';
                return `"${('' + val).replace(/"/g, '""')}"`;
            }).join(','));
        }
        
        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(new Blob([csvRows.join('\n')], { type: 'text/csv' }));
        a.download = `${report.title}.csv`;
        a.click();
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Reports</h1>
            <div className="bg-white p-6 rounded shadow mb-6 border">
                <form onSubmit={handleGenerate} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block font-bold mb-1">Title</label>
                        <input type="text" className="w-full p-2 border rounded" value={title} onChange={e=>setTitle(e.target.value)} required/>
                    </div>
                    <div className="flex-1">
                        <label className="block font-bold mb-1">Course Selector</label>
                        <select className="w-full p-2 border rounded" value={courseId} onChange={e=>setCourseId(e.target.value)} required>
                            {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                        </select>
                    </div>
                    <button type="submit" className="px-6 py-2 bg-indigo-600 text-white font-bold rounded">Generate</button>
                </form>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {reports.map(r => (
                    <div key={r._id} className="bg-white p-6 rounded shadow border">
                        <h3 className="font-bold text-xl mb-4">{r.title}</h3>
                        <button onClick={() => handleExportCSV(r)} className="w-full bg-green-500 text-white font-bold py-2 rounded">Export CSV</button>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default FacultyReportPage;
