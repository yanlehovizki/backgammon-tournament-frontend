import React, { useState } from 'react'

const CreateTournamentModal = ({ isOpen, onClose, onSave }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    description: '',
    format: 'single-elimination',
    maxPlayers: 16,
    entryFee: 0,
    prizePool: 0,
    
    // Schedule
    startDate: '',
    startTime: '',
    registrationDeadline: '',
    estimatedDuration: '2',
    
    // Players & Settings
    isPublic: true,
    requireApproval: false,
    allowSpectators: true,
    location: '',
    rules: '',
    
    // Players
    players: []
  })
  const [newPlayerName, setNewPlayerName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const steps = [
    { id: 1, title: 'Basic Info', icon: '📝' },
    { id: 2, title: 'Schedule', icon: '📅' },
    { id: 3, title: 'Players', icon: '👥' },
    { id: 4, title: 'Review', icon: '✅' }
  ]

  const tournamentFormats = [
    { value: 'single-elimination', label: 'Single Elimination', description: 'One loss and you\'re out' },
    { value: 'double-elimination', label: 'Double Elimination', description: 'Two losses to be eliminated' },
    { value: 'round-robin', label: 'Round Robin', description: 'Everyone plays everyone' },
    { value: 'swiss', label: 'Swiss System', description: 'Paired by performance' }
  ]

  if (!isOpen) return null

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addPlayer = () => {
    if (newPlayerName.trim() && formData.players.length < formData.maxPlayers) {
      setFormData(prev => ({
        ...prev,
        players: [...prev.players, {
          id: Date.now(),
          name: newPlayerName.trim(),
          seed: prev.players.length + 1
        }]
      }))
      setNewPlayerName('')
    }
  }

  const removePlayer = (playerId) => {
    setFormData(prev => ({
      ...prev,
      players: prev.players.filter(p => p.id !== playerId)
    }))
  }

  const shufflePlayers = () => {
    setFormData(prev => ({
      ...prev,
      players: [...prev.players].sort(() => Math.random() - 0.5).map((player, index) => ({
        ...player,
        seed: index + 1
      }))
    }))
  }

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const tournament = {
        ...formData,
        id: Date.now(),
        status: 'upcoming',
        createdAt: new Date().toISOString(),
        participants: formData.players.length,
        bracket: null
      }
      
      onSave(tournament)
      onClose()
      
      // Reset form
      setFormData({
        name: '', description: '', format: 'single-elimination', maxPlayers: 16,
        entryFee: 0, prizePool: 0, startDate: '', startTime: '',
        registrationDeadline: '', estimatedDuration: '2', isPublic: true,
        requireApproval: false, allowSpectators: true, location: '', rules: '', players: []
      })
      setCurrentStep(1)
    } catch (error) {
      console.error('Error creating tournament:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const progressPercentage = (currentStep / steps.length) * 100

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', width: '90vw' }}>
        <div className="form-wizard">
          {/* Beautiful Header */}
          <div className="wizard-header">
            <h2 className="text-2xl font-bold mb-2">Create New Tournament</h2>
            <p className="opacity-90">Set up your tournament in just a few steps</p>
            
            {/* Progress Bar */}
            <div className="wizard-progress">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className={`progress-step ${currentStep >= step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}>
                    {currentStep > step.id ? '✓' : step.id}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`progress-connector ${currentStep > step.id ? 'completed' : ''}`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
            
            <div className="w-full bg-white bg-opacity-30 rounded-full h-2 mt-4">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          <div className="wizard-content">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <span>📝</span>
                  Tournament Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="form-label">Tournament Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter tournament name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-input"
                      rows="3"
                      placeholder="Describe your tournament..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="form-label">Tournament Format *</label>
                    <select
                      className="form-input"
                      value={formData.format}
                      onChange={(e) => handleInputChange('format', e.target.value)}
                    >
                      {tournamentFormats.map(format => (
                        <option key={format.value} value={format.value}>
                          {format.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-gray-500 mt-1">
                      {tournamentFormats.find(f => f.value === formData.format)?.description}
                    </p>
                  </div>
                  
                  <div>
                    <label className="form-label">Maximum Players</label>
                    <select
                      className="form-input"
                      value={formData.maxPlayers}
                      onChange={(e) => handleInputChange('maxPlayers', parseInt(e.target.value))}
                    >
                      {[4, 8, 16, 32, 64, 128].map(num => (
                        <option key={num} value={num}>{num} players</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="form-label">Entry Fee ($)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="0"
                      min="0"
                      step="0.01"
                      value={formData.entryFee}
                      onChange={(e) => handleInputChange('entryFee', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div>
                    <label className="form-label">Prize Pool ($)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="0"
                      min="0"
                      step="0.01"
                      value={formData.prizePool}
                      onChange={(e) => handleInputChange('prizePool', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Schedule */}
            {currentStep === 2 && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <span>📅</span>
                  Schedule & Timing
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Start Date *</label>
                    <input
                      type="date"
                      className="form-input"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="form-label">Start Time *</label>
                    <input
                      type="time"
                      className="form-input"
                      value={formData.startTime}
                      onChange={(e) => handleInputChange('startTime', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="form-label">Registration Deadline</label>
                    <input
                      type="datetime-local"
                      className="form-input"
                      value={formData.registrationDeadline}
                      onChange={(e) => handleInputChange('registrationDeadline', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="form-label">Estimated Duration (hours)</label>
                    <select
                      className="form-input"
                      value={formData.estimatedDuration}
                      onChange={(e) => handleInputChange('estimatedDuration', e.target.value)}
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
                      placeholder="Tournament venue or 'Online'"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Players */}
            {currentStep === 3 && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <span>👥</span>
                  Player Management
                </h3>
                
                <div className="space-y-6">
                  {/* Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="isPublic"
                        className="form-checkbox"
                        checked={formData.isPublic}
                        onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                      />
                      <label htmlFor="isPublic" className="form-label mb-0">Public Tournament</label>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="requireApproval"
                        className="form-checkbox"
                        checked={formData.requireApproval}
                        onChange={(e) => handleInputChange('requireApproval', e.target.checked)}
                      />
                      <label htmlFor="requireApproval" className="form-label mb-0">Require Approval</label>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="allowSpectators"
                        className="form-checkbox"
                        checked={formData.allowSpectators}
                        onChange={(e) => handleInputChange('allowSpectators', e.target.checked)}
                      />
                      <label htmlFor="allowSpectators" className="form-label mb-0">Allow Spectators</label>
                    </div>
                  </div>
                  
                  {/* Add Players */}
                  <div>
                    <label className="form-label">Add Players</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="form-input flex-1"
                        placeholder="Enter player name"
                        value={newPlayerName}
                        onChange={(e) => setNewPlayerName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                      />
                      <button
                        type="button"
                        onClick={addPlayer}
                        className="btn btn-primary"
                        disabled={!newPlayerName.trim() || formData.players.length >= formData.maxPlayers}
                      >
                        Add
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.players.length} / {formData.maxPlayers} players added
                    </p>
                  </div>
                  
                  {/* Player List */}
                  {formData.players.length > 0 && (
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold">Registered Players</h4>
                        <button
                          type="button"
                          onClick={shufflePlayers}
                          className="btn btn-outline btn-sm"
                        >
                          🔀 Shuffle
                        </button>
                      </div>
                      
                      <div className="player-list">
                        {formData.players.map((player) => (
                          <div key={player.id} className="player-item">
                            <div className="player-info">
                              <div className="player-avatar">
                                {player.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </div>
                              <div className="player-details">
                                <div className="player-name">{player.name}</div>
                                <div className="player-rank">Seed #{player.seed}</div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removePlayer(player.id)}
                              className="btn btn-outline btn-sm text-red-600 hover:bg-red-50"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Rules */}
                  <div>
                    <label className="form-label">Tournament Rules</label>
                    <textarea
                      className="form-input"
                      rows="4"
                      placeholder="Enter any specific rules or guidelines..."
                      value={formData.rules}
                      onChange={(e) => handleInputChange('rules', e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <span>✅</span>
                  Review & Create
                </h3>
                
                <div className="space-y-6">
                  <div className="card">
                    <div className="card-header">
                      <h4 className="card-title">Tournament Summary</h4>
                    </div>
                    <div className="card-content">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <strong>Name:</strong> {formData.name}
                        </div>
                        <div>
                          <strong>Format:</strong> {tournamentFormats.find(f => f.value === formData.format)?.label}
                        </div>
                        <div>
                          <strong>Max Players:</strong> {formData.maxPlayers}
                        </div>
                        <div>
                          <strong>Current Players:</strong> {formData.players.length}
                        </div>
                        <div>
                          <strong>Start:</strong> {formData.startDate} at {formData.startTime}
                        </div>
                        <div>
                          <strong>Duration:</strong> {formData.estimatedDuration} hours
                        </div>
                        <div>
                          <strong>Entry Fee:</strong> ${formData.entryFee}
                        </div>
                        <div>
                          <strong>Prize Pool:</strong> ${formData.prizePool}
                        </div>
                      </div>
                      
                      {formData.description && (
                        <div className="mt-4">
                          <strong>Description:</strong>
                          <p className="mt-1 text-gray-600">{formData.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {formData.players.length > 0 && (
                    <div className="card">
                      <div className="card-header">
                        <h4 className="card-title">Registered Players ({formData.players.length})</h4>
                      </div>
                      <div className="card-content">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                          {formData.players.map((player) => (
                            <div key={player.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                              <span className="text-sm font-medium">#{player.seed}</span>
                              <span className="text-sm">{player.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="wizard-navigation">
            <div className="flex gap-2">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn btn-outline"
                >
                  ← Previous
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline"
              >
                Cancel
              </button>
            </div>
            
            <div className="flex gap-2">
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn btn-primary"
                  disabled={currentStep === 1 && !formData.name}
                >
                  Next →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading || !formData.name}
                  className="btn btn-primary"
                >
                  {isLoading ? (
                    <>
                      <div className="spinner"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <span>🎯</span>
                      <span>Create Tournament</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateTournamentModal