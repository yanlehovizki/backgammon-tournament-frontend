import { useState } from 'react'
import { X, Plus, Trash2, Users, Calendar, FileText, Trophy, Shuffle } from 'lucide-react'

// Import the bracket generator utility
import BracketGenerator from '../utils/bracketGenerator'

const CreateTournamentModal = ({ isOpen, onClose, onTournamentCreated, user }) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    description: '',
    rules: '',
    entry_fee: '',
    max_players: 8
  })
  
  const [players, setPlayers] = useState([
    { id: 1, name: '' },
    { id: 2, name: '' }
  ])
  
  const [currentStep, setCurrentStep] = useState(1) // 1: Basic Info, 2: Players, 3: Review
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [generatedBracket, setGeneratedBracket] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePlayerNameChange = (playerId, name) => {
    setPlayers(prev => prev.map(player => 
      player.id === playerId ? { ...player, name } : player
    ))
  }

  const addPlayer = () => {
    if (players.length < formData.max_players) {
      const newId = Math.max(...players.map(p => p.id)) + 1
      setPlayers(prev => [...prev, { id: newId, name: '' }])
    }
  }

  const removePlayer = (playerId) => {
    if (players.length > 2) {
      setPlayers(prev => prev.filter(player => player.id !== playerId))
    }
  }

  const shufflePlayers = () => {
    setPlayers(prev => [...prev].sort(() => Math.random() - 0.5))
  }

  const generateBracket = () => {
    const validPlayers = players.filter(p => p.name.trim() !== '')
    
    if (validPlayers.length < 2) {
      setMessage('At least 2 players with names are required')
      return
    }

    try {
      const bracket = BracketGenerator.generateBracket(validPlayers)
      setGeneratedBracket(bracket)
      setMessage('')
    } catch (error) {
      setMessage(`Error generating bracket: ${error.message}`)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const validPlayers = players.filter(p => p.name.trim() !== '')
    
    if (validPlayers.length < 2) {
      setMessage('At least 2 players with names are required')
      setLoading(false)
      return
    }

    try {
      // Generate the bracket
      const bracket = BracketGenerator.generateBracket(validPlayers)
      
      // Prepare tournament data
      const tournamentData = {
        ...formData,
        players: validPlayers,
        bracket: bracket,
        created_by: user.player_id,
        status: 'upcoming'
      }

      // Create tournament via API
      const response = await fetch('https://77h9ikcj6vgw.manus.space/api/tournaments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tournamentData),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Tournament created successfully!')
        setTimeout(() => {
          onTournamentCreated(data.tournament)
          onClose()
          resetForm()
        }, 1500)
      } else {
        setMessage(`Failed to create tournament: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      date: '',
      description: '',
      rules: '',
      entry_fee: '',
      max_players: 8
    })
    setPlayers([
      { id: 1, name: '' },
      { id: 2, name: '' }
    ])
    setCurrentStep(1)
    setMessage('')
    setGeneratedBracket(null)
  }

  const nextStep = () => {
    if (currentStep === 1) {
      // Validate basic info
      if (!formData.name || !formData.date) {
        setMessage('Please fill in tournament name and date')
        return
      }
    } else if (currentStep === 2) {
      // Generate bracket preview
      generateBracket()
    }
    
    setCurrentStep(prev => Math.min(prev + 1, 3))
    setMessage('')
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
    setMessage('')
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
      <div className="card" style={{ 
        maxWidth: '800px', 
        width: '100%', 
        maxHeight: '90vh', 
        overflow: 'auto' 
      }}>
        <div className="card-header">
          <div className="flex justify-between items-center">
            <h2 className="card-title text-xl">Create Tournament</h2>
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
          
          {/* Step indicator */}
          <div className="flex items-center space-x-4 mt-4">
            <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-primary' : 'text-secondary'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="text-sm font-medium">Basic Info</span>
            </div>
            <div className="flex-1 h-px bg-gray-200"></div>
            <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-primary' : 'text-secondary'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="text-sm font-medium">Players</span>
            </div>
            <div className="flex-1 h-px bg-gray-200"></div>
            <div className={`flex items-center space-x-2 ${currentStep >= 3 ? 'text-primary' : 'text-secondary'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="text-sm font-medium">Review</span>
            </div>
          </div>
        </div>

        <div className="card-content">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Tournament Information</h3>
                
                {/* Tournament Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-primary mb-2">
                    <Trophy style={{ width: '16px', height: '16px', display: 'inline', marginRight: '8px' }} />
                    Tournament Name
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
                    placeholder="Enter tournament name"
                    onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>

                {/* Tournament Date */}
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-primary mb-2">
                    <Calendar style={{ width: '16px', height: '16px', display: 'inline', marginRight: '8px' }} />
                    Tournament Date
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-primary mb-2">
                    <FileText style={{ width: '16px', height: '16px', display: 'inline', marginRight: '8px' }} />
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="3"
                    value={formData.description}
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
                    placeholder="Brief description of the tournament"
                    onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>

                {/* Rules */}
                <div>
                  <label htmlFor="rules" className="block text-sm font-medium text-primary mb-2">
                    Rules & Regulations
                  </label>
                  <textarea
                    id="rules"
                    name="rules"
                    rows="4"
                    value={formData.rules}
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
                    placeholder="Tournament rules and regulations"
                    onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>

                {/* Entry Fee */}
                <div>
                  <label htmlFor="entry_fee" className="block text-sm font-medium text-primary mb-2">
                    Entry Fee (optional)
                  </label>
                  <input
                    id="entry_fee"
                    name="entry_fee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.entry_fee}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                    placeholder="0.00"
                    onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>

                {/* Max Players */}
                <div>
                  <label htmlFor="max_players" className="block text-sm font-medium text-primary mb-2">
                    <Users style={{ width: '16px', height: '16px', display: 'inline', marginRight: '8px' }} />
                    Maximum Players
                  </label>
                  <select
                    id="max_players"
                    name="max_players"
                    value={formData.max_players}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none',
                      backgroundColor: 'white'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  >
                    {[4, 8, 16, 32, 64, 128].map(limit => (
                      <option key={limit} value={limit}>
                        {limit} players
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Players */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Tournament Players</h3>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={shufflePlayers}
                      className="btn btn-outline btn-sm"
                    >
                      <Shuffle style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                      Shuffle
                    </button>
                    <button
                      type="button"
                      onClick={addPlayer}
                      disabled={players.length >= formData.max_players}
                      className="btn btn-primary btn-sm"
                    >
                      <Plus style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                      Add Player
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {players.map((player, index) => (
                    <div key={player.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">{index + 1}</span>
                      </div>
                      <input
                        type="text"
                        value={player.name}
                        onChange={(e) => handlePlayerNameChange(player.id, e.target.value)}
                        placeholder={`Player ${index + 1} name`}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                      />
                      {players.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removePlayer(player.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            color: '#ef4444'
                          }}
                        >
                          <Trash2 style={{ width: '16px', height: '16px' }} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="text-sm text-secondary">
                  <p>• Add player names to generate the tournament bracket</p>
                  <p>• Minimum 2 players required, maximum {formData.max_players} players</p>
                  <p>• Empty player slots will be ignored</p>
                  <p>• Players will be randomly seeded in the bracket</p>
                </div>
              </div>
            )}

            {/* Step 3: Review & Bracket Preview */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Review & Bracket Preview</h3>
                
                {/* Tournament Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Tournament Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-secondary">Name:</span>
                      <span className="ml-2 font-medium">{formData.name}</span>
                    </div>
                    <div>
                      <span className="text-secondary">Date:</span>
                      <span className="ml-2 font-medium">{new Date(formData.date).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-secondary">Players:</span>
                      <span className="ml-2 font-medium">{players.filter(p => p.name.trim()).length}</span>
                    </div>
                    <div>
                      <span className="text-secondary">Entry Fee:</span>
                      <span className="ml-2 font-medium">{formData.entry_fee ? `$${formData.entry_fee}` : 'Free'}</span>
                    </div>
                  </div>
                </div>

                {/* Bracket Preview */}
                {generatedBracket && (
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">Bracket Preview</h4>
                    <div className="space-y-4">
                      {generatedBracket.rounds.map((round, roundIndex) => (
                        <div key={roundIndex}>
                          <h5 className="text-sm font-medium text-secondary mb-2">
                            {round.roundName} ({round.matches.length} matches)
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {round.matches.map((match, matchIndex) => (
                              <div key={matchIndex} className="text-sm p-2 bg-gray-50 rounded">
                                <div className="flex justify-between">
                                  <span>{match.player1?.name || 'TBD'}</span>
                                  <span className="text-secondary">vs</span>
                                  <span>{match.player2?.name || 'TBD'}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="btn btn-outline"
                  >
                    Previous
                  </button>
                )}
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn btn-primary"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                  >
                    {loading ? 'Creating Tournament...' : 'Create Tournament'}
                  </button>
                )}
              </div>
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

export default CreateTournamentModal

