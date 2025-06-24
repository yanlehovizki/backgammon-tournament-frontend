import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Trophy, Home, User, LogOut } from 'lucide-react'

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo and Brand */}
        <Link to="/" className="navbar-brand">
          <Trophy />
          <span>Backgammon Tournament Manager</span>
        </Link>

        {/* Navigation Links */}
        <div className="navbar-nav">
          <Link to="/">
            <Button 
              variant="ghost" 
              size="sm"
              className="btn btn-secondary btn-sm"
            >
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </Button>
          </Link>
          
          <Link to="/tournaments">
            <Button 
              variant="ghost" 
              size="sm"
              className="btn btn-secondary btn-sm"
            >
              <Trophy className="h-4 w-4" />
              <span>Tournaments</span>
            </Button>
          </Link>
          
          <Link to="/profile">
            <Button 
              variant="ghost" 
              size="sm"
              className="btn btn-secondary btn-sm"
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Button>
          </Link>
        </div>

        {/* User Info and Logout */}
        <div className="navbar-user">
          <span className="navbar-user-name">
            Welcome, {user.name}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="btn btn-outline btn-sm"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar