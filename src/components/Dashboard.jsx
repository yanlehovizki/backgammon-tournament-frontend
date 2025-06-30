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
      createdAt: new Date().toISOString()
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
      {/* Header - Original Style */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-primary">Dashboard</h1>
          <p className="text-secondary">Welcome back! Here's your tournament overview.</p>
        </div>
        <button
          onClick={() => {
            console.log('Create Tournament button clicked');
            setShowCreateModal(true);
          }}
          className="btn btn-primary"
        >
          <Plus size={20} />
          Create Tournament
        </button>
      </div>

      {/* Stats Grid - Original 4-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">Total Tournaments</p>
                <p className="text-2xl font-bold text-primary">{stats.totalTournaments}</p>
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
                <p className="text-sm text-secondary">Active Now</p>
                <p className="text-2xl font-bold text-primary">{stats.activeTournaments}</p>
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
                <p className="text-sm text-secondary">Total Players</p>
                <p className="text-2xl font-bold text-primary">{stats.totalPlayers}</p>
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
                <p className="text-sm text-secondary">Prize Pool</p>
                <p className="text-2xl font-bold text-primary">${stats.totalPrizePool?.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Original 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                {tournaments.slice(0, 3).map((tournament) => {
                  const FormatIcon = getFormatIcon(tournament.format);
                  
                  return (
                    <div key={tournament.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <FormatIcon className="text-primary-600" size={20} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-primary">{tournament.name}</h4>
                          <div className="flex items-center gap-3 text-sm text-secondary">
                            <div className="flex items-center gap-1">
                              <Calendar size={12} />
                              {formatDate(tournament.startDate)}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin size={12} />
                              {tournament.location}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={getStatusBadge(tournament.status)}>
                          {tournament.status}
                        </span>
                        <Link
                          to={`/tournaments/${tournament.id}`}
                          className="btn btn-outline btn-sm"
                        >
                          <Eye size={14} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Trophy size={48} className="mx-auto text-gray-300 mb-4" />
                <h4 className="text-lg font-semibold text-primary mb-2">No tournaments yet</h4>
                <p className="text-secondary mb-4">Create your first tournament to get started!</p>
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

        {/* Quick Actions */}
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
  );
};

export default Dashboard;