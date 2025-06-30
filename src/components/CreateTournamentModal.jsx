import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Shuffle, Calendar, Users, Trophy, Settings, MapPin, DollarSign, Clock, Info } from 'lucide-react';

const CreateTournamentModal = ({ isOpen, onClose, onTournamentCreated }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    description: '',
    format: 'single-elimination',
    category: 'amateur',
    maxPlayers: 16,
    entryFee: 0,
    prizePool: 0,
    
    // Schedule
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    registrationDeadline: '',
    
    // Location
    location: '',
    venue: '',
    address: '',
    isOnline: false,
    
    // Settings
    allowRegistration: true,
    requireApproval: false,
    isPrivate: false,
    password: '',
    rules: '',
    gameSettings: {
      matchDuration: 45,
      pointsToWin: 21,
      timeControl: 'standard'
    },
    
    // Players
    players: []
  });

  const [errors, setErrors] = useState({});

  // Don't render if not open
  if (!isOpen) return null;

  const totalSteps = 4;

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1: // Basic Info
        if (!formData.name.trim()) newErrors.name = 'Tournament name is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (formData.maxPlayers < 2) newErrors.maxPlayers = 'Must have at least 2 players';
        if (formData.maxPlayers > 128) newErrors.maxPlayers = 'Maximum 128 players allowed';
        if (formData.entryFee < 0) newErrors.entryFee = 'Entry fee cannot be negative';
        if (formData.prizePool < 0) newErrors.prizePool = 'Prize pool cannot be negative';
        break;
      
      case 2: // Schedule
        if (!formData.startDate) newErrors.startDate = 'Start date is required';
        if (!formData.startTime) newErrors.startTime = 'Start time is required';
        if (!formData.registrationDeadline) newErrors.registrationDeadline = 'Registration deadline is required';
        
        // Validate dates
        const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
        const regDeadline = new Date(formData.registrationDeadline);
        const now = new Date();
        
        if (startDateTime <= now) newErrors.startDate = 'Start date must be in the future';
        if (regDeadline <= now) newErrors.registrationDeadline = 'Registration deadline must be in the future';
        if (regDeadline >= startDateTime) newErrors.registrationDeadline = 'Registration must close before tournament starts';
        break;
      
      case 3: // Location
        if (!formData.isOnline && !formData.location.trim()) {
          newErrors.location = 'Location is required for in-person tournaments';
        }
        break;
      
      case 4: // Settings & Review
        if (formData.isPrivate && !formData.password.trim()) {
          newErrors.password = 'Password is required for private tournaments';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

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

  const handleGameSettingChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      gameSettings: {
        ...prev.gameSettings,
        [field]: value
      }
    }));
  };

  const addPlayer = () => {
    const newPlayer = {
      id: Date.now(),
      name: '',
      email: '',
      rank: 'Unranked',
      seed: formData.players.length + 1
    };
    
    setFormData(prev => ({
      ...prev,
      players: [...prev.players, newPlayer]
    }));
  };

  const removePlayer = (playerId) => {
    setFormData(prev => ({
      ...prev,
      players: prev.players.filter(p => p.id !== playerId).map((p, index) => ({
        ...p,
        seed: index + 1
      }))
    }));
  };

  const updatePlayer = (playerId, field, value) => {
    setFormData(prev => ({
      ...prev,
      players: prev.players.map(p => 
        p.id === playerId ? { ...p, [field]: value } : p
      )
    }));
  };

  const shufflePlayers = () => {
    setFormData(prev => ({
      ...prev,
      players: [...prev.players].sort(() => Math.random() - 0.5).map((p, index) => ({
        ...p,
        seed: index + 1
      }))
    }));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create tournament object
      const tournament = {
        ...formData,
        id: Date.now(),
        status: 'upcoming',
        currentPlayers: formData.players.length,
        organizer: 'Current User', // Replace with actual user
        createdAt: new Date().toISOString()
      };

      console.log('Tournament created:', tournament);
      
      // Call the callback
      onTournamentCreated(tournament);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        format: 'single-elimination',
        category: 'amateur',
        maxPlayers: 16,
        entryFee: 0,
        prizePool: 0,
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        registrationDeadline: '',
        location: '',
        venue: '',
        address: '',
        isOnline: false,
        allowRegistration: true,
        requireApproval: false,
        isPrivate: false,
        password: '',
        rules: '',
        gameSettings: {
          matchDuration: 45,
          pointsToWin: 21,
          timeControl: 'standard'
        },
        players: []
      });
      
      setCurrentStep(1);
      setErrors({});
      
    } catch (error) {
      console.error('Error creating tournament:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStepTitle = (step) => {
    const titles = {
      1: 'Basic Information',
      2: 'Schedule',
      3: 'Location & Players',
      4: 'Settings & Review'
    };
    return titles[step];
  };

  const formatOptions = [
    { value: 'single-elimination', label: 'Single Elimination', description: 'One loss and you\'re out' },
    { value: 'double-elimination', label: 'Double Elimination', description: 'Two losses and you\'re out' },
    { value: 'round-robin', label: 'Round Robin', description: 'Everyone plays everyone' },
    { value: 'swiss-system', label: 'Swiss System', description: 'Paired by performance' }
  ];

  const categoryOptions = [
    { value: 'beginner', label: 'Beginner', description: 'New to competitive play' },
    { value: 'amateur', label: 'Amateur', description: 'Casual competitive play' },
    { value: 'professional', label: 'Professional', description: 'High-level competition' },
    { value: 'mixed', label: 'Mixed', description: 'All skill levels welcome' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* Modal header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Create Tournament</h2>
              <p className="text-gray-600">Step {currentStep} of {totalSteps}: {getStepTitle(currentStep)}</p>
            </div>
            <button
              onClick={onClose}
              className="btn btn-outline btn-sm"
            >
              <X size={16} />
            </button>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i + 1}
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    i + 1 <= currentStep
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step content */}
          <div className="mb-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tournament Name *
                    </label>
                    <input
                      type="text"
                      className={`form-input ${errors.name ? 'border-red-500' : ''}`}
                      placeholder="Enter tournament name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                    >
                      {categoryOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    className={`form-textarea ${errors.description ? 'border-red-500' : ''}`}
                    rows={3}
                    placeholder="Describe your tournament"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tournament Format *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formatOptions.map(option => (
                      <div
                        key={option.value}
                        className={`p-4 border rounded-lg cursor-pointer transition ${
                          formData.format === option.value
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleInputChange('format', option.value)}
                      >
                        <h4 className="font-medium text-gray-900">{option.label}</h4>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Players *
                    </label>
                    <input
                      type="number"
                      min="2"
                      max="128"
                      className={`form-input ${errors.maxPlayers ? 'border-red-500' : ''}`}
                      value={formData.maxPlayers}
                      onChange={(e) => handleInputChange('maxPlayers', parseInt(e.target.value) || 0)}
                    />
                    {errors.maxPlayers && <p className="text-red-500 text-sm mt-1">{errors.maxPlayers}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Entry Fee ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className={`form-input ${errors.entryFee ? 'border-red-500' : ''}`}
                      value={formData.entryFee}
                      onChange={(e) => handleInputChange('entryFee', parseFloat(e.target.value) || 0)}
                    />
                    {errors.entryFee && <p className="text-red-500 text-sm mt-1">{errors.entryFee}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prize Pool ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className={`form-input ${errors.prizePool ? 'border-red-500' : ''}`}
                      value={formData.prizePool}
                      onChange={(e) => handleInputChange('prizePool', parseFloat(e.target.value) || 0)}
                    />
                    {errors.prizePool && <p className="text-red-500 text-sm mt-1">{errors.prizePool}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Schedule */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      className={`form-input ${errors.startDate ? 'border-red-500' : ''}`}
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                    />
                    {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time *
                    </label>
                    <input
                      type="time"
                      className={`form-input ${errors.startTime ? 'border-red-500' : ''}`}
                      value={formData.startTime}
                      onChange={(e) => handleInputChange('startTime', e.target.value)}
                    />
                    {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      className="form-input"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      className="form-input"
                      value={formData.endTime}
                      onChange={(e) => handleInputChange('endTime', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Deadline *
                  </label>
                  <input
                    type="datetime-local"
                    className={`form-input ${errors.registrationDeadline ? 'border-red-500' : ''}`}
                    value={formData.registrationDeadline}
                    onChange={(e) => handleInputChange('registrationDeadline', e.target.value)}
                  />
                  {errors.registrationDeadline && <p className="text-red-500 text-sm mt-1">{errors.registrationDeadline}</p>}
                </div>
              </div>
            )}

            {/* Step 3: Location & Players */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 mb-4">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={formData.isOnline}
                      onChange={(e) => handleInputChange('isOnline', e.target.checked)}
                    />
                    <span className="text-sm font-medium text-gray-700">Online Tournament</span>
                  </label>
                </div>

                {!formData.isOnline && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location *
                      </label>
                      <input
                        type="text"
                        className={`form-input ${errors.location ? 'border-red-500' : ''}`}
                        placeholder="City, State/Country"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                      />
                      {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Venue
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Venue name"
                        value={formData.venue}
                        onChange={(e) => handleInputChange('venue', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <textarea
                        className="form-textarea"
                        rows={2}
                        placeholder="Full address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* Pre-register Players */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Pre-register Players</h3>
                    <button
                      type="button"
                      onClick={addPlayer}
                      className="btn btn-outline btn-sm"
                      disabled={formData.players.length >= formData.maxPlayers}
                    >
                      <Plus size={16} />
                      Add Player
                    </button>
                  </div>

                  {formData.players.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {formData.players.map((player, index) => (
                        <div key={player.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                          <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {player.seed}
                          </span>
                          <input
                            type="text"
                            placeholder="Player name"
                            className="form-input flex-1"
                            value={player.name}
                            onChange={(e) => updatePlayer(player.id, 'name', e.target.value)}
                          />
                          <input
                            type="email"
                            placeholder="Email"
                            className="form-input flex-1"
                            value={player.email}
                            onChange={(e) => updatePlayer(player.id, 'email', e.target.value)}
                          />
                          <select
                            className="form-select w-32"
                            value={player.rank}
                            onChange={(e) => updatePlayer(player.id, 'rank', e.target.value)}
                          >
                            <option value="Unranked">Unranked</option>
                            <option value="Bronze">Bronze</option>
                            <option value="Silver">Silver</option>
                            <option value="Gold">Gold</option>
                            <option value="Platinum">Platinum</option>
                            <option value="Diamond">Diamond</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => removePlayer(player.id)}
                            className="btn btn-outline btn-sm text-red-600 hover:bg-red-50"
                          >
                            <Minus size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {formData.players.length > 1 && (
                    <button
                      type="button"
                      onClick={shufflePlayers}
                      className="btn btn-outline btn-sm"
                    >
                      <Shuffle size={16} />
                      Shuffle Seeding
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Settings & Review */}
            {currentStep === 4 && (
              <div className="space-y-6">
                {/* Registration Settings */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Registration Settings</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={formData.allowRegistration}
                        onChange={(e) => handleInputChange('allowRegistration', e.target.checked)}
                      />
                      <span className="text-sm text-gray-700">Allow public registration</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={formData.requireApproval}
                        onChange={(e) => handleInputChange('requireApproval', e.target.checked)}
                      />
                      <span className="text-sm text-gray-700">Require approval for registration</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={formData.isPrivate}
                        onChange={(e) => handleInputChange('isPrivate', e.target.checked)}
                      />
                      <span className="text-sm text-gray-700">Private tournament (password required)</span>
                    </label>

                    {formData.isPrivate && (
                      <div className="ml-6">
                        <input
                          type="password"
                          className={`form-input ${errors.password ? 'border-red-500' : ''}`}
                          placeholder="Tournament password"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                      </div>
                    )}
                  </div>
                </div>

                {/* Game Settings */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Game Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Match Duration (minutes)
                      </label>
                      <input
                        type="number"
                        min="15"
                        max="180"
                        className="form-input"
                        value={formData.gameSettings.matchDuration}
                        onChange={(e) => handleGameSettingChange('matchDuration', parseInt(e.target.value) || 45)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Points to Win
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        className="form-input"
                        value={formData.gameSettings.pointsToWin}
                        onChange={(e) => handleGameSettingChange('pointsToWin', parseInt(e.target.value) || 21)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time Control
                      </label>
                      <select
                        className="form-select"
                        value={formData.gameSettings.timeControl}
                        onChange={(e) => handleGameSettingChange('timeControl', e.target.value)}
                      >
                        <option value="blitz">Blitz</option>
                        <option value="standard">Standard</option>
                        <option value="extended">Extended</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Rules */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tournament Rules
                  </label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    placeholder="Enter tournament rules and regulations..."
                    value={formData.rules}
                    onChange={(e) => handleInputChange('rules', e.target.value)}
                  />
                </div>

                {/* Review Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Tournament Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Name:</strong> {formData.name}</p>
                      <p><strong>Format:</strong> {formatOptions.find(f => f.value === formData.format)?.label}</p>
                      <p><strong>Category:</strong> {categoryOptions.find(c => c.value === formData.category)?.label}</p>
                      <p><strong>Max Players:</strong> {formData.maxPlayers}</p>
                    </div>
                    <div>
                      <p><strong>Entry Fee:</strong> ${formData.entryFee}</p>
                      <p><strong>Prize Pool:</strong> ${formData.prizePool}</p>
                      <p><strong>Location:</strong> {formData.isOnline ? 'Online' : formData.location}</p>
                      <p><strong>Pre-registered:</strong> {formData.players.length} players</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal footer */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="btn btn-outline"
            >
              Previous
            </button>

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="btn btn-outline"
              >
                Cancel
              </button>

              {currentStep < totalSteps ? (
                <button
                  onClick={handleNext}
                  className="btn btn-primary"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? (
                    <>
                      <div className="spinner w-4 h-4 border-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Trophy size={16} />
                      Create Tournament
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTournamentModal;