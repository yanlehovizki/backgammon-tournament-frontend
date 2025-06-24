import { Link, useLocation } from 'react-router-dom'
import { Button } from './ui/button'
import { Trophy, User, LogOut, Home } from 'lucide-react'

const Navbar = ({ user, onLogout }) => {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Trophy className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Backgammon Tournament Manager</h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/">
              <Button 
                variant={isActive('/') ? 'default' : 'ghost'} 
                size="sm"
                className="flex items-center space-x-2"
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
            </Link>
            
            <Link to="/tournaments">
              <Button 
                variant={isActive('/tournaments') ? 'default' : 'ghost'} 
                size="sm"
                className="flex items-center space-x-2"
              >
                <Trophy className="h-4 w-4" />
                <span>Tournaments</span>
              </Button>
            </Link>
            
            <Link to="/profile">
              <Button 
                variant={isActive('/profile') ? 'default' : 'ghost'} 
                size="sm"
                className="flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Button>
            </Link>
          </div>

          {/* User Info and Logout */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user.name}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onLogout}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

