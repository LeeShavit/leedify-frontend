import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Play, Pause } from 'lucide-react'
import { setIsPlaying, playNext } from '../store/actions/player.actions'

export function NowPlaying() {
  const currentSong = useSelector((state) => state.playerModule.currentSong)
  const isPlaying = useSelector((state) => state.playerModule.isPlaying)
  const queue = useSelector((state) => state.playerModule.queue)

  if (!currentSong) return null

  return (
    <div className='now-playing'>
      <div className='now-playing__header'>
        <h2>Now playing</h2>
      </div>

      <div className='now-playing__current'>
        <div className='now-playing__song-info'>
          <img src={currentSong.imgUrl} alt={currentSong.name} className='now-playing__cover' />
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
          <button className='now-playing__play-button' onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
        </div>
      </div>

      <div className='now-playing__queue'>
        <h3>Next in queue</h3>
        <div className='now-playing__queue-list'>
          {queue.map((song, index) => (
            <div key={song.id} className='queue-item'>
              <img src={song.imgUrl} alt={song.name} className='queue-item__cover' />
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
              <button className='queue-item__play-button' onClick={() => playNext(index)}>
                <Play size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
