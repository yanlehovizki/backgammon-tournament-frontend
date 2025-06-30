import React, { useState, useEffect } from 'react';
import { 
  X,
  Plus,
  Minus,
  Users,
  Trophy,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Settings,
  Save,
  Upload,
  Shuffle,
  Check,
  AlertCircle,
  Info,
  Star,
  Target,
  Zap,
  Award,
  FileText,
  Image as ImageIcon,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

const CreateTournamentModal = ({ isOpen, onClose, onTournamentCreated }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [tournamentData, setTournamentData] = useState({
    // Basic Information
    name: '',
    description: '',
    format: 'single-elimination',
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
    
    // Rules & Settings
    rules: '',
    gameSettings: {
      matchDuration: 30,
      pointsToWin: 15,
      timeControl: 'standard'
    },
    
    // Players
    players: [],
    allowRegistration: true,
    requireApproval: false,
    
    // Media
    banner: null,
    logo: null,
    
    // Advanced
    isPrivate: false,
    password: '',
    category: 'general'
  });

  const steps = [
    { id: 1, title: 'Basic Info', icon: FileText },
    { id: 2, title: 'Schedule', icon: Calendar },
    { id: 3, title: 'Players', icon: Users },
    { id: 4, title: 'Settings', icon: Settings }
  ];

  const tournamentFormats = [
    {
      id: 'single-elimination',
      name: 'Single Elimination',
      description: 'Players are eliminated after one loss',
      icon: Target,
      recommended: true
    },
    {
      id: 'double-elimination',
      name: 'Double Elimination',
      description: 'Players get a second chance in losers bracket',
      icon: Zap,
      recommended: false
    },
    {
      id: 'round-robin',
      name: 'Round Robin',
      description: 'Every player plays every other player',
      icon: Award,
      recommended: false
    },
    {
      id: 'swiss-system',
      name: 'Swiss System',
      description: 'Players paired based on performance',
      icon: Star,
      recommended: false
    }
  ];

  const categories = [
    { id: 'general', name: 'General Tournament' },
    { id: 'beginner', name: 'Beginner Friendly' },
    { id: 'intermediate', name: 'Intermediate Level' },
    { id: 'advanced', name: 'Advanced Players' },
    { id: 'professional', name: 'Professional League' },
    { id: 'casual', name: 'Casual Play' }
  ];

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setErrors({});
      setTournamentData({
        name: '',
        description: '',
        format: 'single-elimination',
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
        rules: '',
        gameSettings: {
          matchDuration: 30,
          pointsToWin: 15,
          timeControl: 'standard'
        },
        players: [],
        allowRegistration: true,
        requireApproval: false,
        banner: null,
        logo: null,
        isPrivate: false,
        password: '',
        category: 'general'
      });
    }
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setTournamentData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleNestedInputChange = (parent, field, value) => {
    setTournamentData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!tournamentData.name.trim()) {
          newErrors.name = 'Tournament name is required';
        }
        if (!tournamentData.description.trim()) {
          newErrors.description = 'Description is required';
        }
        if (tournamentData.maxPlayers < 2) {
          newErrors.maxPlayers = 'Minimum 2 players required';
        }
        if (tournamentData.maxPlayers > 128) {
          newErrors.maxPlayers = 'Maximum 128 players allowed';
        }
        break;
        
      case 2:
        if (!tournamentData.startDate) {
          newErrors.startDate = 'Start date is required';
        }
        if (!tournamentData.startTime) {
          newErrors.startTime = 'Start time is required';
        }
        if (!tournamentData.registrationDeadline) {
          newErrors.registrationDeadline = 'Registration deadline is required';
        }
        
        // Validate dates
        const startDateTime = new Date(`${tournamentData.startDate}T${tournamentData.startTime}`);
        const regDeadline = new Date(tournamentData.registrationDeadline);
        const now = new Date();
        
        if (startDateTime <= now) {
          newErrors.startDate = 'Start date must be in the future';
        }
        if (regDeadline >= startDateTime) {
          newErrors.registrationDeadline = 'Registration must close before tournament starts';
        }
        break;
        
      case 3:
        if (!tournamentData.location.trim()) {
          newErrors.location = 'Location is required';
        }
        break;
        
      case 4:
        if (!tournamentData.rules.trim()) {
          newErrors.rules = 'Tournament rules are required';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const addPlayer = () => {
    const newPlayer = {
      id: Date.now(),
      name: '',
      email: '',
      rank: 'Unranked',
      seed: tournamentData.players.length + 1
    };
    
    setTournamentData(prev => ({
      ...prev,
      players: [...prev.players, newPlayer]
    }));
  };

  const removePlayer = (playerId) => {
    setTournamentData(prev => ({
      ...prev,
      players: prev.players.filter(p => p.id !== playerId)
    }));
  };

  const updatePlayer = (playerId, field, value) => {
    setTournamentData(prev => ({
      ...prev,
      players: prev.players.map(p => 
        p.id === playerId ? { ...p, [field]: value } : p
      )
    }));
  };

  const shufflePlayers = () => {
    setTournamentData(prev => ({
      ...prev,
      players: [...prev.players].sort(() => Math.random() - 0.5).map((player, index) => ({
        ...player,
        seed: index + 1
      }))
    }));
  };

  const handleFileUpload = (field, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange(field, e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculatePrizeDistribution = () => {
    const total = tournamentData.prizePool;
    if (total <= 0) return [];
    
    return [
      { place: '1st', amount: Math.round(total * 0.5), percentage: 50 },
      { place: '2nd', amount: Math.round(total * 0.3), percentage: 30 },
      { place: '3rd', amount: Math.round(total * 0.2), percentage: 20 }
    ];
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would send tournamentData to your API
      console.log('Creating tournament:', tournamentData);
      
      // Call the callback function
      if (onTournamentCreated) {
        onTournamentCreated(tournamentData);
      }
      
      // Close modal
      onClose();
    } catch (error) {
      console.error('Error creating tournament:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStepProgress = () => {
    return (currentStep / steps.length) * 100;
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-4xl w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create Tournament</h2>
            <p className="text-gray-600">Set up your new tournament</p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-outline btn-sm"
          >
            <X size={16} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(getStepProgress())}% Complete
            </span>
          </div>
          
          <div className="progress-bar mb-6">
            <div 
              className="progress-fill transition-all duration-500"
              style={{ width: `${getStepProgress()}%` }}
            ></div>
          </div>

          {/* Step Navigation */}
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex flex-col items-center cursor-pointer transition ${
                  currentStep >= step.id
                    ? 'text-primary-600'
                    : 'text-gray-400'
                }`}
                onClick={() => currentStep > step.id && setCurrentStep(step.id)}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition ${
                  currentStep >= step.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {currentStep > step.id ? (
                    <Check size={16} />
                  ) : (
                    <step.icon size={16} />
                  )}
                </div>
                <span className="text-xs font-medium text-center">
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="form-label">Tournament Name *</label>
                  <input
                    type="text"
                    className={`form-input ${errors.name ? 'border-error-500' : ''}`}
                    placeholder="Enter tournament name"
                    value={tournamentData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                  {errors.name && (
                    <p className="text-error-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={tournamentData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  className={`form-input h-24 resize-none ${errors.description ? 'border-error-500' : ''}`}
                  placeholder="Describe your tournament..."
                  value={tournamentData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
                {errors.description && (
                  <p className="text-error-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              {/* Tournament Format */}
              <div className="form-group">
                <label className="form-label">Tournament Format</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tournamentFormats.map(format => (
                    <div
                      key={format.id}
                      className={`relative p-4 border-2 rounded-lg cursor-pointer transition ${
                        tournamentData.format === format.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleInputChange('format', format.id)}
                    >
                      {format.recommended && (
                        <span className="absolute top-2 right-2 bg-success-500 text-white text-xs px-2 py-1 rounded">
                          Recommended
                        </span>
                      )}
                      <div className="flex items-center gap-3 mb-2">
                        <format.icon size={20} className="text-primary-500" />
                        <h3 className="font-semibold">{format.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600">{format.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Players and Prize */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="form-group">
                  <label className="form-label">Max Players *</label>
                  <input
                    type="number"
                    min="2"
                    max="128"
                    className={`form-input ${errors.maxPlayers ? 'border-error-500' : ''}`}
                    value={tournamentData.maxPlayers}
                    onChange={(e) => handleInputChange('maxPlayers', parseInt(e.target.value))}
                  />
                  {errors.maxPlayers && (
                    <p className="text-error-500 text-sm mt-1">{errors.maxPlayers}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Entry Fee ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="form-input"
                    placeholder="0.00"
                    value={tournamentData.entryFee}
                    onChange={(e) => handleInputChange('entryFee', parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Prize Pool ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="form-input"
                    placeholder="0.00"
                    value={tournamentData.prizePool}
                    onChange={(e) => handleInputChange('prizePool', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              {/* Prize Distribution Preview */}
              {tournamentData.prizePool > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Prize Distribution</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {calculatePrizeDistribution().map(prize => (
                      <div key={prize.place} className="text-center">
                        <div className="font-semibold text-gray-900">{prize.place}</div>
                        <div className="text-lg font-bold text-primary-600">${prize.amount}</div>
                        <div className="text-sm text-gray-600">{prize.percentage}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Schedule */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="form-label">Start Date *</label>
                  <input
                    type="date"
                    className={`form-input ${errors.startDate ? 'border-error-500' : ''}`}
                    value={tournamentData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.startDate && (
                    <p className="text-error-500 text-sm mt-1">{errors.startDate}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Start Time *</label>
                  <input
                    type="time"
                    className={`form-input ${errors.startTime ? 'border-error-500' : ''}`}
                    value={tournamentData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                  />
                  {errors.startTime && (
                    <p className="text-error-500 text-sm mt-1">{errors.startTime}</p>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Registration Deadline *</label>
                <input
                  type="datetime-local"
                  className={`form-input ${errors.registrationDeadline ? 'border-error-500' : ''}`}
                  value={tournamentData.registrationDeadline}
                  onChange={(e) => handleInputChange('registrationDeadline', e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  max={tournamentData.startDate && tournamentData.startTime 
                    ? `${tournamentData.startDate}T${tournamentData.startTime}`
                    : undefined
                  }
                />
                {errors.registrationDeadline && (
                  <p className="text-error-500 text-sm mt-1">{errors.registrationDeadline}</p>
                )}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Info size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Scheduling Tips</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Allow enough time between registration deadline and start</li>
                      <li>• Consider time zones if you have international participants</li>
                      <li>• Single elimination typically takes 3-4 hours for 16 players</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Players */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <input
                    type="text"
                    className={`form-input ${errors.location ? 'border-error-500' : ''}`}
                    placeholder="City, State or Online"
                    value={tournamentData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  />
                  {errors.location && (
                    <p className="text-error-500 text-sm mt-1">{errors.location}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Venue Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Convention Center, Gaming Lounge, etc."
                    value={tournamentData.venue}
                    onChange={(e) => handleInputChange('venue', e.target.value)}
                  />
                </div>
              </div>

              {/* Registration Settings */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4">Registration Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Allow Public Registration</h4>
                      <p className="text-sm text-gray-600">Players can register themselves</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tournamentData.allowRegistration}
                        onChange={(e) => handleInputChange('allowRegistration', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Require Approval</h4>
                      <p className="text-sm text-gray-600">Manually approve each registration</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tournamentData.requireApproval}
                        onChange={(e) => handleInputChange('requireApproval', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Pre-registered Players */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Pre-registered Players</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={shufflePlayers}
                      className="btn btn-outline btn-sm"
                      disabled={tournamentData.players.length < 2}
                    >
                      <Shuffle size={16} />
                      Shuffle
                    </button>
                    <button
                      onClick={addPlayer}
                      className="btn btn-primary btn-sm"
                    >
                      <Plus size={16} />
                      Add Player
                    </button>
                  </div>
                </div>

                {tournamentData.players.length > 0 ? (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {tournamentData.players.map((player, index) => (
                      <div key={player.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                          {player.seed}
                        </div>
                        
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <input
                            type="text"
                            placeholder="Player name"
                            className="form-input"
                            value={player.name}
                            onChange={(e) => updatePlayer(player.id, 'name', e.target.value)}
                          />
                          <input
                            type="email"
                            placeholder="Email (optional)"
                            className="form-input"
                            value={player.email}
                            onChange={(e) => updatePlayer(player.id, 'email', e.target.value)}
                          />
                          <select
                            className="form-select"
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
                        </div>
                        
                        <button
                          onClick={() => removePlayer(player.id)}
                          className="btn btn-outline btn-sm text-error-600 border-error-300 hover:bg-error-50"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>No players added yet. Add players manually or allow public registration.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Settings */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="form-group">
                <label className="form-label">Tournament Rules *</label>
                <textarea
                  className={`form-input h-32 resize-none ${errors.rules ? 'border-error-500' : ''}`}
                  placeholder="Describe the rules and regulations for your tournament..."
                  value={tournamentData.rules}
                  onChange={(e) => handleInputChange('rules', e.target.value)}
                />
                {errors.rules && (
                  <p className="text-error-500 text-sm mt-1">{errors.rules}</p>
                )}
              </div>

              {/* Game Settings */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4">Game Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="form-group">
                    <label className="form-label">Match Duration (minutes)</label>
                    <input
                      type="number"
                      min="5"
                      max="180"
                      className="form-input"
                      value={tournamentData.gameSettings.matchDuration}
                      onChange={(e) => handleNestedInputChange('gameSettings', 'matchDuration', parseInt(e.target.value))}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Points to Win</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      className="form-input"
                      value={tournamentData.gameSettings.pointsToWin}
                      onChange={(e) => handleNestedInputChange('gameSettings', 'pointsToWin', parseInt(e.target.value))}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Time Control</label>
                    <select
                      className="form-select"
                      value={tournamentData.gameSettings.timeControl}
                      onChange={(e) => handleNestedInputChange('gameSettings', 'timeControl', e.target.value)}
                    >
                      <option value="blitz">Blitz (Fast)</option>
                      <option value="standard">Standard</option>
                      <option value="extended">Extended (Slow)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4">Privacy & Access</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Private Tournament</h4>
                      <p className="text-sm text-gray-600">Only invited players can join</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tournamentData.isPrivate}
                        onChange={(e) => handleInputChange('isPrivate', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  {tournamentData.isPrivate && (
                    <div className="form-group">
                      <label className="form-label">Tournament Password</label>
                      <input
                        type="password"
                        className="form-input"
                        placeholder="Enter password for private tournament"
                        value={tournamentData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="flex gap-2">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="btn btn-outline"
              >
                <ArrowLeft size={16} />
                Previous
              </button>
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="btn btn-outline"
              disabled={loading}
            >
              Cancel
            </button>
            
            {currentStep < steps.length ? (
              <button
                onClick={nextStep}
                className="btn btn-primary"
              >
                Next
                <ArrowRight size={16} />
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
                    <Save size={16} />
                    Create Tournament
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTournamentModal;