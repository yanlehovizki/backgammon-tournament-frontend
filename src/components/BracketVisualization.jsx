import React from 'react'

const BracketVisualization = ({ tournament, onMatchClick }) => {
  if (!tournament || !tournament.matches) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🏆</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bracket Available</h3>
        <p className="text-gray-600">The tournament bracket will be generated once all players are registered.</p>
      </div>
    )
  }

  // Generate bracket structure based on tournament format
  const generateBracket = () => {
    const { matches, format, maxPlayers } = tournament
    
    if (format === 'single-elimination') {
      return generateSingleEliminationBracket(matches, maxPlayers)
    } else if (format === 'double-elimination') {
      return generateDoubleEliminationBracket(matches, maxPlayers)
    } else {
      return generateRoundRobinBracket(matches)
    }
  }

  const generateSingleEliminationBracket = (matches, maxPlayers) => {
    const rounds = Math.ceil(Math.log2(maxPlayers))
    const bracket = []
    
    for (let round = 1; round <= rounds; round++) {
      const roundMatches = matches.filter(match => match.round === round)
      bracket.push({
        round,
        name: getRoundName(round, rounds),
        matches: roundMatches
      })
    }
    
    return bracket
  }

  const generateDoubleEliminationBracket = (matches, maxPlayers) => {
    // Simplified double elimination - would need more complex logic for full implementation
    return generateSingleEliminationBracket(matches, maxPlayers)
  }

  const generateRoundRobinBracket = (matches) => {
    const rounds = [...new Set(matches.map(m => m.round))].sort()
    return rounds.map(round => ({
      round,
      name: `Round ${round}`,
      matches: matches.filter(m => m.round === round)
    }))
  }

  const getRoundName = (round, totalRounds) => {
    const roundsFromEnd = totalRounds - round + 1
    switch (roundsFromEnd) {
      case 1: return 'Final'
      case 2: return 'Semi-Final'
      case 3: return 'Quarter-Final'
      case 4: return 'Round of 16'
      case 5: return 'Round of 32'
      default: return `Round ${round}`
    }
  }

  const getMatchStatus = (match) => {
    if (match.status === 'completed') {
      return 'completed'
    } else if (match.status === 'active') {
      return 'active'
    } else {
      return 'upcoming'
    }
  }

  const getWinner = (match) => {
    if (match.status !== 'completed') return null
    return match.score1 > match.score2 ? match.player1 : match.player2
  }

  const bracket = generateBracket()

  return (
    <div className="bracket-container">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <span>🏆</span>
          Tournament Bracket
        </h3>
        <p className="text-gray-600">
          {tournament.format.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Format
        </p>
      </div>

      <div className="bracket-wrapper" style={{ overflowX: 'auto' }}>
        <div className="flex gap-8" style={{ minWidth: 'max-content' }}>
          {bracket.map((round, roundIndex) => (
            <div key={round.round} className="bracket-round">
              <div className="text-center mb-4">
                <h4 className="font-semibold text-lg text-gray-900">{round.name}</h4>
                <p className="text-sm text-gray-500">{round.matches.length} matches</p>
              </div>
              
              <div className="space-y-4">
                {round.matches.map((match, matchIndex) => (
                  <div
                    key={match.id}
                    className={`bracket-match ${getMatchStatus(match)}`}
                    onClick={() => onMatchClick && onMatchClick(match)}
                    style={{ cursor: onMatchClick ? 'pointer' : 'default' }}
                  >
                    <div className="bracket-match-header">
                      <span className="text-xs text-gray-500">Match {match.id}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        match.status === 'completed' ? 'bg-green-100 text-green-700' :
                        match.status === 'active' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mt-3">
                      <div className={`bracket-player ${getWinner(match) === match.player1 ? 'winner' : ''}`}>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-semibold">
                            {match.player1 ? match.player1.split(' ').map(n => n[0]).join('') : '?'}
                          </div>
                          <span className="font-medium">{match.player1 || 'TBD'}</span>
                        </div>
                        <span className="bracket-score">
                          {match.status === 'completed' ? match.score1 : '-'}
                        </span>
                      </div>
                      
                      <div className={`bracket-player ${getWinner(match) === match.player2 ? 'winner' : ''}`}>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center font-semibold">
                            {match.player2 ? match.player2.split(' ').map(n => n[0]).join('') : '?'}
                          </div>
                          <span className="font-medium">{match.player2 || 'TBD'}</span>
                        </div>
                        <span className="bracket-score">
                          {match.status === 'completed' ? match.score2 : '-'}
                        </span>
                      </div>
                    </div>
                    
                    {match.status === 'completed' && (
                      <div className="mt-3 pt-2 border-t border-gray-200">
                        <div className="text-center">
                          <span className="text-xs text-gray-500">Winner: </span>
                          <span className="text-xs font-semibold text-green-600">
                            {getWinner(match)}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {onMatchClick && (
                      <div className="mt-2 text-center">
                        <span className="text-xs text-blue-600">Click to edit</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Connector to next round */}
              {roundIndex < bracket.length - 1 && (
                <div className="bracket-connector" style={{ 
                  position: 'absolute',
                  right: '-2rem',
                  top: '50%',
                  height: '60%',
                  transform: 'translateY(-50%)'
                }}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bracket Legend */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold mb-3">Legend</h4>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Completed Match</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Active Match</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded"></div>
            <span>Upcoming Match</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-400 rounded"></div>
            <span>Winner Highlight</span>
          </div>
        </div>
      </div>

      {/* Tournament Progress */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <span>📊</span>
          Tournament Progress
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {tournament.matches.filter(m => m.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {tournament.matches.filter(m => m.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-600">
              {tournament.matches.filter(m => m.status === 'upcoming').length}
            </div>
            <div className="text-sm text-gray-600">Upcoming</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {Math.round((tournament.matches.filter(m => m.status === 'completed').length / tournament.matches.length) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Complete</div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
              style={{ 
                width: `${(tournament.matches.filter(m => m.status === 'completed').length / tournament.matches.length) * 100}%` 
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BracketVisualization