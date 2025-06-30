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
  BarChart3
} from 'lucide-react';
import CreateTournamentModal from './CreateTournamentModal';

const Dashboard = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [tournaments, setTournaments] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

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
            format: 'single-elimination'
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
            format: 'round-robin'
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
            format: 'double-elimination'
          }
        ];

        // Sample stats
        const sampleStats = {
          totalTournaments: sampleTournaments.length,
          activeTournaments: sampleTournaments.filter(t => t.status === 'active').length,
          upcomingTournaments: sampleTournaments.filter(t => t.status === 'upcoming').length,
          completedTournaments: sampleTournaments.filter(t => t.status === 'completed').length,
          totalPrizePool: sampleTournaments.reduce((sum, t) => sum + t.prizePool, 0),
          totalPlayers: sampleTournaments.reduce((sum, t) => sum + t.currentPlayers, 0),
          averageParticipation: Math.round(
            (sampleTournaments.reduce((sum, t) => sum + (t.currentPlayers / t.maxPlayers), 0) / sampleTournaments.length) * 100
          ),
          monthlyGrowth: 15.3
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
    const newTournament = {
      ...tournamentData,
      id: Date.now(),
      status: 'upcoming',
      currentPlayers: tournamentData.players.length,
      createdAt: new Date().toISOString()
    };
    
    setTournaments(prev => [newTournament, ...prev]);
    
    // Update stats
    setStats(prev => ({
      ...prev,
      totalTournaments: prev.totalTournaments + 1,
      upcomingTournaments: prev.upcomingTournaments + 1,
      totalPrizePool: prev.totalPrizePool + newTournament.prizePool,
      totalPlayers: prev.totalPlayers + newTournament.currentPlayers
    }));
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center py-12">
          <div className="spinner w-8 h-8 border-4"></div>
          <span className="ml-3 text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your tournaments.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
        >
          <Plus size={20} />
          Create Tournament
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tournaments</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalTournaments}</p>
                <p className="text-sm text-success-600 flex items-center gap-1 mt-1">
                  <TrendingUp size={14} />
                  +{stats.monthlyGrowth}% this month
                </p>
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
                <p className="text-3xl font-bold text-gray-900">{stats.activeTournaments}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {stats.upcomingTournaments} upcoming
                </p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <Activity className="text-success-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Players</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalPlayers}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {stats.averageParticipation}% avg participation
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Prize Pool</p>
                <p className="text-3xl font-bold text-gray-900">${stats.totalPrizePool?.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Across all tournaments
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
            <p className="card-description">Common tournament management tasks</p>
          </div>
          <div className="card-content space-y-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full btn btn-primary"
            >
              <Plus size={16} />
              Create New Tournament
            </button>
            <Link to="/tournaments" className="w-full btn btn-outline">
              <Trophy size={16} />
              View All Tournaments
            </Link>
            <Link to="/profile" className="w-full btn btn-outline">
              <Users size={16} />
              Manage Profile
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Tournament Status</h3>
            <p className="card-description">Current tournament breakdown</p>
          </div>
          <div className="card-content space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                <span className="text-sm">Active</span>
              </div>
              <span className="font-semibold">{stats.activeTournaments}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
                <span className="text-sm">Upcoming</span>
              </div>
              <span className="font-semibold">{stats.upcomingTournaments}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                <span className="text-sm">Completed</span>
              </div>
              <span className="font-semibold">{stats.completedTournaments}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Performance</h3>
            <p className="card-description">Tournament metrics</p>
          </div>
          <div className="card-content space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Average Participation</span>
                <span>{stats.averageParticipation}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${stats.averageParticipation}%` }}
                ></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Monthly Growth</span>
              <span className="text-success-600 font-semibold">+{stats.monthlyGrowth}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Revenue</span>
              <span className="font-semibold">${stats.totalPrizePool?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tournaments */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="card-title">Recent Tournaments</h3>
              <p className="card-description">Your latest tournament activity</p>
            </div>
            <Link to="/tournaments" className="btn btn-outline btn-sm">
              View All
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <div className="card-content">
          {tournaments.length > 0 ? (
            <div className="space-y-4">
              {tournaments.slice(0, 5).map((tournament) => {
                const FormatIcon = getFormatIcon(tournament.format);
                
                return (
                  <div key={tournament.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <FormatIcon className="text-primary-600" size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{tournament.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            {formatDate(tournament.startDate)}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            {tournament.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users size={14} />
                            {tournament.currentPlayers}/{tournament.maxPlayers}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={getStatusBadge(tournament.status)}>
                        {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                      </span>
                      <Link
                        to={`/tournaments/${tournament.id}`}
                        className="btn btn-outline btn-sm"
                      >
                        <Eye size={16} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy size={48} className="mx-auto text-gray-300 mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No tournaments yet</h4>
              <p className="text-gray-600 mb-4">Create your first tournament to get started!</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary"
              >
                <Plus size={16} />
                Create Tournament
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Tournament Modal */}
      <CreateTournamentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onTournamentCreated={handleCreateTournament}
      />
    </div>
  );
};

export default Dashboard;