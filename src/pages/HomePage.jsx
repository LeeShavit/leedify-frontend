import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadStations } from '../store/actions/station.actions'
import { SectionHeader } from '../cmps/SectionHeader'
import { QuickAccess } from '../cmps/AccessItems'
import { PlaylistCard } from '../cmps/PlaylistCard'
import { loadUser, login } from '../store/actions/user.actions'
import { userService } from '../services/user'
import { stationService } from '../services/station'

export function HomePage() {
  const stations = useSelector((state) => state.stationModule.stations)
  const [sections, setSections] = useState(null)
  const user = useSelector((state) => state.userModule.user)

  useEffect(() => {
    loadData()
    loadSections()
  },[])

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

  async function loadSections() {
    const newSections = await stationService.getSections()
    setSections(newSections)
  }

  return (
    <div className='home-page'>
      <div className='filter-buttons'>
        <button className='filter-buttons__button filter-buttons__button--active'>All</button>
        <button className='filter-buttons__button'>Music</button>
        <button className='filter-buttons__button'>Podcasts</button>
      </div>
      <QuickAccess />
      {sections?.map(section => 
        <section className='home-page__section'>
          {console.log(section)}
          <SectionHeader title={section.category} />
          <div className='home-page__grid'>
            {section?.stations.map((station) => 
              <PlaylistCard key={station._id} station={station} />
            )}
          </div>
        </section>)}
    </div>
  )
}
