import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Plus, 
  Calendar, 
  Users, 
  Trophy, 
  Clock,
  MapPin,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  MoreVertical
} from 'lucide-react';

const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    fetchTournaments();
  }, []);

  useEffect(() => {
    filterAndSortTournaments();
  }, [tournaments, searchTerm, statusFilter, sortBy]);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      
      // Simulate API call with mock data
      setTimeout(() => {
        const mockTournaments = [
          {
            id: 1,
            name: "Spring Championship 2025",
            description: "Annual spring tournament with exciting prizes",
            status: "active",
            startDate: "2025-06-25T10:00:00Z",
            endDate: "2025-06-27T18:00:00Z",
            location: "Convention Center",
            maxPlayers: 64,
            currentPlayers: 48,
            entryFee: 50,
            prizePool: 5000,
            format: "Single Elimination",
            organizer: "Tournament Pro"
          },
          {
            id: 2,
            name: "Weekly Tournament #12",
            description: "Regular weekly competition for all skill levels",
            status: "completed",
            startDate: "2025-06-20T14:00:00Z",
            endDate: "2025-06-20T20:00:00Z",
            location: "Gaming Lounge",
            maxPlayers: 32,
            currentPlayers: 32,
            entryFee: 25,
            prizePool: 800,
            format: "Double Elimination",
            organizer: "Gaming Club",
            winner: "Alex Johnson"
          },
          {
            id: 3,
            name: "Beginner's Cup",
            description: "Perfect tournament for new players to get started",
            status: "upcoming",
            startDate: "2025-07-01T12:00:00Z",
            endDate: "2025-07-01T18:00:00Z",
            location: "Community Center",
            maxPlayers: 24,
            currentPlayers: 16,
            entryFee: 15,
            prizePool: 500,
            format: "Round Robin",
            organizer: "Beginner's League"
          },
          {
            id: 4,
            name: "Pro League Finals",
            description: "Championship finals for professional players",
            status: "upcoming",
            startDate: "2025-07-15T09:00:00Z",
            endDate: "2025-07-17T21:00:00Z",
            location: "Arena Stadium",
            maxPlayers: 16,
            currentPlayers: 12,
            entryFee: 200,
            prizePool: 25000,
            format: "Single Elimination",
            organizer: "Pro League"
          },
          {
            id: 5,
            name: "Summer Showdown",
            description: "Mid-summer tournament with beach theme",
            status: "registration",
            startDate: "2025-08-10T11:00:00Z",
            endDate: "2025-08-12T19:00:00Z",
            location: "Beach Resort",
            maxPlayers: 48,
            currentPlayers: 8,
            entryFee: 75,
            prizePool: 3000,
            format: "Swiss System",
            organizer: "Summer Events"
          }
        ];
        
        setTournaments(mockTournaments);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      setLoading(false);
    }
  };

  const filterAndSortTournaments = () => {
    let filtered = tournaments.filter(tournament => {
      const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tournament.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || tournament.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sort tournaments
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.startDate) - new Date(b.startDate);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'players':
          return b.currentPlayers - a.currentPlayers;
        case 'prize':
          return b.prizePool - a.prizePool;
        default:
          return 0;
      }
    });

    setFilteredTournaments(filtered);
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { class: "badge-success", text: "Active" },
      completed: { class: "badge-primary", text: "Completed" },
      upcoming: { class: "badge-warning", text: "Upcoming" },
      registration: { class: "badge-outline", text: "Registration Open" }
    };
    return badges[status] || { class: "badge-outline", text: status };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProgressPercentage = (current, max) => {
    return Math.round((current / max) * 100);
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="loading">
          <div className="spinner"></div>
          <p className="ml-3">Loading tournaments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Tournaments</h1>
          <p className="text-gray-600 text-lg">
            Discover and join exciting tournaments
          </p>
        </div>
        <Link to="/tournaments/create" className="btn btn-primary btn-lg">
          <Plus size={20} />
          Create Tournament
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="card mb-8">
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search tournaments..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="registration">Registration Open</option>
              <option value="completed">Completed</option>
            </select>

            {/* Sort By */}
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="players">Sort by Players</option>
              <option value="prize">Sort by Prize Pool</option>
            </select>

            {/* Results Count */}
            <div className="flex items-center text-gray-600">
              <Filter size={16} className="mr-2" />
              {filteredTournaments.length} tournament{filteredTournaments.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Tournaments Grid */}
      {filteredTournaments.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTournaments.map((tournament, index) => (
            <div 
              key={tournament.id} 
              className="tournament-card animate-slide-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="tournament-header">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="tournament-title">{tournament.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{tournament.description}</p>
                    
                    <div className="tournament-meta">
                      <div className="tournament-meta-item">
                        <Calendar size={16} />
                        {formatDate(tournament.startDate)}
                      </div>
                      <div className="tournament-meta-item">
                        <MapPin size={16} />
                        {tournament.location}
                      </div>
                      <div className="tournament-meta-item">
                        <Users size={16} />
                        {tournament.currentPlayers}/{tournament.maxPlayers} players
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <span className={`badge ${getStatusBadge(tournament.status).class}`}>
                      {getStatusBadge(tournament.status).text}
                    </span>
                    <button className="btn btn-outline btn-sm">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Registration Progress</span>
                    <span>{getProgressPercentage(tournament.currentPlayers, tournament.maxPlayers)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage(tournament.currentPlayers, tournament.maxPlayers)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="tournament-content">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <DollarSign size={20} className="mx-auto text-gray-600 mb-1" />
                    <div className="font-semibold text-gray-900">${tournament.entryFee}</div>
                    <div className="text-xs text-gray-600">Entry Fee</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Trophy size={20} className="mx-auto text-gray-600 mb-1" />
                    <div className="font-semibold text-gray-900">${tournament.prizePool.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">Prize Pool</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>Format: <strong>{tournament.format}</strong></span>
                  <span>by {tournament.organizer}</span>
                </div>

                {tournament.winner && (
                  <div className="bg-success-50 border border-success-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2 text-success-700">
                      <Trophy size={16} />
                      <span className="font-medium">Winner: {tournament.winner}</span>
                    </div>
                  </div>
                )}

                <div className="tournament-actions">
                  <Link 
                    to={`/tournaments/${tournament.id}`} 
                    className="btn btn-primary flex-1"
                  >
                    <Eye size={16} />
                    View Details
                  </Link>
                  
                  {tournament.status === 'registration' || tournament.status === 'upcoming' ? (
                    <button className="btn btn-success">
                      <Plus size={16} />
                      Join
                    </button>
                  ) : null}
                  
                  <button className="btn btn-outline">
                    <Edit size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Trophy className="empty-state-icon" />
          <h3 className="empty-state-title">No tournaments found</h3>
          <p className="empty-state-description">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Be the first to create a tournament!'
            }
          </p>
          <Link to="/tournaments/create" className="btn btn-primary">
            <Plus size={16} />
            Create Tournament
          </Link>
        </div>
      )}
    </div>
  );
};

export default Tournaments;