import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { API_ENDPOINTS, apiRequest } from '../config/api'
import { Trophy, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'

const Register = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setMessage('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      const response = await apiRequest(API_ENDPOINTS.PLAYER_REGISTER, {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      })

      if (response.success) {
        setMessage('Registration successful! Logging you in...')
        // Auto-login after successful registration
        if (onLogin && response.data && response.data.player) {
          onLogin(response.data.player)
        }
      } else {
        setMessage(`Registration failed: ${response.error || 'Unknown error'}`)
      }
    } catch (error) {
      setMessage(`An error occurred: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div style={{ maxWidth: '450px', width: '100%' }}>
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
          <h2 className="text-3xl font-bold text-primary mb-2">Create your account</h2>
          <p className="text-secondary">Join the tournament community today</p>
        </div>

        {/* Registration Form */}
        <div className="card">
          <div className="card-content">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-primary mb-2">
                  Full name
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none'
                  }}>
                    <User style={{ width: '20px', height: '20px', color: '#9ca3af' }} />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
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
                    placeholder="Enter your full name"
                    onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>
              </div>

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
                    value={formData.email}
                    onChange={handleChange}
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
                    value={formData.password}
                    onChange={handleChange}
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
                    placeholder="Create a password (min. 6 characters)"
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

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-primary mb-2">
                  Confirm password
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
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      paddingLeft: '44px',
                      paddingRight: '44px',
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      border: `1px solid ${formData.confirmPassword && !passwordsMatch ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                    placeholder="Confirm your password"
                    onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                    onBlur={(e) => e.target.style.borderColor = formData.confirmPassword && !passwordsMatch ? '#ef4444' : '#d1d5db'}
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff style={{ width: '20px', height: '20px', color: '#9ca3af' }} />
                    ) : (
                      <Eye style={{ width: '20px', height: '20px', color: '#9ca3af' }} />
                    )}
                  </button>
                </div>
                {formData.confirmPassword && !passwordsMatch && (
                  <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !passwordsMatch || formData.password.length < 6}
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            {/* Message */}
            {message && (
              <div className={`mt-4 p-3 rounded-lg text-sm ${
                message.includes('failed') || message.includes('error') || message.includes('do not match') || message.includes('must be')
                  ? 'bg-red-50 text-red-600 border border-red-200' 
                  : 'bg-green-50 text-green-600 border border-green-200'
              }`}>
                {message}
              </div>
            )}

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-secondary mb-3">Already have an account?</p>
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign in here →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register