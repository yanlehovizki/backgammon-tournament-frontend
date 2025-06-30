import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Trophy, Calendar, Users, Play, UserPlus, UserMinus, Target, RefreshCw } from 'lucide-react'
import { API_ENDPOINTS, API_BASE_URL, apiRequest } from '../config/api'
import BracketVisualization from './BracketVisualization'
import MatchResultModal from './MatchResultModal'
import BracketGenerator from '../utils/bracketGenerator'

const TournamentDetail = ({ user }) => {
  const { id } = useParams()
  const [tournament, setTournament] = useState(null)
  const [bracket, setBracket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [starting, setStarting] = useState(false)
  const [showMatchModal, setShowMatchModal] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState(null)

  useEffect(() => {
    fetchTournamentDetails()
  }, [id])

  const fetchTournamentDetails = async () => {
    try {
      const response = await apiRequest(API_ENDPOINTS.TOURNAMENT_DETAIL(id))
      if (response.success) {
        setTournament(response.data.tournament)
        
        // Load bracket if it exists
        if (response.data.tournament.bracket) {
          setBracket(response.data.tournament.bracket)
        }
      }
    } catch (error) {
      console.error('Error fetching tournament details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEnrollment = async (action) => {
    setEnrolling(true)
    try {
      const endpoint = action === 'enroll' 
        ? API_ENDPOINTS.TOURNAMENT_ENROLL(id)
        : API_ENDPOINTS.TOURNAMENT_UNENROLL(id)
      
      const method = action === 'enroll' ? 'POST' : 'DELETE'
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ player_id: user.player_id }),
      })

      const data = await response.json()

      if (response.ok) {
        fetchTournamentDetails() // Refresh tournament data
      } else {
        alert(data.error || `Failed to ${action}`)
      }
    } catch (error) {
      alert('Network error. Please try again.')
    } finally {
      setEnrolling(false)
    }
  }

  const handleStartTournament = async () => {
    setStarting(true)
    try {
      // Generate bracket from enrolled players
      if (tournament.enrolled_players && tournament.enrolled_players.length >= 2) {
        const players = tournament.enrolled_players.map(player => ({
          id: player.player_id,
          name: player.name
        }))
        
        const generatedBracket = BracketGenerator.generateBracket(players)
        
        // Start tournament with bracket
        const response = await fetch(API_ENDPOINTS.TOURNAMENT_START(id), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bracket: generatedBracket
          }),
        })

        const data = await response.json()

        if (response.ok) {
          fetchTournamentDetails()
        } else {
          alert(data.error || 'Failed to start tournament')
        }
      } else {
        alert('At least 2 players must be enrolled to start the tournament')
      }
    } catch (error) {
      alert('Network error. Please try again.')
    } finally {
      setStarting(false)
    }
  }

  const handleMatchClick = (match) => {
    setSelectedMatch(match)
    setShowMatchModal(true)
  }

  const handleMatchResultSubmitted = async (resultData) => {
    try {
      // Update the bracket with the new result
      const updatedBracket = BracketGenerator.updateMatchResult(
        bracket, 
        resultData.matchId, 
        {
          winnerId: resultData.result.winner_id,
          score: {
            player1: resultData.result.score_player1,
            player2: resultData.result.score_player2
          }
        }
      )
      
      setBracket(updatedBracket)
      
      // Update tournament in backend
      await fetch(API_ENDPOINTS.TOURNAMENT_UPDATE_BRACKET(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bracket: updatedBracket
        }),
      })
      
      setShowMatchModal(false)
      setSelectedMatch(null)
      
      // Refresh tournament data
      fetchTournamentDetails()
    } catch (error) {
      console.error('Error updating match result:', error)
      alert('Failed to update match result')
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      upcoming: { className: 'badge badge-primary', label: 'Upcoming' },
      in_progress: { className: 'badge badge-success', label: 'In Progress' },
      completed: { className: 'badge badge-outline', label: 'Completed' }
    }
    
    const config = statusConfig[status] || statusConfig.upcoming
    return <span className={config.className}>{config.label}</span>
  }

  const isEnrolled = tournament?.enrolled_players?.some(p => p.player_id === user.player_id)
  const canManageTournament = user.role === 'super_user'

  if (loading) {
    return (
      <div className="container">
        <div className="text-center py-8">
          <div className="text-lg">Loading tournament details...</div>
        </div>
      </div>
    )
  }

  if (!tournament) {
    return (
      <div className="container">
        <div className="text-center py-8">
          <div className="text-lg">Tournament not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">{tournament.name}</h1>
          <div className="flex items-center space-x-4 text-secondary">
            <span className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(tournament.date).toLocaleDateString()}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{tournament.enrollment_count} players</span>
            </span>
            {getStatusBadge(tournament.status)}
          </div>
          {tournament.description && (
            <p className="text-secondary mt-2 max-w-2xl">{tournament.description}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {tournament.status === 'upcoming' && (
            <>
              {isEnrolled ? (
                <button 
                  onClick={() => handleEnrollment('unenroll')}
                  disabled={enrolling}
                  className="btn btn-outline"
                >
                  <UserMinus className="h-4 w-4 mr-2" />
                  <span>{enrolling ? 'Leaving...' : 'Leave Tournament'}</span>
                </button>
              ) : (
                <button 
                  onClick={() => handleEnrollment('enroll')}
                  disabled={enrolling}
                  className="btn btn-primary"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  <span>{enrolling ? 'Joining...' : 'Join Tournament'}</span>
                </button>
              )}
              
              {canManageTournament && tournament.enrollment_count >= 2 && (
                <button 
                  onClick={handleStartTournament}
                  disabled={starting}
                  className="btn btn-success"
                >
                  <Play className="h-4 w-4 mr-2" />
                  <span>{starting ? 'Starting...' : 'Start Tournament'}</span>
                </button>
              )}
            </>
          )}
          
          <button 
            onClick={fetchTournamentDetails}
            className="btn btn-outline btn-sm"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="players">Players</TabsTrigger>
          <TabsTrigger value="bracket">Bracket</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tournament Info */}
            <div className="lg:col-span-2">
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Tournament Information</h2>
                </div>
                <div className="card-content">
                  <div className="space-y-4">
                    {tournament.rules && (
                      <div>
                        <h4 className="font-medium text-primary mb-2">Rules & Regulations</h4>
                        <p className="text-secondary">{tournament.rules}</p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-secondary">Tournament Date:</span>
                        <div className="font-medium">{new Date(tournament.date).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <span className="text-secondary">Max Players:</span>
                        <div className="font-medium">{tournament.max_players}</div>
                      </div>
                      <div>
                        <span className="text-secondary">Entry Fee:</span>
                        <div className="font-medium">{tournament.entry_fee ? `$${tournament.entry_fee}` : 'Free'}</div>
                      </div>
                      <div>
                        <span className="text-secondary">Status:</span>
                        <div className="font-medium">{getStatusBadge(tournament.status)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tournament Stats */}
            <div>
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Tournament Stats</h2>
                </div>
                <div className="card-content">
                  <div className="space-y-4">
                    <div className="stat-item">
                      <div className="stat-value">{tournament.enrollment_count}</div>
                      <div className="stat-label">Enrolled Players</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">{tournament.max_players - tournament.enrollment_count}</div>
                      <div className="stat-label">Spots Remaining</div>
                    </div>
                    {bracket && (
                      <>
                        <div className="stat-item">
                          <div className="stat-value">{bracket.totalRounds}</div>
                          <div className="stat-label">Total Rounds</div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-value">
                            {bracket.rounds.reduce((total, round) => total + round.matches.length, 0)}
                          </div>
                          <div className="stat-label">Total Matches</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="players">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Enrolled Players ({tournament.enrollment_count})</h2>
              <p className="card-description">Players participating in this tournament</p>
            </div>
            <div className="card-content">
              {tournament.enrolled_players?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tournament.enrolled_players.map((player) => (
                    <div key={player.player_id} className="player-card">
                      <div className="player-avatar">
                        <span className="player-initial">
                          {player.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="player-info">
                        <div className="player-name">{player.name}</div>
                        <div className="player-meta">
                          Joined {new Date(player.enrolled_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  No players enrolled yet.
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="bracket">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Tournament Bracket</h2>
              <p className="card-description">
                {bracket 
                  ? 'Tournament bracket and match progression' 
                  : 'Bracket will be generated when tournament starts'
                }
              </p>
            </div>
            <div className="card-content">
              <BracketVisualization
                bracket={bracket}
                onMatchClick={handleMatchClick}
                canEditResults={canManageTournament && tournament.status === 'in_progress'}
                highlightPlayer={isEnrolled ? { id: user.player_id, name: user.name } : null}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Match Result Modal */}
      <MatchResultModal
        isOpen={showMatchModal}
        onClose={() => {
          setShowMatchModal(false)
          setSelectedMatch(null)
        }}
        match={selectedMatch}
        onResultSubmitted={handleMatchResultSubmitted}
        tournament={tournament}
      />
    </div>
  )
}

export default TournamentDetail

