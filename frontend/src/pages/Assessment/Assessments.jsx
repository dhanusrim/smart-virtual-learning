import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import FacultyAssessmentManagePage from '../Faculty/AssessmentManagePage';
import StudentAssessmentPage from '../Student/AssessmentPage';

const Assessments = () => {
    const { user } = useContext(AuthContext);
    if (user?.role === 'Student') return <StudentAssessmentPage />;
    return <FacultyAssessmentManagePage />;
};

export default Assessments;
