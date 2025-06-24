import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, Users, Trophy, Clock, Target, Award, ArrowLeft } from 'lucide-react'

const TournamentDetail = ({ user }) => {
  const { id } = useParams()
  const [tournament, setTournament] = useState(null)
  const [participants, setParticipants] = useState([])
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)

  useEffect(() => {
    fetchTournamentData()
  }, [id])

  const fetchTournamentData = async () => {
    try {
      const [tournamentResponse, participantsResponse, matchesResponse] = await Promise.all([
        fetch(`https://77h9ikcj6vgw.manus.space/api/tournaments/${id}` ),
        fetch(`https://77h9ikcj6vgw.manus.space/api/tournaments/${id}/participants` ),
        fetch(`https://77h9ikcj6vgw.manus.space/api/tournaments/${id}/matches` )
      ])

      const tournamentData = await tournamentResponse.json()
      const participantsData = await participantsResponse.json()
      const matchesData = await matchesResponse.json()

      setTournament(tournamentData.tournament)
      setParticipants(participantsData.participants || [])
      setMatches(matchesData.matches || [])
      
      // Check if user is enrolled
      const userEnrolled = participantsData.participants?.some(p => p.player_id === user.player_id)
      setIsEnrolled(userEnrolled)
    } catch (error) {
      console.error('Error fetching tournament data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async () => {
    setEnrolling(true)
    try {
      const response = await fetch(`https://77h9ikcj6vgw.manus.space/api/tournaments/${id}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player_id: user.player_id } )
      })

      if (response.ok) {
        setIsEnrolled(true)
        fetchTournamentData() // Refresh data
      }
    } catch (error) {
      console.error('Error enrolling:', error)
    } finally {
      setEnrolling(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      upcoming: { className: 'badge badge-primary', label: 'Upcoming' },
      in_progress: { className: 'badge badge-success', label: 'In Progress' },
      completed: { className: 'badge badge-outline', label: 'Completed' }
    }
    
    const config = statusConfig[status] || statusConfig.upcoming
    return <span className={config.className}>{config.label}</span>
  }

  const getMatchStatusBadge = (status) => {
    const statusConfig = {
      pending: { className: 'badge badge-warning', label: 'Pending' },
      in_progress: { className: 'badge badge-primary', label: 'In Progress' },
      completed: { className: 'badge badge-success', label: 'Completed' }
    }
    
    const config = statusConfig[status] || statusConfig.pending
    return <span className={config.className}>{config.label}</span>
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="loading">Loading tournament details...</div>
      </div>
    )
  }

  if (!tournament) {
    return (
      <div className="container py-8">
        <div className="empty-state">Tournament not found.</div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      {/* Back Button */}
      <button 
        onClick={() => window.history.back()} 
        className="btn btn-secondary mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Tournaments</span>
      </button>

      {/* Tournament Header */}
      <div className="card mb-8">
        <div className="card-header">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">{tournament.name}</h1>
              <p className="text-secondary text-lg mb-4">{tournament.description}</p>
              {getStatusBadge(tournament.status)}
            </div>
            {tournament.status === 'upcoming' && !isEnrolled && (
              <button 
                onClick={handleEnroll}
                disabled={enrolling || participants.length >= tournament.max_players}
                className="btn btn-primary"
              >
                {enrolling ? 'Enrolling...' : 'Join Tournament'}
              </button>
            )}
            {isEnrolled && (
              <span className="badge badge-success">Enrolled</span>
            )}
          </div>
        </div>
      </div>

      {/* Tournament Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-title">Tournament Date</div>
            <Calendar className="stat-card-icon" />
          </div>
          <div className="stat-card-value text-lg">
            {new Date(tournament.date).toLocaleDateString()}
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-title">Participants</div>
            <Users className="stat-card-icon" />
          </div>
          <div className="stat-card-value">
            {participants.length}/{tournament.max_players}
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-title">Total Matches</div>
            <Trophy className="stat-card-icon" />
          </div>
          <div className="stat-card-value">{matches.length}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-title">Status</div>
            <Target className="stat-card-icon" />
          </div>
          <div className="stat-card-value text-lg">
            {getStatusBadge(tournament.status)}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="card-content p-0">
          <Tabs defaultValue="participants" className="w-full">
            <div className="border-b border-gray-200 px-6 pt-6">
              <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger value="participants" className="btn btn-secondary btn-sm">Participants</TabsTrigger>
                <TabsTrigger value="matches" className="btn btn-secondary btn-sm">Matches</TabsTrigger>
                <TabsTrigger value="standings" className="btn btn-secondary btn-sm">Standings</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="participants" className="p-6">
              {participants.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {participants.map((participant, index) => (
                    <div key={participant.player_id} className="tournament-item">
                      <div className="tournament-info">
                        <h3 className="flex items-center space-x-2">
                          <span>{participant.name}</span>
                          {index < 3 && tournament.status === 'completed' && (
                            <Award className="h-4 w-4 text-yellow-500" />
                          )}
                        </h3>
                        <p>{participant.email}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-secondary">
                          Player #{index + 1}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  No participants enrolled yet.
                </div>
              )}
            </TabsContent>

            <TabsContent value="matches" className="p-6">
              {matches.length > 0 ? (
                <div className="space-y-4">
                  {matches.map((match) => (
                    <div key={match.match_id} className="tournament-item">
                      <div className="tournament-info">
                        <h3>{match.player1_name} vs {match.player2_name}</h3>
                        <p className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(match.scheduled_time).toLocaleString()}</span>
                          </span>
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-4">
                          {match.status === 'completed' ? (
                            <div className="text-sm">
                              <span className="font-medium">{match.score_player1}</span>
                              <span className="text-secondary"> - </span>
                              <span className="font-medium">{match.score_player2}</span>
                            </div>
                          ) : (
                            <div className="text-sm text-secondary">vs</div>
                          )}
                          {getMatchStatusBadge(match.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  No matches scheduled yet.
                </div>
              )}
            </TabsContent>

            <TabsContent value="standings" className="p-6">
              {participants.length > 0 ? (
                <div className="space-y-4">
                  {participants
                    .sort((a, b) => (b.total_score || 0) - (a.total_score || 0))
                    .map((participant, index) => (
                    <div key={participant.player_id} className="tournament-item">
                      <div className="tournament-info">
                        <h3 className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-primary">#{index + 1}</span>
                          <span>{participant.name}</span>
                          {index === 0 && tournament.status === 'completed' && (
                            <Trophy className="h-5 w-5 text-yellow-500" />
                          )}
                        </h3>
                        <p className="flex items-center space-x-4">
                          <span className="text-green-600">{participant.wins || 0}W</span>
                          <span className="text-red-600">{participant.losses || 0}L</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">
                          {participant.total_score || 0} pts
                        </div>
                        <div className="text-sm text-secondary">
                          {participant.matches_played || 0} matches
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  No standings available yet.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default TournamentDetail