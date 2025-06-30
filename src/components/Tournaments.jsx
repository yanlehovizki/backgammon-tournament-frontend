import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Tournaments = ({ user = { role: 'super_user' } }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Sample tournaments data
  const tournaments = [
    {
      tournament_id: 1,
      name: "Spring Championship",
      description: "Annual spring tournament for all skill levels",
      date: "2025-07-15",
      status: "upcoming",
      enrollment_count: 12,
      max_players: 16,
      entry_fee: 25
    },
    {
      tournament_id: 2,
      name: "Weekly Tournament",
      description: "Regular weekly competition",
      date: "2025-07-08",
      status: "in_progress",
      enrollment_count: 8,
      max_players: 8,
      entry_fee: 10
    },
    {
      tournament_id: 3,
      name: "Beginner's Cup",
      description: "Perfect for new players",
      date: "2025-07-22",
      status: "upcoming",
      enrollment_count: 6,
      max_players: 12,
      entry_fee: 15
    }
  ]

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

  const filteredTournaments = tournaments.filter(tournament => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || tournament.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', paddingTop: '32px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Tournaments</h1>
          <p style={{ color: '#6b7280', margin: '8px 0 0 0' }}>Browse and join upcoming tournaments</p>
        </div>
        
        {user.role === 'super_user' && (
          <button 
            onClick={() => setShowCreateModal(true)}
            style={{
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
            }}
          >
            <span>+</span>
            <span>Create Tournament</span>
          </button>
        )}
      </div>

      {/* Search and Filter */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: '24px',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Search */}
          <div style={{ flex: 1 }}>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6b7280',
                fontSize: '16px'
              }}>🔍</span>
              <input
                type="text"
                placeholder="Search tournaments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '40px',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
          </div>
          
          {/* Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                backgroundColor: 'white',
                minWidth: '150px'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2563eb'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tournament Grid */}
      {filteredTournaments.length > 0 ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '24px' 
        }}>
          {filteredTournaments.map((tournament) => (
            <div key={tournament.tournament_id} style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              transition: 'box-shadow 0.2s ease-in-out'
            }}>
              <div style={{ padding: '24px 24px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>{tournament.name}</h3>
                  {getStatusBadge(tournament.status)}
                </div>
                {tournament.description && (
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>{tournament.description}</p>
                )}
              </div>
              
              <div style={{ padding: '0 24px 24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: '#6b7280' }}>
                    <span style={{ marginRight: '8px' }}>📅</span>
                    <span>{new Date(tournament.date).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: '#6b7280' }}>
                    <span style={{ marginRight: '8px' }}>👥</span>
                    <span>{tournament.enrollment_count || 0} players enrolled</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: '#6b7280' }}>
                    <span style={{ marginRight: '8px' }}>🏆</span>
                    <span>Max: {tournament.max_players} players</span>
                  </div>
                  {tournament.entry_fee && (
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: '#6b7280' }}>
                      <span style={{ fontWeight: '500' }}>Entry Fee: ${tournament.entry_fee}</span>
                    </div>
                  )}
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Link to={`/tournaments/${tournament.tournament_id}`} style={{ textDecoration: 'none' }}>
                    <button style={{
                      width: '100%',
                      backgroundColor: 'white',
                      color: '#374151',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      padding: '10px 16px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}>
                      View Details
                    </button>
                  </Link>
                  
                  {user.role === 'super_user' && (
                    <button 
                      onClick={() => console.log('Edit tournament:', tournament.tournament_id)}
                      style={{
                        width: '100%',
                        backgroundColor: '#e5e7eb',
                        color: '#1f2937',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        padding: '10px 16px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <span>✏️</span>
                      <span>Edit Tournament</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '48px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#9ca3af', fontSize: '16px' }}>
            {searchTerm || filterStatus !== 'all' 
              ? 'No tournaments match your search criteria.' 
              : 'No tournaments available at the moment.'}
          </p>
        </div>
      )}

      {/* Simple Create Tournament Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '32px',
            maxWidth: '500px',
            width: '100%'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Create Tournament</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '24px',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '8px' }}>
                Tournament Name
              </label>
              <input
                type="text"
                placeholder="Enter tournament name"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '8px' }}>
                Tournament Date
              </label>
              <input
                type="date"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  flex: 1,
                  backgroundColor: 'white',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Tournament created successfully!')
                  setShowCreateModal(false)
                }}
                style={{
                  flex: 1,
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Create Tournament
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Tournaments