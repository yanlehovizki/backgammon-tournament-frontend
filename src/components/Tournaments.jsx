import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus,
  Search,
  Filter,
  Calendar,
  MapPin,
  Users,
  Trophy,
  DollarSign,
  Clock,
  Edit3,
  Eye,
  MoreVertical,
  Star,
  TrendingUp,
  Award,
  Target,
  Zap
} from 'lucide-react';
import CreateTournamentModal from './CreateTournamentModal';
import EditTournamentModal from './EditTournamentModal';

const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterFormat, setFilterFormat] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);

  // Sample tournament data - replace with your API call
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Sample data - replace with actual API call
        const sampleTournaments = [
          {
            id: 1,
            name: 'Spring Championship 2025',
            description: 'Annual spring tournament featuring the best players from around the region.',
            format: 'single-elimination',
            status: 'upcoming',
            startDate: '2025-07-15T10:00:00Z',
            endDate: '2025-07-15T18:00:00Z',
            registrationDeadline: '2025-07-10T23:59:59Z',
            location: 'New York, NY',
            venue: 'Madison Square Garden',
            maxPlayers: 32,
            currentPlayers: 24,
            entryFee: 50,
            prizePool: 1500,
            category: 'professional',
            allowRegistration: true,
            requireApproval: false,
            isPrivate: false,
            rules: 'Standard tournament rules apply. All matches are best of 3.',
            gameSettings: {
              matchDuration: 45,
              pointsToWin: 21,
              timeControl: 'standard'
            },
            players: [
              { id: 1, name: 'John Doe', email: 'john@example.com', rank: 'Gold', seed: 1 },
              { id: 2, name: 'Jane Smith', email: 'jane@example.com', rank: 'Silver', seed: 2 }
            ],
            organizer: 'Tournament Admin',
            createdAt: '2025-06-01T12:00:00Z'
          },
          {
            id: 2,
            name: 'Beginner Friendly Cup',
            description: 'Perfect tournament for new players to get started in competitive play.',
            format: 'round-robin',
            status: 'active',
            startDate: '2025-07-01T14:00:00Z',
            endDate: '2025-07-01T20:00:00Z',
            registrationDeadline: '2025-06-28T23:59:59Z',
            location: 'Online',
            venue: 'Virtual Arena',
            maxPlayers: 16,
            currentPlayers: 16,
            entryFee: 0,
            prizePool: 0,
            category: 'beginner',
            allowRegistration: false,
            requireApproval: true,
            isPrivate: false,
            rules: 'Beginner-friendly rules with extended time limits.',
            gameSettings: {
              matchDuration: 30,
              pointsToWin: 15,
              timeControl: 'extended'
            },
            players: [],
            organizer: 'Community Manager',
            createdAt: '2025-05-15T12:00:00Z'
          },
          {
            id: 3,
            name: 'Elite Masters Tournament',
            description: 'Invitation-only tournament for the highest ranked players.',
            format: 'double-elimination',
            status: 'completed',
            startDate: '2025-06-20T09:00:00Z',
            endDate: '2025-06-20T17:00:00Z',
            registrationDeadline: '2025-06-15T23:59:59Z',
            location: 'Los Angeles, CA',
            venue: 'Convention Center',
            maxPlayers: 8,
            currentPlayers: 8,
            entryFee: 100,
            prizePool: 800,
            category: 'professional',
            allowRegistration: false,
            requireApproval: true,
            isPrivate: true,
            rules: 'Elite level tournament with strict time controls.',
            gameSettings: {
              matchDuration: 60,
              pointsToWin: 25,
              timeControl: 'blitz'
            },
            players: [],
            organizer: 'Pro League',
            createdAt: '2025-05-01T12:00:00Z'
          }
        ];
        
        setTournaments(sampleTournaments);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  const handleCreateTournament = (tournamentData) => {
    const newTournament = {
      ...tournamentData,
      id: Date.now(),
      status: 'upcoming',
      currentPlayers: tournamentData.players.length,
      organizer: 'Current User', // Replace with actual user
      createdAt: new Date().toISOString()
    };
    
    setTournaments(prev => [newTournament, ...prev]);
  };

  const handleUpdateTournament = (updatedTournament) => {
    setTournaments(prev => 
      prev.map(t => t.id === updatedTournament.id ? {
        ...updatedTournament,
        currentPlayers: updatedTournament.players.length
      } : t)
    );
  };

  const openEditModal = (tournament) => {
    setSelectedTournament(tournament);
    setShowEditModal(true);
  };

  const getStatusBadge = (status) => {
    const badges = {
      upcoming: 'badge badge-outline',
      active: 'badge badge-primary',
      completed: 'badge badge-success'
    };
    return badges[status] || 'badge badge-outline';
  };

  const getFormatIcon = (format) => {
    const icons = {
      'single-elimination': Target,
      'double-elimination': Zap,
      'round-robin': Award,
      'swiss-system': Star
    };
    return icons[format] || Target;
  };

  const getFormatName = (format) => {
    const names = {
      'single-elimination': 'Single Elimination',
      'double-elimination': 'Double Elimination',
      'round-robin': 'Round Robin',
      'swiss-system': 'Swiss System'
    };
    return names[format] || format;
  };

  const filteredTournaments = tournaments.filter(tournament => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tournament.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || tournament.status === filterStatus;
    const matchesFormat = filterFormat === 'all' || tournament.format === filterFormat;
    
    return matchesSearch && matchesStatus && matchesFormat;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center py-12">
          <div className="spinner w-8 h-8 border-4"></div>
          <span className="ml-3 text-gray-600">Loading tournaments...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Tournaments</h1>
          <p className="text-gray-600">Discover and join exciting tournaments</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
        >
          <Plus size={20} />
          Create Tournament
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tournaments</p>
                <p className="text-2xl font-bold text-gray-900">{tournaments.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Trophy className="text-primary-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Now</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tournaments.filter(t => t.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-success-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tournaments.filter(t => t.status === 'upcoming').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                <Calendar className="text-warning-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Prize Pool</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${tournaments.reduce((sum, t) => sum + t.prizePool, 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-8">
        <div className="card-content">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search tournaments..."
                  className="form-input pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="md:w-48">
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Format Filter */}
            <div className="md:w-48">
              <select
                className="form-select"
                value={filterFormat}
                onChange={(e) => setFilterFormat(e.target.value)}
              >
                <option value="all">All Formats</option>
                <option value="single-elimination">Single Elimination</option>
                <option value="double-elimination">Double Elimination</option>
                <option value="round-robin">Round Robin</option>
                <option value="swiss-system">Swiss System</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tournament Grid */}
      {filteredTournaments.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTournaments.map((tournament) => {
            const FormatIcon = getFormatIcon(tournament.format);
            const isRegistrationOpen = tournament.status === 'upcoming' && 
                                     tournament.allowRegistration && 
                                     tournament.currentPlayers < tournament.maxPlayers;
            
            return (
              <div key={tournament.id} className="card hover:shadow-lg transition-shadow">
                <div className="card-header">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="card-title">{tournament.name}</h3>
                      <p className="card-description line-clamp-2">{tournament.description}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className={getStatusBadge(tournament.status)}>
                        {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                      </span>
                      <div className="relative">
                        <button className="btn btn-outline btn-sm">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-content space-y-4">
                  {/* Tournament Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <FormatIcon size={16} className="text-gray-400" />
                      <span>{getFormatName(tournament.format)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-gray-400" />
                      <span>{tournament.currentPlayers}/{tournament.maxPlayers}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400" />
                      <span className="truncate">{tournament.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-gray-400" />
                      <span>${tournament.prizePool}</span>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={16} className="text-gray-400" />
                      <span>{formatDate(tournament.startDate)} at {formatTime(tournament.startDate)}</span>
                    </div>
                    {tournament.venue && (
                      <div className="text-sm text-gray-600 mt-1">
                        {tournament.venue}
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Registration</span>
                      <span>{tournament.currentPlayers}/{tournament.maxPlayers}</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${(tournament.currentPlayers / tournament.maxPlayers) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Link
                      to={`/tournaments/${tournament.id}`}
                      className="btn btn-outline flex-1"
                    >
                      <Eye size={16} />
                      View Details
                    </Link>
                    
                    {tournament.status !== 'completed' && (
                      <button
                        onClick={() => openEditModal(tournament)}
                        className="btn btn-outline"
                      >
                        <Edit3 size={16} />
                      </button>
                    )}
                    
                    {isRegistrationOpen && (
                      <button className="btn btn-primary">
                        Join
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Trophy size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No tournaments found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterStatus !== 'all' || filterFormat !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Be the first to create a tournament!'
            }
          </p>
          {(!searchTerm && filterStatus === 'all' && filterFormat === 'all') && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary"
            >
              <Plus size={20} />
              Create Tournament
            </button>
          )}
        </div>
      )}

      {/* Create Tournament Modal */}
      <CreateTournamentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onTournamentCreated={handleCreateTournament}
      />

      {/* Edit Tournament Modal */}
      <EditTournamentModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedTournament(null);
        }}
        tournament={selectedTournament}
        onTournamentUpdated={handleUpdateTournament}
      />
    </div>
  );
};

export default Tournaments;