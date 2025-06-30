import React, { useState } from 'react';

const PlayerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    rank: 'Gold',
    bio: 'Passionate backgammon player with 5 years of experience.'
  });

  const [editForm, setEditForm] = useState(profile);

  const stats = {
    totalTournaments: 24,
    wins: 18,
    losses: 6,
    winRate: 75,
    currentStreak: 5,
    totalPrize: 2500
  };

  const recentTournaments = [
    { id: 1, name: 'Spring Championship', position: 1, date: 'June 20, 2025', prize: 500 },
    { id: 2, name: 'Weekly Cup #45', position: 2, date: 'June 15, 2025', prize: 150 },
    { id: 3, name: 'Elite Masters', position: 1, date: 'June 10, 2025', prize: 800 },
    { id: 4, name: 'Beginner Friendly', position: 3, date: 'June 5, 2025', prize: 50 }
  ];

  const handleSave = () => {
    setProfile(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  const getRankColor = (rank) => {
    const colors = {
      'Bronze': '#cd7f32',
      'Silver': '#c0c0c0',
      'Gold': '#ffd700',
      'Platinum': '#e5e4e2',
      'Diamond': '#b9f2ff'
    };
    return colors[rank] || '#666';
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', color: '#333' }}>Player Profile</h1>
          <p style={{ margin: 0, color: '#666' }}>Manage your tournament profile</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile Header */}
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          {/* Avatar */}
          <div 
            style={{ 
              width: '100px', 
              height: '100px', 
              borderRadius: '50%', 
              backgroundColor: getRankColor(profile.rank),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px',
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            {profile.rank === 'Gold' ? '🥇' : profile.rank === 'Silver' ? '🥈' : profile.rank === 'Bronze' ? '🥉' : profile.rank.charAt(0)}
          </div>

          {/* Profile Info */}
          <div style={{ flex: 1 }}>
            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '3px', fontSize: '18px' }}
                />
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '3px' }}
                />
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '3px' }}
                />
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                  style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '3px' }}
                />
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                  style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '3px', minHeight: '60px' }}
                />
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button
                    onClick={handleSave}
                    style={{
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '3px',
                      cursor: 'pointer'
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    style={{
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '3px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h2 style={{ margin: '0 0 10px 0', fontSize: '24px', color: '#333' }}>{profile.name}</h2>
                <div style={{ marginBottom: '10px' }}>
                  <span 
                    style={{ 
                      padding: '4px 12px', 
                      borderRadius: '15px', 
                      fontSize: '14px',
                      backgroundColor: getRankColor(profile.rank),
                      color: 'white'
                    }}
                  >
                    {profile.rank} Rank
                  </span>
                </div>
                <p style={{ margin: '5px 0', color: '#666' }}>{profile.email}</p>
                <p style={{ margin: '5px 0', color: '#666' }}>{profile.phone}</p>
                <p style={{ margin: '5px 0', color: '#666' }}>{profile.location}</p>
                <p style={{ margin: '10px 0 0 0', color: '#666' }}>{profile.bio}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats and Recent Tournaments */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Statistics */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Statistics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>{stats.totalTournaments}</p>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Tournaments</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>{stats.winRate}%</p>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Win Rate</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold', color: '#fd7e14' }}>{stats.currentStreak}</p>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Current Streak</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold', color: '#6f42c1' }}>${stats.totalPrize}</p>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Total Prize</p>
            </div>
          </div>
          
          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#666' }}>Wins: {stats.wins}</span>
              <span style={{ color: '#666' }}>Losses: {stats.losses}</span>
            </div>
          </div>
        </div>

        {/* Recent Tournaments */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Recent Tournaments</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentTournaments.map(tournament => (
              <div 
                key={tournament.id}
                style={{ 
                  padding: '12px', 
                  border: '1px solid #eee', 
                  borderRadius: '5px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <h4 style={{ margin: '0 0 5px 0', color: '#333', fontSize: '14px' }}>{tournament.name}</h4>
                  <p style={{ margin: 0, color: '#666', fontSize: '12px' }}>{tournament.date}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div 
                    style={{ 
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: tournament.position === 1 ? '#ffd700' : 
                                     tournament.position === 2 ? '#c0c0c0' : 
                                     tournament.position === 3 ? '#cd7f32' : '#ddd',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      marginBottom: '5px',
                      marginLeft: 'auto'
                    }}
                  >
                    {tournament.position}
                  </div>
                  <p style={{ margin: 0, color: '#28a745', fontSize: '12px', fontWeight: 'bold' }}>${tournament.prize}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;