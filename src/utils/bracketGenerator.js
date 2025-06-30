/**
 * Tournament Bracket Generator for React Frontend
 * Generates single-elimination tournament brackets with proper seeding
 */

class BracketGenerator {
  /**
   * Generate a tournament bracket from a list of players
   * @param {Array} players - Array of player objects with {id, name}
   * @param {string} tournamentType - Type of tournament ('single-elimination', 'double-elimination')
   * @returns {Object} - Complete bracket structure with rounds and matches
   */
  static generateBracket(players, tournamentType = 'single-elimination') {
    if (!players || players.length < 2) {
      throw new Error('At least 2 players are required for a tournament')
    }

    // Shuffle players for random seeding
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5)
    
    // Calculate the number of rounds needed
    const totalPlayers = shuffledPlayers.length
    const nextPowerOfTwo = Math.pow(2, Math.ceil(Math.log2(totalPlayers)))
    const totalRounds = Math.log2(nextPowerOfTwo)
    
    // Generate the bracket structure
    const bracket = {
      tournamentType,
      totalPlayers,
      totalRounds,
      rounds: [],
      metadata: {
        createdAt: new Date().toISOString(),
        bracketSize: nextPowerOfTwo,
        byesNeeded: nextPowerOfTwo - totalPlayers
      }
    }

    // Generate first round with byes if needed
    const firstRound = this.generateFirstRound(shuffledPlayers, nextPowerOfTwo)
    bracket.rounds.push(firstRound)

    // Generate subsequent rounds
    for (let round = 2; round <= totalRounds; round++) {
      const roundMatches = this.generateRound(round, bracket.rounds[round - 2])
      bracket.rounds.push(roundMatches)
    }

