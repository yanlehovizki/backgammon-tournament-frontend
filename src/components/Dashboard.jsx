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
      case 'upcoming': return 'text-blue-600 bg-blue-50'
      case 'active': return 'text-green-600 bg-green-50'
      case 'completed': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="main-content">
          <div className="container">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="loading-spinner mx-auto mb-4"></div>
                <p className="text-gray-600">Loading dashboard...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-wrapper">
      <div className="main-content">
        <div className="container">
          {/* NO NAVIGATION HERE - Only content */}
          
          {/* Welcome Section */}
          <div className="flex justify-between items-center mb-8 animate-fade-in">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, Player! 👋
              </h1>
              <p className="text-gray-600">Ready to dominate the backgammon world?</p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn btn-primary btn-lg"
            >
              <span>✨</span>
              <span>Create Tournament</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="stat-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="stat-icon bg-blue-500">🏆</div>
              <div className="stat-content">
                <div className="stat-number">{stats.totalTournaments}</div>
                <div className="stat-label">Total Tournaments</div>
              </div>
            </div>

            <div className="stat-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="stat-icon bg-green-500">⚡</div>
              <div className="stat-content">
                <div className="stat-number">{stats.activeTournaments}</div>
                <div className="stat-label">Active Tournaments</div>
              </div>
            </div>

            <div className="stat-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="stat-icon bg-purple-500">👥</div>
              <div className="stat-content">
                <div className="stat-number">{stats.totalPlayers}</div>
                <div className="stat-label">Total Players</div>
              </div>
            </div>

            <div className="stat-card animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="stat-icon bg-orange-500">💰</div>
              <div className="stat-content">
                <div className="stat-number">${stats.totalPrizePool}</div>
                <div className="stat-label">Total Prize Pool</div>
              </div>
            </div>
          </div>

          {/* Recent Tournaments */}
          <div className="card animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="card-header">
              <div className="flex justify-between items-center">
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
              <div className="space-y-4">
                {tournaments.slice(0, 5).map((tournament) => (
                  <div key={tournament.id} className="tournament-card">
                    <div className="flex items-center gap-4">
                      <div className="tournament-icon">
                        🏆
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{tournament.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span>{tournament.participants}/{tournament.maxPlayers} players</span>
                          <span>${tournament.prizePool} prize pool</span>
                          <span>{tournament.format.replace('-', ' ')}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`badge ${getStatusColor(tournament.status)}`}>
                          {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {new Date(tournament.startDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {tournaments.length === 0 && (
                <div className="empty-state">
                  <div className="text-6xl mb-4">🏆</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No tournaments yet</h3>
                  <p className="text-gray-600 mb-6">Create your first tournament to get started!</p>
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