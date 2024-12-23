import { Link, useNavigate } from 'react-router-dom'
import { Play, Pause } from 'lucide-react'
import { addToQueue, clearQueue, playNext, replaceQueue, setCurrentSong, setIsPlaying } from '../store/actions/player.actions'
import { useSelector } from 'react-redux'
import { stationService } from '../services/station'

export function PlaylistCard({ station }) {

  const currentStation = useSelector((state) => state.playerModule.currentStation)
  const isPlaying = useSelector((state) => state.playerModule.isPlaying)
  const navigate = useNavigate()

  async function onPlayPauseStation(event) {
    event.stopPropagation()

    if (station._id === currentStation?._id) {
      isPlaying ? setIsPlaying(false) : setIsPlaying(true)
    } else {
      try {
        const { songs } = await stationService.getById(station._id)
        const [song , ...remainingSongs] = songs
        console.log(songs, song, remainingSongs)
        setCurrentSong(song)
        replaceQueue(remainingSongs, station)
        setIsPlaying(true)
      } catch (error) {
        console.error('Failed to play playlist:', error)
      }
    }
  }
  
  return (
    <div className='playlist-card' onClick={() => navigate(`/station/${station._id}`)}>
      <div className='playlist-card__image-container'>
        <img src={station.imgUrl} alt={station.name} />
        <button className='playlist-card__play-button' aria-label='Play' onClick={(event) => onPlayPauseStation(event)}>
          {isPlaying && currentStation?._id === station._id ? <Pause size={24} color='black' fill='black' /> : <Play size={24} color='black' fill='black' />}
        </button>
      </div>

      <h3 className='playlist-card__title'>{station.name}</h3>
      {station.description && <p className='playlist-card__description'>{station.description}</p>}
    </div>
  )
}
