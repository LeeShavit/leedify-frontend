import { useEffect, useState } from 'react'
import { ArrowRightIcon, LibraryIcon, LibraryIconFull, LibrarySearchIcon, ListIcon, PlusIcon } from '../assets/img/library/icons'
import { stationService } from '../services/station/station.service.local'
import { useNavigate } from 'react-router-dom'
import { loadStations } from '../store/actions/station.actions'
import { useDispatch, useSelector } from 'react-redux'
import { PlayIcon } from 'lucide-react'
import LibrarySortMenu from './LibrarySortMenu'
import { Button } from '@mui/material'

export function Library() {
  const [selectedTab, setSelectedTab] = useState('playlists')
  const [isExpanded, setIsExpanded] = useState(true)

  const stations = useSelector((storeState) => storeState.stationModule.stations)
  const user = useSelector((storeState) => storeState.userModule.user)

  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <aside className={`library ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className='library-header'>
        <div className='library-header__top'>
          <button onClick={() => setIsExpanded(!isExpanded)} className='library-header__title-btn'>
            {isExpanded ? <LibraryIconFull className='library-icon' /> : <LibraryIcon className='library-icon' />}
            {isExpanded && 'Your Library'}
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
          <Button
            className='sort-btn'
            onClick={handleClick}
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            sx={{ textTransform: 'none', fontFamily: 'Spotify-mix, sans-serif'}}>
            Recently Added
            <ListIcon className='list-icon' sx={{ fontSize: '24px', opacity: 0.7 }} />
          </Button>
          <LibrarySortMenu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{ 'aria-labelledby': 'basic-button',}}
          />
        </div>
      </div>

      <div className='library-list'>
        <div className='library-item liked-songs' onClick={() => onNavigateToStation('liked-songs')}>
          <button className='library-item__image-button'>
            <img src='https://misc.scdn.co/liked-songs/liked-songs-300.png' alt='liked-songs' />
            <div className='library-item__image-overlay'>
              <PlayIcon className='play-icon' />
            </div>
          </button>
          <div className='library-item__info'>
            <h3 className='library-item__title'>Liked Songs</h3>
            <p className='library-item__details'>
              <span className='playlist-tag'>Playlist</span>
              <span>{`${user?.likedSongs.length} songs`}</span>
            </p>
          </div>
        </div>
        {stations.map((station) => (
          <div key={station._id} className='library-item' onClick={() => onNavigateToStation(station._id)}>
            <button className='library-item__image-button'>
              <img src={station.imgUrl} alt={station.name} />
              <div className='library-item__image-overlay'>
                <PlayIcon className='play-icon' />
              </div>
            </button>
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
