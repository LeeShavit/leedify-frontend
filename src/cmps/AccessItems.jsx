import { useEffect, useState } from 'react'
import { Play, Pause } from 'lucide-react'
import { useSelector } from 'react-redux'
import { recentlyPlayedService } from '../services/recently-played.service'
import { addToQueue, clearQueue, playNext, replaceQueue, setIsPlaying } from '../store/actions/player.actions'
import { useNavigate } from 'react-router'

const QuickAccessItem = ({ station, isPlaying, isCurrentStation, onPlay }) => {
  const navigate = useNavigate()
  return (
    <div className='quick-access__item' onClick={() => navigate(`/station/${station._id}`)}>
      <img src={station.imgUrl} alt={station.name} className='quick-access__image' />
      <div className='quick-access__content'>
        <span className='quick-access__title'>{station.name}</span>
      </div>
      <button
        className='quick-access__play'
        onClick={(e) => {
          e.stopPropagation()
          onPlay(station)
        }}
      >
        {isPlaying && isCurrentStation ? (
          <Pause size={16} color='black' fill='black' />
        ) : (
          <Play size={16} color='black' fill='black' />
        )}
      </button>
    </div>
  )
}

export function QuickAccess() {
  const [recentStations, setRecentStations] = useState([])
  const currentStation = useSelector((state) => state.playerModule.currentStation)
  const isPlaying = useSelector((state) => state.playerModule.isPlaying)

  useEffect(() => {
    loadRecentStations()
  }, [])

  async function loadRecentStations() {
    try {
      const stations = await recentlyPlayedService.getRecentlyPlayed()
      setRecentStations(stations)
    } catch (err) {
      console.error('Failed to load recent stations:', err)
    }
  }

  async function onPlayStation(station) {
    if (station._id === currentStation?._id) {
      setIsPlaying(!isPlaying)
    } else {
      try {
        replaceQueue(station.songs, station)
        playNext()
        setIsPlaying(true)
      } catch (error) {
        console.error('Failed to play station:', error)
      }
    }
  }

  if (!recentStations.length) return null

  return (
    <div className='quick-access__grid'>
      {recentStations?.map((station) => (
        <QuickAccessItem
          key={station._id}
          station={station}
          isPlaying={isPlaying}
          isCurrentStation={station._id === currentStation?._id}
          onPlay={onPlayStation}
        />
      ))}
    </div>
  )
}
