import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import FacultyNotificationPage from '../Faculty/NotificationPage';
import StudentNotificationPage from '../Student/NotificationPage';

const Notifications = () => {
    const { user } = useContext(AuthContext);
    if (user?.role === 'Student') return <StudentNotificationPage />;
    return <FacultyNotificationPage />;
};

export default Notifications;
