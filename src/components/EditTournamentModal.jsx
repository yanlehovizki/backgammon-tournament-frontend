import { useState } from 'react'

const EditTournamentModal = ({ isOpen, onClose, onTournamentUpdated, tournament, user }) => {
  if (!isOpen) return null

  return (
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
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '100%'
      }}>
        <h2>Edit Tournament</h2>
        <p>Tournament editing functionality coming soon...</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
}

export default EditTournamentModal