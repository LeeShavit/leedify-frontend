import React from 'react'
import { Play } from 'lucide-react'

export default function PlaylistCard({ imageUrl, title, description, aspectSquare = true }) {
  return (
    <div className='playlist-card'>
      <div className='playlist-card__image-container'>
        <img
          src={imageUrl || 'https://i.scdn.co/image/ab67616d0000b273491678beaffcefac517a699e'}
          alt={title}
          className={aspectSquare ? '' : 'aspect-[3/4]'}
        />
        <button className='playlist-card__play-button' aria-label='Play'>
          <Play size={24} color='black' fill='black' />
        </button>
      </div>

      <h3 className='playlist-card__title'>{title}</h3>
      {description && <p className='playlist-card__description'>{description}</p>}
    </div>
  )
}
