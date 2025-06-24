import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Calendar, Users, TrendingUp, Plus } from 'lucide-react'
import CreateTournamentModal from './CreateTournamentModal'
import { API_ENDPOINTS, apiRequest } from '../config/api'

const Dashboard = ({ user } ) => {
  const [tournaments, setTournaments] = useState([])
  const [playerTournaments, setPlayerTournaments] = useState({ current_tournaments: [], past_tournaments: [] })
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [user])

  const fetchDashboardData = async () => {
    try {
      // Fetch all tournaments using your API configuration
      const tournamentsResponse = await apiRequest(API_ENDPOINTS.TOURNAMENTS)
      
      // Fetch player's tournaments using your API configuration
      const playerTournamentsResponse = await apiRequest(API_ENDPOINTS.PLAYER_TOURNAMENTS(user.player_id))
      
      if (tournamentsResponse.success) {
        setTournaments(tournamentsResponse.data.tournaments || tournamentsResponse.data || [])
      }
      
      if (playerTournamentsResponse.success) {
        setPlayerTournaments(playerTournamentsResponse.data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
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
        <div className="loading">Loading dashboard...</div>
      </div>
    )
  }

  const upcomingTournaments = tournaments.filter(t => t.status === 'upcoming').slice(0, 3)
  const activeTournaments = tournaments.filter(t => t.status === 'in_progress').slice(0, 3)

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Dashboard</h1>
          <p className="text-secondary">Welcome back, {user.name}!</p>
        </div>
        {user.role === 'tournament_administrator' && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Create Tournament</span>
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-title">Current Tournaments</div>
            <Trophy className="stat-card-icon" />
          </div>
          <div className="stat-card-value">{playerTournaments.current_tournaments?.length || 0}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-title">Past Tournaments</div>
            <Calendar className="stat-card-icon" />
          </div>
          <div className="stat-card-value">{playerTournaments.past_tournaments?.length || 0}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-title">Total Wins</div>
            <TrendingUp className="stat-card-icon" />
          </div>
          <div className="stat-card-value">
            {playerTournaments.past_tournaments?.reduce((total, t) => total + (t.wins || 0), 0) || 0}
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-title">Active Tournaments</div>
            <Users className="stat-card-icon" />
          </div>
          <div className="stat-card-value">{activeTournaments.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My Current Tournaments */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">My Current Tournaments</h2>
            <p className="card-description">Tournaments you're currently participating in</p>
          </div>
          <div className="card-content">
            {playerTournaments.current_tournaments?.length > 0 ? (
              <div className="space-y-4">
                {playerTournaments.current_tournaments.map((tournament) => (
                  <div key={tournament.tournament_id} className="tournament-item">
                    <div className="tournament-info">
                      <h3>{tournament.name}</h3>
                      <p>{new Date(tournament.date).toLocaleDateString()}</p>
                    </div>
                    <div className="tournament-actions">
                      {getStatusBadge(tournament.status)}
                      <Link to={`/tournaments/${tournament.tournament_id}`}>
                        <button className="btn btn-outline btn-sm">View</button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                You're not currently enrolled in any tournaments.
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Tournaments */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Upcoming Tournaments</h2>
            <p className="card-description">Join these upcoming tournaments</p>
          </div>
          <div className="card-content">
            {upcomingTournaments.length > 0 ? (
              <div className="space-y-4">
                {upcomingTournaments.map((tournament) => (
                  <div key={tournament.tournament_id} className="tournament-item">
                    <div className="tournament-info">
                      <h3>{tournament.name}</h3>
                      <p>{new Date(tournament.date).toLocaleDateString()} • {tournament.enrollment_count || 0} players</p>
                    </div>
                    <div className="tournament-actions">
                      {getStatusBadge(tournament.status)}
                      <Link to={`/tournaments/${tournament.tournament_id}`}>
                        <button className="btn btn-outline btn-sm">Join</button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                No upcoming tournaments available.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Tournament History */}
      {playerTournaments.past_tournaments?.length > 0 && (
        <div className="card mt-8">
          <div className="card-header">
            <h2 className="card-title">Recent Tournament History</h2>
            <p className="card-description">Your performance in past tournaments</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {playerTournaments.past_tournaments.slice(0, 5).map((tournament) => (
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
          </div>
        </div>
      )}

      {/* Create Tournament Modal */}
      <CreateTournamentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onTournamentCreated={() => {
          setShowCreateModal(false)
          fetchDashboardData() // Refresh the data
        }}
        user={user}
      />
    </div>
  )
}

export default Dashboard