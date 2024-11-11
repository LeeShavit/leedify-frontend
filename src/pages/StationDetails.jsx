import { useEffect, useState, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { loadStation, setPlayingSong, setIsPlaying, addSongToStation } from '../store/actions/station.actions'
import { likeSong, dislikeSong } from '../store/actions/user.actions'
import {
  loadStation,
  setPlayingSong,
  setIsPlaying,
  addSongToStation,
  loadLikedSongsStation,
} from '../store/actions/station.actions'
import { likeSong, dislikeSong } from '../store/actions/user.actions'
import { Time, Like, Liked } from '../assets/img/playlist-details/icons'
import { EditStationModal } from '../cmps/EditStationModal'
import { updateStation } from '../store/actions/station.actions'
import { AddSong } from '../cmps/AddSongs'
import { userService } from '../services/user'

export function StationDetails() {
  const { stationId } = useParams()
  const station = useSelector((state) => state.stationModule.currentStation)
  const currentSong = useSelector((state) => state.stationModule.currentSong)

  const likedSongsIds = userService.getLikedSongsIds()

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const isPlaying = useSelector((state) => state.stationModule.isPlaying)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    loadStation(stationId).catch((err) => navigate('/'))
    setIsEditModalOpen(false)
  }, [stationId, station])

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
    setPlayingSong(song)
    setIsPlaying(true)
  }

  function onPauseSong() {
    setIsPlaying(false)
  }

  async function onAddSong(song) {
    console.log(song)
    addSongToStation(stationId, song)
  }

  async function onLikeDislikeSong(song) {
    if (!likedSongsIds.includes(song.id)) likeSong(song)
    else dislikeSong(song.id)
  }

  if (!station) return <div>Loading...</div>

  return (
    <div className='station-page'>
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
            <span className='station-header__songs-count'>{station.songs?.length || 0} songs</span>
          </div>
        </div>
      </header>
      <div className='station-controls'>
        <div className='station-controls__left'>
          <button className='station-controls__play'>
            <span className='station-controls__play-icon'>▶</span>
          </button>
          <button className='station-controls__add'>+</button>
        </div>

        <div className='station-controls__right'>
          <button className='station-controls__list'>List</button>
        </div>
      </div>

      {station.songs.length && (
        <div className='station-table-header'>
          <div className='station-table-header__number'>#</div>
          <div className='station-table-header__title'>Title</div>
          <div className='station-table-header__album'>Album</div>
          <div className='station-table-header__date'>Date added</div>
          <div className='station-table-header__duration'>
            <Time />
          </div>
        </div>
      )}

      <div className='station-table-body'>
        {station.songs?.map((song, idx) => (
          <div key={song.id} className={`station-song-row ${currentSong.id === song.id ? 'current-song' : ''}`}>
            {isPlaying && currentSong.id === song.id ? (
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
              onClick={isPlaying && currentSong.id === song.id ? () => onPauseSong() : () => onPlaySong(song)}
            >
              <img
                src={`/src/assets/img/${isPlaying && currentSong.id === song.id ? 'pause' : 'play'}-icon.svg`}
                alt={`${isPlaying ? 'Pause' : 'Play'}`}
              />
            </div>
            <div className='station-song-row__title'>
              <img src={song.imgUrl} alt={song.name} />
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
            <div className='station-song-row__date'>{new Date(song.addedAt).toLocaleDateString()}</div>
            <div className='station-song-row__duration'>
              <button
                className={`like-song ${likedSongsIds.includes(song.id) ? 'liked' : ''}`}
                onClick={() => onLikeDislikeSong(song.id)}
              >
                {likedSongsIds.includes(song.id) ? <Liked /> : <Like />}
              </button>
              <div>{_formatDuration(song.duration)}</div>
            </div>
          </div>
        ))}
        {station.songs.length === 0 && <AddSong onAddSong={onAddSong} />}
      </div>
      <EditStationModal
        station={station}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
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
