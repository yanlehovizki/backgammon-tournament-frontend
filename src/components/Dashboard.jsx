import React, { useState, useEffect } from 'react'
import CreateTournamentModal from './CreateTournamentModal'

const Dashboard = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [tournaments, setTournaments] = useState([])
  const [stats, setStats] = useState({
    totalTournaments: 0,
    activeTournaments: 0,
    totalPlayers: 0,
    totalPrizePool: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const mockTournaments = [
        {
          id: 1,
          name: 'Spring Championship 2025',
          status: 'active',
          participants: 14,
          maxPlayers: 16,
          prizePool: 400,
          startDate: '2025-07-15',
          format: 'single-elimination'
        },
        {
          id: 2,
          name: 'Weekly Tournament #12',
          status: 'upcoming',
          participants: 8,
          maxPlayers: 12,
          prizePool: 150,
          startDate: '2025-07-20',
          format: 'round-robin'
        },
        {
          id: 3,
          name: 'Pro League Finals',
          status: 'completed',
          participants: 32,
          maxPlayers: 32,
          prizePool: 1000,
          startDate: '2025-06-28',
          format: 'double-elimination'
        }
      ]

      setTournaments(mockTournaments)
      setStats({
        totalTournaments: mockTournaments.length,
        activeTournaments: mockTournaments.filter(t => t.status === 'active').length,
        totalPlayers: mockTournaments.reduce((sum, t) => sum + t.participants, 0),
        totalPrizePool: mockTournaments.reduce((sum, t) => sum + t.prizePool, 0)
      })
      setLoading(false)
    }, 1000)
  }, [])

  const handleCreateTournament = (tournamentData) => {
    const newTournament = {
      id: tournaments.length + 1,
      ...tournamentData,
      participants: 0,
      status: 'upcoming'
    }
    setTournaments(prev => [newTournament, ...prev])
    setIsCreateModalOpen(false)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'badge-primary'
      case 'active': return 'badge-success'
      case 'completed': return 'badge-outline'
      default: return 'badge-outline'
    }
  }

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="text-secondary">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-content">
            <h1 className="page-title">
              Welcome back, Player! 👋
            </h1>
            <p className="page-subtitle">Ready to dominate the backgammon world?</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn btn-primary btn-lg"
          >
            <span>✨</span>
            <span>Create Tournament</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon bg-primary">🏆</div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalTournaments}</div>
              <div className="stat-label">Total Tournaments</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon bg-success">⚡</div>
            <div className="stat-content">
              <div className="stat-number">{stats.activeTournaments}</div>
              <div className="stat-label">Active Tournaments</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon bg-warning">👥</div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalPlayers}</div>
              <div className="stat-label">Total Players</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon bg-error">💰</div>
            <div className="stat-content">
              <div className="stat-number">${stats.totalPrizePool}</div>
              <div className="stat-label">Total Prize Pool</div>
            </div>
          </div>
        </div>

        {/* Recent Tournaments */}
        <div className="card">
          <div className="card-header">
            <div className="card-header-content">
              <div>
                <h2 className="card-title">Recent Tournaments</h2>
                <p className="card-description">Your latest tournament activity</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="btn btn-outline btn-sm"
              >
                <span>➕</span>
                <span>New Tournament</span>
              </button>
            </div>
          </div>

          <div className="card-content">
            {tournaments.length > 0 ? (
              <div className="tournament-list">
                {tournaments.slice(0, 5).map((tournament) => (
                  <div key={tournament.id} className="tournament-item">
                    <div className="tournament-icon">🏆</div>
                    <div className="tournament-info">
                      <h3 className="tournament-name">{tournament.name}</h3>
                      <div className="tournament-details">
                        <span>{tournament.participants}/{tournament.maxPlayers} players</span>
                        <span>${tournament.prizePool} prize pool</span>
                        <span>{tournament.format.replace('-', ' ')}</span>
                      </div>
                    </div>
                    <div className="tournament-status">
                      <div className={`badge ${getStatusColor(tournament.status)}`}>
                        {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                      </div>
                      <div className="tournament-date">
                        {new Date(tournament.startDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🏆</div>
                <h3 className="empty-title">No tournaments yet</h3>
                <p className="empty-description">Create your first tournament to get started!</p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="btn btn-primary"
                >
                  <span>✨</span>
                  <span>Create Your First Tournament</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Tournament Modal */}
      <CreateTournamentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateTournament}
      />
    </div>
  )
}

export default Dashboard