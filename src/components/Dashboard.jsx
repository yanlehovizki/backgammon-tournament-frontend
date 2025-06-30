import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Dashboard = ({ user = { name: 'Player', player_id: 1 } }) => {
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(false)

  // Sample data for immediate display
  const sampleTournaments = [
    {
      tournament_id: 1,
      name: "Spring Championship",
      date: "2025-07-15",
      status: "upcoming",
      enrollment_count: 12,
      max_players: 16
    },
    {
      tournament_id: 2,
      name: "Weekly Tournament",
      date: "2025-07-08",
      status: "in_progress",
      enrollment_count: 8,
      max_players: 8
    }
  ]

  const playerStats = {
    current_tournaments: sampleTournaments.filter(t => t.status !== 'completed'),
    past_tournaments: [
      { tournament_id: 3, name: "Previous Tournament", wins: 5, losses: 2, total_score: 150 }
    ]
  }

  const getStatusBadge = (status) => {
    const styles = {
      upcoming: { backgroundColor: '#dbeafe', color: '#1e40af', padding: '4px 12px', borderRadius: '12px', fontSize: '12px' },
      in_progress: { backgroundColor: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '12px', fontSize: '12px' },
      completed: { backgroundColor: '#f3f4f6', color: '#374151', padding: '4px 12px', borderRadius: '12px', fontSize: '12px' }
    }
    
    return (
      <span style={styles[status] || styles.upcoming}>
        {status === 'upcoming' ? 'Upcoming' : status === 'in_progress' ? 'In Progress' : 'Completed'}
      </span>
    )
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', paddingTop: '32px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Dashboard</h1>
          <p style={{ color: '#6b7280', margin: '8px 0 0 0' }}>Welcome back, {user.name}!</p>
        </div>
        <Link to="/tournaments" style={{ textDecoration: 'none' }}>
          <button style={{
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>+</span>
            <span>Create Tournament</span>
          </button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '24px', 
        marginBottom: '32px' 
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#111827', margin: 0 }}>Current Tournaments</h3>
            <span style={{ fontSize: '16px' }}>🏆</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>
            {playerStats.current_tournaments.length}
          </div>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#111827', margin: 0 }}>Past Tournaments</h3>
            <span style={{ fontSize: '16px' }}>📅</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>
            {playerStats.past_tournaments.length}
          </div>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#111827', margin: 0 }}>Total Wins</h3>
            <span style={{ fontSize: '16px' }}>📈</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>
            {playerStats.past_tournaments.reduce((total, t) => total + (t.wins || 0), 0)}
          </div>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#111827', margin: 0 }}>Active Tournaments</h3>
            <span style={{ fontSize: '16px' }}>👥</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>
            {sampleTournaments.filter(t => t.status === 'in_progress').length}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
        {/* My Current Tournaments */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ padding: '24px 24px 16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>My Current Tournaments</h2>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>Tournaments you're currently participating in</p>
          </div>
          <div style={{ padding: '0 24px 24px' }}>
            {playerStats.current_tournaments.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {playerStats.current_tournaments.map((tournament) => (
                  <div key={tournament.tournament_id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '500', color: '#111827', margin: 0 }}>{tournament.name}</h3>
                      <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
                        {new Date(tournament.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {getStatusBadge(tournament.status)}
                      <Link to={`/tournaments/${tournament.tournament_id}`} style={{ textDecoration: 'none' }}>
                        <button style={{
                          backgroundColor: 'white',
                          color: '#374151',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}>
                          View
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#9ca3af', textAlign: 'center', padding: '32px 0' }}>
                You're not currently enrolled in any tournaments.
              </p>
            )}
          </div>
        </div>

        {/* Upcoming Tournaments */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ padding: '24px 24px 16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>Upcoming Tournaments</h2>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>Join these upcoming tournaments</p>
          </div>
          <div style={{ padding: '0 24px 24px' }}>
            {sampleTournaments.filter(t => t.status === 'upcoming').length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {sampleTournaments.filter(t => t.status === 'upcoming').map((tournament) => (
                  <div key={tournament.tournament_id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '500', color: '#111827', margin: 0 }}>{tournament.name}</h3>
                      <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
                        {new Date(tournament.date).toLocaleDateString()} • {tournament.enrollment_count} players
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {getStatusBadge(tournament.status)}
                      <Link to={`/tournaments/${tournament.tournament_id}`} style={{ textDecoration: 'none' }}>
                        <button style={{
                          backgroundColor: 'white',
                          color: '#374151',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}>
                          Join
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#9ca3af', textAlign: 'center', padding: '32px 0' }}>
                No upcoming tournaments available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard