import React from 'react'
import { Routes, Route } from 'react-router'
import { useState } from 'react'

import { HomePage } from './pages/HomePage'
import { StationIndex } from './pages/StationIndex.jsx'

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
export function RootCmp() {
  // const [isLibraryExpanded, setIsLibraryExpanded] = useState(false)

  // const toggleLibrary = () => {
  //   setIsLibraryExpanded((prev) => !prev)
  // }
  return (
    <div className='main-container'>
      <AppHeader />
      <Library />
      <UserMsg />
      <main className='main scroll-container'>
        <Routes>
          <Route path='' element={<HomePage />} />
          <Route path='station' element={<StationDetails />} />
          <Route path='/station/:stationId' element={<StationDetails />} />
          <Route path='/search' element={<SearchResults />} />
          <Route path='user/:id' element={<UserDetails />} />
          <Route path='login' element={<LoginSignup />}>
            <Route index element={<Login />} />
            <Route path='signup' element={<Signup />} />
          </Route>
        </Routes>
        <MobileNav />
      </main>
      <Player />
    </div>
  )
}
