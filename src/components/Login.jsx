import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS, apiRequest } from '../config/api';
import { Trophy, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      <div style={{ maxWidth: '400px', width: '100%' }}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-3 mb-6">
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#2563eb',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Trophy style={{ width: '28px', height: '28px', color: 'white' }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">Tournament Manager</h1>
              <p className="text-sm text-secondary">Professional Backgammon Platform</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-primary mb-2">Welcome back</h2>
          <p className="text-secondary">Sign in to your tournament account</p>
        </div>

        {/* Login Form */}
        <div className="card">
          <div className="card-content">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
                  Email address
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none'
                  }}>
                    <Mail style={{ width: '20px', height: '20px', color: '#9ca3af' }} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      paddingLeft: '44px',
                      paddingRight: '12px',
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                    placeholder="Enter your email"
                    onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-primary mb-2">
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none'
                  }}>
                    <Lock style={{ width: '20px', height: '20px', color: '#9ca3af' }} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      paddingLeft: '44px',
                      paddingRight: '44px',
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                    placeholder="Enter your password"
                    onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                  <button
                    type="button"
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff style={{ width: '20px', height: '20px', color: '#9ca3af' }} />
                    ) : (
                      <Eye style={{ width: '20px', height: '20px', color: '#9ca3af' }} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg"
                style={{ width:'100%' }}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            {/* Message */}
            {message && (
              <div className={`mt-4 p-3 rounded-lg text-sm ${
                message.includes('failed') || message.includes('error') 
                  ? 'bg-red-50 text-red-600 border border-red-200' 
                  : 'bg-green-50 text-green-600 border border-green-200'
              }`}>
                {message}
              </div>
            )}

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-secondary mb-3">New to Tournament Manager?</p>
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Create your account →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;