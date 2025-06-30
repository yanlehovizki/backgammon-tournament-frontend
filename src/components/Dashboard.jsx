import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Trophy, 
  Users, 
  Calendar, 
  TrendingUp,
  Plus,
  Clock,
  Award,
  Target,
  ArrowRight,
  Activity
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTournaments: 0,
    activeTournaments: 0,
    totalPlayers: 0,
    completedMatches: 0
  });
  
  const [recentTournaments, setRecentTournaments] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Simulate API calls with mock data
      setTimeout(() => {
        setStats({
          totalTournaments: 24,
          activeTournaments: 8,
          totalPlayers: 156,
          completedMatches: 89
        });

        setRecentTournaments([
          {
            id: 1,
            name: "Spring Championship 2025",
            status: "active",
            players: 32,
            startDate: "2025-06-25",
            prize: "$5,000"
          },
          {
            id: 2,
            name: "Weekly Tournament #12",
            status: "completed",
            players: 16,
            startDate: "2025-06-20",
            winner: "Alex Johnson"
          },
          {
            id: 3,
            name: "Beginner's Cup",
            status: "upcoming",
            players: 24,
            startDate: "2025-07-01",
            prize: "$1,000"
          }
        ]);

        setUpcomingMatches([
          {
            id: 1,
            tournament: "Spring Championship 2025",
            player1: "John Doe",
            player2: "Jane Smith",
            time: "14:30",
            round: "Quarter Final"
          },
          {
            id: 2,
            tournament: "Weekly Tournament #13",
            player1: "Mike Wilson",
            player2: "Sarah Davis",
            time: "16:00",
            round: "Semi Final"
          }
        ]);

        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Tournaments",
      value: stats.totalTournaments,
      icon: Trophy,
      color: "primary",
      change: "+12%"
    },
    {
      title: "Active Tournaments",
      value: stats.activeTournaments,
      icon: Activity,
      color: "success",
      change: "+5%"
    },
    {
      title: "Total Players",
      value: stats.totalPlayers,
      icon: Users,
      color: "warning",
      change: "+18%"
    },
    {
      title: "Completed Matches",
      value: stats.completedMatches,
      icon: Target,
      color: "error",
      change: "+23%"
    }
  ];

  const getStatusBadge = (status) => {
    const badges = {
      active: "badge-success",
      completed: "badge-primary",
      upcoming: "badge-warning"
    };
    return badges[status] || "badge-outline";
  };

  const getStatusText = (status) => {
    const texts = {
      active: "Active",
      completed: "Completed",
      upcoming: "Upcoming"
    };
    return texts[status] || status;
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="loading">
          <div className="spinner"></div>
          <p className="ml-3">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Here's what's happening with your tournaments today.
          </p>
        </div>
        <Link to="/tournaments" className="btn btn-primary btn-lg">
          <Plus size={20} />
          Create Tournament
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="stat-icon">
              <stat.icon size={24} />
            </div>
            <div className="stat-number">{stat.value}</div>
            <div className="stat-label">{stat.title}</div>
            <div className="text-xs text-success-600 font-medium mt-2">
              {stat.change} from last month
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Tournaments */}
        <div className="card">
          <div className="card-header">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="card-title">
                  <Calendar size={20} />
                  Recent Tournaments
                </h3>
                <p className="card-description">
                  Latest tournament activity and results
                </p>
              </div>
              <Link to="/tournaments" className="btn btn-outline btn-sm">
                View All
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <div className="card-content">
            {recentTournaments.length > 0 ? (
              <div className="space-y-4">
                {recentTournaments.map((tournament) => (
                  <div key={tournament.id} className="tournament-card">
                    <div className="tournament-header">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="tournament-title">{tournament.name}</h4>
                          <div className="tournament-meta">
                            <div className="tournament-meta-item">
                              <Users size={16} />
                              {tournament.players} players
                            </div>
                            <div className="tournament-meta-item">
                              <Clock size={16} />
                              {new Date(tournament.startDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <span className={`badge ${getStatusBadge(tournament.status)}`}>
                          {getStatusText(tournament.status)}
                        </span>
                      </div>
                    </div>
                    <div className="tournament-content">
                      {tournament.status === 'completed' && tournament.winner && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Award size={16} />
                          Winner: <span className="font-medium">{tournament.winner}</span>
                        </div>
                      )}
                      {tournament.prize && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Trophy size={16} />
                          Prize: <span className="font-medium">{tournament.prize}</span>
                        </div>
                      )}
                      <div className="tournament-actions">
                        <Link 
                          to={`/tournaments/${tournament.id}`} 
                          className="btn btn-primary btn-sm"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Calendar className="empty-state-icon" />
                <h3 className="empty-state-title">No tournaments yet</h3>
                <p className="empty-state-description">
                  Create your first tournament to get started
                </p>
                <Link to="/tournaments" className="btn btn-primary">
                  <Plus size={16} />
                  Create Tournament
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Matches */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Clock size={20} />
                Upcoming Matches
              </h3>
              <p className="card-description">
                Matches scheduled for today
              </p>
            </div>
          </div>
          <div className="card-content">
            {upcomingMatches.length > 0 ? (
              <div className="space-y-4">
                {upcomingMatches.map((match) => (
                  <div key={match.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{match.tournament}</h4>
                        <p className="text-sm text-gray-600">{match.round}</p>
                      </div>
                      <span className="badge badge-primary">{match.time}</span>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                      <div className="text-center">
                        <div className="font-medium text-gray-900">{match.player1}</div>
                      </div>
                      <div className="text-gray-400 font-bold">VS</div>
                      <div className="text-center">
                        <div className="font-medium text-gray-900">{match.player2}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Clock className="empty-state-icon" />
                <h3 className="empty-state-title">No matches today</h3>
                <p className="empty-state-description">
                  Check back later for upcoming matches
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <TrendingUp size={20} />
              Quick Actions
            </h3>
            <p className="card-description">
              Common tasks and shortcuts
            </p>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/tournaments" className="btn btn-outline btn-lg w-full">
                <Plus size={20} />
                Create Tournament
              </Link>
              <Link to="/tournaments" className="btn btn-outline btn-lg w-full">
                <Users size={20} />
                Manage Players
              </Link>
              <Link to="/profile" className="btn btn-outline btn-lg w-full">
                <Award size={20} />
                View Statistics
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;