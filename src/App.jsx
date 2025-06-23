import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './App.css'

// Components
import Navbar from './components/Navbar'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import Tournaments from './components/Tournaments'
import TournamentDetail from './components/TournamentDetail'
import PlayerProfile from './components/PlayerProfile'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in (you could check localStorage or make an API call)
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-background">
        {user && <Navbar user={user} onLogout={handleLogout} />}
        
        <main className={user ? "pt-16" : ""}>
          <Routes>
            {!user ? (
              <>
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/register" element={<Register onLogin={handleLogin} />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Dashboard user={user} />} />
                <Route path="/tournaments" element={<Tournaments user={user} />} />
                <Route path="/tournaments/:id" element={<TournamentDetail user={user} />} />
                <Route path="/profile" element={<PlayerProfile user={user} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App

