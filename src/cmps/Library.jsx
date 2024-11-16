import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import {
  ArrowRightIcon,
  LibraryIcon,
  LibraryIconFull,
  LibrarySearchIcon,
  ListIcon,
  PlusIcon,
} from '../assets/img/library/icons'
import { PlayIcon } from 'lucide-react'
import { Button } from '@mui/material'
import { PauseIcon } from '../assets/img/player/icons'

import LibrarySortMenu from './LibrarySortMenu'
import { addStation, loadStations } from '../store/actions/station.actions'
import { addToQueue, clearQueue, playNext, setIsPlaying } from '../store/actions/player.actions'
import { stationService } from '../services/station/'
import { likeStation } from '../store/actions/station.actions'

export function Library() {
  
  const stations = useSelector((state) => state.stationModule.stations)
  const user = useSelector((state) => state.userModule.user)
  const currentStationId = useSelector((state) => state.playerModule.currentStationId)
  const isPlaying = useSelector((state) => state.playerModule.isPlaying)
  
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedTab, setSelectedTab] = useState('playlists')
  const [isExpanded, setIsExpanded] = useState(true)
  const [sortBy, setSortBy] = useState('recently added')
  const [view, setView] = useState('list')
  const navigate = useNavigate()
  const open = Boolean(anchorEl)

  useEffect(() => {
    loadStations(sortBy)
  }, [sortBy])

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

  async function onPlayPauseStation(stationId) {
    if (stationId === currentStationId) {
      isPlaying ? setIsPlaying(false) : setIsPlaying(true)
    } else {
      try {
        const station =
          stationId === 'liked-songs'
            ? await stationService.getLikedSongsStation()
            : await stationService.getById(stationId)
        clearQueue()
        addToQueue(station.songs, stationId)
        playNext()
        setIsPlaying(true)
      } catch (error) {
        console.error('Failed to play playlist:', err)
      }
    }
  }
  console.log(stations)

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
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
            sx={{ textTransform: 'none', fontFamily: 'Spotify-mix, sans-serif' }}
          >
            Recently Added
            <ListIcon className='list-icon' sx={{ fontSize: '24px', opacity: 0.7 }} />
          </Button>
          <LibrarySortMenu
            id='basic-menu'
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            setSortBy= {setSortBy}
            sortBy= {sortBy}
            setView= {setView}
            view= {view}
            MenuListProps={{ 'aria-labelledby': 'basic-button' }}
          />
        </div>
      </div>

      <div className='library-list'>
        <div
          className={`library-item liked-songs ${currentStationId === 'liked-songs' && 'current-station'}`}
          onClick={() => onNavigateToStation('liked-songs')}
        >
          <button className='library-item__image-button' onClick={() => onPlayStation('liked-songs')}>
            <img src='https://misc.scdn.co/liked-songs/liked-songs-300.png' alt='liked-songs' />
            <div className='library-item__image-overlay'>
              {isPlaying && currentStationId === 'liked-songs' ? <PauseIcon /> : <PlayIcon />}
            </div>
          </button>
          <div className='library-item__info'>
            <h3 className='library-item__title'>Liked Songs</h3>
            <p className='library-item__details'>
              <span className='playlist-tag'>Playlist</span>
              <span>
                <span>
                  {!user.likedSongs
                    ? 'No songs yet'
                    : user.likedSongs.length === 0
                    ? 'No songs yet'
                    : `${user.likedSongs.length} ${user.likedSongs.length === 1 ? 'song' : 'songs'}`}
                </span>
              </span>
            </p>
          </div>
        </div>
        {stations?.map((station) => (
          <div
            key={station._id}
            className={`library-item ${currentStationId === station._id && 'current-station'}`}
            onClick={() => onNavigateToStation(station._id)}
          >
            <button className='library-item__image-button' onClick={() => onPlayStation(station._id)}>
              <img
                src={typeof station.imgUrl === 'string' ? station.imgUrl : station.imgUrl[2].url}
                alt={station.name}
              />
              <div className='library-item__image-overlay'>
                {currentStationId === station._id && isPlaying ? <PauseIcon /> : <PlayIcon className='play-icon' />}
              </div>
            </button>
            <div className='library-item__info'>
              <h3 className='library-item__title'>{station.name}</h3>
              <p className='library-item__details'>
                <span className='playlist-tag'>Playlist</span>
                <span>{station.createdBy?.name || 'unknown'}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
