import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  addSongToStation,
  removeSongFromStation,
  removeStation,
  updateStation,
  likeStation,
  dislikeStation,
  loadStations,
} from '../store/actions/station.actions'
import { likeSong, dislikeSong } from '../store/actions/user.actions'
import { addToQueue, addToQueueNext, clearQueue, playNext, replaceQueue, setIsPlaying } from '../store/actions/player.actions'
import { Time, Like, Liked } from '../assets/img/playlist-details/icons'
import { EditStationModal } from '../cmps/EditStationModal'
import { AddSong } from '../cmps/AddSongs'
import { FastAverageColor } from 'fast-average-color'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { Button } from '@mui/material'
import StationMenu from '../cmps/StationMenu'
import { DraggableSongContainer } from '../cmps/DnDSongContainer'
import { DraggableSongRow } from '../cmps/DnDSongRow'
import { stationService, DEFAULT_IMG } from '../services/station/'
import { getItemsIds } from '../services/util.service'
import {
  SOCKET_EMIT_SET_STATION_ID,
  SOCKET_EVENT_EDIT_STATION,
  SOCKET_EVENT_SAVE_STATION,
  socketService,
} from '../services/socket.service'
import { ListIcon, Loader } from '../assets/img/library/icons'
import { showUserMsg } from '../services/event-bus.service'
import { PauseIcon, PlayIcon } from '../assets/img/player/icons'

