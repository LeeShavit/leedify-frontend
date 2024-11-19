import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { SET_QUEUE_OPEN } from '../store/reducers/player.reducer'
import { PauseIcon, PlayIcon } from '../assets/img/player/icons'
import { setIsPlaying, replaceQueue, setCurrentSong } from '../store/actions/player.actions'

export function NowPlaying() {
  const dispatch = useDispatch()
  const currentSong = useSelector((state) => state.playerModule?.currentSong)
  const queue = useSelector((state) => state.playerModule?.queue || [])
  const isOpen = useSelector((state) => state.playerModule?.isQueueOpen)
  const isPlaying = useSelector((state) => state.playerModule.isPlaying)
  const currentStation = useSelector((state) => state.playerModule.currentStation)

  const closeQueue = () => {
    dispatch({ type: SET_QUEUE_OPEN, isOpen: false })
  }

  const handlePlayFromQueue = (index) => {
    const selectedSong = queue[index]
    dispatch(setCurrentSong(selectedSong))
    dispatch(replaceQueue(queue.slice(index + 1), currentStation))
    dispatch(setIsPlaying(true))
  }

  if (!isOpen) return null

  return (
    <div className='now-playing'>
      <div className='now-playing__header'>
        <div className='now-playing__title'>
          <h2>Queue</h2>
          <button className='now-playing__close' onClick={closeQueue}>
            <X size={20} />
          </button>
        </div>
      </div>

      <div className='now-playing__current'>
        <h3>Now playing</h3>
        <div className='now-playing__song-info'>
          <img
            src={typeof currentSong.imgUrl === 'string' ? currentSong.imgUrl : currentSong.imgUrl[2].url}
            alt={currentSong.name}
            className='now-playing__cover'
          />
          <div className='now-playing__details'>
            <span className='now-playing__name'>{currentSong.name}</span>
            <span className='now-playing__artist'>
              {currentSong.artists?.map((artist, index) => (
                <span key={artist._id}>
                  {index > 0 && ', '}
                  <Link to={`/artist/${artist._id}`}>{artist.name}</Link>
                </span>
              ))}
            </span>
          </div>
          <button className='now-playing__play-button' onClick={() => dispatch(setIsPlaying(!isPlaying))}>
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
        </div>
      </div>

      <div className='now-playing__queue'>
        <h3>Next in queue</h3>
        <div className='now-playing__queue-list'>
          {queue.map((song, index) => (
            <div key={song.id || index} className='queue-item'>
              <div className='queue-item__cover-container'>
                <img
                  src={typeof song.imgUrl === 'string' ? song.imgUrl : song.imgUrl[2].url}
                  alt={song.name}
                  className='queue-item__cover'
                />
                <button className='queue-item__cover-play' onClick={() => handlePlayFromQueue(index)}>
                  <PlayIcon />
                </button>
              </div>
              <div className='queue-item__details'>
                <span className='queue-item__name'>{song.name}</span>
                <span className='queue-item__artist'>
                  {song.artists?.map((artist, idx) => (
                    <span key={artist._id}>
                      {idx > 0 && ', '}
                      <Link to={`/artist/${artist._id}`}>{artist.name}</Link>
                    </span>
                  ))}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
