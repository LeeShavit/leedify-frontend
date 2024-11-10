import React from 'react'
import { Routes, Route } from 'react-router'

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
import { Explore } from './pages/Explore.jsx'
import { Library } from './cmps/Library.jsx'

export function RootCmp() {
  return (
    <div className='main-container'>
      <AppHeader />
      <Library />
      <UserMsg />
      <main>
        <Routes>
          <Route path='' element={<HomePage />} />
          <Route path='station' element={<StationDetails />} />
          <Route path='/station/:stationId' element={<StationDetails />} />
          <Route path='/search' element={<Explore />} />
          <Route path='user/:id' element={<UserDetails />} />
          <Route path='login' element={<LoginSignup />}>
            <Route index element={<Login />} />
            <Route path='signup' element={<Signup />} />
          </Route>
        </Routes>
      </main>
      <Player />
    </div>
  )
}
