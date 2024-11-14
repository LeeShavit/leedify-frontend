import { Menu, MenuItem, Divider } from '@mui/material'
import { ExternalLink, User, LogOut } from 'lucide-react'
import { useState } from 'react'
import { userService } from '../services/user'
import { LoginModal } from './LoginModal'

export function ProfileMenu({ anchorEl, open, onClose }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const handleLogout = async (e) => {
    try {
      await userService.logout()
      setIsLoginModalOpen(true)
      onClose()
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  const handleLogin = async (credentials) => {
    try {
      await userService.login(credentials)
      setIsLoginModalOpen(false)
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

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLogin={handleLogin} />
    </>
  )
}