export function StationDetails() {
  const navigate = useNavigate()
  const fac = new FastAverageColor()
  const fileInputRef = useRef(null)
  const { stationId } = useParams()

  const user = useSelector((state) => state.userModule.user)

  const [station, setStation] = useState(null)
  const [stationImage, setStationImage] = useState(DEFAULT_IMG)
  const [backgroundColor, setBackgroundColor] = useState('rgb(18, 18, 18)')
  const [likedSongsIds, setLikedSongsIds] = useState(null)
  const [isInLibrary, setIsInLibrary] = useState(false)

  const [isAddSong, setIsAddSong] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [stationMenuAnchor, setStationMenuAnchor] = useState(null)
  const stationMenuOpen = Boolean(stationMenuAnchor)

  const currentStation = useSelector((state) => state.playerModule.currentStation)
  const isPlaying = useSelector((state) => state.playerModule.isPlaying)

  const isEditable= (stationId !== 'liked-songs' && stationId.length !== 22)

  useEffect(() => {
    socketService.on(SOCKET_EVENT_EDIT_STATION, editStation)
    console.log(stationId , stationId.length)

    return () => {
      socketService.off(SOCKET_EVENT_EDIT_STATION, editStation)
    }
  }, [])


  useEffect(() => {
    loadStation().catch((err) => console.log(err))
    socketService.emit(SOCKET_EMIT_SET_STATION_ID, stationId)
  }, [user._id, stationId])

  useEffect(() => {
    if (station) {
      console.log(station)
      loadStationImage()
    }
  }, [station])

  async function loadStation() {
    try {
      if (!stationId) return
      if (!user) return
      const loadedStation = await stationService.getById(stationId)
      setStation(loadedStation)
      setLikedSongsIds(getItemsIds(user.likedSongs))
      setIsInLibrary(user?.likedStations.some(likedStation => likedStation._id === stationId))
      setIsAddSong(loadedStation.songs.length === 0 && isEditable)
      return loadedStation
    } catch (err) {
      console.error('Cannot load station', err)
      navigate('/')
      throw err
    }
  }

  function loadStationImage() {
    if (!station) return

    let img = station.imgUrl
    if (station.songs.length === 0 && station.imgUrl !== DEFAULT_IMG && !img.includes('cloudinary')) {
      img = DEFAULT_IMG
      updateStation({ ...station, imgUrl: img })
    } else if (station.songs.length > 0 && (station.imgUrl === DEFAULT_IMG || !img.includes('cloudinary'))) {
      img = typeof station.songs[0].imgUrl === 'string' ? station.songs[0].imgUrl : station.songs[0].imgUrl[0].url
      updateStation({ ...station, imgUrl: img })
    }

    setStationImage(img)
    loadBackgroundColor(img)
  }


  async function loadBackgroundColor(img) {
    try {
      const color = await fac.getColorAsync(img)
      setBackgroundColor(`rgb(${color.value[0]}, ${color.value[1]}, ${color.value[2]})`)
    } catch (err) {
      console.log('Error getting average color:', err)
      setBackgroundColor('rgb(18, 18, 18)')
    }
  }

  function editStation(updatedStation) {
    setStation(updatedStation)
  }

  async function handleSaveStation(updatedStationData) {
    if(!isEditable) return
    try {
      const stationToUpdate = {
        ...station,
        name: updatedStationData.name,
        description: updatedStationData.description,
        imgUrl: updatedStationData.imgUrl,
      }
      setStation(updatedStation)
      const updatedStation = await updateStation(stationToUpdate)
      setIsEditModalOpen(false)
      socketService.emit(SOCKET_EVENT_SAVE_STATION, updatedStation)
      showUserMsg('Playlist Updated Successfully')
    } catch (err) {
      console.error('Failed to update station:', err)
    }
  }

  function handlePhotoClick() {
    if(!isEditable) return
    setIsEditModalOpen(true)
    setTimeout(() => {
      fileInputRef.current?.click()
    }, 100)
  }

  const onDragEnd = async (result) => {
    if(!isEditable) return 
    const { destination, source } = result
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    try {
      const newSongs = Array.from(station.songs)
      const [removed] = newSongs.splice(source.index, 1)
      newSongs.splice(destination.index, 0, removed)

      const stationToSave = {
        ...station,
        songs: newSongs,
      }

      setStation((prevStation) => ({ ...prevStation, songs: newSongs }))
      await updateStation(stationToSave)
      socketService.emit(SOCKET_EVENT_SAVE_STATION, stationToSave)
    } catch (err) {
      console.error('Failed to reorder songs:', err)
    }
  }

  async function onAddSong(song) {
    if(!isEditable) return
    try {
      const songExists = station.songs.some((s) => s._id === song._id)
      if (songExists) {
        showUserMsg('Song is in playlist')
        return
      }
      const updatedStation = await addSongToStation(stationId, song)
      setStation(updatedStation)
      loadStationImage()
      socketService.emit(SOCKET_EVENT_SAVE_STATION, updatedStation)
      showUserMsg(`Added To ${station.name}`, station.imgUrl)
    } catch {
      showUserMsg(`failed to add song ${song.name}`)
    }
  }

  async function onRemoveSong(songId) {
    if(!isEditable) return
    try {
      const updatedStation = await removeSongFromStation(stationId, songId)
      setStation(updatedStation)
      loadStationImage()
      socketService.emit(SOCKET_EVENT_SAVE_STATION, updatedStation)
      showUserMsg(`Removed From ${station.name}`, station.imgUrl)
    } catch {
      showUserMsg(`failed to remove song ${songId}`)
    }
  }

  async function onRemoveStation() {
    try {
      if (station.createdBy._id === user._id) {
        await removeStation(stationId)
      }
      dislikeStation(stationId)
      navigate('/')
      showUserMsg('Playlist Removed Successfully')
    } catch {
      showUserMsg(`failed to remove station`)
    }
  }

  async function onLikeDislikeSong(song) {
    const isToLike = !likedSongsIds.includes(song._id)
    try {
      const likedSongs = isToLike ? await likeSong(song) : await dislikeSong(song._id)
      setLikedSongsIds(getItemsIds(likedSongs))

      if(stationId === 'liked-songs') setStation((prevStation) => ({ ...prevStation, songs: likedSongs }))

      showUserMsg(`${isToLike ? 'Added To' : 'Removed From'} Liked Songs`, 'https://misc.scdn.co/liked-songs/liked-songs-300.png')
    } catch (err) {
      console.error('Failed to like/dislike song:', err)
      showUserMsg(`Added To ${station.name}`, station.imgUrl)
    }
  }

  async function onLikeDislikeStation() {
    if (isInLibrary) {
      await dislikeStation(stationId)
      setIsInLibrary(false)
      showUserMsg('Removed From Your Library')
    } else {
      likeStation(station)
      setIsInLibrary(true)
      showUserMsg('Added To Your Library')
    }
  }

  function handleClick(event) {
    setStationMenuAnchor(event.currentTarget)
  }

  function handleClose() {
    setStationMenuAnchor(null)
  }

  function onPlayStation() {
    if (currentStation?._id === stationId) {
      isPlaying ? setIsPlaying(false) : setIsPlaying(true)
    } else {
      replaceQueue([...station.songs], station)
      playNext()
      setIsPlaying(true)
    }
  }

  if (!station || !user._id) return <Loader />
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
          <h1 onClick={() => isEditable && setIsEditModalOpen(true)} className='station-header__title'>
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
          <button className='station-controls__play' onClick={() => onPlayStation()}>
            {currentStation?._id === stationId && isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          {station.createdBy._id !== user._id && (
            <button
              className={`station-controls__add ${isInLibrary ? 'liked' : ''}`}
              onClick={() => onLikeDislikeStation()}
            >
              {isInLibrary ? <Liked /> : <Like />}
            </button>
          )}
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
            onLikeStation={onLikeDislikeStation}
            onAddToQueue={() => addToQueueNext(station.songs)}
            onClose={() => handleClose()}
            MenuListProps={{ 'aria-labelledby': 'station-menu' }}
          />
        </div>
        <div className='station-controls__right'>
          <button className='station-controls__list'>
            <span>List</span>
            <ListIcon className='list-icon' sx={{ fontSize: '24px', opacity: 0.7 }} />
          </button>
        </div>
      </div>
      {station?.songs.length ? (
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
            onAddToQueue={() => replaceQueue(station.songs.slice(index), station)}
            onLikeDislikeSong={onLikeDislikeSong}
            onRemoveSong={onRemoveSong}
            isEditable= {isEditable}
          />
        ))}
      </DraggableSongContainer>
      {isAddSong
        ? <AddSong onAddSong={onAddSong} onClose={() => setIsAddSong(false)} />
        : <div className='add-song-open'>
          {isEditable && <button onClick={() => setIsAddSong(true)} >Find more</button>}
        </div>}
      {(isEditModalOpen && isEditable) && (
        <EditStationModal
          station={station}
          isOpen={isEditModalOpen}
          onSave={handleSaveStation}
          onClose={() => setIsEditModalOpen(false)}
          onOverlayClick={() => setIsEditModalOpen(false)}
          fileInputRef={fileInputRef}
          // onClose={() => handleClose('song')}
          MenuListProps={{ 'aria-labelledby': 'basic-button' }}
        />
      )}
    </div>
  )
}

function _getLikedSongsIds(songs) {
  if (!songs) return null
  return songs.map((likedSong) => likedSong._id)
}
