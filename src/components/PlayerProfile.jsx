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
  Star,
  Edit3,
  Save,
  X,
  Camera,
  Settings,
  Bell,
  Shield,
  Globe,
  Download,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';

const PlayerProfile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState({
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    bio: 'Passionate backgammon player with 5 years of competitive experience. Love strategic games and meeting new players.',
    rank: 'Gold',
    joinDate: '2023-01-15',
    avatar: null,
    stats: {
      totalTournaments: 24,
      wins: 18,
      losses: 6,
      winRate: 75,
      currentStreak: 5,
      bestRank: 'Gold',
      totalPrize: 2500,
      averagePosition: 2.3
    },
    achievements: [
      { id: 1, name: 'First Victory', description: 'Win your first tournament', icon: '🏆', earned: true, earnedDate: '2023-02-10' },
      { id: 2, name: 'Winning Streak', description: 'Win 5 tournaments in a row', icon: '🔥', earned: true, earnedDate: '2023-08-15' },
      { id: 3, name: 'Gold Standard', description: 'Reach Gold rank', icon: '🥇', earned: true, earnedDate: '2023-11-20' },
      { id: 4, name: 'Tournament Master', description: 'Win 25 tournaments', icon: '👑', earned: false, progress: 18, total: 25 },
      { id: 5, name: 'Perfect Score', description: 'Win a tournament without losing a game', icon: '💎', earned: false, progress: 0, total: 1 },
      { id: 6, name: 'Community Leader', description: 'Organize 10 tournaments', icon: '🌟', earned: false, progress: 3, total: 10 }
    ],
    recentTournaments: [
      { id: 1, name: 'Spring Championship', position: 1, date: '2025-06-20', prize: 500 },
      { id: 2, name: 'Weekly Cup #45', position: 2, date: '2025-06-15', prize: 150 },
      { id: 3, name: 'Elite Masters', position: 1, date: '2025-06-10', prize: 800 },
      { id: 4, name: 'Beginner Friendly', position: 3, date: '2025-06-05', prize: 50 },
      { id: 5, name: 'Monthly Challenge', position: 1, date: '2025-06-01', prize: 300 }
    ]
  });

  const [editForm, setEditForm] = useState({});
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      tournaments: true,
      results: true,
      marketing: false
    },
    privacy: {
      profileVisible: true,
      statsVisible: true,
      achievementsVisible: true,
      contactVisible: false
    },
    preferences: {
      theme: 'light',
      language: 'en',
      timezone: 'America/New_York'
    }
  });

  useEffect(() => {
    setEditForm(userProfile);
  }, [userProfile]);

  const getRankInfo = (rank) => {
    const rankData = {
      'Bronze': { 
        color: 'from-orange-400 to-orange-600', 
        textColor: 'text-orange-600',
        bgColor: 'bg-orange-100',
        icon: '🥉'
      },
      'Silver': { 
        color: 'from-gray-400 to-gray-600', 
        textColor: 'text-gray-600',
        bgColor: 'bg-gray-100',
        icon: '🥈'
      },
      'Gold': { 
        color: 'from-yellow-400 to-yellow-600', 
        textColor: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        icon: '🥇'
      },
      'Platinum': { 
        color: 'from-blue-400 to-blue-600', 
        textColor: 'text-blue-600',
        bgColor: 'bg-blue-100',
        icon: '💎'
      },
      'Diamond': { 
        color: 'from-purple-400 to-purple-600', 
        textColor: 'text-purple-600',
        bgColor: 'bg-purple-100',
        icon: '💎'
      },
      'Unranked': { 
        color: 'from-gray-300 to-gray-500', 
        textColor: 'text-gray-500',
        bgColor: 'bg-gray-50',
        icon: '⭐'
      }
    };
    return rankData[rank] || rankData.Unranked;
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm(userProfile);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUserProfile(editForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(userProfile);
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSettingChange = (category, field, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPositionColor = (position) => {
    if (position === 1) return 'text-yellow-600 bg-yellow-100';
    if (position === 2) return 'text-gray-600 bg-gray-100';
    if (position === 3) return 'text-orange-600 bg-orange-100';
    return 'text-blue-600 bg-blue-100';
  };

  const rankInfo = getRankInfo(userProfile.rank);

  return (
    <div className="container py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-primary">Player Profile</h1>
          <p className="text-secondary">Manage your tournament profile and settings</p>
        </div>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="btn btn-primary"
          >
            <Edit3 size={20} />
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile Header */}
      <div className="card mb-8">
        <div className="card-content">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${rankInfo.color} flex items-center justify-center text-3xl`}>
                {userProfile.avatar ? (
                  <img 
                    src={userProfile.avatar} 
                    alt={userProfile.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  rankInfo.icon
                )}
              </div>
              {isEditing && (
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 transition">
                  <Camera size={16} />
                </button>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    className="form-input text-2xl font-bold"
                    value={editForm.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                  <input
                    type="email"
                    className="form-input"
                    value={editForm.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                  <textarea
                    className="form-textarea"
                    rows={2}
                    value={editForm.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                  />
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-1">{userProfile.name}</h2>
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${rankInfo.bgColor} ${rankInfo.textColor}`}>
                      {userProfile.rank} Rank
                    </span>
                  </div>
                  <p className="text-secondary mb-2">{userProfile.email}</p>
                  <p className="text-gray-600">{userProfile.bio}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? (
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
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'statistics', label: 'Statistics', icon: TrendingUp },
              { id: 'tournaments', label: 'Tournaments', icon: Trophy },
              { id: 'achievements', label: 'Achievements', icon: Award },
              { id: 'settings', label: 'Settings', icon: Settings }
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
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    {isEditing ? (
                      <>
                        <div className="flex items-center gap-3">
                          <Phone size={16} className="text-gray-400" />
                          <input
                            type="tel"
                            className="form-input flex-1"
                            value={editForm.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin size={16} className="text-gray-400" />
                          <input
                            type="text"
                            className="form-input flex-1"
                            value={editForm.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <Mail size={16} className="text-gray-400" />
                          <span>{userProfile.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone size={16} className="text-gray-400" />
                          <span>{userProfile.phone}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin size={16} className="text-gray-400" />
                          <span>{userProfile.location}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar size={16} className="text-gray-400" />
                          <span>Joined {formatDate(userProfile.joinDate)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Quick Stats */}
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-4">Quick Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-primary">{userProfile.stats.totalTournaments}</p>
                      <p className="text-sm text-secondary">Tournaments</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-success-600">{userProfile.stats.winRate}%</p>
                      <p className="text-sm text-secondary">Win Rate</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-warning-600">{userProfile.stats.currentStreak}</p>
                      <p className="text-sm text-secondary">Current Streak</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-purple-600">${userProfile.stats.totalPrize}</p>
                      <p className="text-sm text-secondary">Total Prize</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-semibold text-primary mb-4">Recent Tournament Results</h3>
                <div className="space-y-3">
                  {userProfile.recentTournaments.slice(0, 5).map((tournament) => (
                    <div key={tournament.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getPositionColor(tournament.position)}`}>
                          {tournament.position}
                        </span>
                        <div>
                          <h4 className="font-medium text-primary">{tournament.name}</h4>
                          <p className="text-sm text-secondary">{formatDate(tournament.date)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-success-600">${tournament.prize}</p>
                        <p className="text-sm text-secondary">Prize</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Statistics Tab */}
          {activeTab === 'statistics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card">
                  <div className="card-content text-center">
                    <Trophy className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-primary">{userProfile.stats.wins}</p>
                    <p className="text-sm text-secondary">Wins</p>
                  </div>
                </div>
                <div className="card">
                  <div className="card-content text-center">
                    <Target className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-primary">{userProfile.stats.losses}</p>
                    <p className="text-sm text-secondary">Losses</p>
                  </div>
                </div>
                <div className="card">
                  <div className="card-content text-center">
                    <TrendingUp className="w-8 h-8 text-success-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-primary">{userProfile.stats.winRate}%</p>
                    <p className="text-sm text-secondary">Win Rate</p>
                  </div>
                </div>
                <div className="card">
                  <div className="card-content text-center">
                    <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-primary">{userProfile.stats.averagePosition}</p>
                    <p className="text-sm text-secondary">Avg Position</p>
                  </div>
                </div>
              </div>

              {/* Performance Chart Placeholder */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Performance Over Time</h3>
                </div>
                <div className="card-content">
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Performance chart would go here</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tournaments Tab */}
          {activeTab === 'tournaments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-primary">Tournament History</h3>
                <div className="flex gap-2">
                  <select className="form-select">
                    <option>All Tournaments</option>
                    <option>Won</option>
                    <option>Top 3</option>
                    <option>Recent</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {userProfile.recentTournaments.map((tournament) => (
                  <div key={tournament.id} className="card">
                    <div className="card-content">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${getPositionColor(tournament.position)}`}>
                            {tournament.position}
                          </span>
                          <div>
                            <h4 className="font-semibold text-primary">{tournament.name}</h4>
                            <p className="text-sm text-secondary">{formatDate(tournament.date)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-success-600">${tournament.prize}</p>
                          <p className="text-sm text-secondary">Prize Won</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userProfile.achievements.map((achievement) => (
                  <div key={achievement.id} className={`card ${achievement.earned ? 'border-success-200 bg-success-50' : 'border-gray-200'}`}>
                    <div className="card-content text-center">
                      <div className="text-4xl mb-3">{achievement.icon}</div>
                      <h4 className="font-semibold text-primary mb-2">{achievement.name}</h4>
                      <p className="text-sm text-secondary mb-3">{achievement.description}</p>
                      
                      {achievement.earned ? (
                        <div>
                          <span className="badge badge-success">Earned</span>
                          <p className="text-xs text-gray-500 mt-1">{formatDate(achievement.earnedDate)}</p>
                        </div>
                      ) : (
                        <div>
                          <span className="badge badge-outline">In Progress</span>
                          {achievement.progress !== undefined && (
                            <div className="mt-2">
                              <div className="progress-bar">
                                <div 
                                  className="progress-fill"
                                  style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {achievement.progress}/{achievement.total}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-8">
              {/* Notifications */}
              <div>
                <h3 className="text-lg font-semibold text-primary mb-4">Notifications</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell size={16} className="text-gray-400" />
                      <span>Email notifications</span>
                    </div>
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={settings.notifications.email}
                      onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell size={16} className="text-gray-400" />
                      <span>Push notifications</span>
                    </div>
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={settings.notifications.push}
                      onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Trophy size={16} className="text-gray-400" />
                      <span>Tournament updates</span>
                    </div>
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={settings.notifications.tournaments}
                      onChange={(e) => handleSettingChange('notifications', 'tournaments', e.target.checked)}
                    />
                  </label>
                </div>
              </div>

              {/* Privacy */}
              <div>
                <h3 className="text-lg font-semibold text-primary mb-4">Privacy</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Eye size={16} className="text-gray-400" />
                      <span>Profile visible to others</span>
                    </div>
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={settings.privacy.profileVisible}
                      onChange={(e) => handleSettingChange('privacy', 'profileVisible', e.target.checked)}
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <TrendingUp size={16} className="text-gray-400" />
                      <span>Statistics visible</span>
                    </div>
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={settings.privacy.statsVisible}
                      onChange={(e) => handleSettingChange('privacy', 'statsVisible', e.target.checked)}
                    />
                  </label>
                </div>
              </div>

              {/* Preferences */}
              <div>
                <h3 className="text-lg font-semibold text-primary mb-4">Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                    <select
                      className="form-select"
                      value={settings.preferences.theme}
                      onChange={(e) => handleSettingChange('preferences', 'theme', e.target.value)}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                      className="form-select"
                      value={settings.preferences.language}
                      onChange={(e) => handleSettingChange('preferences', 'language', e.target.value)}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                    <select
                      className="form-select"
                      value={settings.preferences.timezone}
                      onChange={(e) => handleSettingChange('preferences', 'timezone', e.target.value)}
                    >
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              <div>
                <h3 className="text-lg font-semibold text-primary mb-4">Account</h3>
                <div className="space-y-3">
                  <button className="btn btn-outline w-full md:w-auto">
                    <Download size={16} />
                    Export Data
                  </button>
                  <button className="btn btn-outline text-red-600 hover:bg-red-50 w-full md:w-auto">
                    <Trash2 size={16} />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;