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

  // Enhanced mock data for professional bracket
  const mockBracketData = {
    upperBracket: [
      {
        round: 1,
        name: "Round 1",
        matches: [
          {
            id: 7,
            player1: { name: "Nairda", avatar: "🏆", seed: 1 },
            player2: { name: "macmacus", avatar: "👤", seed: 8 },
            score1: 5,
            score2: 3,
            status: "completed",
            winner: "Nairda"
          },
          {
            id: 8,
            player1: { name: "Corneliax", avatar: "🎯", seed: 4 },
            player2: { name: "XerxesRegulus", avatar: "⚡", seed: 5 },
            score1: 5,
            score2: 3,
            status: "completed",
            winner: "Corneliax"
          }
        ]
      },
      {
        round: 2,
        name: "Semi-Final",
        matches: [
          {
            id: 11,
            player1: { name: "Nairda", avatar: "🏆", seed: 1 },
            player2: { name: "Corneliax", avatar: "🎯", seed: 4 },
            score1: 5,
            score2: 3,
            status: "completed",
            winner: "Nairda"
          }
        ]
      },
      {
        round: 3,
        name: "Final",
        matches: [
          {
            id: 14,
            player1: { name: "Nairda", avatar: "🏆", seed: 1 },
            player2: { name: "RadicalPugtato", avatar: "🐶", seed: 2 },
            score1: 8,
            score2: 4,
            status: "completed",
            winner: "Nairda"
          }
        ]
      }
    ],
    lowerBracket: [
      {
        round: 1,
        name: "Losers Round 2",
        matches: [
          {
            id: 9,
            player1: { name: "macmacus", avatar: "👤", seed: 8 },
            player2: { name: "Altheare", avatar: "💎", seed: 7 },
            score1: 5,
            score2: 3,
            status: "completed",
            winner: "macmacus"
          }
        ]
      },
      {
        round: 2,
        name: "Losers Round 3",
        matches: [
          {
            id: 12,
            player1: { name: "XerxesRegulus", avatar: "⚡", seed: 5 },
            player2: { name: "RadicalPugtato", avatar: "🐶", seed: 2 },
            score1: 2,
            score2: 5,
            status: "completed",
            winner: "RadicalPugtato"
          }
        ]
      },
      {
        round: 3,
        name: "Losers Round 4",
        matches: [
          {
            id: 13,
            player1: { name: "Corneliax", avatar: "🎯", seed: 4 },
            player2: { name: "RadicalPugtato", avatar: "🐶", seed: 2 },
            score1: 7,
            score2: 4,
            status: "completed",
            winner: "Corneliax"
          }
        ]
      }
    ]
  }

  const PlayerCard = ({ player, score, isWinner, position = "top" }) => {
    if (!player) {
      return (
        <div className="bracket-player-card empty">
          <div className="player-info">
            <div className="player-avatar">?</div>
            <span className="player-name">TBD</span>
          </div>
          <div className="player-score">-</div>
        </div>
      )
    }

    return (
      <div className={`bracket-player-card ${isWinner ? 'winner' : ''} ${position}`}>
        <div className="player-info">
          <div className="player-avatar">
            {player.avatar}
          </div>
          <span className="player-name">{player.name}</span>
        </div>
        <div className={`player-score ${isWinner ? 'winner-score' : ''}`}>
          {score !== null && score !== undefined ? score : '-'}
        </div>
      </div>
    )
  }

  const MatchCard = ({ match, onClick }) => {
    const winner1 = match.winner === match.player1?.name
    const winner2 = match.winner === match.player2?.name

    return (
      <div 
        className="bracket-match-container"
        onClick={() => onClick && onClick(match)}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
      >
        <div className="match-number">{match.id}</div>
        <div className="bracket-match-card">
          <PlayerCard 
            player={match.player1} 
            score={match.score1} 
            isWinner={winner1}
            position="top"
          />
          <PlayerCard 
            player={match.player2} 
            score={match.score2} 
            isWinner={winner2}
            position="bottom"
          />
        </div>
      </div>
    )
  }

  const BracketRound = ({ round, isLower = false }) => {
    return (
      <div className="bracket-round-container">
        <div className="bracket-round-header">
          <h4 className="round-title">{round.name}</h4>
        </div>
        <div className="bracket-round-matches">
          {round.matches.map((match, index) => (
            <div key={match.id} className="match-wrapper">
              <MatchCard match={match} onClick={onMatchClick} />
              {/* Bracket connectors would go here */}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="professional-bracket-container">
      {/* Header */}
      <div className="bracket-header">
        <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <span>🏆</span>
          Tournament Bracket
        </h3>
        <p className="text-gray-600 mb-6">
          Double Elimination Format • {tournament.participants} Players
        </p>
      </div>

      {/* Bracket Layout */}
      <div className="bracket-layout">
        {/* Upper Bracket */}
        <div className="upper-bracket">
          <div className="bracket-section-title">
            <h4 className="text-lg font-semibold text-gray-800">Winners Bracket</h4>
          </div>
          <div className="bracket-rounds">
            {mockBracketData.upperBracket.map((round, index) => (
              <BracketRound key={`upper-${round.round}`} round={round} />
            ))}
          </div>
        </div>

        {/* Lower Bracket */}
        <div className="lower-bracket">
          <div className="bracket-section-title">
            <h4 className="text-lg font-semibold text-gray-800">Losers Bracket</h4>
          </div>
          <div className="bracket-rounds">
            {mockBracketData.lowerBracket.map((round, index) => (
              <BracketRound key={`lower-${round.round}`} round={round} isLower={true} />
            ))}
          </div>
        </div>
      </div>

      {/* Tournament Champion */}
      <div className="champion-section">
        <div className="champion-card">
          <div className="champion-crown">👑</div>
          <h3 className="champion-title">Tournament Champion</h3>
          <div className="champion-player">
            <div className="champion-avatar">🏆</div>
            <div className="champion-info">
              <div className="champion-name">Nairda</div>
              <div className="champion-subtitle">Congratulations!</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tournament Statistics */}
      <div className="bracket-stats">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">
              {mockBracketData.upperBracket.reduce((acc, round) => acc + round.matches.length, 0) +
               mockBracketData.lowerBracket.reduce((acc, round) => acc + round.matches.length, 0)}
            </div>
            <div className="stat-label">Total Matches</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              {mockBracketData.upperBracket.length + mockBracketData.lowerBracket.length}
            </div>
            <div className="stat-label">Total Rounds</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Complete</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">${tournament.prizePool || 0}</div>
            <div className="stat-label">Prize Pool</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BracketVisualization