import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Dashboard = ({ user = { name: 'Player', player_id: 1 } }) => {
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Sample data for beautiful display
  const sampleTournaments = [
    {
      tournament_id: 1,
      name: "Spring Championship",
      date: "2025-07-15",
      status: "upcoming",
      enrollment_count: 12,
      max_players: 16,
      prize_pool: 500
    },
    {
      tournament_id: 2,
      name: "Weekly Tournament",
      date: "2025-07-08",
      status: "in_progress",
      enrollment_count: 8,
      max_players: 8,
      prize_pool: 200
    },
    {
      tournament_id: 3,
      name: "Beginner's Cup",
      date: "2025-07-22",
      status: "upcoming",
      enrollment_count: 6,
      max_players: 12,
      prize_pool: 150
    }
  ]

  const playerStats = {
    current_tournaments: sampleTournaments.filter(t => t.status !== 'completed'),
    past_tournaments: [
      { tournament_id: 3, name: "Previous Tournament", wins: 5, losses: 2, total_score: 150 }
    ],
    total_wins: 12,
    total_tournaments: 15,
    win_rate: 80
  }

  const getStatusBadge = (status) => {
    const badgeClasses = {
      upcoming: 'badge badge-primary',
      in_progress: 'badge badge-success',
      completed: 'badge badge-outline'
    }
    
    const statusText = {
      upcoming: 'Upcoming',
      in_progress: 'In Progress',
      completed: 'Completed'
    }
    
    return (
      <span className={badgeClasses[status] || badgeClasses.upcoming}>
        {statusText[status] || 'Unknown'}
      </span>
    )
  }

  return (
    <div className="page-wrapper">
      <div className="main-content">
        <div className="container">
          {/* Beautiful Header */}
          <div className="flex justify-between items-center mb-8 animate-fade-in">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome back, {user.name}! 👋
              </h1>
              <p className="text-lg text-gray-600">
                Ready to dominate the backgammon world?
              </p>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary btn-lg animate-slide-in"
            >
              <span>✨</span>
              <span>Create Tournament</span>
            </button>
          </div>

          {/* Beautiful Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="stat-card animate-fade-in">
              <div className="stat-icon">
                <span className="text-xl">🏆</span>
              </div>
              <div className="stat-number">{playerStats.current_tournaments.length}</div>
              <div className="stat-label">Active Tournaments</div>
            </div>
            
            <div className="stat-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="stat-icon">
                <span className="text-xl">📈</span>
              </div>
              <div className="stat-number">{playerStats.total_wins}</div>
              <div className="stat-label">Total Wins</div>
            </div>
            
            <div className="stat-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="stat-icon">
                <span className="text-xl">🎯</span>
              </div>
              <div className="stat-number">{playerStats.win_rate}%</div>
              <div className="stat-label">Win Rate</div>
            </div>
            
            <div className="stat-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="stat-icon">
                <span className="text-xl">🏅</span>
              </div>
              <div className="stat-number">{playerStats.total_tournaments}</div>
              <div className="stat-label">Total Tournaments</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* My Current Tournaments */}
            <div className="card animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="card-header">
                <h2 className="card-title">
                  <span>🎮</span>
                  My Current Tournaments
                </h2>
                <p className="card-description">
                  Tournaments you're currently participating in
                </p>
              </div>
              <div className="card-content">
                {playerStats.current_tournaments.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {playerStats.current_tournaments.map((tournament) => (
                      <div key={tournament.tournament_id} className="tournament-card">
                        <div className="tournament-header">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="tournament-title">{tournament.name}</h3>
                            {getStatusBadge(tournament.status)}
                          </div>
                          <div className="tournament-meta">
                            <div className="tournament-meta-item">
                              <span>📅</span>
                              <span>{new Date(tournament.date).toLocaleDateString()}</span>
                            </div>
                            <div className="tournament-meta-item">
                              <span>👥</span>
                              <span>{tournament.enrollment_count}/{tournament.max_players} players</span>
                            </div>
                            {tournament.prize_pool && (
                              <div className="tournament-meta-item">
                                <span>💰</span>
                                <span>${tournament.prize_pool}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="tournament-content">
                          <div className="tournament-actions">
                            <Link to={`/tournaments/${tournament.tournament_id}`} className="btn btn-primary btn-sm">
                              View Details
                            </Link>
                            <button className="btn btn-outline btn-sm">
                              Leave Tournament
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-state-icon">🎯</div>
                    <div className="empty-state-title">No Active Tournaments</div>
                    <div className="empty-state-description">
                      You're not currently enrolled in any tournaments.
                    </div>
                    <button 
                      onClick={() => setShowCreateModal(true)}
                      className="btn btn-primary"
                    >
                      Create Your First Tournament
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Tournaments */}
            <div className="card animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="card-header">
                <h2 className="card-title">
                  <span>🚀</span>
                  Upcoming Tournaments
                </h2>
                <p className="card-description">
                  Join these exciting upcoming tournaments
                </p>
              </div>
              <div className="card-content">
                {sampleTournaments.filter(t => t.status === 'upcoming').length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {sampleTournaments.filter(t => t.status === 'upcoming').map((tournament) => (
                      <div key={tournament.tournament_id} className="tournament-card">
                        <div className="tournament-header">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="tournament-title">{tournament.name}</h3>
                            {getStatusBadge(tournament.status)}
                          </div>
                          <div className="tournament-meta">
                            <div className="tournament-meta-item">
                              <span>📅</span>
                              <span>{new Date(tournament.date).toLocaleDateString()}</span>
                            </div>
                            <div className="tournament-meta-item">
                              <span>👥</span>
                              <span>{tournament.enrollment_count}/{tournament.max_players} players</span>
                            </div>
                            {tournament.prize_pool && (
                              <div className="tournament-meta-item">
                                <span>💰</span>
                                <span>${tournament.prize_pool}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="tournament-content">
                          <div className="tournament-actions">
                            <Link to={`/tournaments/${tournament.tournament_id}`} className="btn btn-outline btn-sm">
                              View Details
                            </Link>
                            <button className="btn btn-success btn-sm">
                              Join Tournament
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-state-icon">📅</div>
                    <div className="empty-state-title">No Upcoming Tournaments</div>
                    <div className="empty-state-description">
                      No tournaments are scheduled at the moment.
                    </div>
                    <Link to="/tournaments" className="btn btn-outline">
                      Browse All Tournaments
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card mt-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="card-header">
              <h2 className="card-title">
                <span>⚡</span>
                Quick Actions
              </h2>
              <p className="card-description">
                Common actions to get you started
              </p>
            </div>
            <div className="card-content">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="btn btn-primary w-full"
                >
                  <span>🏆</span>
                  <span>Create Tournament</span>
                </button>
                <Link to="/tournaments" className="btn btn-outline w-full">
                  <span>🔍</span>
                  <span>Browse Tournaments</span>
                </Link>
                <Link to="/profile" className="btn btn-secondary w-full">
                  <span>👤</span>
                  <span>View Profile</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Beautiful Create Tournament Modal */}
      {showCreateModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md animate-fade-in">
            <div className="card-header">
              <div className="flex justify-between items-center">
                <h2 className="card-title">
                  <span>✨</span>
                  Create Tournament
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary btn-sm"
                >
                  ✕
                </button>
              </div>
              <p className="card-description">
                Create a new tournament for players to join
              </p>
            </div>
            <div className="card-content">
              <div className="form-group">
                <label className="form-label">Tournament Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter tournament name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tournament Date</label>
                <input
                  type="date"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Max Players</label>
                <select className="form-select">
                  <option value="8">8 Players</option>
                  <option value="16">16 Players</option>
                  <option value="32">32 Players</option>
                </select>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('Tournament created successfully! 🎉')
                    setShowCreateModal(false)
                  }}
                  className="btn btn-primary flex-1"
                >
                  Create Tournament
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard