import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import FacultyProgressPage from '../Faculty/ProgressPage';
import StudentProgressPage from '../Student/ProgressPage';

const Progress = () => {
    const { user } = useContext(AuthContext);
    if (user?.role === 'Student') return <StudentProgressPage />;
    return <FacultyProgressPage />;
};

export default Progress;
