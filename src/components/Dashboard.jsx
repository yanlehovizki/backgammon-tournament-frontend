import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus,
  Trophy,
  Users,
  Calendar,
  TrendingUp,
  Award,
  Clock,
  MapPin,
  DollarSign,
  Star,
  Target,
  Zap,
  Eye,
  ArrowRight,
  Activity,
  BarChart3,
  Search,
  Filter
} from 'lucide-react';
import CreateTournamentModal from './CreateTournamentModal';

const Dashboard = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [tournaments, setTournaments] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sample data - replace with your API calls
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Sample tournaments data
        const sampleTournaments = [
          {
            id: 1,
            name: 'Spring Championship 2025',
            status: 'upcoming',
            startDate: '2025-07-15T10:00:00Z',
            location: 'New York, NY',
            currentPlayers: 24,
            maxPlayers: 32,
            prizePool: 1500,
            format: 'single-elimination',
            organizer: 'Tournament Pro',
            description: 'Annual spring championship featuring top players from around the region.'
          },
          {
            id: 2,
            name: 'Beginner Friendly Cup',
            status: 'active',
            startDate: '2025-07-01T14:00:00Z',
            location: 'Online',
            currentPlayers: 16,
            maxPlayers: 16,
            prizePool: 0,
            format: 'round-robin',
            organizer: 'Community League',
            description: 'Perfect for new players looking to get competitive experience.'
          },
          {
            id: 3,
            name: 'Elite Masters Tournament',
            status: 'completed',
            startDate: '2025-06-20T09:00:00Z',
            location: 'Los Angeles, CA',
            currentPlayers: 8,
            maxPlayers: 8,
            prizePool: 800,
            format: 'double-elimination',
            organizer: 'Elite Gaming',
            description: 'High-stakes tournament for experienced players only.'
          },
          {
            id: 4,
            name: 'Weekly Challenge #47',
            status: 'upcoming',
            startDate: '2025-07-08T18:00:00Z',
            location: 'Chicago, IL',
            currentPlayers: 12,
            maxPlayers: 20,
            prizePool: 200,
            format: 'swiss-system',
            organizer: 'Weekly Series',
            description: 'Regular weekly tournament with rotating formats.'
          }
        ];

        // Sample stats
        const sampleStats = {
          totalTournaments: sampleTournaments.length,
          activeTournaments: sampleTournaments.filter(t => t.status === 'active').length,
          upcomingTournaments: sampleTournaments.filter(t => t.status === 'upcoming').length,
          completedTournaments: sampleTournaments.filter(t => t.status === 'completed').length,
          totalPrizePool: sampleTournaments.reduce((sum, t) => sum + t.prizePool, 0),
          totalPlayers: sampleTournaments.reduce((sum, t) => sum + t.currentPlayers, 0)
        };

        setTournaments(sampleTournaments);
        setStats(sampleStats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleCreateTournament = (tournamentData) => {
    console.log('Creating tournament:', tournamentData);
    
    const newTournament = {
      ...tournamentData,
      id: Date.now(),
      status: 'upcoming',
      currentPlayers: tournamentData.players ? tournamentData.players.length : 0,
      createdAt: new Date().toISOString(),
      organizer: 'Current User'
    };
    
    setTournaments(prev => [newTournament, ...prev]);
    
    // Update stats
    setStats(prev => ({
      ...prev,
      totalTournaments: prev.totalTournaments + 1,
      upcomingTournaments: prev.upcomingTournaments + 1,
      totalPrizePool: prev.totalPrizePool + (newTournament.prizePool || 0),
      totalPlayers: prev.totalPlayers + newTournament.currentPlayers
    }));

    // Close modal
    setShowCreateModal(false);
  };

  const getStatusBadge = (status) => {
    const badges = {
      upcoming: { class: 'bg-blue-100 text-blue-800', label: 'Upcoming' },
      active: { class: 'bg-green-100 text-green-800', label: 'Active' },
      completed: { class: 'bg-gray-100 text-gray-800', label: 'Completed' }
    };
    return badges[status] || badges.upcoming;
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredTournaments = tournaments.filter(tournament => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tournament.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tournament.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tournament Dashboard</h1>
            <p className="text-gray-600">Manage and track your tournaments</p>
          </div>
          <button
            onClick={() => {
              console.log('Create Tournament button clicked');
              setShowCreateModal(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Tournament
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Trophy className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Tournaments</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalTournaments}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Activity className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Now</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.activeTournaments}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Players</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalPlayers}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Prize Pool</dt>
                    <dd className="text-lg font-medium text-gray-900">${stats.totalPrizePool?.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search tournaments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tournaments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.length > 0 ? (
            filteredTournaments.map((tournament) => {
              const FormatIcon = getFormatIcon(tournament.format);
              const statusBadge = getStatusBadge(tournament.status);
              
              return (
                <div key={tournament.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                  <div className="px-6 py-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <FormatIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {tournament.name}
                          </h3>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.class}`}>
                        {statusBadge.label}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {tournament.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(tournament.startDate)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-2" />
                        {tournament.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-2" />
                        {tournament.currentPlayers}/{tournament.maxPlayers} players
                      </div>
                      {tournament.prizePool > 0 && (
                        <div className="flex items-center text-sm text-gray-500">
                          <DollarSign className="h-4 w-4 mr-2" />
                          ${tournament.prizePool.toLocaleString()} prize pool
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        by {tournament.organizer}
                      </div>
                      <Link
                        to={`/tournaments/${tournament.id}`}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </div>
                  </div>
                  
                  {/* Progress bar for player capacity */}
                  <div className="bg-gray-50 px-6 py-3">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>Registration</span>
                      <span>{Math.round((tournament.currentPlayers / tournament.maxPlayers) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(tournament.currentPlayers / tournament.maxPlayers) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full">
              <div className="text-center py-12">
                <Trophy className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No tournaments found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Get started by creating your first tournament.'
                  }
                </p>
                {(!searchTerm && statusFilter === 'all') && (
                  <div className="mt-6">
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Tournament
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Create Tournament Modal */}
        {showCreateModal && (
          <CreateTournamentModal
            isOpen={showCreateModal}
            onClose={() => {
              console.log('Closing modal');
              setShowCreateModal(false);
            }}
            onTournamentCreated={handleCreateTournament}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;