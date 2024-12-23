import { SpotifyIcon } from '../assets/img/app-header/icons'
import { useState, useEffect } from 'react'
import { Google } from '@mui/icons-material'
import { User } from 'lucide-react'
import { firebaseAuthService } from '../services/firebase.auth.service'
import { loadStations } from '../store/actions/station.actions'
import { useNavigate } from 'react-router-dom'

export function LoginModal({ isOpen, onClose, onLogin, onSignup }) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  })

  useEffect(() => {
    setError(null)
  }, [isOpen])

  const handleGuestLogin = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await onLogin({
        username: 'guest',
        password: 'guest123',
      })
      if (result.success) {
        await loadStations()
        onClose()
      } else {
        setError(result.error)
      }
    } catch (err) {
      console.error('Guest login failed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)
      setError(null)
      await firebaseAuthService.loginWithGoogle()
      onClose()
      await loadStations()
      navigate('/', { replace: true })
      window.location.reload()
    } catch (err) {
      console.error('Google login failed:', err)
    } finally {
      setIsLoading(false)
    }
  }
  if (!isOpen) return null

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (isLoginMode) {
        await onLogin({
          username: formData.username,
          password: formData.password,
        })
      } else {
        await onSignup(formData)
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid username or password')
        setFormData((prev) => ({
          ...prev,
          password: '',
        }))
      } else if (err.response?.status === 409) {
        setError('Username already exists')
      } else {
        setError(err.message || 'An error occurred. Please try again.')
      }
      navigate('/login', { replace: true })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (error) setError(null)
  }

  const toggleMode = () => {
    setIsLoginMode((prev) => !prev)
    setFormData({
      email: '',
      username: '',
      password: '',
    })
  }

  return (
    <>
      <div className='modal-overlay' onClick={onClose}></div>
      <div className='login-modal'>
        <div className='login-modal__content'>
          <SpotifyIcon className='login-modal__logo' />
          <h1 className='login-modal__title'>{isLoginMode ? 'Log in to Spotify' : 'Sign up for Spotify'}</h1>

          <div className='login-modal__social-buttons'>
            <button className='login-modal__social-button' onClick={handleGoogleLogin} disabled={isLoading}>
              <Google />
              {isLoading ? 'Connecting...' : 'Continue with Google'}
            </button>

            <button className='login-modal__social-button' onClick={handleGuestLogin} disabled={isLoading}>
              <User size={20} />
              {isLoading ? 'Connecting...' : 'Continue as Guest'}
            </button>
          </div>

          <div className='login-modal__divider'>
            <span>or</span>
          </div>

          <form onSubmit={handleSubmit} className='login-modal__form'>
            {!isLoginMode && (
              <div className='login-modal__form-group'>
                <label>Email</label>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder='Email'
                  required={!isLoginMode}
                />
              </div>
            )}

            <div className='login-modal__form-group'>
              <label>Username</label>
              <input
                type='text'
                name='username'
                value={formData.username}
                onChange={handleInputChange}
                placeholder='Username'
                required
              />
            </div>

            <div className='login-modal__form-group'>
              <label>Password</label>
              <input
                type='password'
                name='password'
                value={formData.password}
                onChange={handleInputChange}
                placeholder='Password'
                required
              />
            </div>

            <button type='submit' className='login-modal__submit'>
              {isLoginMode ? 'Log In' : 'Sign Up'}
            </button>
          </form>

          {isLoginMode && (
            <a href='#' className='login-modal__forgot'>
              Forgot your password?
            </a>
          )}

          <div className='login-modal__signup'>
            <span>{isLoginMode ? "Don't have an account?" : 'Already have an account?'}</span>
            <button onClick={toggleMode} className='login-modal__mode-toggle'>
              {isLoginMode ? 'Sign up for Spotify' : 'Log in to Spotify'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
