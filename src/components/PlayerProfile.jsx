import React, { useState } from 'react'

const PlayerProfile = ({ user = { name: 'John Doe', email: 'john@example.com' } }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user.name || 'John Doe',
    email: user.email || 'john@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    bio: 'Passionate backgammon player with 5+ years of experience. Love competitive tournaments and helping new players learn the game.',
    rank: 'Gold',
    level: 15,
    experience: 2850,
    nextLevelExp: 3000
  })

  const playerStats = {
    totalGames: 127,
    wins: 89,
    losses: 38,
    winRate: 70,
    currentStreak: 5,
    bestStreak: 12,
    totalTournaments: 23,
    tournamentsWon: 8,
    averageScore: 156,
    totalPoints: 19812
  }

  const achievements = [
    { id: 1, name: 'First Victory', description: 'Win your first game', icon: '🏆', earned: true, date: '2024-01-15' },
    { id: 2, name: 'Tournament Champion', description: 'Win a tournament', icon: '👑', earned: true, date: '2024-03-22' },
    { id: 3, name: 'Winning Streak', description: 'Win 10 games in a row', icon: '🔥', earned: true, date: '2024-05-10' },
    { id: 4, name: 'Master Player', description: 'Reach Gold rank', icon: '🥇', earned: true, date: '2024-06-15' },
    { id: 5, name: 'Social Player', description: 'Play 100 games', icon: '🤝', earned: true, date: '2024-06-20' },
    { id: 6, name: 'Legendary', description: 'Win 5 tournaments', icon: '⭐', earned: false, progress: 3, total: 5 }
  ]

  const recentTournaments = [
    { id: 1, name: 'Spring Championship', date: '2024-06-15', position: 1, players: 16, prize: '$200' },
    { id: 2, name: 'Weekly Pro League', date: '2024-06-08', position: 3, players: 8, prize: '$50' },
    { id: 3, name: 'Beginner\'s Cup', date: '2024-05-25', position: 2, players: 12, prize: '$75' }
  ]

  const getRankInfo = (rank) => {
    const ranks = {
      Bronze: { icon: '🥉', color: 'from-amber-600 to-amber-700', bgColor: 'bg-amber-50' },
      Silver: { icon: '🥈', color: 'from-gray-400 to-gray-500', bgColor: 'bg-gray-50' },
      Gold: { icon: '🥇', color: 'from-yellow-400 to-yellow-500', bgColor: 'bg-yellow-50' },
      Platinum: { icon: '💎', color: 'from-blue-400 to-blue-500', bgColor: 'bg-blue-50' },
      Diamond: { icon: '💠', color: 'from-purple-400 to-purple-500', bgColor: 'bg-purple-50' }
    }
    return ranks[rank] || ranks.Bronze
  }

  const rankInfo = getRankInfo(profileData.rank)
  const experiencePercentage = (profileData.experience / profileData.nextLevelExp) * 100

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'statistics', name: 'Statistics', icon: '📈' },
    { id: 'tournaments', name: 'Tournaments', icon: '🏆' },
    { id: 'achievements', name: 'Achievements', icon: '🏅' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ]

  return (
    <div className="page-wrapper">
      <div className="main-content">
        <div className="container">
          {/* Beautiful Profile Header */}
          <div className="card mb-8 animate-fade-in">
            <div className="card-content">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Profile Picture */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                      {profileData.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className={`absolute -bottom-2 -right-2 w-12 h-12 rounded-full ${rankInfo.bgColor} flex items-center justify-center shadow-lg border-4 border-white`}>
                      <span className="text-2xl">{rankInfo.icon}</span>
                    </div>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{profileData.name}</h1>
                      <div className="flex items-center gap-4 mb-3">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${rankInfo.color} text-white font-semibold`}>
                          <span>{rankInfo.icon}</span>
                          <span>{profileData.rank} Rank</span>
                        </div>
                        <div className="text-gray-600">
                          Level {profileData.level}
                        </div>
                      </div>
                      <p className="text-gray-600 max-w-2xl">{profileData.bio}</p>
                    </div>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="btn btn-outline btn-sm"
                    >
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                  </div>

                  {/* Experience Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Experience</span>
                      <span>{profileData.experience}/{profileData.nextLevelExp} XP</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${experiencePercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{playerStats.wins}</div>
                      <div className="text-sm text-gray-500">Wins</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{playerStats.winRate}%</div>
                      <div className="text-sm text-gray-500">Win Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{playerStats.tournamentsWon}</div>
                      <div className="text-sm text-gray-500">Tournaments Won</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{playerStats.currentStreak}</div>
                      <div className="text-sm text-gray-500">Current Streak</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Beautiful Tabs */}
          <div className="card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="card-header">
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`btn btn-sm ${activeTab === tab.id ? 'btn-primary' : 'btn-outline'}`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="card-content">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="animate-fade-in">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Contact Information */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span>📞</span>
                        Contact Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-500">📧</span>
                          <span>{profileData.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-500">📱</span>
                          <span>{profileData.phone}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-500">📍</span>
                          <span>{profileData.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span>⚡</span>
                        Recent Activity
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                          <span className="text-green-600">🏆</span>
                          <div>
                            <div className="font-medium">Won Spring Championship</div>
                            <div className="text-sm text-gray-500">2 days ago</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                          <span className="text-blue-600">🎯</span>
                          <div>
                            <div className="font-medium">Achieved 5-game win streak</div>
                            <div className="text-sm text-gray-500">1 week ago</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                          <span className="text-purple-600">⭐</span>
                          <div>
                            <div className="font-medium">Reached Level 15</div>
                            <div className="text-sm text-gray-500">2 weeks ago</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Statistics Tab */}
              {activeTab === 'statistics' && (
                <div className="animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="stat-card">
                      <div className="stat-icon">
                        <span className="text-xl">🎮</span>
                      </div>
                      <div className="stat-number">{playerStats.totalGames}</div>
                      <div className="stat-label">Total Games</div>
                    </div>
                    
                    <div className="stat-card">
                      <div className="stat-icon">
                        <span className="text-xl">🏆</span>
                      </div>
                      <div className="stat-number">{playerStats.wins}</div>
                      <div className="stat-label">Games Won</div>
                    </div>
                    
                    <div className="stat-card">
                      <div className="stat-icon">
                        <span className="text-xl">📈</span>
                      </div>
                      <div className="stat-number">{playerStats.winRate}%</div>
                      <div className="stat-label">Win Rate</div>
                    </div>
                    
                    <div className="stat-card">
                      <div className="stat-icon">
                        <span className="text-xl">🔥</span>
                      </div>
                      <div className="stat-number">{playerStats.currentStreak}</div>
                      <div className="stat-label">Current Streak</div>
                    </div>
                    
                    <div className="stat-card">
                      <div className="stat-icon">
                        <span className="text-xl">⭐</span>
                      </div>
                      <div className="stat-number">{playerStats.bestStreak}</div>
                      <div className="stat-label">Best Streak</div>
                    </div>
                    
                    <div className="stat-card">
                      <div className="stat-icon">
                        <span className="text-xl">🏅</span>
                      </div>
                      <div className="stat-number">{playerStats.totalTournaments}</div>
                      <div className="stat-label">Tournaments</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tournaments Tab */}
              {activeTab === 'tournaments' && (
                <div className="animate-fade-in">
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <span>🏆</span>
                    Tournament History
                  </h3>
                  <div className="space-y-4">
                    {recentTournaments.map((tournament) => (
                      <div key={tournament.id} className="tournament-card">
                        <div className="tournament-content">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-lg">{tournament.name}</h4>
                              <p className="text-gray-600">{new Date(tournament.date).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <div className={`text-2xl font-bold ${tournament.position === 1 ? 'text-yellow-500' : tournament.position === 2 ? 'text-gray-400' : tournament.position === 3 ? 'text-amber-600' : 'text-gray-600'}`}>
                                #{tournament.position}
                              </div>
                              <div className="text-sm text-gray-500">of {tournament.players} players</div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <div className="text-green-600 font-semibold">{tournament.prize}</div>
                            <div className="flex items-center gap-2">
                              {tournament.position === 1 && <span>🥇</span>}
                              {tournament.position === 2 && <span>🥈</span>}
                              {tournament.position === 3 && <span>🥉</span>}
                              <span className="text-sm text-gray-500">
                                {tournament.position === 1 ? 'Champion' : 
                                 tournament.position === 2 ? 'Runner-up' : 
                                 tournament.position === 3 ? 'Third Place' : 
                                 `${tournament.position}th Place`}
                              </span>
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
                <div className="animate-fade-in">
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <span>🏅</span>
                    Achievements
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {achievements.map((achievement) => (
                      <div 
                        key={achievement.id} 
                        className={`card ${achievement.earned ? 'bg-gradient-to-br from-yellow-50 to-orange-50' : 'opacity-75'}`}
                      >
                        <div className="card-content text-center">
                          <div className="text-4xl mb-3">{achievement.icon}</div>
                          <h4 className="font-semibold mb-2">{achievement.name}</h4>
                          <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                          {achievement.earned ? (
                            <div className="text-xs text-green-600 font-medium">
                              Earned {new Date(achievement.date).toLocaleDateString()}
                            </div>
                          ) : achievement.progress ? (
                            <div>
                              <div className="text-xs text-gray-500 mb-2">
                                Progress: {achievement.progress}/{achievement.total}
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                                  style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-gray-400">Not earned yet</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="animate-fade-in">
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <span>⚙️</span>
                    Account Settings
                  </h3>
                  <div className="space-y-6">
                    <div className="card">
                      <div className="card-header">
                        <h4 className="card-title">Profile Information</h4>
                      </div>
                      <div className="card-content">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                              type="text"
                              className="form-input"
                              value={profileData.name}
                              onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                              type="email"
                              className="form-input"
                              value={profileData.email}
                              onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Phone</label>
                            <input
                              type="tel"
                              className="form-input"
                              value={profileData.phone}
                              onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Location</label>
                            <input
                              type="text"
                              className="form-input"
                              value={profileData.location}
                              onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Bio</label>
                          <textarea
                            className="form-input"
                            rows="4"
                            value={profileData.bio}
                            onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                          ></textarea>
                        </div>
                        <button className="btn btn-primary">
                          Save Changes
                        </button>
                      </div>
                    </div>

                    <div className="card">
                      <div className="card-header">
                        <h4 className="card-title">Preferences</h4>
                      </div>
                      <div className="card-content">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">Email Notifications</div>
                              <div className="text-sm text-gray-500">Receive tournament updates via email</div>
                            </div>
                            <button className="btn btn-outline btn-sm">
                              Enabled
                            </button>
                          </div>
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">Public Profile</div>
                              <div className="text-sm text-gray-500">Allow others to view your profile</div>
                            </div>
                            <button className="btn btn-outline btn-sm">
                              Public
                            </button>
                          </div>
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">Tournament Invitations</div>
                              <div className="text-sm text-gray-500">Allow tournament organizers to invite you</div>
                            </div>
                            <button className="btn btn-outline btn-sm">
                              Enabled
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerProfile