import { BellIcon, ExploreIcon, HomeIcon, HomeIconFull, SearchIcon, SpotifyIcon } from '../assets/img/app-header/icons'
import { useNavigate, useLocation } from 'react-router-dom'

export function AppHeader() {

  const navigate = useNavigate()
  const location = useLocation()

  console.log(location.pathname)

  return (
    <header className='app-header full'>
      <div className='app-header__logo'>
        <SpotifyIcon />
      </div>

      <div className='app-header__center'>
        <button onClick={() => navigate('/')} className='app-header__nav-button app-header__nav-button--home'>
          {(location.pathname === '/')? <HomeIconFull/>:<HomeIcon/>}
        </button>
        <div className='app-header__search'>
          <button className='app-header__search-icon'>
            <SearchIcon className='text-[#b3b3b3] hover:text-white transition-colors' />
          </button>
          <input type='text' placeholder='What do you want to play?' className='app-header__search-input' />
          <button onClick={() => navigate('/search')} className='app-header__search__collection-button'>
            <ExploreIcon className='text-[#b3b3b3] hover:text-white transition-colors' />
          </button>
        </div>
      </div>

      <div className='app-header__controls'>
        <button className='app-header__bell'>
          <BellIcon className='text-[#b3b3b3] hover:text-white transition-colors w-5 h-5' />
        </button>
        <button className='app-header__profile-button'>L</button>
      </div>
    </header>
  )
}
