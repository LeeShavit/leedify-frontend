import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadStations } from '../store/actions/station.actions'
import { SectionHeader } from '../cmps/SectionHeader'
import { QuickAccess } from '../cmps/AccessItems'
import { PlaylistCard } from '../cmps/PlaylistCard'
import { loadUser, login } from '../store/actions/user.actions'
import { userService } from '../services/user'

export function HomePage() {
  const stations = useSelector((state) => state.stationModule.stations)
  const user = useSelector((state) => state.userModule.user)

  useEffect(() => {
    loadData()
  })

  async function loadData() {
    try {
      const loggedInUser = userService.getLoggedinUser()
      if (!loggedInUser._id) {
        await login({ username: 'guest', password: 'guest123' })
        await loadStations()
        console.log(stations)
        navigate('/', { replace: true })
      }
      await loadUsers()
      await loadStations()
    } catch (err) {
      console.log('failed to load home page')
    }
  }

  return (
    <div className='home-page'>
      <div className='filter-buttons'>
        <button className='filter-buttons__button filter-buttons__button--active'>All</button>
        <button className='filter-buttons__button'>Music</button>
        <button className='filter-buttons__button'>Podcasts</button>
      </div>
      <QuickAccess />
      <section className='home-page__section'>
        <SectionHeader title='Your Library' />
        <div className='home-page__grid'>
          {stations.map((station) => (
            <PlaylistCard key={station._id} station={station} />
          ))}
        </div>
      </section>
    </div>
  )
}
