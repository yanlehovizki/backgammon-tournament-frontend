import React, { useState } from 'react'

const PlayerProfile = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    bio: 'Passionate backgammon player with 5 years of experience.',
    rank: 'Gold',
    totalTournaments: 15,
    wins: 12,
    winRate: 80
  })

  const getRankIcon = (rank) => {
    const icons = {
      'Bronze': '🥉',
      'Silver': '🥈', 
      'Gold': '🥇',
      'Platinum': '💎',
      'Diamond': '💍'
    }
    return icons[rank] || '🏆'
  }

  const getRankColor = (rank) => {
    const colors = {
      'Bronze': '#cd7f32',
      'Silver': '#c0c0c0',
      'Gold': '#ffd700',
      'Platinum': '#e5e4e2',
      'Diamond': '#b9f2ff'
    }
    return colors[rank] || '#ffd700'
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'statistics', label: 'Statistics' },
    { id: 'tournaments', label: 'Tournaments' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'settings', label: 'Settings' }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{profileData.totalTournaments}</div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Tournaments</div>
              </div>
              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>{profileData.wins}</div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Wins</div>
              </div>
              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>{profileData.winRate}%</div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Win Rate</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', padding: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>Recent Activity</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                  <span style={{ fontSize: '16px' }}>🏆</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>Won Spring Championship</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>2 days ago</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                  <span style={{ fontSize: '16px' }}>📈</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>Rank promoted to Gold</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>1 week ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'statistics':
        return (
          <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>Performance Statistics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Win Rate</div>
                <div style={{ backgroundColor: '#f3f4f6', borderRadius: '8px', height: '8px', overflow: 'hidden' }}>
                  <div style={{ backgroundColor: '#16a34a', height: '100%', width: `${profileData.winRate}%` }}></div>
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{profileData.winRate}%</div>
              </div>
              <div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Tournament Participation</div>
                <div style={{ backgroundColor: '#f3f4f6', borderRadius: '8px', height: '8px', overflow: 'hidden' }}>
                  <div style={{ backgroundColor: '#2563eb', height: '100%', width: '75%' }}></div>
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>75% active</div>
              </div>
            </div>
          </div>
        )

      case 'tournaments':
        return (
          <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>Tournament History</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '500', color: '#111827' }}>Spring Championship</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>March 2025 • 1st Place</div>
                </div>
                <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '12px', fontSize: '12px' }}>Won</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '500', color: '#111827' }}>Weekly Tournament</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>February 2025 • 3rd Place</div>
                </div>
                <span style={{ backgroundColor: '#dbeafe', color: '#1e40af', padding: '4px 12px', borderRadius: '12px', fontSize: '12px' }}>Placed</span>
              </div>
            </div>
          </div>
        )

      case 'achievements':
        return (
          <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>Achievements</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏆</div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>First Victory</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Win your first tournament</div>
              </div>
              <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔥</div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>Winning Streak</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Win 5 games in a row</div>
              </div>
            </div>
          </div>
        )

      case 'settings':
        return (
          <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>Account Settings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '8px' }}>
                  Email Notifications
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked />
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Receive tournament updates</span>
                </label>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '8px' }}>
                  Privacy
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked />
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Make profile public</span>
                </label>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
      {/* Header */}
      <div style={{ paddingTop: '32px', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Player Profile</h1>
        <p style={{ color: '#6b7280', margin: '8px 0 0 0' }}>Manage your profile and view your tournament history</p>
      </div>

      {/* Profile Header */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: '24px',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px' }}>
          {/* Profile Picture */}
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            color: '#6b7280'
          }}>
            👤
          </div>
          
          {/* Profile Info */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>{profileData.name}</h2>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: getRankColor(profileData.rank),
                color: 'white',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                <span>{getRankIcon(profileData.rank)}</span>
                <span>{profileData.rank} Rank</span>
              </div>
            </div>
            <p style={{ color: '#6b7280', margin: '0 0 8px 0' }}>{profileData.email}</p>
            <p style={{ color: '#6b7280', margin: 0 }}>{profileData.location}</p>
          </div>
          
          {/* Edit Button */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            style={{
              backgroundColor: isEditing ? '#16a34a' : '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            {isEditing ? 'Save' : 'Edit Profile'}
          </button>
        </div>
        
        {/* Bio */}
        {isEditing ? (
          <textarea
            value={profileData.bio}
            onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              resize: 'vertical',
              minHeight: '80px'
            }}
          />
        ) : (
          <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>{profileData.bio}</p>
        )}
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 24px',
                border: 'none',
                backgroundColor: 'transparent',
                color: activeTab === tab.id ? '#2563eb' : '#6b7280',
                borderBottom: activeTab === tab.id ? '2px solid #2563eb' : '2px solid transparent',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  )
}

export default PlayerProfile