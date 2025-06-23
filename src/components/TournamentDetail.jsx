import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Trophy, Calendar, Users, Play, UserPlus, UserMinus, Target } from 'lucide-react'

const TournamentDetail = ({ user }) => {
  const { id } = useParams()
  const [tournament, setTournament] = useState(null)
  const [matches, setMatches] = useState({})
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [starting, setStarting] = useState(false)
  const [showMatchDialog, setShowMatchDialog] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState(null)
  const [matchResult, setMatchResult] = useState({
    score_player1: '',
    score_player2: '',
    winner_id: ''
  })

  useEffect(() => {
    fetchTournamentDetails()
    fetchMatches()
  }, [id])

  const fetchTournamentDetails = async () => {
    try {
      const response = await fetch(`https://77h9ikcj6vgw.manus.space/api/tournaments/${id}`)
      const data = await response.json()
      setTournament(data.tournament)
    } catch (error) {
      console.error('Error fetching tournament details:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMatches = async () => {
    try {
      const response = await fetch(`https://77h9ikcj6vgw.manus.space/api/tournaments/${id}/matches`)
      const data = await response.json()
      setMatches(data.matches_by_round || {})
    } catch (error) {
      console.error('Error fetching matches:', error)
    }
  }

  const handleEnrollment = async (action) => {
    setEnrolling(true)
    try {
      const url = `https://77h9ikcj6vgw.manus.space/api/tournaments/${id}/${action}`
      const method = action === 'enroll' ? 'POST' : 'DELETE'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ player_id: user.player_id }),
      })

      const data = await response.json()

      if (response.ok) {
        fetchTournamentDetails() // Refresh tournament data
      } else {
        alert(data.error || `Failed to ${action}`)
      }
    } catch (error) {
      alert('Network error. Please try again.')
    } finally {
      setEnrolling(false)
    }
  }

  const handleStartTournament = async () => {
    setStarting(true)
    try {
      const response = await fetch(`https://77h9ikcj6vgw.manus.space/api/tournaments/${id}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok) {
        fetchTournamentDetails()
        fetchMatches()
      } else {
        alert(data.error || 'Failed to start tournament')
      }
    } catch (error) {
      alert('Network error. Please try again.')
    } finally {
      setStarting(false)
    }
  }

  const handleMatchResult = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`https://77h9ikcj6vgw.manus.space/api/matches/${selectedMatch.match_id}/result`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(matchResult),
      })

      const data = await response.json()

      if (response.ok) {
        setShowMatchDialog(false)
        setSelectedMatch(null)
        setMatchResult({ score_player1: '', score_player2: '', winner_id: '' })
        fetchMatches()
        fetchTournamentDetails()
      } else {
        alert(data.error || 'Failed to update match result')
      }
    } catch (error) {
      alert('Network error. Please try again.')
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      upcoming: { variant: 'secondary', label: 'Upcoming' },
      in_progress: { variant: 'default', label: 'In Progress' },
      completed: { variant: 'outline', label: 'Completed' }
    }
    
    const config = statusConfig[status] || statusConfig.upcoming
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const isEnrolled = tournament?.enrolled_players?.some(p => p.player_id === user.player_id)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading tournament details...</div>
      </div>
    )
  }

  if (!tournament) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Tournament not found</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{tournament.name}</h1>
          <div className="flex items-center space-x-4 text-muted-foreground">
            <span className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(tournament.date).toLocaleDateString()}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{tournament.enrollment_count} players</span>
            </span>
            {getStatusBadge(tournament.status)}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {tournament.status === 'upcoming' && (
            <>
              {isEnrolled ? (
                <Button 
                  variant="outline" 
                  onClick={() => handleEnrollment('unenroll')}
                  disabled={enrolling}
                  className="flex items-center space-x-2"
                >
                  <UserMinus className="h-4 w-4" />
                  <span>{enrolling ? 'Leaving...' : 'Leave Tournament'}</span>
                </Button>
              ) : (
                <Button 
                  onClick={() => handleEnrollment('enroll')}
                  disabled={enrolling}
                  className="flex items-center space-x-2"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>{enrolling ? 'Joining...' : 'Join Tournament'}</span>
                </Button>
              )}
              
              {tournament.enrollment_count >= 2 && (
                <Button 
                  onClick={handleStartTournament}
                  disabled={starting}
                  className="flex items-center space-x-2"
                >
                  <Play className="h-4 w-4" />
                  <span>{starting ? 'Starting...' : 'Start Tournament'}</span>
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="players">Players</TabsTrigger>
          <TabsTrigger value="bracket">Bracket</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Tournament Information</CardTitle>
            </CardHeader>
            <CardContent>
              {tournament.rules ? (
                <div className="prose max-w-none">
                  <p className="text-muted-foreground">{tournament.rules}</p>
                </div>
              ) : (
                <p className="text-muted-foreground">No rules or description provided.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="players">
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Players ({tournament.enrollment_count})</CardTitle>
              <CardDescription>Players participating in this tournament</CardDescription>
            </CardHeader>
            <CardContent>
              {tournament.enrolled_players?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tournament.enrolled_players.map((player) => (
                    <div key={player.player_id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {player.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{player.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Joined {new Date(player.enrolled_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No players enrolled yet.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bracket">
          <Card>
            <CardHeader>
              <CardTitle>Tournament Bracket</CardTitle>
              <CardDescription>Match progression and results</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(matches).length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(matches).map(([round, roundMatches]) => (
                    <div key={round}>
                      <h3 className="text-lg font-semibold mb-4">Round {round}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {roundMatches.map((match) => (
                          <Card key={match.match_id} className="p-4">
                            <div className="flex justify-between items-center">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">{match.player1_name}</span>
                                  <span className="text-sm text-muted-foreground">
                                    {match.status === 'completed' ? match.score_player1 : '-'}
                                  </span>
                                </div>
                                <div className="text-sm text-muted-foreground">vs</div>
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">{match.player2_name}</span>
                                  <span className="text-sm text-muted-foreground">
                                    {match.status === 'completed' ? match.score_player2 : '-'}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex flex-col items-end space-y-2">
                                <Badge variant={match.status === 'completed' ? 'default' : 'secondary'}>
                                  {match.status === 'completed' ? 'Completed' : 'Pending'}
                                </Badge>
                                
                                {match.status === 'completed' && match.winner_name && (
                                  <div className="text-sm text-primary font-medium">
                                    Winner: {match.winner_name}
                                  </div>
                                )}
                                
                                {match.status !== 'completed' && tournament.status === 'in_progress' && (
                                  <Dialog open={showMatchDialog && selectedMatch?.match_id === match.match_id} onOpenChange={(open) => {
                                    setShowMatchDialog(open)
                                    if (!open) setSelectedMatch(null)
                                  }}>
                                    <DialogTrigger asChild>
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => setSelectedMatch(match)}
                                        className="flex items-center space-x-1"
                                      >
                                        <Target className="h-3 w-3" />
                                        <span>Enter Result</span>
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Enter Match Result</DialogTitle>
                                        <DialogDescription>
                                          {match.player1_name} vs {match.player2_name}
                                        </DialogDescription>
                                      </DialogHeader>
                                      
                                      <form onSubmit={handleMatchResult}>
                                        <div className="space-y-4">
                                          <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                              <Label>{match.player1_name} Score</Label>
                                              <Input
                                                type="number"
                                                min="0"
                                                value={matchResult.score_player1}
                                                onChange={(e) => setMatchResult({ ...matchResult, score_player1: e.target.value })}
                                                required
                                              />
                                            </div>
                                            <div className="space-y-2">
                                              <Label>{match.player2_name} Score</Label>
                                              <Input
                                                type="number"
                                                min="0"
                                                value={matchResult.score_player2}
                                                onChange={(e) => setMatchResult({ ...matchResult, score_player2: e.target.value })}
                                                required
                                              />
                                            </div>
                                          </div>
                                          
                                          <div className="space-y-2">
                                            <Label>Winner</Label>
                                            <select 
                                              className="w-full p-2 border rounded"
                                              value={matchResult.winner_id}
                                              onChange={(e) => setMatchResult({ ...matchResult, winner_id: e.target.value })}
                                              required
                                            >
                                              <option value="">Select winner</option>
                                              <option value={match.player1_id}>{match.player1_name}</option>
                                              <option value={match.player2_id}>{match.player2_name}</option>
                                            </select>
                                          </div>
                                        </div>
                                        
                                        <DialogFooter className="mt-6">
                                          <Button type="button" variant="outline" onClick={() => setShowMatchDialog(false)}>
                                            Cancel
                                          </Button>
                                          <Button type="submit">
                                            Save Result
                                          </Button>
                                        </DialogFooter>
                                      </form>
                                    </DialogContent>
                                  </Dialog>
                                )}
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  {tournament.status === 'upcoming' 
                    ? 'Bracket will be generated when tournament starts.'
                    : 'No matches available.'
                  }
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default TournamentDetail

