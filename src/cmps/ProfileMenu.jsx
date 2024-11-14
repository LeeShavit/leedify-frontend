import { Menu, MenuItem, Divider } from '@mui/material'
import { ExternalLink, User, Users, Settings, LogOut } from 'lucide-react'

export function ProfileMenu({ anchorEl, open, onClose }) {
  return (
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
      <MenuItem>
        <div className='nested-menu'>
          <LogOut size={16} />
          Log out
        </div>
      </MenuItem>
    </Menu>
  )
}
