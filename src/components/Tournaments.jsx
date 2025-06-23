import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Trophy, Plus, Calendar, Users, Search } from 'lucide-react'

const Tournaments = ({ user }) => {
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newTournament, setNewTournament] = useState({
    name: '',
    date: '',
    rules: ''
  })
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchTournaments()
  }, [])

  const fetchTournaments = async () => {
    try {
      const response = await fetch('https://77h9ikcj6vgw.manus.space/api/tournaments')
      const data = await response.json()
      setTournaments(data.tournaments || [])
    } catch (error) {
      console.error('Error fetching tournaments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTournament = async (e) => {
    e.preventDefault()
    setCreating(true)

    try {
      const response = await fetch('https://77h9ikcj6vgw.manus.space/api/tournaments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTournament),
      })

      const data = await response.json()

      if (response.ok) {
        setTournaments([data.tournament, ...tournaments])
        setShowCreateDialog(false)
        setNewTournament({ name: '', date: '', rules: '' })
      } else {
        alert(data.error || 'Failed to create tournament')
      }
    } catch (error) {
      alert('Network error. Please try again.')
    } finally {
      setCreating(false)
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

  const filteredTournaments = tournaments.filter(tournament =>
    tournament.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading tournaments...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tournaments</h1>
          <p className="text-muted-foreground">Browse and join backgammon tournaments</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Create Tournament</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Tournament</DialogTitle>
              <DialogDescription>
                Set up a new backgammon tournament for players to join.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleCreateTournament}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tournament Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter tournament name"
                    value={newTournament.name}
                    onChange={(e) => setNewTournament({ ...newTournament, name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Tournament Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newTournament.date}
                    onChange={(e) => setNewTournament({ ...newTournament, date: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rules">Rules & Description</Label>
                  <Textarea
                    id="rules"
                    placeholder="Enter tournament rules and description"
                    value={newTournament.rules}
                    onChange={(e) => setNewTournament({ ...newTournament, rules: e.target.value })}
                    rows={4}
                  />
                </div>
              </div>
              
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={creating}>
                  {creating ? 'Creating...' : 'Create Tournament'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tournaments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tournament Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTournaments.map((tournament) => (
          <Card key={tournament.tournament_id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{tournament.name}</CardTitle>
                  <CardDescription className="flex items-center space-x-4 mt-2">
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(tournament.date).toLocaleDateString()}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{tournament.enrollment_count || 0} players</span>
                    </span>
                  </CardDescription>
                </div>
                {getStatusBadge(tournament.status)}
              </div>
            </CardHeader>
            
            <CardContent>
              {tournament.rules && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {tournament.rules}
                </p>
              )}
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Backgammon</span>
                </div>
                
                <Link to={`/tournaments/${tournament.tournament_id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTournaments.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {searchTerm ? 'No tournaments found' : 'No tournaments available'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm 
              ? 'Try adjusting your search terms.' 
              : 'Be the first to create a tournament!'
            }
          </p>
          {!searchTerm && (
            <Button onClick={() => setShowCreateDialog(true)}>
              Create First Tournament
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default Tournaments

