import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Plus, Calendar, Users, Trophy, Search } from 'lucide-react'

const Tournaments = ({ user }) => {
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchTournaments()
  }, [])

  const fetchTournaments = async () => {
    try {
      const response = await fetch('https://77h9ikcj6vgw.manus.space/api/tournaments' )
      const data = await response.json()
      setTournaments(data.tournaments || [])
    } catch (error) {
      console.error('Error fetching tournaments:', error)
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

  const filteredTournaments = tournaments.filter(tournament => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || tournament.status === filterStatus
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="container py-8">
        <div className="loading">Loading tournaments...</div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Tournaments</h1>
          <p className="text-secondary">Browse and join tournaments</p>
        </div>
        {user.role === 'tournament_administrator' && (
          <button className="btn btn-primary">
            <Plus className="h-4 w-4" />
            <span>Create Tournament</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card mb-8">
        <div className="card-content">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tournaments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
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
                <div className="flex justify-between items-start mb-3">
                  <h3 className="card-title text-lg">{tournament.name}</h3>
                  {getStatusBadge(tournament.status)}
                </div>
                <p className="card-description line-clamp-2">{tournament.description}</p>
              </div>
              <div className="card-content">
                <div className="space-y-3 mb-6">
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
                </div>
                
                <Link to={`/tournaments/${tournament.tournament_id}`}>
                  <button className="btn btn-outline w-full">
                    View Details
                  </button>
                </Link>
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
    </div>
  )
}

export default Tournaments