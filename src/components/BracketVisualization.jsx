import { useState } from 'react'
import { Trophy, User, Clock, CheckCircle, Circle, Target } from 'lucide-react'

const BracketVisualization = ({ 
  bracket, 
  onMatchClick, 
  canEditResults = false, 
  highlightPlayer = null 
}) => {
  const [selectedMatch, setSelectedMatch] = useState(null)

  if (!bracket || !bracket.rounds || bracket.rounds.length === 0) {
    return (
      <div className="text-center py-12">
        <Trophy className="h-12 w-12 text-secondary mx-auto mb-4" />
        <h3 className="text-lg font-medium text-primary mb-2">No Bracket Available</h3>
        <p className="text-secondary">Tournament bracket will appear here once created.</p>
      </div>
    )
  }

  const getMatchStatusIcon = (match) => {
    switch (match.status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'pending':
        return <Circle className="h-4 w-4 text-blue-600" />
      case 'waiting':
        return <Clock className="h-4 w-4 text-gray-400" />
      default:
        return <Circle className="h-4 w-4 text-gray-400" />
    }
  }

  const getPlayerDisplayName = (player) => {
    if (!player) return 'TBD'
    if (player.isBye) return 'BYE'
    return player.name
  }

  const isPlayerHighlighted = (player) => {
    return highlightPlayer && player && player.id === highlightPlayer.id
  }

  const handleMatchClick = (match) => {
    if (canEditResults && match.status === 'pending') {
      setSelectedMatch(match)
      if (onMatchClick) {
        onMatchClick(match)
      }
    }
  }

  const MatchCard = ({ match, roundIndex }) => {
    const isClickable = canEditResults && match.status === 'pending'
    const isSelected = selectedMatch && selectedMatch.matchId === match.matchId
    
    return (
      <div
        className={`
          match-card relative p-4 border rounded-lg transition-all duration-200
          ${match.status === 'completed' ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}
          ${match.status === 'pending' ? 'border-blue-200 shadow-sm' : ''}
          ${match.status === 'waiting' ? 'bg-gray-50 border-gray-200' : ''}
          ${isClickable ? 'cursor-pointer hover:shadow-md hover:border-blue-300' : ''}
          ${isSelected ? 'ring-2 ring-blue-500 border-blue-500' : ''}
        `}
        onClick={() => handleMatchClick(match)}
        style={{ minHeight: '120px' }}
      >
        {/* Match Header */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            {getMatchStatusIcon(match)}
            <span className="text-sm font-medium text-secondary">
              Match {match.matchNumber}
            </span>
          </div>
          {match.status === 'completed' && match.winner && (
            <Trophy className="h-4 w-4 text-yellow-500" />
          )}
        </div>

        {/* Players */}
        <div className="space-y-3">
          {/* Player 1 */}
          <div className={`
            flex items-center justify-between p-2 rounded
            ${match.winner && match.winner.id === match.player1?.id ? 'bg-green-100 border border-green-300' : 'bg-gray-50'}
            ${isPlayerHighlighted(match.player1) ? 'ring-2 ring-blue-400' : ''}
          `}>
            <div className="flex items-center space-x-2">
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                ${match.player1?.isBye ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-blue-600'}
              `}>
                {match.player1?.isBye ? '-' : <User className="h-3 w-3" />}
              </div>
              <span className={`
                text-sm font-medium
                ${match.player1?.isBye ? 'text-gray-500 italic' : 'text-primary'}
                ${match.winner && match.winner.id === match.player1?.id ? 'font-bold' : ''}
              `}>
                {getPlayerDisplayName(match.player1)}
              </span>
            </div>
            <div className={`
              text-sm font-bold px-2 py-1 rounded
              ${match.status === 'completed' ? 'bg-white' : 'text-gray-400'}
            `}>
              {match.status === 'completed' ? (match.score?.player1 || 0) : '-'}
            </div>
          </div>

          {/* VS Divider */}
          <div className="text-center">
            <span className="text-xs text-secondary font-medium">VS</span>
          </div>

          {/* Player 2 */}
          <div className={`
            flex items-center justify-between p-2 rounded
            ${match.winner && match.winner.id === match.player2?.id ? 'bg-green-100 border border-green-300' : 'bg-gray-50'}
            ${isPlayerHighlighted(match.player2) ? 'ring-2 ring-blue-400' : ''}
          `}>
            <div className="flex items-center space-x-2">
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                ${match.player2?.isBye ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-blue-600'}
              `}>
                {match.player2?.isBye ? '-' : <User className="h-3 w-3" />}
              </div>
              <span className={`
                text-sm font-medium
                ${match.player2?.isBye ? 'text-gray-500 italic' : 'text-primary'}
                ${match.winner && match.winner.id === match.player2?.id ? 'font-bold' : ''}
              `}>
                {getPlayerDisplayName(match.player2)}
              </span>
            </div>
            <div className={`
              text-sm font-bold px-2 py-1 rounded
              ${match.status === 'completed' ? 'bg-white' : 'text-gray-400'}
            `}>
              {match.status === 'completed' ? (match.score?.player2 || 0) : '-'}
            </div>
          </div>
        </div>

        {/* Action Indicator */}
        {isClickable && (
          <div className="absolute top-2 right-2">
            <Target className="h-4 w-4 text-blue-500" />
          </div>
        )}

        {/* Winner Indicator */}
        {match.status === 'completed' && match.winner && (
          <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
            <Trophy className="h-3 w-3" />
          </div>
        )}
      </div>
    )
  }

  const ConnectorLine = ({ fromRound, toRound, matchIndex }) => {
    // Calculate connector positions and draw SVG lines
    return (
      <div className="connector-line flex items-center justify-center px-4">
        <svg width="60" height="120" className="text-gray-300">
          <path
            d="M 0 60 L 30 60 L 30 30 L 60 30 M 30 60 L 30 90 L 60 90"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>
    )
  }

  return (
    <div className="bracket-visualization">
      {/* Tournament Header */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Tournament Bracket</h2>
        <div className="flex justify-center items-center space-x-6 text-sm text-secondary">
          <div className="flex items-center space-x-2">
            <Circle className="h-4 w-4 text-blue-600" />
            <span>Pending</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>Waiting</span>
          </div>
        </div>
      </div>

      {/* Bracket Grid */}
      <div className="bracket-grid overflow-x-auto">
        <div className="flex space-x-8 min-w-max pb-4">
          {bracket.rounds.map((round, roundIndex) => (
            <div key={roundIndex} className="round-column">
              {/* Round Header */}
              <div className="round-header mb-6 text-center">
                <h3 className="text-lg font-semibold text-primary">{round.roundName}</h3>
                <p className="text-sm text-secondary">
                  {round.matches.length} match{round.matches.length !== 1 ? 'es' : ''}
                </p>
              </div>

              {/* Round Matches */}
              <div className="round-matches space-y-6" style={{ minWidth: '280px' }}>
                {round.matches.map((match, matchIndex) => (
                  <div key={match.matchId} className="match-container">
                    <MatchCard match={match} roundIndex={roundIndex} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tournament Status */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">
              {bracket.rounds.reduce((total, round) => total + round.matches.length, 0)}
            </div>
            <div className="text-sm text-secondary">Total Matches</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {bracket.rounds.reduce((total, round) => 
                total + round.matches.filter(m => m.status === 'completed').length, 0
              )}
            </div>
            <div className="text-sm text-secondary">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {bracket.rounds.reduce((total, round) => 
                total + round.matches.filter(m => m.status === 'pending').length, 0
              )}
            </div>
            <div className="text-sm text-secondary">Pending</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-400">
              {bracket.rounds.reduce((total, round) => 
                total + round.matches.filter(m => m.status === 'waiting').length, 0
              )}
            </div>
            <div className="text-sm text-secondary">Waiting</div>
          </div>
        </div>
      </div>

      {/* Champion Display */}
      {bracket.rounds.length > 0 && (
        (() => {
          const finalRound = bracket.rounds[bracket.rounds.length - 1]
          const finalMatch = finalRound.matches[0]
          const champion = finalMatch?.status === 'completed' ? finalMatch.winner : null
          
          if (champion) {
            return (
              <div className="mt-8 text-center">
                <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 py-4 rounded-lg shadow-lg">
                  <Trophy className="h-8 w-8" />
                  <div>
                    <div className="text-lg font-bold">Tournament Champion</div>
                    <div className="text-xl font-black">{champion.name}</div>
                  </div>
                  <Trophy className="h-8 w-8" />
                </div>
              </div>
            )
          }
          
          return null
        })()
      )}

      {/* Instructions */}
      {canEditResults && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <Target className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Match Results</h4>
              <p className="text-sm text-blue-700 mt-1">
                Click on pending matches (blue border) to enter results. 
                Completed matches are shown in green, and waiting matches in gray.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BracketVisualization

