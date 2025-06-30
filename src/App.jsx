import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Tournaments from './components/Tournaments'
import PlayerProfile from './components/PlayerProfile'
import TournamentDetail from './components/TournamentDetail'
import Login from './components/Login'
import './App.css'

const App = () => {
  return (
    <Router>
      <div className="app">
        {/* Simple navigation - exactly as it was working */}
        <nav className="navbar">
          <div className="nav-container">
            <div className="nav-brand">
              <span className="brand-icon">🎯</span>
              <span className="brand-text">Tournament Pro</span>
              <span className="brand-subtitle">Elite Gaming Platform</span>
            </div>
            <div className="nav-links">
              <a href="/dashboard" className="nav-link active">
                <span className="nav-icon">🏠</span>
                <span>Dashboard</span>
              </a>
              <a href="/tournaments" className="nav-link">
                <span className="nav-icon">🏆</span>
                <span>Tournaments</span>
              </a>
              <a href="/profile" className="nav-link">
                <span className="nav-icon">👤</span>
                <span>Profile</span>
              </a>
              <a href="/login" className="nav-link nav-login">
                <span className="nav-icon">🔐</span>
                <span>Login</span>
              </a>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/tournaments/:id" element={<TournamentDetail />} />
            <Route path="/profile" element={<PlayerProfile />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App