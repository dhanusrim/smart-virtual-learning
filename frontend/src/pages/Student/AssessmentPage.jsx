import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { CheckCircle, XCircle, AlertCircle, FileQuestion, BookOpen, Trophy, Target } from 'lucide-react';

const StudentAssessmentPage = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [assessments, setAssessments] = useState([]);
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // Quiz State
    const [activeQuiz, setActiveQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        api.get('/courses/enrolled').then(res => setCourses(res.data.data));
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            setLoading(true);
            Promise.all([
                api.get(`/assessments/course/${selectedCourse}`),
                api.get(`/progress/${selectedCourse}`)
            ]).then(([assRes, progRes]) => {
                setAssessments(assRes.data.data);
                setProgress(progRes.data.data);
            }).catch(console.error).finally(() => setLoading(false));
            
            // Reset active quiz when changing course
            setActiveQuiz(null); setSubmitted(false); setAnswers({});
        }
    }, [selectedCourse]);

    const isAttempted = (assId) => {
        return progress?.completedAssessments?.includes(assId);
    };

    const handleAttempt = (ass) => {
        setActiveQuiz(ass);
        setAnswers({});
        setSubmitted(false);
    };

    const handleOptionSelect = (qIdx, option) => {
        if(submitted) return;
        setAnswers({ ...answers, [qIdx]: option });
    };

    const handleSubmit = async () => {
        if (Object.keys(answers).length < activeQuiz.questions.length) {
            if(!window.confirm('You have unanswered questions. Submit anyway?')) return;
        }
        
        let calculatedScore = 0;
        activeQuiz.questions.forEach((q, idx) => {
            if (answers[idx] === q.correctAnswer) calculatedScore++;
        });
        setScore(calculatedScore);
        setSubmitted(true);

        try {
            await api.post(`/assessments/${activeQuiz._id}/submit`, { answers: [] });
            await api.put(`/progress/${selectedCourse}`, { assessmentId: activeQuiz._id });
            const pRes = await api.get(`/progress/${selectedCourse}`);
            setProgress(pRes.data.data);
        } catch(err) { console.error('Error saving attempt to backend', err); }
    };

    if (activeQuiz) {
        return (
            <div className="max-w-4xl mx-auto space-y-6 animate-[fadeIn_0.5s_ease-out] pb-12 px-4 sm:px-6">
                <button onClick={() => setActiveQuiz(null)} className="text-gray-500 text-sm font-bold hover:text-indigo-600 transition flex items-center bg-white border border-gray-200 shadow-sm px-4 py-2 rounded-xl hover:shadow hover:-translate-y-0.5">
                    ← Back to Assessments List
                </button>
                
                <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden relative">
                    {/* Header */}
                    <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-900 p-8 sm:p-10 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white opacity-10 rounded-full blur-2xl mix-blend-overlay"></div>
                        <div className="relative z-10">
                            <div className="flex items-center space-x-2 mb-4 bg-white/10 inline-flex px-3 py-1.5 rounded-full backdrop-blur-md border border-white/20 shadow-sm">
                                <BookOpen className="w-3 h-3 text-indigo-100" />
                                <span className="font-bold tracking-widest uppercase text-[9px] text-indigo-50">Course Assessment</span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold mb-2 leading-tight drop-shadow-sm">{activeQuiz.title}</h2>
                            <p className="text-indigo-100 font-medium text-sm leading-relaxed max-w-2xl">{activeQuiz.description}</p>
                        </div>
                    </div>

                    <div className="p-6 sm:p-8">
                        {submitted && (
                            <div className={`p-8 rounded-2xl mb-8 text-center border-2 shadow-sm relative overflow-hidden transform transition-all ${score === activeQuiz.questions.length ? 'bg-gradient-to-b from-green-50 to-white border-green-200 shadow-green-500/10' : 'bg-gradient-to-b from-indigo-50 to-white border-indigo-200 shadow-indigo-500/10'}`}>
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${score === activeQuiz.questions.length ? 'bg-green-100 text-green-500' : 'bg-indigo-100 text-indigo-500'}`}>
                                        <Trophy className="w-5 h-5" />
                                    </div>
                                </div>
                                <h3 className={`text-3xl font-bold mb-2 mt-4 drop-shadow-sm ${score === activeQuiz.questions.length ? 'text-green-600' : 'text-indigo-700'}`}>
                                    🎉 {score}/{activeQuiz.questions.length}
                                </h3>
                                <p className="text-gray-600 font-bold text-sm">
                                    {score === activeQuiz.questions.length ? "Perfect! Incredible job, keep it up!" : "Great effort! Review your answers below."}
                                </p>
                            </div>
                        )}

                        <div className="space-y-6">
                            {activeQuiz.questions.map((q, idx) => {
                                const isCorrect = answers[idx] === q.correctAnswer;

                                return (
                                    <div key={idx} className={`p-6 sm:p-8 rounded-2xl border transition-all duration-300 ${
                                        submitted 
                                        ? (isCorrect ? 'bg-green-50/40 border-green-200 shadow-sm' : 'bg-red-50/40 border-red-200 shadow-sm') 
                                        : 'bg-white border-gray-100 hover:shadow-md hover:border-indigo-100'
                                    }`}>
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 gap-3">
                                            <h4 className="font-bold text-base sm:text-lg text-gray-800 break-words leading-relaxed flex items-start">
                                                <span className="text-indigo-400 font-bold mr-3 text-lg mt-0 drop-shadow-sm">{idx + 1}.</span> 
                                                <span className="mt-0.5">{q.questionText}</span>
                                            </h4>
                                            {submitted && (
                                                <div className="flex-shrink-0 self-start">
                                                    {isCorrect ? (
                                                        <div className="bg-white p-1.5 rounded-full shadow-sm">
                                                            <CheckCircle className="w-6 h-6 text-green-500" />
                                                        </div>
                                                    ) : (
                                                        <div className="bg-white p-1.5 rounded-full shadow-sm">
                                                            <XCircle className="w-6 h-6 text-red-500" />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="space-y-3">
                                            {q.options.map((opt, oIdx) => {
                                                const letter = String.fromCharCode(65 + oIdx);
                                                const isSelected = answers[idx] === opt;
                                                
                                                let optionClass = "flex items-center p-4 rounded-xl border transition-all duration-200 cursor-pointer text-sm font-bold text-gray-700 bg-white hover:border-indigo-300 hover:bg-indigo-50/30";
                                                
                                                if (submitted) {
                                                    optionClass = "flex items-center p-4 rounded-xl border transition-all bg-white opacity-70 cursor-default text-sm font-bold";
                                                    if (opt === q.correctAnswer) {
                                                        optionClass = "flex items-center p-4 rounded-xl border-2 border-green-500 bg-green-50 text-sm font-bold text-green-800 shadow-sm opacity-100 transform scale-[1.01]";
                                                    } else if (isSelected && !isCorrect) {
                                                        optionClass = "flex items-center p-4 rounded-xl border-2 border-red-500 bg-red-50 text-sm font-bold text-red-800 shadow-sm opacity-100";
                                                    }
                                                } else if (isSelected) {
                                                    optionClass = "flex items-center p-4 rounded-xl border-2 border-purple-500 bg-indigo-50/80 text-sm font-bold text-indigo-900 shadow-sm transform scale-[1.01]";
                                                }

                                                return (
                                                    <div key={oIdx} onClick={() => handleOptionSelect(idx, opt)} className={optionClass}>
                                                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3 text-[10px] font-bold transition-colors shadow-sm ${
                                                            submitted && opt === q.correctAnswer ? 'border-green-600 text-green-600 bg-green-100' :
                                                            submitted && isSelected && !isCorrect ? 'border-red-600 text-red-600 bg-red-100' :
                                                            isSelected ? 'border-purple-600 text-purple-600 bg-white' : 'border-gray-200 text-gray-400 bg-gray-50'
                                                        }`}>
                                                            {letter}
                                                        </div>
                                                        <span className="flex-1 leading-relaxed">{opt}</span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        
                                        {submitted && !isCorrect && (
                                            <div className="mt-6 p-4 rounded-xl bg-white border border-red-100 flex items-start shadow-sm relative overflow-hidden">
                                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500"></div>
                                                <AlertCircle className="w-5 h-5 mr-3 text-red-500 flex-shrink-0 mt-0.5" />
                                                <div className="pl-1">
                                                    <p className="text-red-900 font-bold mb-1 uppercase tracking-widest text-[10px]">Correct Answer</p>
                                                    <p className="text-gray-900 font-bold text-sm">{q.correctAnswer}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>

                        {!submitted && (
                            <div className="mt-10 flex justify-end">
                                <button onClick={handleSubmit} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm px-8 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-md shadow-indigo-500/20 transform transition-all hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center">
                                    <Target className="w-4 h-4 mr-2" /> Submit Quiz
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto pl-8 pb-8 pr-4 animate-[fadeIn_0.5s_ease-out]">
            <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight mb-1">Assessments</h1>
                <p className="text-sm text-gray-500 font-medium">Test your knowledge and track your progress.</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center gap-4 relative overflow-hidden z-0">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-purple-100 rounded-full blur-2xl opacity-60 z-[-1]"></div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner z-10">
                    <Target className="w-6 h-6" />
                </div>
                <div className="flex-1 z-10">
                    <label className="block text-[10px] font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Select Course</label>
                    <div className="relative">
                        <select className="w-full md:w-2/3 p-3 text-sm font-bold bg-white border border-purple-200 text-purple-900 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-600 transition-all outline-none shadow-sm cursor-pointer appearance-none" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                            <option value="" disabled>-- Choose an enrolled course --</option>
                            {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 md:right-[34%] right-0 flex items-center px-3 text-purple-600">
                             <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="py-16 flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600 mb-3"></div>
                    <p className="text-gray-500 font-bold text-sm">Loading available assessments...</p>
                </div>
            ) : selectedCourse && assessments.length === 0 ? (
                <div className="py-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center px-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 shadow-inner">
                        <FileQuestion className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-base font-bold text-gray-800 mb-2">No Assessments Found</h3>
                    <p className="text-gray-500 font-medium text-sm max-w-sm">There are currently no assessments assigned for this course.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {assessments.map((ass, idx) => {
                        const attempted = isAttempted(ass._id);
                        const colors = ['bg-indigo-500', 'bg-purple-500', 'bg-blue-500', 'bg-pink-500'];
                        const topColor = colors[idx % colors.length];

                        return (
                            <div key={ass._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-1 relative group">
                                <div className={`h-1.5 w-full ${attempted ? 'bg-green-500' : topColor}`}></div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center space-x-3 max-w-[75%]">
                                            <div className={`p-3 rounded-xl flex-shrink-0 shadow-inner 
                                                ${attempted ? 'bg-green-50 text-green-600' : 'bg-indigo-50 text-indigo-600'}
                                            `}>
                                                <FileQuestion className="w-5 h-5"/>
                                            </div>
                                            <h3 className="text-base font-bold text-gray-800 leading-tight group-hover:text-indigo-900 transition-colors">{ass.title}</h3>
                                        </div>
                                        <span className="bg-gray-100 text-gray-500 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">{ass.type || 'MCQ'}</span>
                                    </div>
                                    <p className="text-gray-500 font-medium text-sm mb-6 flex-1 leading-relaxed line-clamp-2">{ass.description}</p>
                                    
                                    {attempted ? (
                                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2.5 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner relative overflow-hidden">
                                            <CheckCircle className="w-4 h-4 mr-2 text-green-500 relative z-10" /> 
                                            <span className="relative z-10">Completed</span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[shimmer_2.5s_infinite] -translate-x-full"></div>
                                        </div>
                                    ) : (
                                        <button onClick={() => handleAttempt(ass)} className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow hover:shadow-md hover:-translate-y-0.5 w-full">
                                            Attempt Quiz
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
            <style jsx>{`
                @keyframes shimmer {
                    100% {
                        transform: translateX(100%);
                    }
                }
            `}</style>
        </div>
    );
};
export default StudentAssessmentPage;