    return bracket
  }

  /**
   * Generate the first round of matches with proper bye handling
   * @param {Array} players - Shuffled array of players
   * @param {number} bracketSize - Size of the bracket (power of 2)
   * @returns {Object} - First round structure
   */
  static generateFirstRound(players, bracketSize) {
    const round = {
      roundNumber: 1,
      roundName: 'First Round',
      matches: [],
      totalMatches: bracketSize / 2
    }

    const byesNeeded = bracketSize - players.length
    const playersWithByes = [...players]

    // Add bye players to fill the bracket
    for (let i = 0; i < byesNeeded; i++) {
      playersWithByes.push({
        id: `bye_${i}`,
        name: 'BYE',
        isBye: true
      })
    }

    // Create matches by pairing players
    for (let i = 0; i < playersWithByes.length; i += 2) {
      const player1 = playersWithByes[i]
      const player2 = playersWithByes[i + 1]
      
      const match = {
        matchId: `r1_m${Math.floor(i / 2) + 1}`,
        roundNumber: 1,
        matchNumber: Math.floor(i / 2) + 1,
        player1: player1,
        player2: player2,
        status: 'pending',
        winner: null,
        score: {
          player1: null,
          player2: null
        }
      }

      // Auto-advance if one player has a bye
      if (player1.isBye) {
        match.status = 'completed'
        match.winner = player2
        match.score = { player1: 0, player2: 1 }
      } else if (player2.isBye) {
        match.status = 'completed'
        match.winner = player1
        match.score = { player1: 1, player2: 0 }
      }

      round.matches.push(match)
    }

    return round
  }

  /**
   * Generate a subsequent round based on the previous round
   * @param {number} roundNumber - Current round number
   * @param {Object} previousRound - Previous round data
   * @returns {Object} - Current round structure
   */
  static generateRound(roundNumber, previousRound) {
    const round = {
      roundNumber,
      roundName: this.getRoundName(roundNumber, previousRound.totalMatches),
      matches: [],
      totalMatches: Math.ceil(previousRound.totalMatches / 2)
    }

    // Create matches by pairing winners from previous round
    for (let i = 0; i < previousRound.matches.length; i += 2) {
      const match1 = previousRound.matches[i]
      const match2 = previousRound.matches[i + 1]
      
      const match = {
        matchId: `r${roundNumber}_m${Math.floor(i / 2) + 1}`,
        roundNumber,
        matchNumber: Math.floor(i / 2) + 1,
        player1: null, // Will be filled when previous matches complete
        player2: null, // Will be filled when previous matches complete
        status: 'waiting',
        winner: null,
        score: {
          player1: null,
          player2: null
        },
        dependsOn: {
          match1: match1.matchId,
          match2: match2 ? match2.matchId : null
        }
      }

      // If previous matches are completed, set players
      if (match1.status === 'completed' && match1.winner) {
        match.player1 = match1.winner
      }
      if (match2 && match2.status === 'completed' && match2.winner) {
        match.player2 = match2.winner
      }

      // If both players are set, match is ready
      if (match.player1 && match.player2) {
        match.status = 'pending'
      }

      round.matches.push(match)
    }

    return round
  }

  /**
   * Get the name for a round based on its position
   * @param {number} roundNumber - Round number
   * @param {number} totalMatches - Total matches in the tournament
   * @returns {string} - Round name
   */
  static getRoundName(roundNumber, totalMatches) {
    const remainingRounds = Math.log2(totalMatches)
    const roundsFromEnd = remainingRounds - roundNumber + 1

    switch (roundsFromEnd) {
      case 1:
        return 'Final'
      case 2:
        return 'Semi-Final'
      case 3:
        return 'Quarter-Final'
      case 4:
        return 'Round of 16'
      case 5:
        return 'Round of 32'
      default:
        return `Round ${roundNumber}`
    }
  }

  /**
   * Update a match result and advance the winner
   * @param {Object} bracket - Complete bracket structure
   * @param {string} matchId - ID of the match to update
   * @param {Object} result - Match result {winnerId, score}
   * @returns {Object} - Updated bracket
   */
  static updateMatchResult(bracket, matchId, result) {
    const updatedBracket = JSON.parse(JSON.stringify(bracket)) // Deep clone

    // Find and update the match
    for (let round of updatedBracket.rounds) {
      const match = round.matches.find(m => m.matchId === matchId)
      if (match) {
        match.status = 'completed'
        match.score = result.score
        
        // Determine winner
        if (result.winnerId === match.player1.id) {
          match.winner = match.player1
        } else if (result.winnerId === match.player2.id) {
          match.winner = match.player2
        }

        // Advance winner to next round
        this.advanceWinner(updatedBracket, match)
        break
      }
    }

    return updatedBracket
  }

  /**
   * Advance the winner of a match to the next round
   * @param {Object} bracket - Complete bracket structure
   * @param {Object} completedMatch - The completed match
   */
  static advanceWinner(bracket, completedMatch) {
    if (!completedMatch.winner) return

    // Find the next round match that depends on this match
    for (let round of bracket.rounds) {
      for (let match of round.matches) {
        if (match.dependsOn) {
          if (match.dependsOn.match1 === completedMatch.matchId) {
            match.player1 = completedMatch.winner
          } else if (match.dependsOn.match2 === completedMatch.matchId) {
            match.player2 = completedMatch.winner
          }

          // If both players are now set, make the match ready
          if (match.player1 && match.player2 && match.status === 'waiting') {
            match.status = 'pending'
          }
        }
      }
    }
  }

  /**
   * Get the current tournament status
   * @param {Object} bracket - Complete bracket structure
   * @returns {Object} - Tournament status information
   */
  static getTournamentStatus(bracket) {
    let totalMatches = 0
    let completedMatches = 0
    let pendingMatches = 0
    let waitingMatches = 0

    for (let round of bracket.rounds) {
      for (let match of round.matches) {
        totalMatches++
        switch (match.status) {
          case 'completed':
            completedMatches++
            break
          case 'pending':
            pendingMatches++
            break
          case 'waiting':
            waitingMatches++
            break
        }
      }
    }

    const isComplete = completedMatches === totalMatches
    const champion = isComplete ? this.getChampion(bracket) : null

    return {
      totalMatches,
      completedMatches,
      pendingMatches,
      waitingMatches,
      isComplete,
      champion,
      progress: Math.round((completedMatches / totalMatches) * 100)
    }
  }

  /**
   * Get the tournament champion
   * @param {Object} bracket - Complete bracket structure
   * @returns {Object|null} - Champion player or null if tournament not complete
   */
  static getChampion(bracket) {
    const finalRound = bracket.rounds[bracket.rounds.length - 1]
    const finalMatch = finalRound.matches[0]
    
    return finalMatch && finalMatch.status === 'completed' ? finalMatch.winner : null
  }

  /**
   * Generate a sample tournament for testing
   * @param {number} playerCount - Number of players
   * @returns {Object} - Sample bracket
   */
  static generateSampleTournament(playerCount = 8) {
    const players = []
    for (let i = 1; i <= playerCount; i++) {
      players.push({
        id: `player_${i}`,
        name: `Player ${i}`
      })
    }

    return this.generateBracket(players)
  }
}

export default BracketGenerator

