import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Trophy,
  Target,
  TrendingUp,
  Award,
  Settings,
  Camera,
  Edit3,
  Save,
  X,
  Eye,
  EyeOff,
  Lock,
  Bell,
  Globe,
  Shield,
  Download,
  Upload,
  Star,
  Medal,
  Crown,
  Zap,
  Activity,
  BarChart3,
  PieChart,
  Clock,
  Users,
  GamepadIcon,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const PlayerProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      // Simulate API call with comprehensive mock data
      setTimeout(() => {
        const mockUser = {
          id: 1,
          username: 'Alex Johnson',
          email: 'alex.johnson@email.com',
          phone: '+1 (555) 123-4567',
          location: 'New York, NY',
          joinDate: '2023-01-15',
          avatar: null,
          bio: 'Passionate tournament player with 5+ years of competitive experience. Always looking for new challenges and opportunities to improve.',
          
          // Statistics
          stats: {
            totalTournaments: 47,
            tournamentsWon: 12,
            totalMatches: 156,
            matchesWon: 98,
            winRate: 62.8,
            currentRank: 'Gold',
            rankPoints: 2847,
            longestWinStreak: 8,
            averageMatchDuration: '24 minutes'
          },
          
          // Recent tournaments
          recentTournaments: [
            {
              id: 1,
              name: 'Spring Championship 2025',
              date: '2025-06-25',
              placement: 2,
              prize: 1500,
              status: 'completed'
            },
            {
              id: 2,
              name: 'Weekly Tournament #12',
              date: '2025-06-20',
              placement: 1,
              prize: 500,
              status: 'completed'
            },
            {
              id: 3,
              name: 'Pro League Qualifier',
              date: '2025-06-15',
              placement: 4,
              prize: 200,
              status: 'completed'
            }
          ],
          
          // Achievements
          achievements: [
            {
              id: 1,
              title: 'Tournament Winner',
              description: 'Win your first tournament',
              icon: Trophy,
              earned: true,
              earnedDate: '2023-03-20'
            },
            {
              id: 2,
              title: 'Win Streak Master',
              description: 'Win 5 matches in a row',
              icon: Zap,
              earned: true,
              earnedDate: '2023-05-10'
            },
            {
              id: 3,
              title: 'Veteran Player',
              description: 'Play 100 matches',
              icon: Medal,
              earned: true,
              earnedDate: '2024-01-15'
            },
            {
              id: 4,
              title: 'Champion',
              description: 'Win 10 tournaments',
              icon: Crown,
              earned: true,
              earnedDate: '2024-08-22'
            },
            {
              id: 5,
              title: 'Perfect Game',
              description: 'Win a match without losing a point',
              icon: Star,
              earned: false,
              progress: 85
            }
          ],
          
          // Settings
          settings: {
            notifications: {
              email: true,
              push: true,
              tournaments: true,
              matches: true,
              achievements: false
            },
            privacy: {
              profileVisible: true,
              statsVisible: true,
              matchHistoryVisible: false
            },
            preferences: {
              theme: 'light',
              language: 'en',
              timezone: 'America/New_York'
            }
          }
        };
        
        setUser(mockUser);
        setEditForm(mockUser);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({ ...user });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setUser({ ...editForm });
      setIsEditing(false);
      setSaving(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({ ...user });
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    // Handle password change logic
    console.log('Password change:', passwordForm);
    setShowPasswordChange(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditForm(prev => ({
          ...prev,
          avatar: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getRankColor = (rank) => {
    const colors = {
      Bronze: 'text-warning-600 bg-warning-50',
      Silver: 'text-gray-600 bg-gray-100',
      Gold: 'text-warning-600 bg-warning-100',
      Platinum: 'text-primary-600 bg-primary-100',
      Diamond: 'text-purple-600 bg-purple-100'
    };
    return colors[rank] || 'text-gray-600 bg-gray-100';
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'statistics', label: 'Statistics', icon: BarChart3 },
    { id: 'tournaments', label: 'Tournaments', icon: Trophy },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (loading) {
    return (
      <div className="container py-8">
        <div className="loading">
          <div className="spinner"></div>
          <p className="ml-3">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-8">
        <div className="empty-state">
          <AlertCircle className="empty-state-icon" />
          <h3 className="empty-state-title">Profile not found</h3>
          <p className="empty-state-description">
            Unable to load user profile. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 animate-fade-in">
      {/* Profile Header */}
      <div className="card mb-8">
        <div className="card-content">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    user.username.charAt(0).toUpperCase()
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-primary-500 text-white p-2 rounded-full cursor-pointer hover:bg-primary-600 transition">
                    <Camera size={16} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              
              {/* Rank Badge */}
              <div className={`mt-4 px-4 py-2 rounded-full font-semibold text-sm ${getRankColor(user.stats.currentRank)}`}>
                {user.stats.currentRank} Rank
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="form-input text-2xl font-bold mb-2"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.username}</h1>
                  )}
                  
                  <div className="flex items-center gap-4 text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Mail size={16} />
                      {isEditing ? (
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="form-input"
                        />
                      ) : (
                        <span>{user.email}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="btn btn-primary"
                      >
                        {saving ? (
                          <>
                            <div className="spinner w-4 h-4 border-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={16} />
                            Save
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="btn btn-outline"
                      >
                        <X size={16} />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleEdit}
                      className="btn btn-primary"
                    >
                      <Edit3 size={16} />
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                {isEditing ? (
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="form-input h-24 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-600">{user.bio}</p>
                )}
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone size={16} />
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="form-input"
                    />
                  ) : (
                    <span>{user.phone}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={16} />
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="form-input"
                    />
                  ) : (
                    <span>{user.location}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="card mb-8">
        <div className="card-content p-0">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Stats */}
            <div className="lg:col-span-2">
              <div className="card mb-6">
                <div className="card-header">
                  <h3 className="card-title">
                    <Activity size={20} />
                    Quick Statistics
                  </h3>
                </div>
                <div className="card-content">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="stat-card">
                      <div className="stat-icon">
                        <Trophy size={20} />
                      </div>
                      <div className="stat-number">{user.stats.tournamentsWon}</div>
                      <div className="stat-label">Tournaments Won</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">
                        <Target size={20} />
                      </div>
                      <div className="stat-number">{user.stats.winRate}%</div>
                      <div className="stat-label">Win Rate</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">
                        <TrendingUp size={20} />
                      </div>
                      <div className="stat-number">{user.stats.rankPoints}</div>
                      <div className="stat-label">Rank Points</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">
                        <Zap size={20} />
                      </div>
                      <div className="stat-number">{user.stats.longestWinStreak}</div>
                      <div className="stat-label">Best Streak</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Tournaments */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    <Trophy size={20} />
                    Recent Tournaments
                  </h3>
                </div>
                <div className="card-content">
                  <div className="space-y-4">
                    {user.recentTournaments.map((tournament) => (
                      <div key={tournament.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
                        <div>
                          <h4 className="font-semibold text-gray-900">{tournament.name}</h4>
                          <p className="text-sm text-gray-600">
                            {new Date(tournament.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <Medal size={16} className="text-warning-500" />
                            <span className="font-semibold">#{tournament.placement}</span>
                          </div>
                          <div className="text-sm text-success-600 font-medium">
                            ${tournament.prize}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements Preview */}
            <div>
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    <Award size={20} />
                    Recent Achievements
                  </h3>
                </div>
                <div className="card-content">
                  <div className="space-y-3">
                    {user.achievements.filter(a => a.earned).slice(0, 4).map((achievement) => (
                      <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="bg-primary-500 text-white p-2 rounded-full">
                          <achievement.icon size={16} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                          <p className="text-xs text-gray-600">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setActiveTab('achievements')}
                    className="btn btn-outline w-full mt-4"
                  >
                    View All Achievements
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'statistics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Stats */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <BarChart3 size={20} />
                  Performance Statistics
                </h3>
              </div>
              <div className="card-content">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Win Rate</span>
                      <span className="text-sm text-gray-600">{user.stats.winRate}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${user.stats.winRate}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Tournament Success</span>
                      <span className="text-sm text-gray-600">
                        {Math.round((user.stats.tournamentsWon / user.stats.totalTournaments) * 100)}%
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${(user.stats.tournamentsWon / user.stats.totalTournaments) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{user.stats.totalMatches}</div>
                      <div className="text-sm text-gray-600">Total Matches</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{user.stats.matchesWon}</div>
                      <div className="text-sm text-gray-600">Matches Won</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <PieChart size={20} />
                  Additional Statistics
                </h3>
              </div>
              <div className="card-content">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock size={16} className="text-gray-600" />
                      <span className="font-medium">Average Match Duration</span>
                    </div>
                    <span className="text-gray-900 font-semibold">{user.stats.averageMatchDuration}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Zap size={16} className="text-gray-600" />
                      <span className="font-medium">Longest Win Streak</span>
                    </div>
                    <span className="text-gray-900 font-semibold">{user.stats.longestWinStreak} wins</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Trophy size={16} className="text-gray-600" />
                      <span className="font-medium">Current Rank</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full font-semibold text-sm ${getRankColor(user.stats.currentRank)}`}>
                      {user.stats.currentRank}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Star size={16} className="text-gray-600" />
                      <span className="font-medium">Rank Points</span>
                    </div>
                    <span className="text-gray-900 font-semibold">{user.stats.rankPoints}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tournaments' && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <Trophy size={20} />
                Tournament History
              </h3>
            </div>
            <div className="card-content">
              <div className="space-y-4">
                {user.recentTournaments.map((tournament) => (
                  <div key={tournament.id} className="tournament-card">
                    <div className="tournament-header">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="tournament-title">{tournament.name}</h4>
                          <div className="tournament-meta">
                            <div className="tournament-meta-item">
                              <Calendar size={16} />
                              {new Date(tournament.date).toLocaleDateString()}
                            </div>
                            <div className="tournament-meta-item">
                              <Medal size={16} />
                              Placement: #{tournament.placement}
                            </div>
                          </div>
                        </div>
                        <span className="badge badge-success">Completed</span>
                      </div>
                    </div>
                    <div className="tournament-content">
                      <div className="flex justify-between items-center">
                        <div className="text-success-600 font-semibold">
                          Prize: ${tournament.prize}
                        </div>
                        <button className="btn btn-outline btn-sm">
                          <Eye size={16} />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.achievements.map((achievement) => (
              <div key={achievement.id} className={`card ${achievement.earned ? 'border-success-200 bg-success-50' : 'border-gray-200'}`}>
                <div className="card-content text-center">
                  <div className={`mx-auto mb-4 p-4 rounded-full ${achievement.earned ? 'bg-success-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    <achievement.icon size={32} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{achievement.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{achievement.description}</p>
                  
                  {achievement.earned ? (
                    <div className="flex items-center justify-center gap-2 text-success-600">
                      <CheckCircle size={16} />
                      <span className="text-sm font-medium">
                        Earned {new Date(achievement.earnedDate).toLocaleDateString()}
                      </span>
                    </div>
                  ) : achievement.progress ? (
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${achievement.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Not earned yet</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Account Settings */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <User size={20} />
                  Account Settings
                </h3>
              </div>
              <div className="card-content space-y-4">
                <button
                  onClick={() => setShowPasswordChange(!showPasswordChange)}
                  className="btn btn-outline w-full"
                >
                  <Lock size={16} />
                  Change Password
                </button>
                
                {showPasswordChange && (
                  <form onSubmit={handlePasswordChange} className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div className="form-group">
                      <label className="form-label">Current Password</label>
                      <input
                        type="password"
                        className="form-input"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">New Password</label>
                      <input
                        type="password"
                        className="form-input"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Confirm New Password</label>
                      <input
                        type="password"
                        className="form-input"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" className="btn btn-primary">
                        Update Password
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setShowPasswordChange(false)}
                        className="btn btn-outline"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
                
                <button className="btn btn-outline w-full">
                  <Download size={16} />
                  Export Data
                </button>
                
                <button className="btn btn-outline w-full text-error-600 border-error-300 hover:bg-error-50">
                  <Trash2 size={16} />
                  Delete Account
                </button>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <Bell size={20} />
                  Notification Preferences
                </h3>
              </div>
              <div className="card-content space-y-4">
                {Object.entries(user.settings.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="font-medium text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => {
                          const newSettings = { ...user.settings };
                          newSettings.notifications[key] = e.target.checked;
                          setUser(prev => ({ ...prev, settings: newSettings }));
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <Shield size={20} />
                  Privacy Settings
                </h3>
              </div>
              <div className="card-content space-y-4">
                {Object.entries(user.settings.privacy).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="font-medium text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => {
                          const newSettings = { ...user.settings };
                          newSettings.privacy[key] = e.target.checked;
                          setUser(prev => ({ ...prev, settings: newSettings }));
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Preferences */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <Globe size={20} />
                  Preferences
                </h3>
              </div>
              <div className="card-content space-y-4">
                <div>
                  <label className="form-label">Theme</label>
                  <select 
                    className="form-select"
                    value={user.settings.preferences.theme}
                    onChange={(e) => {
                      const newSettings = { ...user.settings };
                      newSettings.preferences.theme = e.target.value;
                      setUser(prev => ({ ...prev, settings: newSettings }));
                    }}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
                
                <div>
                  <label className="form-label">Language</label>
                  <select 
                    className="form-select"
                    value={user.settings.preferences.language}
                    onChange={(e) => {
                      const newSettings = { ...user.settings };
                      newSettings.preferences.language = e.target.value;
                      setUser(prev => ({ ...prev, settings: newSettings }));
                    }}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
                
                <div>
                  <label className="form-label">Timezone</label>
                  <select 
                    className="form-select"
                    value={user.settings.preferences.timezone}
                    onChange={(e) => {
                      const newSettings = { ...user.settings };
                      newSettings.preferences.timezone = e.target.value;
                      setUser(prev => ({ ...prev, settings: newSettings }));
                    }}
                  >
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerProfile;