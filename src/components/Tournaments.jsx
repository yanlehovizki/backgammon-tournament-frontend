import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Tournaments = ({ user = { role: 'super_user' } }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Beautiful sample tournaments data
  const tournaments = [
    {
      tournament_id: 1,
      name: "Spring Championship 2025",
      description: "The ultimate spring tournament for backgammon masters",
      date: "2025-07-15",
      status: "upcoming",
      enrollment_count: 12,
      max_players: 16,
      entry_fee: 25,
      prize_pool: 400,
      organizer: "Tournament Masters",
      location: "Online"
    },
    {
      tournament_id: 2,
      name: "Weekly Pro League",
      description: "Weekly competition for professional players",
      date: "2025-07-08",
      status: "in_progress",
      enrollment_count: 8,
      max_players: 8,
      entry_fee: 50,
      prize_pool: 400,
      organizer: "Pro League",
      location: "Online"
    },
    {
      tournament_id: 3,
      name: "Beginner's Welcome Cup",
      description: "Perfect tournament for new players to get started",
      date: "2025-07-22",
      status: "upcoming",
      enrollment_count: 6,
      max_players: 12,
      entry_fee: 10,
      prize_pool: 120,
      organizer: "Beginner's Club",
      location: "Online"
    },
    {
      tournament_id: 4,
      name: "Masters Invitational",
      description: "Exclusive tournament for top-ranked players",
      date: "2025-08-01",
      status: "upcoming",
      enrollment_count: 4,
      max_players: 8,
      entry_fee: 100,
      prize_pool: 800,
      organizer: "Elite Gaming",
      location: "Online"
    }
  ]

  const getStatusBadge = (status) => {
    const badgeClasses = {
      upcoming: 'badge badge-primary',
      in_progress: 'badge badge-success',
      completed: 'badge badge-outline'
    }
    
    const statusText = {
      upcoming: 'Upcoming',
      in_progress: 'Live Now',
      completed: 'Completed'
    }
    
    return (
      <span className={badgeClasses[status] || badgeClasses.upcoming}>
        {statusText[status] || 'Unknown'}
      </span>
    )
  }

  const getProgressPercentage = (enrolled, max) => {
    return Math.round((enrolled / max) * 100)
  }

  const filteredTournaments = tournaments.filter(tournament => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tournament.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || tournament.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="page-wrapper">
      <div className="main-content">
        <div className="container">
          {/* Beautiful Header */}
          <div className="flex justify-between items-center mb-8 animate-fade-in">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                🏆 Tournaments
              </h1>
              <p className="text-lg text-gray-600">
                Discover and join exciting backgammon tournaments
              </p>
            </div>
            
            {user.role === 'super_user' && (
              <button 
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary btn-lg animate-slide-in"
              >
                <span>✨</span>
                <span>Create Tournament</span>
              </button>
            )}
          </div>

          {/* Beautiful Search and Filter */}
          <div className="card mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="card-content">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Search */}
                <div className="search-container">
                  <div className="search-icon">🔍</div>
                  <input
                    type="text"
                    placeholder="Search tournaments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
                
                {/* Filter */}
                <div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="form-select"
                  >
                    <option value="all">All Tournaments</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="in_progress">Live Now</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Tournament Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="stat-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="stat-icon">
                <span className="text-xl">🎯</span>
              </div>
              <div className="stat-number">{tournaments.length}</div>
              <div className="stat-label">Total Tournaments</div>
            </div>
            
            <div className="stat-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="stat-icon">
                <span className="text-xl">🔥</span>
              </div>
              <div className="stat-number">{tournaments.filter(t => t.status === 'in_progress').length}</div>
              <div className="stat-label">Live Now</div>
            </div>
            
            <div className="stat-card animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="stat-icon">
                <span className="text-xl">⏰</span>
              </div>
              <div className="stat-number">{tournaments.filter(t => t.status === 'upcoming').length}</div>
              <div className="stat-label">Upcoming</div>
            </div>
            
            <div className="stat-card animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="stat-icon">
                <span className="text-xl">👥</span>
              </div>
              <div className="stat-number">{tournaments.reduce((sum, t) => sum + t.enrollment_count, 0)}</div>
              <div className="stat-label">Total Players</div>
            </div>
          </div>

          {/* Beautiful Tournament Grid */}
          {filteredTournaments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTournaments.map((tournament, index) => (
                <div 
                  key={tournament.tournament_id} 
                  className="tournament-card animate-fade-in"
                  style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                >
                  <div className="tournament-header">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="tournament-title">{tournament.name}</h3>
                      {getStatusBadge(tournament.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{tournament.description}</p>
                    
                    <div className="tournament-meta">
                      <div className="tournament-meta-item">
                        <span>📅</span>
                        <span>{new Date(tournament.date).toLocaleDateString()}</span>
                      </div>
                      <div className="tournament-meta-item">
                        <span>🏢</span>
                        <span>{tournament.organizer}</span>
                      </div>
                      <div className="tournament-meta-item">
                        <span>📍</span>
                        <span>{tournament.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="tournament-content">
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Players Enrolled</span>
                        <span>{tournament.enrollment_count}/{tournament.max_players}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getProgressPercentage(tournament.enrollment_count, tournament.max_players)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Tournament Details */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">${tournament.entry_fee}</div>
                        <div className="text-xs text-gray-500">Entry Fee</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">${tournament.prize_pool}</div>
                        <div className="text-xs text-gray-500">Prize Pool</div>
                      </div>
                    </div>
                    
                    <div className="tournament-actions">
                      <Link 
                        to={`/tournaments/${tournament.tournament_id}`} 
                        className="btn btn-outline btn-sm flex-1"
                      >
                        View Details
                      </Link>
                      
                      {tournament.status === 'upcoming' && (
                        <button className="btn btn-success btn-sm flex-1">
                          Join Tournament
                        </button>
                      )}
                      
                      {tournament.status === 'in_progress' && (
                        <button className="btn btn-primary btn-sm flex-1">
                          Watch Live
                        </button>
                      )}
                      
                      {user.role === 'super_user' && (
                        <button 
                          onClick={() => console.log('Edit tournament:', tournament.tournament_id)}
                          className="btn btn-secondary btn-sm"
                        >
                          ✏️
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="card-content">
                <div className="empty-state">
                  <div className="empty-state-icon">🔍</div>
                  <div className="empty-state-title">No Tournaments Found</div>
                  <div className="empty-state-description">
                    {searchTerm || filterStatus !== 'all' 
                      ? 'Try adjusting your search criteria or filters.' 
                      : 'No tournaments are available at the moment.'}
                  </div>
                  {user.role === 'super_user' && (
                    <button 
                      onClick={() => setShowCreateModal(true)}
                      className="btn btn-primary"
                    >
                      Create First Tournament
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Beautiful Create Tournament Modal */}
          {showCreateModal && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="card w-full max-w-lg animate-fade-in">
                <div className="card-header">
                  <div className="flex justify-between items-center">
                    <h2 className="card-title">
                      <span>✨</span>
                      Create New Tournament
                    </h2>
                    <button
                      onClick={() => setShowCreateModal(false)}
                      className="btn btn-secondary btn-sm"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="card-description">
                    Create an exciting new tournament for players to join
                  </p>
                </div>
                <div className="card-content">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="form-group">
                      <label className="form-label">Tournament Name</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter an exciting tournament name"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-input"
                        rows="3"
                        placeholder="Describe your tournament..."
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                          <option value="64">64 Players</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-group">
                        <label className="form-label">Entry Fee ($)</label>
                        <input
                          type="number"
                          className="form-input"
                          placeholder="0"
                          min="0"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Prize Pool ($)</label>
                        <input
                          type="number"
                          className="form-input"
                          placeholder="0"
                          min="0"
                        />
                      </div>
                    </div>
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
                        alert('🎉 Tournament created successfully! Players can now join your amazing tournament.')
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
      </div>
    </div>
  )
}

export default Tournaments