import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginModal } from '../cmps/LoginModal'
import { login, signup } from '../store/actions/user.actions'
import { loadStations } from '../store/actions/station.actions'

export function LoginPage() {
  const navigate = useNavigate()

  const handleClose = () => {
    navigate('/')
  }

  const handleLogin = async (credentials) => {
    try {
      await login(credentials)
      await loadStations()
      navigate('/')
      return { success: true }
    } catch (err) {
      console.error('Login handling error:', err)
    }
  }

  const handleSignup = async (userData) => {
    try {
      const response = await signup(userData)
      if (response.success) {
        await loadStations()
        navigate('/')
        return { success: true }
      }
    } catch (err) {
      console.error('Signup handling error:', err)
    }
  }

  return <LoginModal isOpen={true} onClose={handleClose} onLogin={handleLogin} onSignup={handleSignup} />
}
