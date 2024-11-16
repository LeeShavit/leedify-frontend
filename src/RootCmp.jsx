import React from 'react'
import { Routes, Route } from 'react-router'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'

import { HomePage } from './pages/HomePage'
import { StationDetails } from './pages/StationDetails.jsx'
import { UserDetails } from './pages/UserDetails.jsx'
import { AppHeader } from './cmps/AppHeader.jsx'
import { Player } from './cmps/Player.jsx'
import { UserMsg } from './cmps/UserMsg.jsx'
import { LoginSignup } from './pages/LoginSignup.jsx'
import { Login } from './pages/Login.jsx'
import { Signup } from './pages/Signup.jsx'
import { Library } from './cmps/Library.jsx'
import { MobileNav } from './cmps/MobileNav.jsx'
import { SearchResults } from './cmps/SearchResults.jsx'
import { GenreDetails } from './pages/GenreDetails.jsx'

export function RootCmp() {
  const [isLibraryExpanded, setIsLibraryExpanded] = useState(false)
  const location = useLocation()
  const showHeader = location.pathname === '/search'

  const toggleLibrary = () => {
    setIsLibraryExpanded((prev) => !prev)
  }
  return (
    <div className='main-container'>
      <AppHeader className={showHeader ? 'show-header' : ''} />
      <Library onToggleLibrary={toggleLibrary} isExpanded={isLibraryExpanded} />
      <UserMsg />
      <main className='main scroll-container'>
        <Routes>
          <Route path='' element={<HomePage />} />
          <Route path='station' element={<StationDetails />} />
          <Route path='/station/:stationId' element={<StationDetails />} />
          <Route path='/search' element={<SearchResults />} />
          <Route path='/genre/:genreId' element={<GenreDetails />} />
          <Route path='user/:id' element={<UserDetails />} />
          <Route path='login' element={<LoginSignup />}>
            <Route index element={<Login />} />
            <Route path='signup' element={<Signup />} />
          </Route>
        </Routes>
      </main>
      <Player />
      <MobileNav onLibraryClick={toggleLibrary} />
    </div>
  )
}
