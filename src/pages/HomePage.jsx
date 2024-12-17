import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useNavigate } from 'react-router-dom'
import { loadStations } from '../store/actions/station.actions'
import { SectionHeader } from '../cmps/SectionHeader'
import { QuickAccess } from '../cmps/AccessItems'
import { PlaylistCard } from '../cmps/PlaylistCard'
import { login } from '../store/actions/user.actions'
import { userService } from '../services/user'
import { stationService } from '../services/station'
import { makeId } from '../services/util.service'

export function HomePage() {
  const [sections, setSections] = useState(null)
  const user = useSelector((state) => state.userModule.user)
  const profileLetter = user?.name?.charAt(0).toUpperCase() || 'G'
  const navigate = useNavigate()

  useEffect(() => {
    loadData()
    loadSections()
  }, [])

  async function loadData() {
    try {
      const loggedInUser = userService.getLoggedinUser()
      if (!loggedInUser) {
        await login({ username: 'guest', password: 'guest123' })
        await loadStations()
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
      <button className='mobile-profile-button' onClick={() => navigate('/login')}>
        {profileLetter}
      </button>
      <QuickAccess />
      {sections?.map((category) => (
        <section key={category._id} className='home-page__section'>
          <SectionHeader title={category.name} categoryId={category._id} />
          <div className='home-page__grid'>
            {category?.stations.map((station) => (
              <PlaylistCard key={makeId()} station={station} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
