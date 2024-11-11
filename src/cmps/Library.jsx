import { useEffect, useState } from 'react'
import { ArrowRightIcon, LibraryIcon, LibrarySearchIcon, ListIcon, PlusIcon } from '../assets/img/library/icons'
import { stationService } from '../services/station/station.service.local'
import { useNavigate } from 'react-router-dom'
import { loadStations } from '../store/actions/station.actions'
import { useDispatch, useSelector } from 'react-redux'

export function Library() {
  const [selectedTab, setSelectedTab] = useState('playlists')
  const stations = useSelector((storeState) => storeState.stationModule.stations)
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStations()
  }, [])

  async function handleCreatePlaylist() {
    try {
      const emptyStation = stationService.getEmptyStation()
      const savedStation = await stationService.save(emptyStation)
      await loadStations()
      navigate(`/station/${savedStation._id}`)
    } catch (err) {
      console.error('Failed to create playlist:', err)
    }
  }

  function onNavigateToStation(stationId) {
    navigate(`/station/${stationId}`)
  }

  return (
    <aside className='library'>
      <div className='library-header'>
        <div className='library-header__top'>
          <button className='library-header__title-btn'>
            <LibraryIcon className='library-icon' />
            Your Library
          </button>
          <div className='library-header__actions'>
            <button className='action-btn action-btn-plus' onClick={handleCreatePlaylist}>
              <PlusIcon className='action-icon' />
            </button>
            <button className='action-btn action-btn-arrow'>
              <ArrowRightIcon className='action-icon' />
            </button>
          </div>
        </div>

        <div className='library-filter'>
          <button
            className={`library-filter__btn ${selectedTab === 'playlists' ? 'active' : ''}`}
            onClick={() => setSelectedTab('playlists')}
          >
            Playlists
          </button>
          <button
            className={`library-filter__btn ${selectedTab === 'artists' ? 'active' : ''}`}
            onClick={() => setSelectedTab('artists')}
          >
            Artists
          </button>
          <button
            className={`library-filter__btn ${selectedTab === 'albums' ? 'active' : ''}`}
            onClick={() => setSelectedTab('albums')}
          >
            Albums
          </button>
        </div>

        <div className='library-search'>
          <button className='search-btn'>
            <LibrarySearchIcon className='search-icon' />
          </button>
          <button className='sort-btn'>
            Recently Added
            <ListIcon className='list-icon' />
          </button>
        </div>
      </div>

      <div className='library-list'>
        <div className='library-item'>
          <div className='library-item__image'>
            <img src='https://misc.scdn.co/liked-songs/liked-songs-300.png' alt='Liked Songs' />
          </div>
          <div className='library-item__info'>
            <h3 className='library-item__title'>Liked Songs</h3>
            <p className='library-item__details'>
              <span className='playlist-tag'>Playlist</span>
              <span>2,646 songs</span>
            </p>
          </div>
        </div>
        {stations.map((station) => (
          <div key={station._id} className='library-item' onClick={() => onNavigateToStation(station._id)}>
            <div className='library-item__image'>
              <img
                src={station.imgUrl}
                alt={station.name}
                onError={(e) => {
                  e.target.src = 'https://i.scdn.co/image/ab67616d0000b273d766af9a96c4206c5d13a790'
                }}
              />
            </div>
            <div className='library-item__info'>
              <h3 className='library-item__title'>{station.name}</h3>
              <p className='library-item__details'>
                <span className='playlist-tag'>Playlist</span>
                <span>{station.createdBy.fullname}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
