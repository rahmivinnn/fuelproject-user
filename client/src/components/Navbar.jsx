import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            Fullstack App
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/posts"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Posts
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/create-post"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Create Post
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Profile
                </Link>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    Welcome, {user?.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="btn-secondary text-sm"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;