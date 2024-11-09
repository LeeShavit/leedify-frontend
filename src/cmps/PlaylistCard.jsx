import { Link } from 'react-router-dom'
import { Play } from 'lucide-react'

export function PlaylistCard({ station }) {
  return (
    <Link to={`/station/${station._id}`} className='playlist-card'>
      <div className='playlist-card__image-container'>
        <img src={station.imgUrl} alt={station.name} />
        <button className='playlist-card__play-button' aria-label='Play'>
          <Play size={24} color='black' fill='black' />
        </button>
      </div>

      <h3 className='playlist-card__title'>{station.name}</h3>
      {station.description && <p className='playlist-card__description'>{station.description}</p>}
    </Link>
  )
}
