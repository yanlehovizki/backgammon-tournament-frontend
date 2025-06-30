import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CreateTournamentModal from './CreateTournamentModal';

const Tournaments = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const tournaments = [
    {
      id: 1,
      name: 'Spring Championship 2025',
      status: 'Upcoming',
      date: 'July 15, 2025',
      location: 'New York, NY',
      players: 24,
      maxPlayers: 32,
      prize: 1500,
      organizer: 'Tournament Pro'
    },
    {
      id: 2,
      name: 'Beginner Friendly Cup',
      status: 'Active',
      date: 'July 1, 2025',
      location: 'Online',
      players: 16,
      maxPlayers: 16,
      prize: 0,
      organizer: 'Community League'
    },
    {
      id: 3,
      name: 'Elite Masters Tournament',
      status: 'Completed',
      date: 'June 20, 2025',
      location: 'Los Angeles, CA',
      players: 8,
      maxPlayers: 8,
      prize: 800,
      organizer: 'Elite Gaming'
    },
    {
      id: 4,
      name: 'Weekly Challenge #47',
      status: 'Upcoming',
      date: 'July 8, 2025',
      location: 'Chicago, IL',
      players: 12,
      maxPlayers: 20,
      prize: 200,
      organizer: 'Weekly Series'
    }
  ];

  const filteredTournaments = tournaments.filter(tournament =>
    tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tournament.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', color: '#333' }}>Tournaments</h1>
          <p style={{ margin: 0, color: '#666' }}>Browse and join tournaments</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
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
          + Create Tournament
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search tournaments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            fontSize: '14px'
          }}
        />
      </div>

      {/* Tournaments List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {filteredTournaments.map(tournament => (
          <div 
            key={tournament.id}
            style={{ 
              backgroundColor: 'white', 
              padding: '20px', 
              borderRadius: '8px', 
              border: '1px solid #ddd',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, color: '#333', fontSize: '18px' }}>{tournament.name}</h3>
              <span 
                style={{ 
                  padding: '3px 8px', 
                  borderRadius: '3px', 
                  fontSize: '12px',
                  backgroundColor: tournament.status === 'Active' ? '#d4edda' : 
                                 tournament.status === 'Upcoming' ? '#d1ecf1' : '#f8d7da',
                  color: tournament.status === 'Active' ? '#155724' : 
                         tournament.status === 'Upcoming' ? '#0c5460' : '#721c24'
                }}
              >
                {tournament.status}
              </span>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                <strong>Date:</strong> {tournament.date}
              </p>
              <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                <strong>Location:</strong> {tournament.location}
              </p>
              <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                <strong>Players:</strong> {tournament.players}/{tournament.maxPlayers}
              </p>
              {tournament.prize > 0 && (
                <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                  <strong>Prize:</strong> ${tournament.prize}
                </p>
              )}
              <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                <strong>Organizer:</strong> {tournament.organizer}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '12px', color: '#999' }}>
                {Math.round((tournament.players / tournament.maxPlayers) * 100)}% full
              </div>
              <Link
                to={`/tournaments/${tournament.id}`}
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '3px',
                  fontSize: '14px'
                }}
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredTournaments.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <h3>No tournaments found</h3>
          <p>Try adjusting your search or create a new tournament.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              marginTop: '10px'
            }}
          >
            Create Tournament
          </button>
        </div>
      )}

      {/* Create Tournament Modal */}
      {showCreateModal && (
        <CreateTournamentModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onTournamentCreated={(tournament) => {
            console.log('Tournament created:', tournament);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Tournaments;