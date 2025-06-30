import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import EditTournamentModal from './EditTournamentModal'
import BracketVisualization from './BracketVisualization'
import MatchResultModal from './MatchResultModal'

const TournamentDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tournament, setTournament] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading tournament data
    setTimeout(() => {
      const mockTournament = {
        id: parseInt(id),
        name: 'Spring Championship 2025',
        description: 'Annual spring tournament featuring the best backgammon players from around the region.',
        format: 'single-elimination',
        status: 'active',
        maxPlayers: 16,
        participants: 14,
        entryFee: 25,
        prizePool: 400,
        startDate: '2025-07-15',
        startTime: '10:00',
        location: 'Downtown Gaming Center',
        organizer: 'Tournament Pro',
        rules: 'Standard backgammon rules apply. Matches are best of 3 games.',
        isPublic: true,
        allowSpectators: true,
        estimatedDuration: '4',
        createdAt: '2025-06-20T10:00:00Z',
        players: [
          { id: 1, name: 'John Smith', rank: 'Gold', seed: 1, status: 'active' },
          { id: 2, name: 'Sarah Johnson', rank: 'Silver', seed: 2, status: 'active' },
          { id: 3, name: 'Mike Chen', rank: 'Gold', seed: 3, status: 'active' },
          { id: 4, name: 'Emma Wilson', rank: 'Bronze', seed: 4, status: 'active' },
          { id: 5, name: 'David Brown', rank: 'Silver', seed: 5, status: 'active' },
          { id: 6, name: 'Lisa Garcia', rank: 'Gold', seed: 6, status: 'active' },
          { id: 7, name: 'Tom Anderson', rank: 'Bronze', seed: 7, status: 'active' },
          { id: 8, name: 'Anna Martinez', rank: 'Silver', seed: 8, status: 'active' }
        ],
        matches: [
          { id: 1, round: 1, player1: 'John Smith', player2: 'Anna Martinez', score1: 2, score2: 1, status: 'completed' },
          { id: 2, round: 1, player1: 'Sarah Johnson', player2: 'Tom Anderson', score1: 2, score2: 0, status: 'completed' },
          { id: 3, round: 1, player1: 'Mike Chen', player2: 'Lisa Garcia', score1: 1, score2: 2, status: 'completed' },
          { id: 4, round: 1, player1: 'Emma Wilson', player2: 'David Brown', score1: null, score2: null, status: 'active' }
        ]
      }
      setTournament(mockTournament)
      setLoading(false)
    }, 1000)
  }, [id])

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="main-content">
          <div className="container">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="loading-spinner mx-auto mb-4"></div>
                <p className="text-gray-600">Loading tournament details...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!tournament) {
    return (
      <div className="page-wrapper">
        <div className="main-content">
          <div className="container">
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🏆</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Tournament Not Found</h1>
              <p className="text-gray-600 mb-6">The tournament you're looking for doesn't exist.</p>
              <button onClick={() => navigate('/tournaments')} className="btn btn-primary">
                Back to Tournaments
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'text-blue-600 bg-blue-50'
      case 'active': return 'text-green-600 bg-green-50'
      case 'completed': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getRankColor = (rank) => {
    switch (rank) {
      case 'Bronze': return 'text-amber-600 bg-amber-50'
      case 'Silver': return 'text-gray-600 bg-gray-50'
      case 'Gold': return 'text-yellow-600 bg-yellow-50'
      case 'Platinum': return 'text-blue-600 bg-blue-50'
      case 'Diamond': return 'text-purple-600 bg-purple-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'bracket', name: 'Bracket', icon: '🏆' },
    { id: 'players', name: 'Players', icon: '👥' },
    { id: 'schedule', name: 'Schedule', icon: '📅' },
    { id: 'rules', name: 'Rules', icon: '📋' }
  ]

  const handleEditMatch = (match) => {
    setSelectedMatch(match)
    setIsMatchModalOpen(true)
  }

  const handleSaveMatch = (matchData) => {
    // Update match in tournament
    setTournament(prev => ({
      ...prev,
      matches: prev.matches.map(match => 
        match.id === matchData.id ? matchData : match
      )
    }))
    setIsMatchModalOpen(false)
    setSelectedMatch(null)
  }

  const handleSaveTournament = (updatedTournament) => {
    setTournament(updatedTournament)
    setIsEditModalOpen(false)
  }

  return (
    <div className="page-wrapper">
      <div className="main-content">
        <div className="container">
          {/* Beautiful Header */}
          <div className="card mb-8 animate-fade-in">
            <div className="card-content">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Tournament Image */}
                <div className="flex-shrink-0">
                  <div className="tournament-image">
                    🏆
                  </div>
                </div>

                {/* Tournament Info */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{tournament.name}</h1>
                      <div className="flex items-center gap-4 mb-3">
                        <div className={`badge ${getStatusColor(tournament.status)}`}>
                          {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                        </div>
                        <div className="text-gray-600">
                          {tournament.format.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                        <div className="text-gray-600">
                          📍 {tournament.location}
                        </div>
                      </div>
                      <p className="text-gray-600 max-w-2xl">{tournament.description}</p>
                    </div>
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="btn btn-outline btn-sm"
                    >
                      ✏️ Edit
                    </button>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{tournament.participants}</div>
                      <div className="text-sm text-gray-500">Players</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">${tournament.prizePool}</div>
                      <div className="text-sm text-gray-500">Prize Pool</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">${tournament.entryFee}</div>
                      <div className="text-sm text-gray-500">Entry Fee</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{tournament.estimatedDuration}h</div>
                      <div className="text-sm text-gray-500">Duration</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Beautiful Tabs */}
          <div className="card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="card-header">
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`btn btn-sm ${activeTab === tab.id ? 'btn-primary' : 'btn-outline'}`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="card-content">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="animate-fade-in">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Tournament Details */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span>ℹ️</span>
                        Tournament Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Organizer:</span>
                          <span className="font-medium">{tournament.organizer}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Start Date:</span>
                          <span className="font-medium">{new Date(tournament.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Start Time:</span>
                          <span className="font-medium">{tournament.startTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Format:</span>
                          <span className="font-medium">{tournament.format.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Max Players:</span>
                          <span className="font-medium">{tournament.maxPlayers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Public:</span>
                          <span className="font-medium">{tournament.isPublic ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Spectators:</span>
                          <span className="font-medium">{tournament.allowSpectators ? 'Allowed' : 'Not Allowed'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Recent Matches */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span>⚡</span>
                        Recent Matches
                      </h3>
                      <div className="space-y-3">
                        {tournament.matches.slice(0, 5).map((match) => (
                          <div key={match.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <div className="font-medium">
                                {match.player1} vs {match.player2}
                              </div>
                              <div className="text-sm text-gray-500">Round {match.round}</div>
                            </div>
                            <div className="text-right">
                              {match.status === 'completed' ? (
                                <div className="font-bold">
                                  {match.score1} - {match.score2}
                                </div>
                              ) : (
                                <div className="text-sm text-blue-600">In Progress</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bracket Tab */}
              {activeTab === 'bracket' && (
                <div className="animate-fade-in">
                  <BracketVisualization 
                    tournament={tournament}
                    onMatchClick={handleEditMatch}
                  />
                </div>
              )}

              {/* Players Tab */}
              {activeTab === 'players' && (
                <div className="animate-fade-in">
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <span>👥</span>
                    Registered Players ({tournament.players.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tournament.players.map((player) => (
                      <div key={player.id} className="card">
                        <div className="card-content">
                          <div className="flex items-center gap-3">
                            <div className="player-avatar">
                              {player.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold">{player.name}</div>
                              <div className="flex items-center gap-2">
                                <div className={`badge badge-sm ${getRankColor(player.rank)}`}>
                                  {player.rank}
                                </div>
                                <div className="text-sm text-gray-500">Seed #{player.seed}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Schedule Tab */}
              {activeTab === 'schedule' && (
                <div className="animate-fade-in">
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <span>📅</span>
                    Tournament Schedule
                  </h3>
                  <div className="space-y-4">
                    {tournament.matches.map((match) => (
                      <div key={match.id} className="card">
                        <div className="card-content">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-semibold">Round {match.round}</div>
                              <div className="text-gray-600">{match.player1} vs {match.player2}</div>
                            </div>
                            <div className="text-right">
                              <div className={`badge ${match.status === 'completed' ? 'badge-success' : 'badge-primary'}`}>
                                {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                              </div>
                              {match.status === 'completed' && (
                                <div className="text-sm text-gray-500 mt-1">
                                  Score: {match.score1} - {match.score2}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rules Tab */}
              {activeTab === 'rules' && (
                <div className="animate-fade-in">
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <span>📋</span>
                    Tournament Rules
                  </h3>
                  <div className="card">
                    <div className="card-content">
                      <div className="prose max-w-none">
                        {tournament.rules ? (
                          <p className="text-gray-700 leading-relaxed">{tournament.rules}</p>
                        ) : (
                          <p className="text-gray-500 italic">No specific rules have been set for this tournament.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditTournamentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveTournament}
        tournament={tournament}
      />

      <MatchResultModal
        isOpen={isMatchModalOpen}
        onClose={() => setIsMatchModalOpen(false)}
        onSave={handleSaveMatch}
        match={selectedMatch}
      />
    </div>
  )
}

export default TournamentDetail