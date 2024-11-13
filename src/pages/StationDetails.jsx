import { useEffect, useState, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  loadStation,
  setPlayingSong,
  setIsPlaying,
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
import { PauseIcon, PlayIcon } from '../assets/img/player/icons'
import { Library } from 'lucide-react'
import { FastAverageColor } from 'fast-average-color'
import { getRelativeTime, getItemsIds, formatDuration } from '../services/util.service'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { Button } from '@mui/material'
import SongMenu from '../cmps/SongMenu'
import StationMenu from '../cmps/StationMenu'
import { showErrorMsg } from '../services/event-bus.service'



export function StationDetails() {

  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const { stationId } = useParams()
  const station = useSelector((state) => state.stationModule.currentStation)
  const currentSong = useSelector((state) => state.stationModule.currentSong)
  const isPlaying = useSelector((state) => state.stationModule.isPlaying)

  const user = useSelector((state) => state.userModule.user)
  const isInLibrary = (user.likedStations.some(likedStation => likedStation._id === stationId))
  const [likedSongsIds, setLikedSongsIds] = useState(_getLikedSongsIds(user.likedSongs))

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [backgroundColor, setBackgroundColor] = useState('rgb(18, 18, 18)')
  const fac = new FastAverageColor()

  const [songMenuAnchor, setSongMenuAnchor] = useState(null)
  const songMenuOpen = Boolean(songMenuAnchor)
  const [stationMenuAnchor, setStationMenuAnchor] = useState(null)
  const stationMenuOpen = Boolean(stationMenuAnchor)

  useEffect(() => {
    if (!station?.imgUrl) return

    fac
      .getColorAsync(station.imgUrl)
      .then((color) => {
        setBackgroundColor(`rgb(${color.value[0]}, ${color.value[1]}, ${color.value[2]})`)
      })
      .catch((err) => {
        console.log('Error getting average color:', err)
        setBackgroundColor('rgb(18, 18, 18)') // fallback color
      })
  }, [station?.imgUrl])

  useEffect(() => {
    if (stationId === 'liked-songs') {
      loadLikedSongsStation().catch((err) => navigate('/'))
      return
    }
    loadStation(stationId).catch((err) => navigate('/'))
  }, [stationId])

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

  function handleCloseModal() {
    setIsEditModalOpen(false)
    loadStation(stationId)
  }

  function onPlaySong(song) {
    if (currentSong._id !== song._id) setPlayingSong(song)
    setIsPlaying(true)
  }

  function onPauseSong() {
    setIsPlaying(false)
  }

  async function onAddSong(song) {
    try {
      await addSongToStation(stationId, song)
    } catch {
      showErrorMsg(`failed to add song ${song.name}`)
    }
  }

  async function onRemoveSong(songId) {
    try {
      await removeSongFromStation(stationId, songId)
      handleClose('song')
    } catch {
      showErrorMsg(`failed to remove song ${songId}`)
    }
  }

  async function onRemoveStation() {
    try {
      await removeStation(stationId)
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

  async function onLikeDislikeStation() {
    try {
      isInLibrary ? await dislikeStation(station._id) : await likeStation(station)
    } catch (err) {
      console.error('Failed to like/dislike station:', err)
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
          <button className='station-controls__play'>
            <span className='station-controls__play-icon'>▶</span>
          </button>
          <button
            className={`like-station ${isInLibrary ? 'liked' : ''}`}
            onClick={() => onLikeDislikeStation()}>
            {isInLibrary ? <Liked /> : <Like />}
          </button>
          <Button
            className='list-icon'
            onClick={(event) => handleClick(event, 'station')}
            aria-controls={stationMenuOpen ? 'station-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={stationMenuOpen ? 'true' : undefined}
            sx={{ textTransform: 'none', fontFamily: 'Spotify-mix, sans-serif', }}>
            <MoreHorizIcon sx={{ fontSize: '32px', opacity: 0.7, color: '' }} />
          </Button>
          <StationMenu id="station-menu"
            anchorEl={stationMenuAnchor}
            open={stationMenuOpen}
            onClose={() => handleClose('station')}
            onLikeDislikeStation={() => onLikeDislikeStation()}
            isUserStation={(user._id === station.createdBy._id)}
            isInLibrary={isInLibrary}
            MenuListProps={{ 'aria-labelledby': 'station-menu', }} />
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
      <div className='station-table-body'>
        {(stationId === 'liked-songs' ? user.likedSongs : station.songs).map((song, idx) => (
          <div key={song._id} className={`station-song-row ${currentSong._id === song._id ? 'current-song' : ''}`}>
            {isPlaying && currentSong._id === song._id ? (
              <div className='station-song-row__icon playing'>
                <div className='bar'></div>
                <div className='bar'></div>
                <div className='bar'></div>
                <div className='bar'></div>
              </div>
            ) : (
              <div className='station-song-row__number'>{idx + 1}</div>
            )}

            <div
              className='station-song-row__playPause'
              onClick={isPlaying && currentSong._id === song._id ? () => onPauseSong() : () => onPlaySong(song)}
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </div>
            <div className='station-song-row__title'>
              <img src={typeof song.imgUrl === 'string' ? song.imgUrl : song.imgUrl[2].url} alt={song.name} />
              <div>
                <div className='song-title'>{song.name}</div>
                <div className='song-artist'>
                  {song.artists.map((artist) => (
                    <Link key={artist._id} to={`/artist/${artist._id}`}>
                      {artist.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className='station-song-row__album'>{song.album.name}</div>
            <div className='station-song-row__date'>{getRelativeTime(song.addedAt)}</div>
            <div className='station-song-row__duration'>
              <button
                className={`like-song ${likedSongsIds.includes(song._id) ? 'liked' : ''}`}
                onClick={() => onLikeDislikeSong(song)}
              >
                {likedSongsIds.includes(song._id) ? <Liked /> : <Like />}
              </button>
              <div>{formatDuration(song.duration)}</div>
            </div>
            <Button
              className='list-icon'
              onClick={(event) => handleClick(event, 'song', song._id)}
              aria-controls={songMenuOpen ? 'song-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={songMenuOpen ? 'true' : undefined}
              sx={{ textTransform: 'none', fontFamily: 'Spotify-mix, sans-serif', }}>
              <MoreHorizIcon sx={{ fontSize: '24px', opacity: 0.7, color: '' }} />
            </Button>
            <SongMenu id="song-menu"
              anchorEl={songMenuAnchor}
              open={songMenuOpen}
              onClose={() => handleClose('song')}
              onRemoveSong={() => onRemoveSong(song._id)}
              songId={song._id}
              MenuListProps={{ 'aria-labelledby': 'basic-button', }}
              isUserStation={(user._id === station.createdBy._id)}
              isInLibrary={likedSongsIds.includes(song._id)}
            />
          </div>
        ))}
        {station.songs.length < 3 && <AddSong onAddSong={onAddSong} />}
      </div>
      <EditStationModal
        station={station}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onOverlayClick={() => setIsEditModalOpen(false)}
        onSave={handleSaveStation}
        fileInputRef={fileInputRef}
      />
    </div>
  )

}

function _formatDuration(ms) {
  const minutes = Math.floor(ms / 60000)
  const seconds = ((ms % 60000) / 1000).toFixed(0)
  return `${minutes}:${seconds.padStart(2, '0')}`
}

function _getLikedSongsIds(songs) {
  return songs.map((likedSong) => likedSong.id)
}
