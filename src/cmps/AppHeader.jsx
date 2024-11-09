import { Home, Search, Bell, User } from 'lucide-react'
import React from 'react'
import { BellIcon, ExploreIcon, HomeIcon, SearchIcon, SpotifyIcon } from '../assets/img/app-header/icons'

export function AppHeader() {
  return (
    <header className='app-header'>
      <div className='app-header__logo'>
        <SpotifyIcon />
      </div>

      <div className='app-header__nav'>
        <button className='app-header__nav-button app-header__nav-button--home'>
          <HomeIcon />
        </button>

        <div className='app-header__search'>
          <button className='app-header__search-icon '>
            <SearchIcon />
          </button>
          <input type='text' placeholder='What do you want to play?' className='app-header__search-input' />
          <button className='app-header__search__collection-button'>
            <ExploreIcon />
          </button>
        </div>
      </div>

      <div className='app-header__controls'>
        <button className='app-header__bell'>
          <BellIcon />
        </button>
        <button className='app-header__profile-button'>
          <div className='w-8 h-8 rounded-full bg-[#535353] flex items-center justify-center'>L</div>
        </button>
      </div>
    </header>
  )
}
