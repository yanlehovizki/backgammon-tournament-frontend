import { useState, useEffect } from 'react'
import { X, User, Mail, Camera, Upload } from 'lucide-react'
import { API_ENDPOINTS, apiRequest } from '../config/api'

const EditProfileModal = ({ isOpen, onClose, onProfileUpdated, user }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    avatar: null
  })
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Pre-fill form when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        avatar: null
      })
      setAvatarPreview(user.avatar_url || null)
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage('Please select a valid image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('Image size must be less than 5MB')
        return
      }

      setFormData(prev => ({
        ...prev,
        avatar: file
      }))

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target.result)
      }
      reader.readAsDataURL(file)
      setMessage('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('bio', formData.bio)
      
      if (formData.avatar) {
        formDataToSend.append('avatar', formData.avatar)
      }

      const response = await fetch(`${API_ENDPOINTS.PLAYER_PROFILE(user.player_id)}`, {
        method: 'PUT',
        body: formDataToSend
      })

      if (response.ok) {
        const data = await response.json()
        setMessage('Profile updated successfully!')
        setTimeout(() => {
          onProfileUpdated(data.player)
          onClose()
          setMessage('')
        }, 1500)
      } else {
        const errorData = await response.json()
        setMessage(`Failed to update profile: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div className="card" style={{ maxWidth: '500px', width: '100%', maxHeight: '90vh', overflow: 'auto' }}>
        <div className="card-header">
          <div className="flex justify-between items-center">
            <h2 className="card-title text-xl">Edit Profile</h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <X style={{ width: '24px', height: '24px', color: '#6b7280' }} />
            </button>
          </div>
          <p className="card-description">Update your profile information</p>
        </div>

        <div className="card-content">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div className="text-center">
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                margin: '0 auto 16px',
                border: '3px solid #e5e7eb',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f9fafb',
                position: 'relative'
              }}>
                {avatarPreview ? (
                  <img 
                    src={avatarPreview} 
                    alt="Avatar preview" 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <User style={{ width: '48px', height: '48px', color: '#9ca3af' }} />
                )}
                
                {/* Upload overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  backgroundColor: '#2563eb',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: '2px solid white'
                }}>
                  <Camera style={{ width: '16px', height: '16px', color: 'white' }} />
                </div>
              </div>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
                id="avatar-upload"
              />
              
              <label 
                htmlFor="avatar-upload"
                className="btn btn-outline btn-sm"
                style={{ cursor: 'pointer' }}
              >
                <Upload style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                Upload Photo
              </label>
              
              <p className="text-sm text-secondary mt-2">
                JPG, PNG or GIF. Max size 5MB.
              </p>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-primary mb-2">
                <User style={{ width: '16px', height: '16px', display: 'inline', marginRight: '8px' }} />
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
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

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
                <Mail style={{ width: '16px', height: '16px', display: 'inline', marginRight: '8px' }} />
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
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

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-primary mb-2">
                About Me
              </label>
              <textarea
                id="bio"
                name="bio"
                rows="3"
                value={formData.bio}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  resize: 'vertical'
                }}
                placeholder="Tell us about yourself..."
                onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>

          {/* Message */}
          {message && (
            <div className={`mt-4 p-3 rounded-lg text-sm ${
              message.includes('successfully') 
                ? 'bg-green-50 text-green-600 border border-green-200' 
                : 'bg-red-50 text-red-600 border border-red-200'
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EditProfileModal