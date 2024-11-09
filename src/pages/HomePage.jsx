// pages/HomePage.jsx
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadStations } from '../store/actions/station.actions'
import { StationList } from '../cmps/StationList'
import { SectionHeader } from '../cmps/SectionHeader'
import { QuickAccess } from '../cmps/AccessItems'
import { PlaylistCard } from '../cmps/PlaylistCard'
export function HomePage() {
  const stations = useSelector((state) => state.stationModule.stations)
  const dispatch = useDispatch()

  useEffect(() => {
    loadStations()
  }, [])

  return (
    <div className='home-page'>
      <div className='filter-buttons'>
        <button className='filter-buttons__button filter-buttons__button--active'>All</button>
        <button className='filter-buttons__button'>Latin</button>
        <button className='filter-buttons__button'>Rock</button>
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
