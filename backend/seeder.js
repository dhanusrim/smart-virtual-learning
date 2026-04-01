const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Load models
const User = require('./models/User');
const Course = require('./models/Course');
const Content = require('./models/Content');
const Assessment = require('./models/Assessment');
const Submission = require('./models/Submission');
const Progress = require('./models/Progress');
const Report = require('./models/Report');
const Notification = require('./models/Notification');

// Connect to DB
connectDB();

const importData = async () => {
  try {
    console.log('Clearing existing data...');
    await User.deleteMany();
    await Course.deleteMany();
    await Content.deleteMany();
    await Assessment.deleteMany();
    await Submission.deleteMany();
    await Progress.deleteMany();
    await Report.deleteMany();
    await Notification.deleteMany();

    console.log('Creating users...');
    // We use create() instead of insertMany() to naturally trigger the 'pre' save middleware for password hashing
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@smartlearn.com',
      password: 'admin123',
      role: 'Admin'
    });

    const facultyUser = await User.create({
      name: 'Dr. Ramesh Kumar',
      email: 'faculty@smartlearn.com',
      password: 'faculty123',
      role: 'Faculty'
    });

    const student1 = await User.create({
      name: 'Yuva',
      email: 'yuva@smartlearn.com',
      password: 'student123',
      role: 'Student'
    });

    const student2 = await User.create({
      name: 'Priya',
      email: 'priya@smartlearn.com',
      password: 'student123',
      role: 'Student'
    });

    console.log('Creating courses and enrollments...');
    const courses = await Course.insertMany([
      {
        title: 'Web Development Fundamentals',
        description: 'Comprehensive guide to HTML, CSS, and modern JavaScript techniques.',
        category: 'Technology',
        tags: ['html', 'css', 'js'],
        faculty: facultyUser._id,
        students: [student1._id, student2._id]
      },
      {
        title: 'Data Structures & Algorithms',
        description: 'Master Data Structures and Algorithms focusing heavily on efficiency and logic.',
        category: 'Computer Science',
        tags: ['dsa', 'python'],
        faculty: facultyUser._id,
        students: [student1._id, student2._id]
      },
      {
        title: 'Database Management Systems',
        description: 'Theory and practice of robust database structuring using raw SQL and MongoDB.',
        category: 'Computer Science',
        tags: ['sql', 'mongodb'],
        faculty: facultyUser._id,
        students: [student1._id, student2._id]
      }
    ]);

    console.log('Creating learning content...');
    const contents = [];
    for (const course of courses) {
      contents.push({
        title: `${course.title} - Lecture 1 Notes`,
        description: `Introductory reading materials and theory for ${course.title}`,
        contentType: 'Document',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // Example placeholder URL
        course: course._id,
        faculty: facultyUser._id
      });
      contents.push({
        title: `${course.title} - Lecture 2 Notes`,
        description: `Advanced deep dive concepts and practice exercises for ${course.title}`,
        contentType: 'Document',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        course: course._id,
        faculty: facultyUser._id
      });
    }
    const insertedContents = await Content.insertMany(contents);

    console.log('Creating assessments...');
    const assessments = [];
    for (const course of courses) {
      assessments.push({
        title: `${course.title} - Midterm Quiz`,
        description: `Test your knowledge thoroughly on the topics covered so far in ${course.title}.`,
        course: course._id,
        faculty: facultyUser._id,
        type: 'MCQ',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days
        questions: [
          {
            questionText: 'What is the most basic fundamental concept covered in the first module?',
            options: ['Concept A', 'Concept B', 'Concept C', 'Concept D'],
            correctAnswer: 'Concept B'
          },
          {
            questionText: 'Identify the correct definition among the following choices:',
            options: ['Option alpha', 'Option beta', 'Option gamma', 'Option delta'],
            correctAnswer: 'Option alpha'
          },
          {
            questionText: 'Which methodology guarantees optimal performance in this context?',
            options: ['Method 1', 'Method 2', 'Method 3', 'Method 4'],
            correctAnswer: 'Method 3'
          }
        ]
      });
    }
    await Assessment.insertMany(assessments);

    console.log('Creating progress data...');
    // Yuva's progress in Web Dev (courses[0]) = 60%, DSA (courses[1]) = 40%
    await Progress.create([
      {
        student: student1._id,
        course: courses[0]._id, 
        completionPercentage: 60,
        completedContent: [insertedContents[0]._id, insertedContents[1]._id],
        lastAccessed: new Date()
      },
      {
        student: student1._id,
        course: courses[1]._id,
        completionPercentage: 40,
        completedContent: [insertedContents[2]._id],
        lastAccessed: new Date()
      }
    ]);

    console.log('Creating notifications...');
    await Notification.insertMany([
      {
        recipient: student1._id,
        title: 'Assignment Deadline',
        message: 'Your Midterm Quiz for Web Development is due soon. Please complete it within 7 days.',
        read: false
      },
      {
        recipient: student1._id,
        title: 'New Content Alert',
        message: 'New Lecture Notes have been added to Data Structures & Algorithms course!',
        read: false
      },
      {
        recipient: student2._id,
        title: 'Assignment Deadline',
        message: 'Your Midterm Quiz for Database Management Systems is due soon.',
        read: false
      },
      {
        recipient: student2._id,
        title: 'Welcome Message',
        message: 'Welcome to the Smart Virtual Learning Ecosystem!',
        read: false
      }
    ]);

    console.log('Database Seeding Complete! SUCCESS!');
    process.exit();
  } catch (error) {
    console.error(`Error with Database Seeding: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    console.log('Clearing existing data from database...');
    await User.deleteMany();
    await Course.deleteMany();
    await Content.deleteMany();
    await Assessment.deleteMany();
    await Submission.deleteMany();
    await Progress.deleteMany();
    await Report.deleteMany();
    await Notification.deleteMany();
    console.log('Database Cleared! SUCCESS!');
    process.exit();
  } catch (err) {
    console.error(`Error destroying data: ${err.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
