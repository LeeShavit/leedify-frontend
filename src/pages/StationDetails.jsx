import { useEffect, useState, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  loadStation,
  addSongToStation,
  loadLikedSongsStation,
  updateStation,
  removeSongFromStation,
  removeStation,
} from '../store/actions/station.actions'
import { likeSong, dislikeSong, likeStation, dislikeStation } from '../store/actions/user.actions'
import { Time, Like, Liked } from '../assets/img/playlist-details/icons'
import { EditStationModal } from '../cmps/EditStationModal'
import { AddSong } from '../cmps/AddSongs'
import { DEFAULT_IMG } from '../services/station/station.service.local'
import { FastAverageColor } from 'fast-average-color'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { Button } from '@mui/material'
import StationMenu from '../cmps/StationMenu'
import { DraggableSongContainer } from '../cmps/DnDSongContainer'
import { DraggableSongRow } from '../cmps/DnDSongRow'
import { addToQueue, addToQueueNext, playNext, setIsPlaying } from '../store/actions/player.actions'


export function StationDetails() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const fileInputRef = useRef(null)

  const { stationId } = useParams()
  const station = useSelector((state) => state.stationModule.currentStation)
  const user = useSelector((state) => state.userModule.user)

  const isInLibrary = user.likedStations.some((likedStation) => likedStation._id === stationId)

  const [likedSongsIds, setLikedSongsIds] = useState(_getLikedSongsIds(user.likedSongs))
  const [stationImage, setStationImage] = useState(stationService.DEFAULT_IMG)
  const fac = new FastAverageColor()
  const [backgroundColor, setBackgroundColor] = useState('rgb(18, 18, 18)')

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const [stationMenuAnchor, setStationMenuAnchor] = useState(null)
  const stationMenuOpen = Boolean(stationMenuAnchor)

  const currentStationId = useSelector((state) => state.stationModule.currentStationId)
  const queue = useSelector((state) => state.stationModule.queue)
  const isPlaying = useSelector((state) => state.stationModule.isPlaying)

  console.log(currentStationId, queue, isPlaying)

  useEffect(() => {
    if (stationId === 'liked-songs') {
      loadLikedSongsStation().catch((err) => navigate('/'))
      return
    }
    loadStation(stationId).catch((err) => navigate('/'))
  }, [])

  useEffect(() => {
    if (station?.imgUrl === stationService.DEFAULT_IMG && station.songs.length > 0) {
      const firstSong = station.songs[0]
      const newImgUrl = typeof firstSong.imgUrl === 'string' ? firstSong.imgUrl : firstSong.imgUrl[0].url
      setStationImage(newImgUrl)
    } else {
      setStationImage(station.imgUrl)
    }
  }, [station])

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
      const updatedStation = await updateStation(stationToUpdate)
      await loadStation(stationId)
      updateUsersLikedStation(updatedStation)

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


  async function onAddSong(song) {
    try {
      const updatedStation = await addSongToStation(stationId, song)
      updateUsersLikedStation(updatedStation)
    } catch {
      showErrorMsg(`failed to add song ${song.name}`)
    }
  }

  async function onRemoveSong(songId) {
    try {
      const updatedStation = await removeSongFromStation(stationId, songId)
      updateUsersLikedStation(updatedStation)
    } catch {
      showErrorMsg(`failed to remove song ${songId}`)
    }
  }

  async function onRemoveStation() {
    try {
      await removeStation(stationId)
      dislikeStation(stationId)
      navigate('/')
    } catch {
      showErrorMsg(`failed to remove station`)
    }
  }

  async function onLikeDislikeSong(song) {
    try {
      const likedSongs = !likedSongsIds.includes(song._id) ? await likeSong(song) : await dislikeSong(song._id)
      setLikedSongsIds(_getLikedSongsIds(likedSongs))
    } catch (err) {
      console.error('Failed to like/dislike song:', err)
    }
  }

  function handleClick(event) {
    setStationMenuAnchor(event.currentTarget)
  }

  function handleClose() {
    setStationMenuAnchor(null)
  }

  function onPlayStation(){
    addToQueue(station.songs, stationId)
    playNext()
    setIsPlaying(true) 
  }

  if (!station) return <div>Loading...</div>

  const isUserStation = station.createdBy._id === user._id

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
          <img src={stationImage} alt={station.name} className='station-header__cover-img' />
        </div>

        <div className='station-header__info'>
          <span className='station-header__type'>Playlist</span>
          <h1 onClick={() => setIsEditModalOpen(true)} className='station-header__title'>
            {station.name}
          </h1>
          <span className='station-header__description'>{station.description}</span>
          <div className='station-header__meta'>
            <span className='station-header__owner'>{station.createdBy.name}</span>
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
          <button className='station-controls__play' onClick={()=>onPlayStation()}>
            <span className='station-controls__play-icon'>▶</span>
          </button>
          <button className={`like-station ${isInLibrary ? 'liked' : ''}`} onClick={() => onLikeDislikeStation()}>
            {isInLibrary ? <Liked /> : <Like />}
          </button>
          <Button
            className='list-icon'
            onClick={(event) => handleClick(event)}
            aria-controls={stationMenuOpen ? 'station-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={stationMenuOpen ? 'true' : undefined}
            sx={{ textTransform: 'none', fontFamily: 'Spotify-mix, sans-serif' }}
          >
            <MoreHorizIcon sx={{ fontSize: '32px', opacity: 0.7, color: '' }} />
          </Button>
          <StationMenu
            id='station-menu'
            anchorEl={stationMenuAnchor}
            open={stationMenuOpen}
            isInLibrary={isInLibrary}
            onRemoveStation={onRemoveStation}
            onAddToQueue={()=> addToQueueNext(station.songs)}
            onClose={() => handleClose()}
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
            isUserStation={isUserStation}
            likedSongsIds={likedSongsIds}
            onAddToQueue={()=>addToQueue(station.songs.splice(index),stationId)}
            onLikeDislikeSong={onLikeDislikeSong}
            onRemoveSong={onRemoveSong}
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
        // onClose={() => handleClose('song')}
        MenuListProps={{ 'aria-labelledby': 'basic-button' }}
      />
    </div>
  )
}

function _getLikedSongsIds(songs) {
  return songs.map((likedSong) => likedSong._id)
}
