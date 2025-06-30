import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate login
    setTimeout(() => {
      setIsLoading(false)
      alert('🎉 Login successful! Welcome to Tournament Pro!')
      navigate('/')
    }, 1500)
  }

  const handleDemoLogin = () => {
    setFormData({
      email: 'demo@tournamentpro.com',
      password: 'demo123'
    })
    setTimeout(() => {
      alert('🎉 Demo login successful! Welcome to Tournament Pro!')
      navigate('/')
    }, 500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="card animate-fade-in">
          <div className="card-header text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h1 className="card-title text-2xl">Welcome Back!</h1>
            <p className="card-description">
              Sign in to your Tournament Pro account
            </p>
          </div>
          
          <div className="card-content">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full"
              >
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>🔐</span>
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6">
              <div className="text-center text-gray-500 mb-4">
                <span>Don't have an account? Try our demo!</span>
              </div>
              <button
                onClick={handleDemoLogin}
                className="btn btn-outline w-full"
              >
                <span>✨</span>
                <span>Demo Login</span>
              </button>
            </div>

            <div className="mt-6 text-center">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                Forgot your password?
              </a>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>© 2025 Tournament Pro. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default Login