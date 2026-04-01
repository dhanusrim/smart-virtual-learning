import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AssessmentManagePage = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [assessments, setAssessments] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        api.get('/courses').then(res => {
            setCourses(res.data.data);
            if(res.data.data.length > 0) setSelectedCourse(res.data.data[0]._id);
        });
    }, []);

    useEffect(() => {
        if(selectedCourse) api.get(`/assessments/course/${selectedCourse}`).then(res => setAssessments(res.data.data));
    }, [selectedCourse]);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const mappedQs = questions.map(q => {
                const idx = q.correctAnswer === 'A' ? 0 : q.correctAnswer === 'B' ? 1 : q.correctAnswer === 'C' ? 2 : 3;
                return { questionText: q.questionText, options: q.options, correctAnswer: q.options[idx] }
            });
            await api.post('/assessments', { title, description, course: selectedCourse, type: 'MCQ', questions: mappedQs });
            setShowForm(false); setQuestions([]); setTitle(''); setDescription('');
            api.get(`/assessments/course/${selectedCourse}`).then(res => setAssessments(res.data.data));
        } catch(err) { console.error(err); }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Assessments</h1>
                <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 text-white font-bold px-4 py-2 rounded">+ Create Assessment</button>
            </div>
            
            <select className="p-2 border rounded font-bold mb-6" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                <option value="" disabled>Course selector dropdown</option>
                {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
            </select>

            {showForm && (
                <div className="bg-white p-6 rounded shadow mb-6 border">
                    <form onSubmit={handleCreate}>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <input type="text" placeholder="Title" className="p-2 border rounded" value={title} onChange={e=>setTitle(e.target.value)} required/>
                            <input type="text" placeholder="Description" className="p-2 border rounded" value={description} onChange={e=>setDescription(e.target.value)} required/>
                        </div>
                        <button type="button" onClick={() => setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: 'A' }])} className="bg-gray-800 text-white px-4 py-2 rounded font-bold mb-4">+ Add Question</button>

                        {questions.map((q, idx) => (
                            <div key={idx} className="p-4 border-2 border-dashed rounded mb-4 relative bg-gray-50">
                                <button type="button" onClick={()=>{let newQs=[...questions]; newQs.splice(idx,1); setQuestions(newQs);}} className="absolute top-2 right-2 text-white bg-red-500 px-2 rounded">Remove</button>
                                <input type="text" placeholder="Question text input" className="w-full p-2 border rounded mb-2" value={q.questionText} onChange={e=>{let n=[...questions]; n[idx].questionText=e.target.value; setQuestions(n);}} required/>
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    {[0,1,2,3].map(i => (
                                        <input key={i} type="text" placeholder={`Option ${['A','B','C','D'][i]}`} className="p-2 border rounded" value={q.options[i]} onChange={e=>{let n=[...questions]; n[idx].options[i]=e.target.value; setQuestions(n);}} required/>
                                    ))}
                                </div>
                                <select className="p-2 border rounded font-bold" value={q.correctAnswer} onChange={e=>{let n=[...questions]; n[idx].correctAnswer=e.target.value; setQuestions(n);}}>
                                    <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
                                </select>
                            </div>
                        ))}
                        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded font-bold">Save Assessment</button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-3 gap-6">
                {assessments.map(a => (
                    <div key={a._id} className="p-4 border rounded bg-white shadow">
                        <h3 className="font-bold text-lg">{a.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{a.description}</p>
                        <span className="font-bold text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">{a.questions?.length || 0} Questions</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default AssessmentManagePage;
