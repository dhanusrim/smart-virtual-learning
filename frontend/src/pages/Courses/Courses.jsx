import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import FacultyCoursePage from '../Faculty/CoursePage';
import StudentCoursePage from '../Student/CoursePage';

const Courses = () => {
    const { user } = useContext(AuthContext);
    if (user?.role === 'Student') return <StudentCoursePage />;
    return <FacultyCoursePage />;
};

export default Courses;
