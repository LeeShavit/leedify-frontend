import { ChevronLeft, ChevronRight, Home, Search, Bell, User } from 'lucide-react'
import React from 'react'

export function AppHeader() {
  return (
    <header className='app-header'>
      <div className='app-header__logo'></div>

      <div className='app-header__nav'>
        <button className='app-header__nav-button bg-black/60 rounded-full p-2'>
          <Home size={20} />
        </button>
        <div className='app-header__search'>
          <Search className='app-header__search-icon' size={20} />
          <input type='text' placeholder='What do you want to play?' className='app-header__search-input' />
        </div>
      </div>

      <div className='app-header__controls'>
        <button className='app-header__button'>
          <Bell size={20} />
        </button>
        <button className='app-header__profile-button'>
          <div className='w-8 h-8 rounded-full bg-[#535353] flex items-center justify-center'>L</div>
        </button>
      </div>
    </header>
  )
}
