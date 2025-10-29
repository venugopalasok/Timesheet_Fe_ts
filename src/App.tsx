import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import './App.css'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Grid from './pages/Grid'

function App() {
  return (
    <Router>
      <title>Timesheet</title>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/grid" element={<Grid />} />
      </Routes>
    </Router>
  )
}

export default App
