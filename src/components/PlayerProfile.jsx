import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Trophy, Award, TrendingUp, Target, Calendar, Users } from 'lucide-react'

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
        fetch(`https://77h9ikcj6vgw.manus.space/api/players/${user.player_id}/tournaments` ),
        fetch(`https://77h9ikcj6vgw.manus.space/api/players/${user.player_id}/matches` )
      ])
      
      const tournamentsData = await tournamentsResponse.json()
      const matchesData = await matchesResponse.json()
      
      setPlayerData(tournamentsData)
      setPlayerMatches(matchesData.matches || [])
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

  // Calculate statistics
  const totalTournaments = (playerData.current_tournaments?.length || 0) + (playerData.past_tournaments?.length || 0)
  const totalWins = playerData.past_tournaments?.reduce((total, t) => total + (t.wins || 0), 0) || 0
  const totalGames = playerData.past_tournaments?.reduce((total, t) => total + (t.wins || 0) + (t.losses || 0), 0) || 0
  const winRate = totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0
  const totalScore = playerData.past_tournaments?.reduce((total, t) => total + (t.total_score || 0), 0) || 0

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex items-center space-x-6 mb-8">
        <div className="w-20 h-20 bg-blue-50 rounded-xl flex items-center justify-center border-2 border-blue-200">
          <span className="text-3xl font-bold text-blue-600">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">{user.name}</h1>
          <p className="text-secondary text-lg">{user.email}</p>
          {user.role && (
            <span className="badge badge-primary mt-2">{user.role.replace('_', ' ').toUpperCase()}</span>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-title">Tournaments Played</div>
            <Trophy className="stat-card-icon" />
          </div>
          <div className="stat-card-value">{totalTournaments}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-title">Total Wins</div>
            <Award className="stat-card-icon" />
          </div>
          <div className="stat-card-value text-green-600">{totalWins}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-title">Win Rate</div>
            <TrendingUp className="stat-card-icon" />
          </div>
          <div className="stat-card-value">{winRate}%</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-title">Total Score</div>
            <Target className="stat-card-icon" />
          </div>
          <div className="stat-card-value">{totalScore}</div>
        </div>
      </div>

      {/* Tabs */}
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
                          <span className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{tournament.matches_played} matches played</span>
                          </span>
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-4">
                          <div className="text-sm">
                            <span className="font-medium text-green-600">{tournament.wins}W</span>
                            <span className="text-secondary"> - </span>
                            <span className="font-medium text-red-600">{tournament.losses}L</span>
                          </div>
                          <div className="text-sm text-secondary">
                            Score: {tournament.total_score}
                          </div>
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
                        <h3>vs {match.opponent_name}</h3>
                        <p className="flex items-center space-x-4">
                          <span>{match.tournament_name}</span>
                          <span className="text-xs text-secondary">
                            {new Date(match.date).toLocaleDateString()}
                          </span>
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-4">
                          {match.status === 'completed' ? (
                            <>
                              <div className="text-sm">
                                <span className="font-medium">
                                  {match.player1_id === user.player_id ? match.score_player1 : match.score_player2}
                                </span>
                                <span className="text-secondary"> - </span>
                                <span className="font-medium">
                                  {match.player1_id === user.player_id ? match.score_player2 : match.score_player1}
                                </span>
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