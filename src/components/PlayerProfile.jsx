import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Trophy, Award, TrendingUp, Target, Calendar, Users, Edit, User } from 'lucide-react'
import { API_ENDPOINTS, API_BASE_URL, apiRequest } from '../config/api'
import EditProfileModal from './EditProfileModal'

const PlayerProfile = ({ user, onUserUpdate }) => {
  const [playerData, setPlayerData] = useState({ current_tournaments: [], past_tournaments: [] })
  const [playerMatches, setPlayerMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentUser, setCurrentUser] = useState(user)

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

  const handleProfileUpdated = (updatedUser) => {
    setCurrentUser(updatedUser)
    setShowEditModal(false)
    if (onUserUpdate) {
      onUserUpdate(updatedUser)
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

  const calculateStats = () => {
    const totalMatches = playerMatches.length
    const wonMatches = playerMatches.filter(match => 
      (match.player1_id === user.player_id && match.score_player1 > match.score_player2) ||
      (match.player2_id === user.player_id && match.score_player2 > match.score_player1)
    ).length
    const winRate = totalMatches > 0 ? Math.round((wonMatches / totalMatches) * 100) : 0
    
    return {
      totalMatches,
      wonMatches,
      lostMatches: totalMatches - wonMatches,
      winRate
    }
  }

  const stats = calculateStats()

  if (loading) {
    return (
      <div className="container">
        <div className="text-center py-8">
          <div className="text-lg">Loading profile...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      {/* Profile Header */}
      <div className="card mb-8">
        <div className="card-content">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              border: '3px solid #e5e7eb',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f9fafb',
              flexShrink: 0
            }}>
              {currentUser.avatar_url ? (
                <img 
                  src={currentUser.avatar_url} 
                  alt={`${currentUser.name}'s avatar`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <User style={{ width: '48px', height: '48px', color: '#9ca3af' }} />
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-primary">{currentUser.name}</h1>
                  <p className="text-secondary mt-1">{currentUser.email}</p>
                  {currentUser.bio && (
                    <p className="text-secondary mt-2 max-w-md">{currentUser.bio}</p>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    <span className="badge badge-outline">
                      {currentUser.role === 'super_user' ? 'Tournament Administrator' : 'Player'}
                    </span>
                    <span className="text-sm text-secondary">
                      Member since {new Date(currentUser.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <button 
                  className="btn btn-primary"
                  onClick={() => setShowEditModal(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="stat-card">
          <div className="stat-icon bg-blue-100">
            <Trophy className="h-6 w-6 text-blue-600" />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.wonMatches}</div>
            <div className="stat-label">Matches Won</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-green-100">
            <Target className="h-6 w-6 text-green-600" />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalMatches}</div>
            <div className="stat-label">Total Matches</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-purple-100">
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.winRate}%</div>
            <div className="stat-label">Win Rate</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-orange-100">
            <Award className="h-6 w-6 text-orange-600" />
          </div>
          <div className="stat-content">
            <div className="stat-value">{playerData.current_tournaments?.length || 0}</div>
            <div className="stat-label">Active Tournaments</div>
          </div>
        </div>
      </div>

      {/* Detailed Information */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Tournament History & Matches</h2>
          <p className="card-description">Your tournament participation and match results</p>
        </div>
        
        <div className="card-content">
          <Tabs defaultValue="current" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="current">Current Tournaments</TabsTrigger>
              <TabsTrigger value="history">Tournament History</TabsTrigger>
              <TabsTrigger value="matches">Match History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="current" className="space-y-4">
              {playerData.current_tournaments?.length > 0 ? (
                <div className="space-y-4">
                  {playerData.current_tournaments.map((tournament) => (
                    <div key={tournament.tournament_id} className="tournament-item">
                      <div className="tournament-info">
                        <h3>{tournament.name}</h3>
                        <p>{new Date(tournament.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
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
            
            <TabsContent value="history" className="space-y-4">
              {playerData.past_tournaments?.length > 0 ? (
                <div className="space-y-4">
                  {playerData.past_tournaments.map((tournament) => (
                    <div key={tournament.tournament_id} className="tournament-item">
                      <div className="tournament-info">
                        <h3>{tournament.name}</h3>
                        <p>{new Date(tournament.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          <span className="text-green-600">{tournament.wins || 0}W</span>
                          <span className="text-secondary"> - </span>
                          <span className="text-red-600">{tournament.losses || 0}L</span>
                        </div>
                        <div className="text-sm text-secondary">
                          Score: {tournament.total_score || 0}
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
            
            <TabsContent value="matches" className="space-y-4">
              {playerMatches.length > 0 ? (
                <div className="space-y-4">
                  {playerMatches.slice(0, 10).map((match) => (
                    <div key={match.match_id} className="tournament-item">
                      <div className="tournament-info">
                        <h3>
                          vs {match.player1_id === user.player_id ? match.player2_name : match.player1_name}
                        </h3>
                        <p>{new Date(match.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        {match.status === 'completed' ? (
                          <>
                            <div className="text-sm font-medium">
                              <span className={match.player1_id === user.player_id ? 'text-primary' : 'text-secondary'}>
                                {match.score_player1}
                              </span>
                              <span className="text-secondary"> - </span>
                              <span className={match.player2_id === user.player_id ? 'text-primary' : 'text-secondary'}>
                                {match.score_player2}
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

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onProfileUpdated={handleProfileUpdated}
        user={currentUser}
      />
    </div>
  )
}

export default PlayerProfile