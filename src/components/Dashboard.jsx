import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Trophy, Calendar, Users, TrendingUp, Plus } from 'lucide-react'

const Dashboard = ({ user }) => {
  const [tournaments, setTournaments] = useState([])
  const [playerTournaments, setPlayerTournaments] = useState({ current_tournaments: [], past_tournaments: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [user])

  const fetchDashboardData = async () => {
    try {
      // Fetch all tournaments
      const tournamentsResponse = await fetch('https://77h9ikcj6vgw.manus.space/api/tournaments')
      const tournamentsData = await tournamentsResponse.json()
      
      // Fetch player's tournaments
      const playerTournamentsResponse = await fetch(`https://77h9ikcj6vgw.manus.space/api/players/${user.player_id}/tournaments`)
      const playerTournamentsData = await playerTournamentsResponse.json()
      
      setTournaments(tournamentsData.tournaments || [])
      setPlayerTournaments(playerTournamentsData)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading dashboard...</div>
      </div>
    )
  }

  const upcomingTournaments = tournaments.filter(t => t.status === 'upcoming').slice(0, 3)
  const activeTournaments = tournaments.filter(t => t.status === 'in_progress').slice(0, 3)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}!</p>
        </div>
        <Link to="/tournaments">
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Create Tournament</span>
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Tournaments</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{playerTournaments.current_tournaments?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Past Tournaments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{playerTournaments.past_tournaments?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Wins</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {playerTournaments.past_tournaments?.reduce((total, t) => total + (t.wins || 0), 0) || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tournaments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTournaments.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My Current Tournaments */}
        <Card>
          <CardHeader>
            <CardTitle>My Current Tournaments</CardTitle>
            <CardDescription>Tournaments you're currently participating in</CardDescription>
          </CardHeader>
          <CardContent>
            {playerTournaments.current_tournaments?.length > 0 ? (
              <div className="space-y-4">
                {playerTournaments.current_tournaments.map((tournament) => (
                  <div key={tournament.tournament_id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{tournament.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(tournament.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(tournament.status)}
                      <Link to={`/tournaments/${tournament.tournament_id}`}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                You're not currently enrolled in any tournaments.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Tournaments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tournaments</CardTitle>
            <CardDescription>Join these upcoming tournaments</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingTournaments.length > 0 ? (
              <div className="space-y-4">
                {upcomingTournaments.map((tournament) => (
                  <div key={tournament.tournament_id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{tournament.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(tournament.date).toLocaleDateString()} • {tournament.enrollment_count} players
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(tournament.status)}
                      <Link to={`/tournaments/${tournament.tournament_id}`}>
                        <Button variant="outline" size="sm">Join</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No upcoming tournaments available.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Tournament History */}
      {playerTournaments.past_tournaments?.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Tournament History</CardTitle>
            <CardDescription>Your performance in past tournaments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {playerTournaments.past_tournaments.slice(0, 5).map((tournament) => (
                <div key={tournament.tournament_id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{tournament.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(tournament.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {tournament.wins}W - {tournament.losses}L
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Score: {tournament.total_score}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Dashboard

