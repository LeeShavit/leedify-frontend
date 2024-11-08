import { Home, Search, Bell, User } from 'lucide-react'
import React from 'react'

export function AppHeader() {
  return (
    <header className='app-header'>
      <div className='app-header__logo'>
        <img src='src/assets/img/app-header/spotify-icon.svg' alt='spotify-icon' />
      </div>

      <div className='app-header__nav'>
        <button className='app-header__nav-button app-header__nav-button--home'>
          {/* <img src='src/assets/img/app-header/home-button.svg' alt='spotify-icon' /> */}
          <svg
            role='img'
            xmlns='http://www.w3.org/2000/svg'
            aria-hidden='true'
            viewBox='0 0 24 24'
            className='w-[48px] h-[48px]'
          >
            <path
              fill='currentColor'
              d='M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v6H20V7.577l-7.5-4.33zm-2-1.732a3 3 0 0 1 3 0l7.5 4.33a2 2 0 0 1 1 1.732V21a1 1 0 0 1-1 1h-6.5a1 1 0 0 1-1-1v-6h-3v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.577a2 2 0 0 1 1-1.732l7.5-4.33z'
            />
          </svg>
        </button>

        <div className='app-header__search'>
          <button className='app-header__search-icon '>
            <svg
              role='img'
              xmlns='http://www.w3.org/2000/svg'
              aria-hidden='true'
              viewBox='0 0 24 24'
              className='w-[48px] h-[48px]'
            >
              <path
                fill='currentColor'
                d='M10.533 1.27893C5.35215 1.27893 1.12598 5.41887 1.12598 10.5579C1.12598 15.697 5.35215 19.8369 10.533 19.8369C12.767 19.8369 14.8235 19.0671 16.4402 17.7794L20.7929 22.132C21.1834 22.5226 21.8166 22.5226 22.2071 22.132C22.5976 21.7415 22.5976 21.1083 22.2071 20.7178L17.8634 16.3741C19.1616 14.7849 19.94 12.7634 19.94 10.5579C19.94 5.41887 15.7138 1.27893 10.533 1.27893ZM3.12598 10.5579C3.12598 6.55226 6.42768 3.27893 10.533 3.27893C14.6383 3.27893 17.94 6.55226 17.94 10.5579C17.94 14.5636 14.6383 17.8369 10.533 17.8369C6.42768 17.8369 3.12598 14.5636 3.12598 10.5579Z'
              ></path>
            </svg>
          </button>
          <input type='text' placeholder='What do you want to play?' className='app-header__search-input' />
          <button className='app-header__search__collection-button'>
            <svg
              data-encore-id='icon'
              xmlns='http://www.w3.org/2000/svg'
              role='img'
              aria-hidden='true'
              viewBox='0 0 24 24'
            >
              <path fill='currentColor' d='M15 15.5c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z'></path>
              <path
                fill='currentColor'
                d='M1.513 9.37A1 1 0 0 1 2.291 9h19.418a1 1 0 0 1 .979 1.208l-2.339 11a1 1 0 0 1-.978.792H4.63a1 1 0 0 1-.978-.792l-2.339-11a1 1 0 0 1 .201-.837zM3.525 11l1.913 9h13.123l1.913-9H3.525zM4 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v4h-2V3H6v3H4V2z'
              ></path>
            </svg>
          </button>
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
