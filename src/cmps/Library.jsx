import { useEffect, useState } from 'react'
import { ArrowRightIcon, LibraryIcon, LibraryIconFull, LibrarySearchIcon, ListIcon, PlusIcon } from '../assets/img/library/icons'
import { stationService } from '../services/station/station.service.local'
import { useNavigate } from 'react-router-dom'
import { addStation, loadStations } from '../store/actions/station.actions'
import { useDispatch, useSelector } from 'react-redux'
import { PlayIcon } from 'lucide-react'
import LibrarySortMenu from './LibrarySortMenu'
import { Button } from '@mui/material'
import { likeStation } from '../store/actions/user.actions'
import { addToQueue, playNext, setIsPlaying } from '../store/actions/player.actions'
import { PauseIcon } from '../assets/img/player/icons'
import { userService } from '../services/user'

export function Library() {
  const [selectedTab, setSelectedTab] = useState('playlists')
  const [isExpanded, setIsExpanded] = useState(true)

  const user = useSelector(state => state.userModule.user)
  const currentStationId = useSelector((state) => state.playerModule.currentStationId)
  const isPlaying = useSelector((state) => state.playerModule.isPlaying)
  const queue = useSelector((state) => state.playerModule.queue)

  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  async function handleCreatePlaylist() {
    try {
      const savedStation = await addStation()
      await likeStation(savedStation)
      navigate(`/station/${savedStation._id}`)
    } catch (err) {
      console.error('Failed to create playlist:', err)
    }
  }

  function onNavigateToStation(stationId) {
    navigate(`/station/${stationId}`)
  }

  function handleClick(event) {
    setAnchorEl(event.currentTarget)
  }
  function handleClose() {
    setAnchorEl(null)
  }

  async function onPlayStation(stationId) {
    try {
      const station = (stationId === 'liked-songs') ? await stationService.getLikedSongsStation() : await stationService.getById(stationId)
      addToQueue(station.songs, stationId)
      playNext()
      setIsPlaying(true)
    } catch (error) {
      console.error('Failed to play playlist:', err)
    }
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
            <button className='action-btn action-btn-plus' onClick={() => handleCreatePlaylist()}>
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
            sx={{ textTransform: 'none', fontFamily: 'Spotify-mix, sans-serif' }}>
            Recently Added
            <ListIcon className='list-icon' sx={{ fontSize: '24px', opacity: 0.7 }} />
          </Button>
          <LibrarySortMenu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{ 'aria-labelledby': 'basic-button', }}
          />
        </div>
      </div>

      <div className='library-list'>
        <div className={`library-item liked-songs ${(currentStationId === 'liked-songs') && 'current-station'}`} onClick={() => onNavigateToStation('liked-songs')}>
          <button className='library-item__image-button' onClick={() => onPlayStation('liked-songs')}>
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
        {user?.likedStations.map((station) => (
          <div key={station._id} className={`library-item ${(currentStationId === station._id) && 'current-station'}`} onClick={() => onNavigateToStation(station._id)}>
            <button className='library-item__image-button' onClick={() => onPlayStation(station._id)}>
              <img src={typeof station.imgUrl === 'string' ? station.imgUrl : station.imgUrl[2].url} alt={station.name} />
              <div className='library-item__image-overlay'>
                {(currentStationId === station._id && isPlaying) ? <PauseIcon /> : <PlayIcon className='play-icon'/>}
              </div>
            </button>
            <div className='library-item__info'>
              <h3 className='library-item__title'>{station.name}</h3>
              <p className='library-item__details'>
                <span className='playlist-tag'>Playlist</span>
                <span>{station.createdBy}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
