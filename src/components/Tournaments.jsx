import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from './ui/badge'
import { Plus, Calendar, Users, Trophy, Search, Edit } from 'lucide-react'
import { API_ENDPOINTS, apiRequest } from '../config/api'
import CreateTournamentModal from './CreateTournamentModal'
import EditTournamentModal from './EditTournamentModal'

const Tournaments = ({ user }) => {
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedTournament, setSelectedTournament] = useState(null)

  useEffect(() => {
    fetchTournaments()
  }, [])

  const fetchTournaments = async () => {
    try {
      const response = await apiRequest(API_ENDPOINTS.TOURNAMENTS)
      if (response.success) {
        setTournaments(response.data.tournaments || [])
      }
    } catch (error) {
      console.error('Error fetching tournaments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTournamentCreated = (newTournament) => {
    setTournaments(prev => [newTournament, ...prev])
    setShowCreateModal(false)
  }

  const handleEditTournament = (tournament) => {
    setSelectedTournament(tournament)
    setShowEditModal(true)
  }

  const handleTournamentUpdated = () => {
    setShowEditModal(false)
    setSelectedTournament(null)
    fetchTournaments() // Refresh the tournament list
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

  const filteredTournaments = tournaments.filter(tournament => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || tournament.status === filterStatus
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="container">
        <div className="text-center py-8">
          <div className="text-lg">Loading tournaments...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Tournaments</h1>
          <p className="text-secondary mt-2">Browse and join upcoming tournaments</p>
        </div>
        
        {user.role === 'super_user' && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Create Tournament</span>
          </button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="card mb-8">
        <div className="card-content">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary" />
                <input
                  type="text"
                  placeholder="Search tournaments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    paddingLeft: '40px',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>
            </div>
            
            {/* Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  backgroundColor: 'white',
                  minWidth: '150px'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              >
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tournament Grid */}
      {filteredTournaments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((tournament) => (
            <div key={tournament.tournament_id} className="card">
              <div className="card-header">
                <div className="flex justify-between items-start">
                  <h3 className="card-title">{tournament.name}</h3>
                  {getStatusBadge(tournament.status)}
                </div>
                {tournament.description && (
                  <p className="card-description">{tournament.description}</p>
                )}
              </div>
              
              <div className="card-content">
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-secondary">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{new Date(tournament.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-secondary">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{tournament.enrollment_count || 0} players enrolled</span>
                  </div>
                  <div className="flex items-center text-sm text-secondary">
                    <Trophy className="h-4 w-4 mr-2" />
                    <span>Max: {tournament.max_players} players</span>
                  </div>
                  {tournament.entry_fee && (
                    <div className="flex items-center text-sm text-secondary">
                      <span className="font-medium">Entry Fee: ${tournament.entry_fee}</span>
                    </div>
                  )}
                  {tournament.bracket && (
                    <div className="flex items-center text-sm text-green-600">
                      <Trophy className="h-4 w-4 mr-2" />
                      <span>Bracket Generated</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Link to={`/tournaments/${tournament.tournament_id}`}>
                    <button className="btn btn-outline w-full">
                      View Details
                    </button>
                  </Link>
                  
                  {user.role === 'super_user' && (
                    <button 
                      className="btn btn-secondary w-full"
                      onClick={() => handleEditTournament(tournament)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Tournament
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="card-content">
            <div className="empty-state">
              {searchTerm || filterStatus !== 'all' 
                ? 'No tournaments match your search criteria.' 
                : 'No tournaments available at the moment.'}
            </div>
          </div>
        </div>
      )}

      {/* Create Tournament Modal */}
      <CreateTournamentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onTournamentCreated={handleTournamentCreated}
        user={user}
      />

      {/* Edit Tournament Modal */}
      <EditTournamentModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedTournament(null)
        }}
        onTournamentUpdated={handleTournamentUpdated}
        tournament={selectedTournament}
        user={user}
      />
    </div>
  )
}

export default Tournaments