import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Trophy, Calendar, Target, TrendingUp, Award, Users } from 'lucide-react'

const PlayerProfile = ({ user }) => {
  const [playerData, setPlayerData] = useState({ current_tournaments: [], past_tournaments: [] })
  const [playerMatches, setPlayerMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPlayerData()
    fetchPlayerMatches()
  }, [user])

  const fetchPlayerData = async () => {
    try {
      const response = await fetch(`https://77h9ikcj6vgw.manus.space/api/players/${user.player_id}/tournaments`)
      const data = await response.json()
      setPlayerData(data)
    } catch (error) {
      console.error('Error fetching player data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPlayerMatches = async () => {
    try {
      const response = await fetch(`https://77h9ikcj6vgw.manus.space/api/players/${user.player_id}/matches`)
      const data = await response.json()
      setPlayerMatches(data.matches || [])
    } catch (error) {
      console.error('Error fetching player matches:', error)
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

  // Calculate statistics
  const totalTournaments = playerData.past_tournaments?.length || 0
  const totalWins = playerData.past_tournaments?.reduce((sum, t) => sum + (t.wins || 0), 0) || 0
  const totalLosses = playerData.past_tournaments?.reduce((sum, t) => sum + (t.losses || 0), 0) || 0
  const totalScore = playerData.past_tournaments?.reduce((sum, t) => sum + (t.total_score || 0), 0) || 0
  const winRate = totalWins + totalLosses > 0 ? ((totalWins / (totalWins + totalLosses)) * 100).toFixed(1) : 0

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold text-primary">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tournaments Played</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTournaments}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Wins</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalWins}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{winRate}%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalScore}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="current" className="space-y-6">
        <TabsList>
          <TabsTrigger value="current">Current Tournaments</TabsTrigger>
          <TabsTrigger value="history">Tournament History</TabsTrigger>
          <TabsTrigger value="matches">Match History</TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          <Card>
            <CardHeader>
              <CardTitle>Current Tournaments</CardTitle>
              <CardDescription>Tournaments you're currently participating in</CardDescription>
            </CardHeader>
            <CardContent>
              {playerData.current_tournaments?.length > 0 ? (
                <div className="space-y-4">
                  {playerData.current_tournaments.map((tournament) => (
                    <div key={tournament.tournament_id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{tournament.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(tournament.date).toLocaleDateString()}</span>
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(tournament.status)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  You're not currently enrolled in any tournaments.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Tournament History</CardTitle>
              <CardDescription>Your performance in past tournaments</CardDescription>
            </CardHeader>
            <CardContent>
              {playerData.past_tournaments?.length > 0 ? (
                <div className="space-y-4">
                  {playerData.past_tournaments.map((tournament) => (
                    <div key={tournament.tournament_id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{tournament.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(tournament.date).toLocaleDateString()}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{tournament.matches_played} matches played</span>
                          </span>
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-4">
                          <div className="text-sm">
                            <span className="font-medium text-green-600">{tournament.wins}W</span>
                            <span className="text-muted-foreground"> - </span>
                            <span className="font-medium text-red-600">{tournament.losses}L</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Score: {tournament.total_score}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No tournament history available.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matches">
          <Card>
            <CardHeader>
              <CardTitle>Match History</CardTitle>
              <CardDescription>Detailed history of all your matches</CardDescription>
            </CardHeader>
            <CardContent>
              {playerMatches.length > 0 ? (
                <div className="space-y-4">
                  {playerMatches.map((match) => (
                    <div key={match.match_id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">vs {match.opponent_name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center space-x-4">
                          <span>{match.tournament_name}</span>
                          <span>Round {match.round}</span>
                          {match.completed_at && (
                            <span>{new Date(match.completed_at).toLocaleDateString()}</span>
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-4">
                          {match.status === 'completed' ? (
                            <>
                              <div className="text-sm">
                                <span className="font-medium">
                                  {match.player1_id === user.player_id ? match.score_player1 : match.score_player2}
                                </span>
                                <span className="text-muted-foreground"> - </span>
                                <span className="font-medium">
                                  {match.player1_id === user.player_id ? match.score_player2 : match.score_player1}
                                </span>
                              </div>
                              <Badge variant={match.is_winner ? 'default' : 'secondary'}>
                                {match.is_winner ? 'Won' : 'Lost'}
                              </Badge>
                            </>
                          ) : (
                            <Badge variant="outline">
                              {match.status === 'in_progress' ? 'In Progress' : 'Scheduled'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No match history available.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PlayerProfile

