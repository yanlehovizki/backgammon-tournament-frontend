import { useState } from 'react'
import { X, Calendar, Users, Trophy, FileText } from 'lucide-react'
import { API_ENDPOINTS, apiRequest } from '../config/api'

const CreateTournamentModal = ({ isOpen, onClose, onTournamentCreated, user }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    max_players: 16,
    entry_fee: 0
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Generate player limit options (10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 64, 128)
  const getPlayerLimitOptions = () => {
    const options = []
    // 10 to 32 in steps of 2
    for (let i = 10; i <= 32; i += 2) {
      options.push(i)
    }
    // Add larger tournament sizes
    options.push(64, 128)
    return options
  }

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await apiRequest(API_ENDPOINTS.TOURNAMENTS, {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          created_by: user.player_id,
          status: 'upcoming'
        })
      })

      if (response.success) {
        setMessage('Tournament created successfully!')
        setTimeout(() => {
          onTournamentCreated()
          onClose()
          // Reset form
          setFormData({
            name: '',
            description: '',
            date: '',
            max_players: 16,
            entry_fee: 0
          })
          setMessage('')
        }, 1500)
      } else {
        setMessage(`Failed to create tournament: ${response.error || 'Unknown error'}`)
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
            <h2 className="card-title text-xl">Create New Tournament</h2>
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
          <p className="card-description">Set up a new backgammon tournament</p>
        </div>

        <div className="card-content">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="Describe your tournament..."
                onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-primary mb-2">
                <Calendar style={{ width: '16px', height: '16px', display: 'inline', marginRight: '8px' }} />
                Tournament Date
              </label>
              <input
                id="date"
                name="date"
                type="datetime-local"
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
                {getPlayerLimitOptions().map(limit => (
                  <option key={limit} value={limit}>
                    {limit} players
                  </option>
                ))}
              </select>
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
                {loading ? 'Creating...' : 'Create Tournament'}
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

export default CreateTournamentModal