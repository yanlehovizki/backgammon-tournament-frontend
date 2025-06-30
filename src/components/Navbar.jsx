import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const isActive = (path) => {
    return location.pathname === path
  }

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '🏠' },
    { path: '/tournaments', label: 'Tournaments', icon: '🏆' },
    { path: '/profile', label: 'Profile', icon: '👤' }
  ]

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          {/* Beautiful Brand */}
          <Link to="/" className="navbar-brand">
            <div className="brand-icon">🎯</div>
            <div className="brand-text">
              <span className="brand-name">Tournament Pro</span>
              <span className="brand-tagline">Elite Gaming Platform</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="navbar-nav desktop-nav">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
                {isActive(item.path) && <div className="nav-indicator"></div>}
              </Link>
            ))}
            
            {/* Beautiful Login Button */}
            <Link to="/login" className="btn btn-primary btn-sm nav-login">
              <span>🔐</span>
              <span>Login</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-nav-content">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
              </Link>
            ))}
            <Link
              to="/login"
              className="btn btn-primary w-full mt-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span>🔐</span>
              <span>Login</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar