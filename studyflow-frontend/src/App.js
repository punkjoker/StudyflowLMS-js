import React from 'react';
import { BrowserRouter as Router, Route, Routes, } from 'react-router-dom';
import './App.css';
import Header from './Header';
import StudentDashboard from './StudentDashboard';
import InstructorDashboard from './InstructorDashboard';
import Signup from './Signup';
import Login from './Login';
import Home from './Home';
import Courses from './Courses';
import Grades from './Grades';
import Progress from './Progress';
import Assignments from './Assignments';
import Profile from './Profile';
import Feature from './Feature';
import About from './About';
import Contact from './Contact';
import { UserProvider } from './UserContext';
import ManageCourses from './ManageCourses';
import ManageAssignments from './ManageAssignments';
import AssignmentFeedback from './AssignmentFeedback';
import CourseDetails from './CourseDetails';
import CourseProgress from './CourseProgress';
import ViewCourseDetails from './ViewCourseDetails';
import ViewAssignmentDetails from './viewassignmentdetails';
import ChatRoom from './chatroom';
import ChatFeedback from './chatfeedback';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/instructor" element={<InstructorDashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:courseId" element={<CourseDetails />} />
            <Route path="/grades" element={<Grades />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/progress/:courseId" element={<CourseProgress />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/features" element={<Feature />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/manage-courses" element={<ManageCourses />} />
            <Route path="/manage-assignments" element={<ManageAssignments />} />
            <Route path="/assignment-feedback" element={<AssignmentFeedback />} />
            <Route path="/viewcoursedetails/:courseId" element={<ViewCourseDetails />} />
            <Route path="/viewassignmentdetails/:courseId" element={<ViewAssignmentDetails />} />
            <Route path="/chatroom" element={<ChatRoom />} />
            <Route path="/chatfeedback" element={<ChatFeedback />} />
          </Routes>

          {/* Footer Section */}
          <footer>
            <p>&copy; 2024 StudyFlow LMS. All rights reserved.</p>
            <a href="http://localhost/october%202024/Gym-System/admin/mpesa-checkout.php">
  <button className="donate-button">Donate via M-Pesa</button>
</a>

            </footer>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
