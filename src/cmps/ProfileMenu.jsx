import { Menu, MenuItem, Divider } from '@mui/material'
import { ExternalLink, User, LogOut } from 'lucide-react'
import { useState } from 'react'
import { LoginModal } from './LoginModal'
import { loadStations } from '../store/actions/station.actions'
import { useNavigate } from 'react-router-dom'
import { login, signup, logout } from '../store/actions/user.actions'

export function ProfileMenu({ anchorEl, open, onClose }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async (e) => {
    try {
      setIsLoginModalOpen(true)
      onClose()
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }
  const handleSignup = async (userData) => {
    try {
      await logout()
      await signup(userData)
      setIsLoginModalOpen(false)
      await loadStations()
      navigate('/', { replace: true })
      window.location.reload()
    } catch (err) {
      console.error('Signup failed:', err)
    }
  }

  const handleLogin = async (credentials) => {
    try {
      await logout()
      await login(credentials)
      setIsLoginModalOpen(false)
      await loadStations()
      navigate('/', { replace: true })
      window.location.reload()
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        className='menu'
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem>
          <div className='nested-menu'>
            Account
            <ExternalLink className='nested-menu-end' size={16} />
          </div>
        </MenuItem>

        <MenuItem>
          <div className='nested-menu'>
            <User size={16} />
            Profile
          </div>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <div className='nested-menu'>
            <LogOut size={16} />
            Log out
          </div>
        </MenuItem>
      </Menu>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        onSignup={handleSignup}
      />
    </>
  )
}
