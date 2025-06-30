import React, { useState, useEffect } from 'react'

const EditTournamentModal = ({ isOpen, onClose, onSave, tournament }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    format: 'single-elimination',
    maxPlayers: 16,
    entryFee: 0,
    prizePool: 0,
    startDate: '',
    startTime: '',
    registrationDeadline: '',
    estimatedDuration: '2',
    isPublic: true,
    requireApproval: false,
    allowSpectators: true,
    location: '',
    rules: '',
    status: 'upcoming'
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (tournament) {
      setFormData({
        ...tournament,
        startDate: tournament.startDate?.split('T')[0] || '',
        startTime: tournament.startTime || '',
      })
    }
  }, [tournament])

  if (!isOpen || !tournament) return null

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const updatedTournament = {
        ...tournament,
        ...formData,
        updatedAt: new Date().toISOString()
      }
      
      onSave(updatedTournament)
      onClose()
    } catch (error) {
      console.error('Error updating tournament:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const canEdit = (field) => {
    if (tournament.status === 'completed') return false
    if (tournament.status === 'active' && ['format', 'maxPlayers'].includes(field)) return false
    return true
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'text-blue-600 bg-blue-50'
      case 'active': return 'text-green-600 bg-green-50'
      case 'completed': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px', width: '90vw' }}>
        <div className="card">
          {/* Beautiful Header */}
          <div className="card-header">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="card-title text-2xl">Edit Tournament</h2>
                <p className="card-description">Update tournament information and settings</p>
              </div>
              <div className={`badge ${getStatusColor(tournament.status)}`}>
                {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="card-content space-y-6">
              {/* Status Warning */}
              {tournament.status !== 'upcoming' && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <span>⚠️</span>
                    <span className="font-medium">
                      {tournament.status === 'active' 
                        ? 'Tournament is active - some fields cannot be modified'
                        : 'Tournament is completed - editing is limited'
                      }
                    </span>
                  </div>
                </div>
              )}

              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span>📝</span>
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="form-label">Tournament Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={!canEdit('name')}
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-input"
                      rows="3"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      disabled={!canEdit('description')}
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="form-label">Format</label>
                    <select
                      className="form-input"
                      value={formData.format}
                      onChange={(e) => handleInputChange('format', e.target.value)}
                      disabled={!canEdit('format')}
                    >
                      <option value="single-elimination">Single Elimination</option>
                      <option value="double-elimination">Double Elimination</option>
                      <option value="round-robin">Round Robin</option>
                      <option value="swiss">Swiss System</option>
                    </select>
                    {!canEdit('format') && (
                      <p className="text-sm text-gray-500 mt-1">Cannot change format after tournament starts</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="form-label">Maximum Players</label>
                    <select
                      className="form-input"
                      value={formData.maxPlayers}
                      onChange={(e) => handleInputChange('maxPlayers', parseInt(e.target.value))}
                      disabled={!canEdit('maxPlayers')}
                    >
                      {[4, 8, 16, 32, 64, 128].map(num => (
                        <option key={num} value={num}>{num} players</option>
                      ))}
                    </select>
                    {!canEdit('maxPlayers') && (
                      <p className="text-sm text-gray-500 mt-1">Cannot change player limit after tournament starts</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="form-label">Entry Fee ($)</label>
                    <input
                      type="number"
                      className="form-input"
                      min="0"
                      step="0.01"
                      value={formData.entryFee}
                      onChange={(e) => handleInputChange('entryFee', parseFloat(e.target.value) || 0)}
                      disabled={!canEdit('entryFee')}
                    />
                  </div>
                  
                  <div>
                    <label className="form-label">Prize Pool ($)</label>
                    <input
                      type="number"
                      className="form-input"
                      min="0"
                      step="0.01"
                      value={formData.prizePool}
                      onChange={(e) => handleInputChange('prizePool', parseFloat(e.target.value) || 0)}
                      disabled={!canEdit('prizePool')}
                    />
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span>📅</span>
                  Schedule
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      disabled={!canEdit('startDate')}
                    />
                  </div>
                  
                  <div>
                    <label className="form-label">Start Time</label>
                    <input
                      type="time"
                      className="form-input"
                      value={formData.startTime}
                      onChange={(e) => handleInputChange('startTime', e.target.value)}
                      disabled={!canEdit('startTime')}
                    />
                  </div>
                  
                  <div>
                    <label className="form-label">Registration Deadline</label>
                    <input
                      type="datetime-local"
                      className="form-input"
                      value={formData.registrationDeadline}
                      onChange={(e) => handleInputChange('registrationDeadline', e.target.value)}
                      disabled={!canEdit('registrationDeadline')}
                    />
                  </div>
                  
                  <div>
                    <label className="form-label">Estimated Duration (hours)</label>
                    <select
                      className="form-input"
                      value={formData.estimatedDuration}
                      onChange={(e) => handleInputChange('estimatedDuration', e.target.value)}
                      disabled={!canEdit('estimatedDuration')}
                    >
                      <option value="1">1 hour</option>
                      <option value="2">2 hours</option>
                      <option value="3">3 hours</option>
                      <option value="4">4 hours</option>
                      <option value="6">6 hours</option>
                      <option value="8">8 hours</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      disabled={!canEdit('location')}
                    />
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span>⚙️</span>
                  Settings
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="editIsPublic"
                      className="form-checkbox"
                      checked={formData.isPublic}
                      onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                      disabled={!canEdit('isPublic')}
                    />
                    <label htmlFor="editIsPublic" className="form-label mb-0">Public Tournament</label>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="editRequireApproval"
                      className="form-checkbox"
                      checked={formData.requireApproval}
                      onChange={(e) => handleInputChange('requireApproval', e.target.checked)}
                      disabled={!canEdit('requireApproval')}
                    />
                    <label htmlFor="editRequireApproval" className="form-label mb-0">Require Approval</label>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="editAllowSpectators"
                      className="form-checkbox"
                      checked={formData.allowSpectators}
                      onChange={(e) => handleInputChange('allowSpectators', e.target.checked)}
                      disabled={!canEdit('allowSpectators')}
                    />
                    <label htmlFor="editAllowSpectators" className="form-label mb-0">Allow Spectators</label>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="form-label">Tournament Rules</label>
                  <textarea
                    className="form-input"
                    rows="4"
                    value={formData.rules}
                    onChange={(e) => handleInputChange('rules', e.target.value)}
                    disabled={!canEdit('rules')}
                  ></textarea>
                </div>
              </div>

              {/* Tournament Stats */}
              {tournament.participants > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span>📊</span>
                    Tournament Statistics
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="stat-card">
                      <div className="stat-number">{tournament.participants || 0}</div>
                      <div className="stat-label">Participants</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-number">{formData.maxPlayers}</div>
                      <div className="stat-label">Max Players</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-number">${formData.prizePool}</div>
                      <div className="stat-label">Prize Pool</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-number">{formData.estimatedDuration}h</div>
                      <div className="stat-label">Duration</div>
                    </div>
                  </div>
                </div>
              )}
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
                      <span>Save Changes</span>
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

export default EditTournamentModal