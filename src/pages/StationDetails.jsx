import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { loadStation } from '../store/actions/station.actions'
import { Time } from '../assets/img/playlist-details/icons'

export function StationDetails() {
  const { stationId } = useParams()
  const station = useSelector((state) => state.stationModule.currentStation)

  useEffect(() => {
    loadStation(stationId)
  }, [stationId])

  if (!station) return <div>Loading...</div>

  return (
    <div className='station-page'>
      <header className='station-header'>
        <div className='station-header__cover'>
          <img src={station.imgUrl} alt={station.name} className='station-header__cover-img' />
        </div>

        <div className='station-header__info'>
          <span className='station-header__type'>Playlist</span>
          <h1 className='station-header__title'>{station.name}</h1>
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

      <div className='station-table-header'>
        <div className='station-table-header__number'>#</div>
        <div className='station-table-header__title'>Title</div>
        <div className='station-table-header__album'>Album</div>
        <div className='station-table-header__date'>Date added</div>
        <div className='station-table-header__duration'>
          <Time />
        </div>
      </div>

      <div className='station-table-body'>
        {station.songs?.map((song, idx) => (
          <div key={song.id} className='station-song-row'>
            <div className='station-song-row__number'>{idx + 1}</div>
            <div className='station-song-row__title'>
              <img src={song.imgUrl} alt={song.title} />
              <div>
                <div className='song-title'>{song.title}</div>
                <div className='song-artist'>{song.artistName}</div>
              </div>
            </div>
            <div className='station-song-row__album'>{song.albumName}</div>
            <div className='station-song-row__date'>{new Date(song.addedAt).toLocaleDateString()}</div>
            <div className='station-song-row__duration'>{_formatDuration(song.duration)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function _formatDuration(ms) {
  const minutes = Math.floor(ms / 60000)
  const seconds = ((ms % 60000) / 1000).toFixed(0)
  return `${minutes}:${seconds.padStart(2, '0')}`
}
