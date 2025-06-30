import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft,
  Edit3,
  Users,
  Calendar,
  MapPin,
  DollarSign,
  Trophy,
  Clock,
  Settings,
  Share2,
  Download,
  Star,
  Target,
  Zap,
  Award,
  Eye,
  UserPlus,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import EditTournamentModal from './EditTournamentModal';

const TournamentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Sample tournament data - replace with your API call
  useEffect(() => {
    const fetchTournament = async () => {
      try {
        setLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Sample data - replace with actual API call
        const sampleTournament = {
          id: parseInt(id),
          name: 'Spring Championship 2025',
          description: 'Annual spring tournament featuring the best players from around the region. This tournament brings together competitive players for an exciting day of matches with substantial prizes.',
          format: 'single-elimination',
          status: 'upcoming',
          startDate: '2025-07-15T10:00:00Z',
          endDate: '2025-07-15T18:00:00Z',
          registrationDeadline: '2025-07-10T23:59:59Z',
          location: 'New York, NY',
          venue: 'Madison Square Garden',
          address: '4 Pennsylvania Plaza, New York, NY 10001',
          maxPlayers: 32,
          currentPlayers: 24,
          entryFee: 50,
          prizePool: 1500,
          category: 'professional',
          allowRegistration: true,
          requireApproval: false,
          isPrivate: false,
          rules: `Tournament Rules:
1. All matches are best of 3 games
2. Standard time control: 45 minutes per match
3. Players must arrive 15 minutes before their scheduled match
4. No coaching during matches
5. Electronic devices must be turned off
6. Disputes will be resolved by tournament officials
7. Unsportsmanlike conduct will result in disqualification
8. Prize distribution: 1st place 50%, 2nd place 30%, 3rd place 20%`,
          gameSettings: {
            matchDuration: 45,
            pointsToWin: 21,
            timeControl: 'standard'
          },
          players: [
            { id: 1, name: 'John Doe', email: 'john@example.com', rank: 'Gold', seed: 1, status: 'confirmed' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', rank: 'Silver', seed: 2, status: 'confirmed' },
            { id: 3, name: 'Mike Johnson', email: 'mike@example.com', rank: 'Gold', seed: 3, status: 'confirmed' },
            { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', rank: 'Bronze', seed: 4, status: 'pending' },
            { id: 5, name: 'David Brown', email: 'david@example.com', rank: 'Silver', seed: 5, status: 'confirmed' },
            { id: 6, name: 'Lisa Davis', email: 'lisa@example.com', rank: 'Gold', seed: 6, status: 'confirmed' }
          ],
          organizer: 'Tournament Admin',
          organizerEmail: 'admin@tournament.com',
          createdAt: '2025-06-01T12:00:00Z',
          updatedAt: '2025-06-15T14:30:00Z',
          banner: null,
          logo: null,
          matches: [
            {
              id: 1,
              round: 'Round 1',
              player1: 'John Doe',
              player2: 'Jane Smith',
              status: 'scheduled',
              scheduledTime: '2025-07-15T10:00:00Z',
              result: null
            },
            {
              id: 2,
              round: 'Round 1',
              player1: 'Mike Johnson',
              player2: 'Sarah Wilson',
              status: 'scheduled',
              scheduledTime: '2025-07-15T10:30:00Z',
              result: null
            }
          ]
        };
        
        setTournament(sampleTournament);
      } catch (error) {
        console.error('Error fetching tournament:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [id]);

  const handleUpdateTournament = (updatedTournament) => {
    setTournament(updatedTournament);
  };

  const getStatusBadge = (status) => {
    const badges = {
      upcoming: { class: 'badge badge-outline', icon: Clock },
      active: { class: 'badge badge-primary', icon: Play },
      completed: { class: 'badge badge-success', icon: CheckCircle },
      cancelled: { class: 'badge badge-error', icon: AlertCircle }
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

  const getFormatName = (format) => {
    const names = {
      'single-elimination': 'Single Elimination',
      'double-elimination': 'Double Elimination',
      'round-robin': 'Round Robin',
      'swiss-system': 'Swiss System'
    };
    return names[format] || format;
  };

  const getRankColor = (rank) => {
    const colors = {
      'Bronze': 'text-orange-600 bg-orange-100',
      'Silver': 'text-gray-600 bg-gray-100',
      'Gold': 'text-yellow-600 bg-yellow-100',
      'Platinum': 'text-blue-600 bg-blue-100',
      'Diamond': 'text-purple-600 bg-purple-100',
      'Unranked': 'text-gray-500 bg-gray-50'
    };
    return colors[rank] || colors.Unranked;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const calculatePrizeDistribution = () => {
    if (!tournament?.prizePool || tournament.prizePool <= 0) return [];
    
    return [
      { place: '1st', amount: Math.round(tournament.prizePool * 0.5), percentage: 50 },
      { place: '2nd', amount: Math.round(tournament.prizePool * 0.3), percentage: 30 },
      { place: '3rd', amount: Math.round(tournament.prizePool * 0.2), percentage: 20 }
    ];
  };

  const isRegistrationOpen = tournament?.status === 'upcoming' && 
                            tournament?.allowRegistration && 
                            tournament?.currentPlayers < tournament?.maxPlayers;

  const canEdit = tournament?.status !== 'completed';

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center py-12">
          <div className="spinner w-8 h-8 border-4"></div>
          <span className="ml-3 text-gray-600">Loading tournament...</span>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <Trophy size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tournament not found</h2>
          <p className="text-gray-600 mb-6">The tournament you're looking for doesn't exist or has been removed.</p>
          <Link to="/tournaments" className="btn btn-primary">
            <ArrowLeft size={16} />
            Back to Tournaments
          </Link>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(tournament.status);
  const FormatIcon = getFormatIcon(tournament.format);
  const StatusIcon = statusBadge.icon;

  return (
    <div className="container py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/tournaments')}
          className="btn btn-outline"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{tournament.name}</h1>
            <span className={statusBadge.class}>
              <StatusIcon size={14} />
              {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
            </span>
          </div>
          <p className="text-gray-600">{tournament.description}</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline">
            <Share2 size={16} />
            Share
          </button>
          {canEdit && (
            <button
              onClick={() => setShowEditModal(true)}
              className="btn btn-outline"
            >
              <Edit3 size={16} />
              Edit
            </button>
          )}
          {isRegistrationOpen && (
            <button className="btn btn-primary">
              <UserPlus size={16} />
              Join Tournament
            </button>
          )}
        </div>
      </div>

      {/* Tournament Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Format</p>
                <p className="text-lg font-semibold text-gray-900">{getFormatName(tournament.format)}</p>
              </div>
              <FormatIcon className="text-primary-500" size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Players</p>
                <p className="text-lg font-semibold text-gray-900">
                  {tournament.currentPlayers}/{tournament.maxPlayers}
                </p>
                <div className="progress-bar mt-2">
                  <div 
                    className="progress-fill"
                    style={{ width: `${(tournament.currentPlayers / tournament.maxPlayers) * 100}%` }}
                  ></div>
                </div>
              </div>
              <Users className="text-blue-500" size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Prize Pool</p>
                <p className="text-lg font-semibold text-gray-900">${tournament.prizePool.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Entry: ${tournament.entryFee}</p>
              </div>
              <DollarSign className="text-green-500" size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="text-lg font-semibold text-gray-900">{formatDate(tournament.startDate)}</p>
                <p className="text-sm text-gray-500">{formatTime(tournament.startDate)}</p>
              </div>
              <Calendar className="text-purple-500" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: Eye },
              { id: 'players', label: 'Players', icon: Users },
              { id: 'schedule', label: 'Schedule', icon: Calendar },
              { id: 'rules', label: 'Rules', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tournament Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tournament Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <MapPin size={16} className="text-gray-400" />
                      <div>
                        <p className="font-medium">{tournament.location}</p>
                        {tournament.venue && <p className="text-sm text-gray-600">{tournament.venue}</p>}
                        {tournament.address && <p className="text-sm text-gray-500">{tournament.address}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-gray-400" />
                      <div>
                        <p className="font-medium">Start: {formatDateTime(tournament.startDate)}</p>
                        {tournament.endDate && (
                          <p className="text-sm text-gray-600">End: {formatDateTime(tournament.endDate)}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock size={16} className="text-gray-400" />
                      <div>
                        <p className="font-medium">Registration Deadline</p>
                        <p className="text-sm text-gray-600">{formatDateTime(tournament.registrationDeadline)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Trophy size={16} className="text-gray-400" />
                      <div>
                        <p className="font-medium">Organizer</p>
                        <p className="text-sm text-gray-600">{tournament.organizer}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Prize Distribution */}
                {tournament.prizePool > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Prize Distribution</h3>
                    <div className="space-y-3">
                      {calculatePrizeDistribution().map((prize, index) => (
                        <div key={prize.place} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              index === 0 ? 'bg-yellow-500 text-white' :
                              index === 1 ? 'bg-gray-400 text-white' :
                              'bg-orange-500 text-white'
                            }`}>
                              {index + 1}
                            </div>
                            <span className="font-medium">{prize.place} Place</span>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">${prize.amount}</p>
                            <p className="text-sm text-gray-600">{prize.percentage}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Game Settings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Game Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Match Duration</p>
                    <p className="text-lg font-semibold">{tournament.gameSettings.matchDuration} minutes</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Points to Win</p>
                    <p className="text-lg font-semibold">{tournament.gameSettings.pointsToWin}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Time Control</p>
                    <p className="text-lg font-semibold capitalize">{tournament.gameSettings.timeControl}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Players Tab */}
          {activeTab === 'players' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Registered Players ({tournament.players.length}/{tournament.maxPlayers})
                </h3>
                {isRegistrationOpen && (
                  <button className="btn btn-primary">
                    <UserPlus size={16} />
                    Join Tournament
                  </button>
                )}
              </div>

              {tournament.players.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tournament.players.map((player, index) => (
                    <div key={player.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                            {player.seed}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{player.name}</h4>
                            <p className="text-sm text-gray-600">{player.email}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getRankColor(player.rank)}`}>
                          {player.rank}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Seed #{player.seed}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          player.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {player.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users size={48} className="mx-auto text-gray-300 mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No players registered yet</h4>
                  <p className="text-gray-600">Be the first to join this tournament!</p>
                </div>
              )}
            </div>
          )}

          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Tournament Schedule</h3>
              
              {tournament.matches && tournament.matches.length > 0 ? (
                <div className="space-y-4">
                  {tournament.matches.map((match) => (
                    <div key={match.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">{match.round}</h4>
                          <p className="text-gray-600">{match.player1} vs {match.player2}</p>
                          <p className="text-sm text-gray-500">
                            {formatDateTime(match.scheduledTime)}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded text-sm font-medium ${
                          match.status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : match.status === 'active'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {match.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Schedule not available</h4>
                  <p className="text-gray-600">
                    {tournament.status === 'upcoming' 
                      ? 'The tournament schedule will be generated once registration closes.'
                      : 'No matches scheduled for this tournament.'
                    }
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Rules Tab */}
          {activeTab === 'rules' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Tournament Rules</h3>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Info size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Important Information</h4>
                    <p className="text-sm text-blue-800">
                      Please read all rules carefully before participating. Violation of any rule may result in disqualification.
                    </p>
                  </div>
                </div>
              </div>

              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed">
                  {tournament.rules}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Tournament Modal */}
      <EditTournamentModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        tournament={tournament}
        onTournamentUpdated={handleUpdateTournament}
      />
    </div>
  );
};

export default TournamentDetail;