import {
  BellIcon,
  ExploreIcon,
  ExploreIconFull,
  HomeIcon,
  HomeIconFull,
  SearchIcon,
  SpotifyIcon,
} from '../assets/img/app-header/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { ProfileMenu } from './ProfileMenu'
import { useState } from 'react'
import { userService } from '../services/user/'
import { Search } from './Search'

export function AppHeader({ className }) {
  const navigate = useNavigate()
  const location = useLocation()

  const [profileAnchor, setProfileAnchor] = useState(null)
  const user = userService.getLoggedinUser()
  const profileLetter = user?.name?.charAt(0).toUpperCase() || 'G'

  const handleProfileClick = (event) => {
    setProfileAnchor(event.currentTarget)
  }

  const handleProfileClose = () => {
    setProfileAnchor(null)
  }

  return (
    <header className={`app-header full ${className}`}>
      <div onClick={() => navigate('/')} className='app-header__logo'>
        <SpotifyIcon />
      </div>

      <div className='app-header__center'>
        <button onClick={() => navigate('/')} className='app-header__nav-button app-header__nav-button--home'>
          {location.pathname === '/' ? <HomeIconFull /> : <HomeIcon />}
        </button>
        <Search />
      </div>

      <div className='app-header__controls'>
        <button className='app-header__bell'>
          <BellIcon className='text-[#b3b3b3] hover:text-white transition-colors w-5 h-5' />
        </button>
        <button
          className='app-header__profile-button'
          onClick={handleProfileClick}
          aria-controls={Boolean(profileAnchor) ? 'profile-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={Boolean(profileAnchor) ? 'true' : undefined}
        >
          {profileLetter}
        </button>
        <ProfileMenu user={user} anchorEl={profileAnchor} open={Boolean(profileAnchor)} onClose={handleProfileClose} />
      </div>
    </header>
  )
}
