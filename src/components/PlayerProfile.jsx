import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Trophy, Award, TrendingUp, Target, Calendar, Users } from 'lucide-react'
import { API_ENDPOINTS, API_BASE_URL, apiRequest } from '../config/api'

const PlayerProfile = ({ user }) => {
  const [playerData, setPlayerData] = useState({ current_tournaments: [], past_tournaments: [] })
  const [playerMatches, setPlayerMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPlayerData()
  }, [user])

  const fetchPlayerData = async () => {
    try {
      const [tournamentsResponse, matchesResponse] = await Promise.all([
        apiRequest(API_ENDPOINTS.PLAYER_TOURNAMENTS(user.player_id)),
        fetch(`${API_BASE_URL}/api/players/${user.player_id}/matches`)
      ])
      
      if (tournamentsResponse.success) {
        setPlayerData(tournamentsResponse.data)
      }
      
      if (matchesResponse.ok) {
        const matchesData = await matchesResponse.json()
        setPlayerMatches(matchesData.matches || [])
      }
    } catch (error) {
      console.error('Error fetching player data:', error)
    } finally {
      setLoading(false)
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

  if (loading) {
    return (
      <div className="container py-8">
        <div className="loading">Loading profile...</div>
      </div>
    )
  }

  const totalWins = playerData.past_tournaments?.reduce((total, t) => total + (t.wins || 0), 0) || 0
  const totalLosses = playerData.past_tournaments?.reduce((total, t) => total + (t.losses || 0), 0) || 0
  const totalScore = playerData.past_tournaments?.reduce((total, t) => total + (t.total_score || 0), 0) || 0

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Player Profile</h1>
        <p className="text-secondary">Your tournament statistics and history</p>
      </div>

      {/* Player Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-title">Total Tournaments</div>
            <Trophy className="stat-card-icon" />
          </div>
          <div className="stat-card-value">
            {(playerData.current_tournaments?.length || 0) + (playerData.past_tournaments?.length || 0)}
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-title">Total Wins</div>
            <Award className="stat-card-icon" />
          </div>
          <div className="stat-card-value">{totalWins}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-title">Win Rate</div>
            <TrendingUp className="stat-card-icon" />
          </div>
          <div className="stat-card-value">
            {totalWins + totalLosses > 0 ? Math.round((totalWins / (totalWins + totalLosses)) * 100) : 0}%
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-title">Total Score</div>
            <Target className="stat-card-icon" />
          </div>
          <div className="stat-card-value">{totalScore}</div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="card">
        <div className="card-content p-0">
          <Tabs defaultValue="current" className="w-full">
            <div className="border-b border-gray-200 px-6 pt-6">
              <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger value="current" className="btn btn-secondary btn-sm">Current Tournaments</TabsTrigger>
                <TabsTrigger value="history" className="btn btn-secondary btn-sm">Tournament History</TabsTrigger>
                <TabsTrigger value="matches" className="btn btn-secondary btn-sm">Match History</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="current" className="p-6">
              {playerData.current_tournaments?.length > 0 ? (
                <div className="space-y-4">
                  {playerData.current_tournaments.map((tournament) => (
                    <div key={tournament.tournament_id} className="tournament-item">
                      <div className="tournament-info">
                        <h3>{tournament.name}</h3>
                        <p className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(tournament.date).toLocaleDateString()}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{tournament.enrollment_count || 0} players</span>
                          </span>
                        </p>
                      </div>
                      <div className="tournament-actions">
                        {getStatusBadge(tournament.status)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  You're not currently enrolled in any tournaments.
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="p-6">
              {playerData.past_tournaments?.length > 0 ? (
                <div className="space-y-4">
                  {playerData.past_tournaments.map((tournament) => (
                    <div key={tournament.tournament_id} className="tournament-item">
                      <div className="tournament-info">
                        <h3>{tournament.name}</h3>
                        <p className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(tournament.date).toLocaleDateString()}</span>
                          </span>
                          <span className="text-green-600">{tournament.wins || 0}W</span>
                          <span className="text-red-600">{tournament.losses || 0}L</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">
                          {tournament.total_score || 0} pts
                        </div>
                        <div className="text-sm text-secondary">
                          {tournament.matches_played || 0} matches
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  No tournament history available.
                </div>
              )}
            </TabsContent>

            <TabsContent value="matches" className="p-6">
              {playerMatches.length > 0 ? (
                <div className="space-y-4">
                  {playerMatches.map((match) => (
                    <div key={match.match_id} className="tournament-item">
                      <div className="tournament-info">
                        <h3>{match.player1_name} vs {match.player2_name}</h3>
                        <p className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(match.scheduled_time).toLocaleDateString()}</span>
                          </span>
                          <span className="text-sm text-secondary">{match.tournament_name}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        {match.status === 'completed' ? (
                          <>
                            <div className="text-sm font-medium">
                              <span className="text-primary">{match.score_player1}</span>
                              <span className="text-secondary"> - </span>
                              <span className="text-primary">{match.score_player2}</span>
                            </div>
                            <span className={`badge ${
                              (match.player1_id === user.player_id && match.score_player1 > match.score_player2) ||
                              (match.player2_id === user.player_id && match.score_player2 > match.score_player1)
                                ? 'badge-success' : 'badge-outline'
                            }`}>
                              {(match.player1_id === user.player_id && match.score_player1 > match.score_player2) ||
                               (match.player2_id === user.player_id && match.score_player2 > match.score_player1)
                                ? 'Won' : 'Lost'}
                            </span>
                          </>
                        ) : (
                          <span className="badge badge-warning">Pending</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  No match history available.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default PlayerProfile