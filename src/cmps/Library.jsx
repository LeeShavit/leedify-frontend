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
import { Loader, PlayIcon } from 'lucide-react'
import { Button } from '@mui/material'
import { PauseIcon } from '../assets/img/player/icons'

import LibrarySortMenu from './LibrarySortMenu'
import { addStation, loadStations } from '../store/actions/station.actions'
import { addToQueue, clearQueue, playNext, setIsPlaying } from '../store/actions/player.actions'
import { stationService } from '../services/station/'
import { likeStation } from '../store/actions/station.actions'
import { capitalizeFirstLetters } from '../services/util.service'

export function Library({ isExpanded, onToggleLibrary }) {
  const stations = useSelector((state) => state.stationModule.stations)
  const user = useSelector((state) => state.userModule.user)
  const currentStationId = useSelector((state) => state.playerModule.currentStationId)
  const isPlaying = useSelector((state) => state.playerModule.isPlaying)

  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedTab, setSelectedTab] = useState('playlists')
  const [sortBy, setSortBy] = useState('recently added')
  const [view, setView] = useState('compact')
  const [isMobile, setIsMobile] = useState(window.innerWidth < 500)

  const navigate = useNavigate()
  const open = Boolean(anchorEl)

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 500)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!user) return
    loadStations(sortBy)
  }, [sortBy])

  async function handleCreatePlaylist() {
    try {
      const savedStation = await addStation()
      await likeStation(savedStation)
      navigate(`/station/${savedStation._id}`)
      if (isMobile) onToggleLibrary()
    } catch (err) {
      console.error('Failed to create playlist:', err)
    }
  }

  function onNavigateToStation(stationId) {
    navigate(`/station/${stationId}`)
    if (isMobile) onToggleLibrary()
  }

  function handleClick(event) {
    setAnchorEl(event.currentTarget)
  }
  function handleClose() {
    setAnchorEl(null)
  }
  function formatSortText(text) {
    return text
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
  function getLibraryListClassName() {
    if (!isExpanded) return 'library-list library-list--collapsed'
    return `library-list ${view === 'list' ? 'library-list--compact' : ''}`
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
  function renderLibraryItem(item, index) {
    const isCurrentStation = currentStationId === item._id
    const isLikedSongs = item === 'liked-songs'
    const itemName = isLikedSongs ? 'Liked Songs' : item.name
    const itemImage = isLikedSongs
      ? 'https://misc.scdn.co/liked-songs/liked-songs-300.png'
      : typeof item.imgUrl === 'string'
      ? item.imgUrl
      : item.imgUrl[2].url

    if (!stations) return <Loader />

    return (
      <div
        key={isLikedSongs ? 'liked-songs' : item._id}
        className={`library-item ${isCurrentStation ? 'current-station' : ''}`}
        onClick={() => onNavigateToStation(isLikedSongs ? 'liked-songs' : item._id)}
        data-name={itemName}
      >
        <button
          className='library-item__image-button'
          onClick={(e) => {
            e.stopPropagation()
            onPlayPauseStation(isLikedSongs ? 'liked-songs' : item._id)
          }}
        >
          <img src={itemImage} alt={itemName} />
          {!isExpanded && (
            <div className='library-item__image-overlay'>
              {isCurrentStation && isPlaying ? <PauseIcon size={16} /> : <PlayIcon size={16} className='play-icon' />}
            </div>
          )}
        </button>

        {isExpanded && (
          <div className='library-item__info'>
            <span className='library-item__title'>{itemName}</span>
            <div className='library-item__details'>
              <span className='playlist-tag'>Playlist</span>
              <span>
                {user
                  ? isLikedSongs
                    ? `${user.likedSongs?.length || 0} songs`
                    : item.createdBy?.name || 'Unknown'
                  : 'Guest'}
              </span>
            </div>

            {view === 'list' && (
              <button
                className='play-button'
                onClick={(e) => {
                  e.stopPropagation()
                  onPlayPauseStation(isLikedSongs ? 'liked-songs' : item._id)
                }}
              >
                {isCurrentStation && isPlaying ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
              </button>
            )}
          </div>
        )}
      </div>
    )
  }

  // if (!user) return <Loader />

  return (
    <aside className={`library ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className='library-header'>
        <div className='library-header__top'>
          <button onClick={onToggleLibrary} className='library-header__title-btn'>
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
            {capitalizeFirstLetters(sortBy)}
            <ListIcon className='list-icon' sx={{ fontSize: '24px', opacity: 0.7 }} />
          </Button>
          <LibrarySortMenu
            id='basic-menu'
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            setSortBy={setSortBy}
            sortBy={sortBy || 'recently added'}
            setView={setView}
            view={view}
            MenuListProps={{ 'aria-labelledby': 'basic-button' }}
          />
        </div>
      </div>
      <div className={getLibraryListClassName()}>
        {renderLibraryItem('liked-songs')}
        {stations?.map((station) => renderLibraryItem(station))}
      </div>
    </aside>
  )
}
