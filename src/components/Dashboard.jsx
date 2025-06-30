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
          format: 'single-elimination',
          icon: '🏆'
        },
        {
          id: 2,
          name: 'Weekly Tournament #12',
          status: 'upcoming',
          participants: 8,
          maxPlayers: 12,
          prizePool: 150,
          startDate: '2025-07-20',
          format: 'round-robin',
          icon: '⚡'
        },
        {
          id: 3,
          name: 'Pro League Finals',
          status: 'completed',
          participants: 32,
          maxPlayers: 32,
          prizePool: 1000,
          startDate: '2025-06-28',
          format: 'double-elimination',
          icon: '👑'
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
      status: 'upcoming',
      icon: '🎯'
    }
    setTournaments(prev => [newTournament, ...prev])
    setIsCreateModalOpen(false)
  }

  const getStatusBadge = (status) => {
    const badges = {
      upcoming: { color: 'bg-blue-100 text-blue-800', text: 'UPCOMING' },
      active: { color: 'bg-green-100 text-green-800', text: 'ACTIVE' },
      completed: { color: 'bg-gray-100 text-gray-800', text: 'COMPLETED' }
    }
    return badges[status] || badges.upcoming
  }

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* NO NAVIGATION HERE - REMOVED COMPLETELY */}
      
      {/* Welcome Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div className="animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Welcome back, Player! 👋
          </h1>
          <p className="text-gray-600 text-lg">Ready to dominate the backgammon world?</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
        >
          <span className="text-xl">✨</span>
          <span>Create Tournament</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Tournaments</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalTournaments}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <span className="text-2xl">🏆</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Active Tournaments</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.activeTournaments}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <span className="text-2xl">⚡</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Players</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalPlayers}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Prize Pool</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">${stats.totalPrizePool}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-xl">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Beautiful Recent Tournaments */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 animate-fade-in" style={{ animationDelay: '0.5s' }}>
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Recent Tournaments</h2>
              <p className="text-gray-600">Your latest tournament activity</p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 border border-blue-200"
            >
              <span>➕</span>
              <span>New Tournament</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {tournaments.length > 0 ? (
            <div className="space-y-4">
              {tournaments.slice(0, 5).map((tournament, index) => {
                const badge = getStatusBadge(tournament.status)
                return (
                  <div 
                    key={tournament.id} 
                    className="bg-gray-50 hover:bg-gray-100 rounded-xl p-4 transition-all duration-300 border border-gray-200 hover:border-blue-300 hover:shadow-md"
                    style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200">
                          <span className="text-2xl">{tournament.icon}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg mb-1">{tournament.name}</h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <span>👥</span>
                              {tournament.participants}/{tournament.maxPlayers} players
                            </span>
                            <span className="flex items-center gap-1">
                              <span>💰</span>
                              ${tournament.prizePool} prize pool
                            </span>
                            <span className="flex items-center gap-1">
                              <span>🎯</span>
                              {tournament.format.replace('-', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.color} mb-2`}>
                          {badge.text}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(tournament.startDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No tournaments yet</h3>
              <p className="text-gray-600 mb-6">Create your first tournament to get started!</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto"
              >
                <span>✨</span>
                <span>Create Your First Tournament</span>
              </button>
            </div>
          )}
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