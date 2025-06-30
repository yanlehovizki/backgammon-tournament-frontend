import { useState, useEffect } from 'react'
import { X, Trophy, Target, User } from 'lucide-react'

const MatchResultModal = ({ 
  isOpen, 
  onClose, 
  match, 
  onResultSubmitted,
  tournament 
}) => {
  const [result, setResult] = useState({
    score_player1: '',
    score_player2: '',
    winner_id: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (match) {
      setResult({
        score_player1: '',
        score_player2: '',
        winner_id: ''
      })
      setMessage('')
    }
  }, [match])

  const handleScoreChange = (player, score) => {
    const newResult = {
      ...result,
      [`score_${player}`]: score
    }
    
    // Auto-determine winner based on scores
    if (newResult.score_player1 && newResult.score_player2) {
      const score1 = parseInt(newResult.score_player1)
      const score2 = parseInt(newResult.score_player2)
      
      if (score1 > score2) {
        newResult.winner_id = match.player1.id
      } else if (score2 > score1) {
        newResult.winner_id = match.player2.id
      } else {
        newResult.winner_id = '' // Tie - user must select winner
      }
    }
    
    setResult(newResult)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    // Validation
    if (!result.score_player1 || !result.score_player2) {
      setMessage('Please enter scores for both players')
      setLoading(false)
      return
    }

    if (!result.winner_id) {
      setMessage('Please select the winner')
      setLoading(false)
      return
    }

    try {
      // Submit match result to API
      const response = await fetch(`https://77h9ikcj6vgw.manus.space/api/matches/${match.matchId}/result`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          score_player1: parseInt(result.score_player1),
          score_player2: parseInt(result.score_player2),
          winner_id: result.winner_id
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Match result saved successfully!')
        setTimeout(() => {
          onResultSubmitted({
            matchId: match.matchId,
            result: {
              score_player1: parseInt(result.score_player1),
              score_player2: parseInt(result.score_player2),
              winner_id: result.winner_id
            }
          })
          onClose()
        }, 1000)
      } else {
        setMessage(`Failed to save result: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !match) return null

  const getPlayerDisplayName = (player) => {
    if (!player) return 'Unknown Player'
    if (player.isBye) return 'BYE'
    return player.name
  }

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
      <div className="card" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="card-header">
          <div className="flex justify-between items-center">
            <h2 className="card-title text-xl">Enter Match Result</h2>
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
          <p className="card-description">
            Round {match.roundNumber} - Match {match.matchNumber}
          </p>
        </div>

        <div className="card-content">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Match Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-center space-x-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="font-medium text-primary">{getPlayerDisplayName(match.player1)}</div>
                </div>
                <div className="text-2xl font-bold text-secondary">VS</div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="font-medium text-primary">{getPlayerDisplayName(match.player2)}</div>
                </div>
              </div>
            </div>

            {/* Score Input */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  {getPlayerDisplayName(match.player1)} Score
                </label>
                <input
                  type="number"
                  min="0"
                  value={result.score_player1}
                  onChange={(e) => handleScoreChange('player1', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    textAlign: 'center'
                  }}
                  placeholder="0"
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  {getPlayerDisplayName(match.player2)} Score
                </label>
                <input
                  type="number"
                  min="0"
                  value={result.score_player2}
                  onChange={(e) => handleScoreChange('player2', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    textAlign: 'center'
                  }}
                  placeholder="0"
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  required
                />
              </div>
            </div>

            {/* Winner Selection */}
            <div>
              <label className="block text-sm font-medium text-primary mb-3">
                <Trophy style={{ width: '16px', height: '16px', display: 'inline', marginRight: '8px' }} />
                Match Winner
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setResult({ ...result, winner_id: match.player1.id })}
                  className={`
                    p-3 border rounded-lg text-center transition-all
                    ${result.winner_id === match.player1.id 
                      ? 'border-green-500 bg-green-50 text-green-700' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="font-medium">{getPlayerDisplayName(match.player1)}</div>
                  {result.winner_id === match.player1.id && (
                    <Trophy className="h-4 w-4 text-green-600 mx-auto mt-1" />
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => setResult({ ...result, winner_id: match.player2.id })}
                  className={`
                    p-3 border rounded-lg text-center transition-all
                    ${result.winner_id === match.player2.id 
                      ? 'border-green-500 bg-green-50 text-green-700' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="font-medium">{getPlayerDisplayName(match.player2)}</div>
                  {result.winner_id === match.player2.id && (
                    <Trophy className="h-4 w-4 text-green-600 mx-auto mt-1" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Buttons */}
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
                {loading ? 'Saving...' : 'Save Result'}
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

export default MatchResultModal

