import React, { useState, useEffect } from 'react'

const MatchResultModal = ({ isOpen, onClose, onSave, match }) => {
  const [formData, setFormData] = useState({
    player1Score: '',
    player2Score: '',
    status: 'active',
    notes: '',
    duration: '',
    startTime: '',
    endTime: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (match) {
      setFormData({
        player1Score: match.score1?.toString() || '',
        player2Score: match.score2?.toString() || '',
        status: match.status || 'active',
        notes: match.notes || '',
        duration: match.duration || '',
        startTime: match.startTime || '',
        endTime: match.endTime || ''
      })
    }
  }, [match])

  if (!isOpen || !match) return null

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (formData.status === 'completed') {
      if (!formData.player1Score || formData.player1Score < 0) {
        newErrors.player1Score = 'Please enter a valid score for Player 1'
      }
      if (!formData.player2Score || formData.player2Score < 0) {
        newErrors.player2Score = 'Please enter a valid score for Player 2'
      }
      if (formData.player1Score === formData.player2Score) {
        newErrors.general = 'Scores cannot be tied. Please enter different scores.'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updatedMatch = {
        ...match,
        score1: formData.status === 'completed' ? parseInt(formData.player1Score) : null,
        score2: formData.status === 'completed' ? parseInt(formData.player2Score) : null,
        status: formData.status,
        notes: formData.notes,
        duration: formData.duration,
        startTime: formData.startTime,
        endTime: formData.endTime,
        updatedAt: new Date().toISOString()
      }
      
      onSave(updatedMatch)
      onClose()
    } catch (error) {
      console.error('Error saving match result:', error)
      setErrors({ general: 'Failed to save match result. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const getWinner = () => {
    if (formData.status !== 'completed' || !formData.player1Score || !formData.player2Score) {
      return null
    }
    return parseInt(formData.player1Score) > parseInt(formData.player2Score) ? match.player1 : match.player2
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'text-gray-600 bg-gray-50'
      case 'active': return 'text-blue-600 bg-blue-50'
      case 'completed': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', width: '90vw' }}>
        <div className="card">
          {/* Beautiful Header */}
          <div className="card-header">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="card-title text-2xl">Match Result</h2>
                <p className="card-description">Update match details and scores</p>
              </div>
              <div className={`badge ${getStatusColor(formData.status)}`}>
                {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="card-content space-y-6">
              {/* Error Display */}
              {errors.general && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-800">
                    <span>❌</span>
                    <span>{errors.general}</span>
                  </div>
                </div>
              )}

              {/* Match Info */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span>🏆</span>
                  Match Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="card bg-blue-50">
                    <div className="card-content text-center">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-bold">
                        {match.player1 ? match.player1.split(' ').map(n => n[0]).join('') : '?'}
                      </div>
                      <h4 className="font-semibold text-lg">{match.player1 || 'TBD'}</h4>
                      <p className="text-sm text-gray-600">Player 1</p>
                    </div>
                  </div>
                  
                  <div className="card bg-purple-50">
                    <div className="card-content text-center">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-purple-500 text-white flex items-center justify-center text-xl font-bold">
                        {match.player2 ? match.player2.split(' ').map(n => n[0]).join('') : '?'}
                      </div>
                      <h4 className="font-semibold text-lg">{match.player2 || 'TBD'}</h4>
                      <p className="text-sm text-gray-600">Player 2</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center mt-4">
                  <div className="text-sm text-gray-600">Round {match.round} • Match {match.id}</div>
                </div>
              </div>

              {/* Match Status */}
              <div>
                <label className="form-label">Match Status *</label>
                <select
                  className="form-input"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  required
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Scores */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span>🎯</span>
                  Match Scores
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">
                      {match.player1 || 'Player 1'} Score
                      {formData.status === 'completed' && <span className="text-red-500"> *</span>}
                    </label>
                    <input
                      type="number"
                      className={`form-input ${errors.player1Score ? 'border-red-500' : ''}`}
                      placeholder="0"
                      min="0"
                      value={formData.player1Score}
                      onChange={(e) => handleInputChange('player1Score', e.target.value)}
                      disabled={formData.status !== 'completed'}
                    />
                    {errors.player1Score && (
                      <p className="text-sm text-red-600 mt-1">{errors.player1Score}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="form-label">
                      {match.player2 || 'Player 2'} Score
                      {formData.status === 'completed' && <span className="text-red-500"> *</span>}
                    </label>
                    <input
                      type="number"
                      className={`form-input ${errors.player2Score ? 'border-red-500' : ''}`}
                      placeholder="0"
                      min="0"
                      value={formData.player2Score}
                      onChange={(e) => handleInputChange('player2Score', e.target.value)}
                      disabled={formData.status !== 'completed'}
                    />
                    {errors.player2Score && (
                      <p className="text-sm text-red-600 mt-1">{errors.player2Score}</p>
                    )}
                  </div>
                </div>
                
                {/* Winner Display */}
                {getWinner() && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-center gap-2 text-green-800">
                      <span>🏆</span>
                      <span className="font-semibold">Winner: {getWinner()}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Match Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span>📝</span>
                  Match Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Start Time</label>
                    <input
                      type="datetime-local"
                      className="form-input"
                      value={formData.startTime}
                      onChange={(e) => handleInputChange('startTime', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="form-label">End Time</label>
                    <input
                      type="datetime-local"
                      className="form-input"
                      value={formData.endTime}
                      onChange={(e) => handleInputChange('endTime', e.target.value)}
                      disabled={formData.status !== 'completed'}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="form-label">Duration (minutes)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g., 45"
                      min="1"
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="form-label">Match Notes</label>
                <textarea
                  className="form-input"
                  rows="4"
                  placeholder="Add any notes about the match (optional)..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                ></textarea>
              </div>
            </div>

            {/* Footer */}
            <div className="card-content border-t border-gray-200">
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary"
                >
                  {isLoading ? (
                    <>
                      <div className="spinner"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span>💾</span>
                      <span>Save Result</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default MatchResultModal