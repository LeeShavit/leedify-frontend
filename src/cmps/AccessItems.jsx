import React from 'react'
import { Play } from 'lucide-react'

const QuickAccessItem = ({ image, title }) => {
  return (
    <div className='quick-access__item'>
      <img src={image} alt={title} className='quick-access__image' />
      <div className='quick-access__content'>
        <span className='quick-access__title'>{title}</span>
      </div>
      <button className='quick-access__play'>
        <Play size={16} color='black' fill='black' />
      </button>
    </div>
  )
}

export function QuickAccess() {
  const quickItems = [
    {
      id: 1,
      title: 'Romeo Santos',
      image: 'https://i.scdn.co/image/ab67616d0000b273491678beaffcefac517a699e',
    },
    {
      id: 2,
      title: 'Liked Songs',
      image: 'https://i.scdn.co/image/ab67616d0000b273491678beaffcefac517a699e',
    },
    {
      id: 3,
      title: 'best reggaeton',
      image: 'https://i.scdn.co/image/ab67616d0000b273491678beaffcefac517a699e',
    },
    {
      id: 4,
      title: 'Brega Funk',
      image: 'https://i.scdn.co/image/ab67616d0000b273491678beaffcefac517a699e',
    },
    {
      id: 5,
      title: 'Healing Sounds',
      image: 'https://i.scdn.co/image/ab67616d0000b273491678beaffcefac517a699e',
    },
    {
      id: 6,
      title: 'Salsa',
      image: 'https://i.scdn.co/image/ab67616d0000b273491678beaffcefac517a699e',
    },
    {
      id: 7,
      title: 'Body Healing Frequencies',
      image: 'https://i.scdn.co/image/ab67616d0000b273491678beaffcefac517a699e',
    },
  ]

  return (
    <div className='quick-access__grid'>
      {quickItems.map((item) => (
        <QuickAccessItem key={item.id} image={item.image} title={item.title} />
      ))}
    </div>
  )
}
