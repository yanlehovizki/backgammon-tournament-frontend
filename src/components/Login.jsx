import React, { useState } from 'react';
import { API_ENDPOINTS, apiRequest } from '../config/api';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await apiRequest(API_ENDPOINTS.PLAYER_LOGIN, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response.success) {
        setMessage('Login successful!');
        console.log('Login.jsx: API response data:', response.data);
        if (onLogin) {
          onLogin(response.data.player);
        }
      } else {
        setMessage(`Login failed: ${response.error || 'Unknown error'}`);
      }
    } catch (error) {
      setMessage(`An error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-header text-center">
          <h2 className="card-title text-2xl">Welcome Back</h2>
          <p className="card-description">Sign in to your tournament account</p>
        </div>
        <div className="card-content">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primary mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary btn-lg w-full"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          {message && (
            <div className={`mt-4 p-3 rounded-lg text-sm ${
              message.includes('failed') || message.includes('error') 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {message}
            </div>
           )}
          
          <div className="mt-6 text-center">
            <p className="text-sm text-secondary">
              Don't have an account?{' '}
              <a href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                Create one here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;