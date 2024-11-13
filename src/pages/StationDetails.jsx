import { useEffect, useState, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  loadStation,
  setPlayingSong,
  setIsPlaying,
  addSongToStation,
  loadLikedSongsStation,
  updateStation,
} from '../store/actions/station.actions'
import { likeSong, dislikeSong } from '../store/actions/user.actions'
import { Time } from '../assets/img/playlist-details/icons'
import { EditStationModal } from '../cmps/EditStationModal'
import { AddSong } from '../cmps/AddSongs'
import { DEFAULT_IMG } from '../services/station/station.service.local'
import { FastAverageColor } from 'fast-average-color'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { Button } from '@mui/material'
import StationMenu from '../cmps/StationMenu'
import { DraggableSongRow } from '../cmps/DnDSongRow'
import { DraggableSongContainer } from '../cmps/DnDSongContainer'
import SongMenu from '../cmps/SongMenu'

export function StationDetails() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const fileInputRef = useRef(null)
  const { stationId } = useParams()

  const station = useSelector((state) => state.stationModule.currentStation)
  const currentSong = useSelector((state) => state.stationModule.currentSong)
  const isPlaying = useSelector((state) => state.stationModule.isPlaying)
  const user = useSelector((state) => state.userModule.user)
  const [likedSongsIds, setLikedSongsIds] = useState(_getLikedSongsIds(user.likedSongs))
  const [stationImage, setStationImage] = useState('')

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [backgroundColor, setBackgroundColor] = useState('rgb(18, 18, 18)')
  const fac = new FastAverageColor()

  const [songMenuAnchor, setSongMenuAnchor] = useState(null)
  const songMenuOpen = Boolean(songMenuAnchor)
  const [stationMenuAnchor, setStationMenuAnchor] = useState(null)
  const stationMenuOpen = Boolean(stationMenuAnchor)

  useEffect(() => {
    if (!station) return

    if (station.imgUrl === stationService.DEFAULT_IMG && station.songs.length > 0) {
      const firstSong = station.songs[0]
      const newImgUrl = typeof firstSong.imgUrl === 'string' ? firstSong.imgUrl : firstSong.imgUrl[0].url

      setStationImage(newImgUrl)
    } else {
      setStationImage(station.imgUrl)
    }
  }, [station, station?.songs])

  useEffect(() => {
    if (!stationImage) return

    fac
      .getColorAsync(stationImage)
      .then((color) => {
        setBackgroundColor(`rgb(${color.value[0]}, ${color.value[1]}, ${color.value[2]})`)
      })
      .catch((err) => {
        console.log('Error getting average color:', err)
        setBackgroundColor('rgb(18, 18, 18)')
      })
  }, [stationImage])

  useEffect(() => {
    if (stationId === 'liked-songs') {
      loadLikedSongsStation().catch((err) => navigate('/'))
      return
    }
    loadStation(stationId).catch((err) => navigate('/'))
  }, [stationId])
  useEffect(() => {
    if (!station) return

    if (station.imgUrl === DEFAULT_IMG && station.songs.length > 0) {
      const firstSong = station.songs[0]
      const newImgUrl = typeof firstSong.imgUrl === 'string' ? firstSong.imgUrl : firstSong.imgUrl[0].url

      setStationImage(newImgUrl)

      fac
        .getColorAsync(newImgUrl)
        .then((color) => {
          setBackgroundColor(`rgb(${color.value[0]}, ${color.value[1]}, ${color.value[2]})`)
        })
        .catch((err) => {
          console.log('Error getting average color:', err)
          setBackgroundColor('rgb(18, 18, 18)')
        })
    } else {
      setStationImage(station.imgUrl)

      fac
        .getColorAsync(station.imgUrl)
        .then((color) => {
          setBackgroundColor(`rgb(${color.value[0]}, ${color.value[1]}, ${color.value[2]})`)
        })
        .catch((err) => {
          console.log('Error getting average color:', err)
          setBackgroundColor('rgb(18, 18, 18)')
        })
    }
  }, [station])

  function handlePhotoClick() {
    setIsEditModalOpen(true)
    setTimeout(() => {
      fileInputRef.current?.click()
    }, 100)
  }

  async function handleSaveStation(updatedStationData) {
    try {
      const stationToUpdate = {
        ...station,
        name: updatedStationData.name,
        description: updatedStationData.description,
        imgUrl: updatedStationData.imgUrl,
      }
      await updateStation(stationToUpdate)
      await loadStation(stationId)
      setIsEditModalOpen(false)
    } catch (err) {
      console.error('Failed to update station:', err)
    }
  }

  const onDragEnd = async (result) => {
    const { destination, source } = result
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    try {
      const newSongs = Array.from(station.songs)
      const [removed] = newSongs.splice(source.index, 1)
      newSongs.splice(destination.index, 0, removed)

      const updatedStation = {
        ...station,
        songs: newSongs,
      }

      dispatch({ type: 'SET_STATION', station: updatedStation })
      await stationService.save(updatedStation)
    } catch (err) {
      console.error('Failed to reorder songs:', err)
      dispatch({ type: 'SET_STATION', station })
    }
  }

  function onPlaySong(song) {
    if (currentSong._id !== song._id) setPlayingSong(song)
    setIsPlaying(true)
  }

  function onPauseSong() {
    setIsPlaying(false)
  }

  async function onAddSong(song) {
    addSongToStation(stationId, song)
  }

  async function onLikeDislikeSong(song) {
    try {
      const likedSongs = !likedSongsIds.includes(song._id) ? await likeSong(song) : await dislikeSong(song._id)
      setLikedSongsIds(_getLikedSongsIds(likedSongs))
    } catch (err) {
      console.error('Failed to like/dislike song:', err)
    }
  }

  function handleClick(event, type) {
    type === 'song' ? setSongMenuAnchor(event.currentTarget) : setStationMenuAnchor(event.currentTarget)
  }
  function handleClose(type) {
    type === 'song' ? setSongMenuAnchor(null) : setStationMenuAnchor(null)
  }

  if (!station) return <div>Loading...</div>

  return (
    <div
      className='station-page'
      style={{
        background: `linear-gradient(180deg, 
          ${backgroundColor} 0%,
          rgba(18, 18, 18, 0.95) 45%,
          rgba(18, 18, 18, 1) 100%
        )`,
      }}
    >
      {' '}
      <header className='station-header'>
        <div className='station-header__cover' onClick={handlePhotoClick} style={{ cursor: 'pointer' }}>
          <img src={station.imgUrl} alt={station.name} className='station-header__cover-img' />
        </div>

        <div className='station-header__info'>
          <span className='station-header__type'>Playlist</span>
          <h1 onClick={() => setIsEditModalOpen(true)} className='station-header__title'>
            {station.name}
          </h1>
          <span className='station-header__description'>{station.description}</span>
          <div className='station-header__meta'>
            <span className='station-header__owner'>{station.createdBy.fullname}</span>
            <span className='station-header__songs-count'>
              {!station.songs?.length
                ? 'No songs yet'
                : `${station.songs.length} ${station.songs.length === 1 ? 'song' : 'songs'}`}
            </span>
          </div>
        </div>
      </header>
      <div className='station-controls'>
        <div className='station-controls__left'>
          <button className='station-controls__play'>
            <span className='station-controls__play-icon'>▶</span>
          </button>
          <button className='station-controls__add'>+</button>
          <Button
            className='list-icon'
            onClick={(event) => handleClick(event, 'station')}
            aria-controls={songMenuOpen ? 'station-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={songMenuOpen ? 'true' : undefined}
            sx={{ textTransform: 'none', fontFamily: 'Spotify-mix, sans-serif' }}
          >
            <MoreHorizIcon sx={{ fontSize: '32px', opacity: 0.7, color: '' }} />
          </Button>
          <StationMenu
            id='station-menu'
            anchorEl={stationMenuAnchor}
            open={stationMenuOpen}
            onClose={() => handleClose('station')}
            MenuListProps={{ 'aria-labelledby': 'station-menu' }}
          />
        </div>
        <div className='station-controls__right'>
          <button className='station-controls__list'>List</button>
        </div>
      </div>
      {station.songs.length ? (
        <div className='station-table-header'>
          <div className='station-table-header__number'>#</div>
          <div className='station-table-header__title'>Title</div>
          <div className='station-table-header__album'>Album</div>
          <div className='station-table-header__date'>Date added</div>
          <div className='station-table-header__duration'>
            <Time />
          </div>
        </div>
      ) : (
        ''
      )}
      <DraggableSongContainer onDragEnd={onDragEnd}>
        {station.songs.map((song, index) => (
          <DraggableSongRow
            key={song._id}
            song={song}
            index={index}
            currentSong={currentSong}
            isPlaying={isPlaying}
            likedSongsIds={likedSongsIds}
            onPlaySong={onPlaySong}
            onPauseSong={onPauseSong}
            onLikeDislikeSong={onLikeDislikeSong}
            handleClick={handleClick}
          />
        ))}
      </DraggableSongContainer>
      {station.songs.length < 3 && <AddSong onAddSong={onAddSong} />}
      <EditStationModal
        station={station}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onOverlayClick={() => setIsEditModalOpen(false)}
        onSave={handleSaveStation}
        fileInputRef={fileInputRef}
        anchorEl={songMenuAnchor}
        open={songMenuOpen}
        // onClose={() => handleClose('song')}
        MenuListProps={{ 'aria-labelledby': 'basic-button' }}
      />
    </div>
  )
}

function _getLikedSongsIds(songs) {
  return songs.map((likedSong) => likedSong._id)
}
