import React, { useState } from 'react';

const CreateTournamentModal = ({ isOpen, onClose, onTournamentCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    format: 'single-elimination',
    maxPlayers: 16,
    startDate: '',
    startTime: '',
    location: '',
    prizePool: 0,
    entryFee: 0
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Tournament name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (formData.maxPlayers < 2) newErrors.maxPlayers = 'Must have at least 2 players';
    if (formData.maxPlayers > 128) newErrors.maxPlayers = 'Maximum 128 players allowed';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const tournament = {
      ...formData,
      id: Date.now(),
      status: 'upcoming',
      currentPlayers: 0,
      createdAt: new Date().toISOString()
    };
    
    onTournamentCreated(tournament);
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      format: 'single-elimination',
      maxPlayers: 16,
      startDate: '',
      startTime: '',
      location: '',
      prizePool: 0,
      entryFee: 0
    });
    setErrors({});
  };

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
        padding: '30px',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#333' }}>Create Tournament</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 'bold' }}>
              Tournament Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: `1px solid ${errors.name ? '#dc3545' : '#ddd'}`,
                borderRadius: '5px',
                fontSize: '14px'
              }}
              placeholder="Enter tournament name"
            />
            {errors.name && <p style={{ color: '#dc3545', fontSize: '12px', margin: '5px 0 0 0' }}>{errors.name}</p>}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 'bold' }}>
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: `1px solid ${errors.description ? '#dc3545' : '#ddd'}`,
                borderRadius: '5px',
                fontSize: '14px',
                minHeight: '80px',
                resize: 'vertical'
              }}
              placeholder="Describe your tournament"
            />
            {errors.description && <p style={{ color: '#dc3545', fontSize: '12px', margin: '5px 0 0 0' }}>{errors.description}</p>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 'bold' }}>
                Format
              </label>
              <select
                value={formData.format}
                onChange={(e) => handleInputChange('format', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
              >
                <option value="single-elimination">Single Elimination</option>
                <option value="double-elimination">Double Elimination</option>
                <option value="round-robin">Round Robin</option>
                <option value="swiss-system">Swiss System</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 'bold' }}>
                Max Players *
              </label>
              <input
                type="number"
                min="2"
                max="128"
                value={formData.maxPlayers}
                onChange={(e) => handleInputChange('maxPlayers', parseInt(e.target.value) || 0)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: `1px solid ${errors.maxPlayers ? '#dc3545' : '#ddd'}`,
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
              />
              {errors.maxPlayers && <p style={{ color: '#dc3545', fontSize: '12px', margin: '5px 0 0 0' }}>{errors.maxPlayers}</p>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 'bold' }}>
                Start Date *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: `1px solid ${errors.startDate ? '#dc3545' : '#ddd'}`,
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
              />
              {errors.startDate && <p style={{ color: '#dc3545', fontSize: '12px', margin: '5px 0 0 0' }}>{errors.startDate}</p>}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 'bold' }}>
                Start Time *
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: `1px solid ${errors.startTime ? '#dc3545' : '#ddd'}`,
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
              />
              {errors.startTime && <p style={{ color: '#dc3545', fontSize: '12px', margin: '5px 0 0 0' }}>{errors.startTime}</p>}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 'bold' }}>
              Location *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: `1px solid ${errors.location ? '#dc3545' : '#ddd'}`,
                borderRadius: '5px',
                fontSize: '14px'
              }}
              placeholder="Tournament location"
            />
            {errors.location && <p style={{ color: '#dc3545', fontSize: '12px', margin: '5px 0 0 0' }}>{errors.location}</p>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 'bold' }}>
                Entry Fee ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.entryFee}
                onChange={(e) => handleInputChange('entryFee', parseFloat(e.target.value) || 0)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 'bold' }}>
                Prize Pool ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.prizePool}
                onChange={(e) => handleInputChange('prizePool', parseFloat(e.target.value) || 0)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                backgroundColor: 'white',
                color: '#333',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                backgroundColor: '#007bff',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Create Tournament
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTournamentModal;