import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center py-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to Fullstack App
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          A modern fullstack application built with Node.js, Express, MongoDB, and React
        </p>
        
        <div className="flex justify-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="btn-primary text-lg px-8 py-3">
                Go to Dashboard
              </Link>
              <Link to="/posts" className="btn-secondary text-lg px-8 py-3">
                View Posts
              </Link>
            </>
          ) : (
            <>
              <Link to="/register" className="btn-primary text-lg px-8 py-3">
                Get Started
              </Link>
              <Link to="/login" className="btn-secondary text-lg px-8 py-3">
                Login
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-16">
        <div className="card text-center">
          <div className="text-4xl mb-4">🚀</div>
          <h3 className="text-xl font-semibold mb-2">Fast Development</h3>
          <p className="text-gray-600">
            Built with modern technologies for rapid development and deployment.
          </p>
        </div>
        
        <div className="card text-center">
          <div className="text-4xl mb-4">🔐</div>
          <h3 className="text-xl font-semibold mb-2">Secure Authentication</h3>
          <p className="text-gray-600">
            JWT-based authentication with secure password hashing.
          </p>
        </div>
        
        <div className="card text-center">
          <div className="text-4xl mb-4">📱</div>
          <h3 className="text-xl font-semibold mb-2">Responsive Design</h3>
          <p className="text-gray-600">
            Beautiful, responsive UI that works on all devices.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;