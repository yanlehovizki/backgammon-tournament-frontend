import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import Tournaments from './components/Tournaments'
import PlayerProfile from './components/PlayerProfile'
import TournamentDetail from './components/TournamentDetail'
import Login from './components/Login'

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Only the beautiful Navbar - no duplicate navigation */}
        <Navbar />
        
        {/* Main content area */}
        <main>
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