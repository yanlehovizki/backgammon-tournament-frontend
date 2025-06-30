import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CreateTournamentModal from './CreateTournamentModal';

const Dashboard = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const stats = {
    totalTournaments: 12,
    activeTournaments: 3,
    totalPlayers: 156,
    totalPrize: 5000
  };

  const recentTournaments = [
    {
      id: 1,
      name: 'Spring Championship',
      status: 'Active',
      players: '24/32',
      date: 'July 15, 2025'
    },
    {
      id: 2,
      name: 'Weekly Cup',
      status: 'Upcoming',
      players: '16/20',
      date: 'July 20, 2025'
    },
    {
      id: 3,
      name: 'Masters Tournament',
      status: 'Completed',
      players: '8/8',
      date: 'July 10, 2025'
    }
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', color: '#333' }}>Dashboard</h1>
          <p style={{ margin: 0, color: '#666' }}>Welcome to your tournament management dashboard</p>
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

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Total Tournaments</h3>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>{stats.totalTournaments}</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Active Tournaments</h3>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>{stats.activeTournaments}</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Total Players</h3>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#6f42c1' }}>{stats.totalPlayers}</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Total Prize Pool</h3>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#fd7e14' }}>${stats.totalPrize}</p>
        </div>
      </div>

      {/* Recent Tournaments */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#333' }}>Recent Tournaments</h2>
          <Link 
            to="/tournaments"
            style={{ 
              color: '#007bff', 
              textDecoration: 'none',
              padding: '5px 10px',
              border: '1px solid #007bff',
              borderRadius: '3px'
            }}
          >
            View All
          </Link>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {recentTournaments.map(tournament => (
            <div 
              key={tournament.id}
              style={{ 
                padding: '15px', 
                border: '1px solid #eee', 
                borderRadius: '5px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{tournament.name}</h4>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{tournament.date}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
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
                <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>{tournament.players} players</p>
              </div>
            </div>
          ))}
        </div>
      </div>

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

export default Dashboard;