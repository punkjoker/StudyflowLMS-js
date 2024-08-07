import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';

const Header = () => {
  const { userRole, setUserRole } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUserRole(null);
    navigate('/login'); // Navigate to login page after logout
  };

  return (
    <div>
      <header>
        <h1>StudyFlow LMS</h1>
      </header>
      <nav>
        {!userRole && <Link to="/">Home</Link>}
        {!userRole && <Link to="/signup">Sign Up</Link>}
        {!userRole && <Link to="/login">Login</Link>}
        {!userRole && <Link to="/features">Features</Link>}
        {!userRole && <Link to="/about">About</Link>}
        {!userRole && <Link to="/contact">Contact</Link>}
        {userRole && (
          <>
            {userRole === 'student' && <Link to="/student">Dashboard</Link>}
            {userRole === 'instructor' && <Link to="/instructor">Dashboard</Link>}
            <Link to="/profile">Profile</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </nav>
    </div>
  );
};

export default Header;
