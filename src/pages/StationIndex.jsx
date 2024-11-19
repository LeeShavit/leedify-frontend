import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

// import { loadStations, addStation, updateStation, removeStation, addStationMsg } from '../store/actions/station.actions'

import { showUserMsg } from '../services/event-bus.service'
import { stationService } from '../services/station/'
import { userService } from '../services/user'

import { StationList } from '../cmps/StationList'
import { StationFilter } from '../cmps/StationFilter'

export function StationIndex() {
  const [filterBy, setFilterBy] = useState(stationService.getDefaultFilter())
  const stations = useSelector((storeState) => storeState.stationModule.stations)
  
  
  useEffect(() => {
    loadStations(filterBy)
  }, [filterBy])

  async function onRemoveStation(stationId) {
    try {
      await removeStation(stationId)
      showUserMsg('Station removed')
    } catch (err) {
      showUserMsg('Cannot remove station')
    }
  }

  return (
    <main className='station-index'>
      <header>
        <h2>Stations</h2>
        {userService.getLoggedinUser() && <button onClick={onAddStation}>Add a Station</button>}
      </header>
      <StationFilter filterBy={filterBy} setFilterBy={setFilterBy} />
      <StationList stations={stations} />
    </main>
  )
}
