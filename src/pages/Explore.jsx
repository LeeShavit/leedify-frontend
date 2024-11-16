import { useEffect, useState } from 'react'
import exploredata from '../../data/exploredataa.json'
import { GenreCard } from '../cmps/GenreCard'
import { useNavigate } from 'react-router'

export function Explore() {

  const [selectedGenre, setSelectedGenre] = useState('all')
  const genres = exploredata.categories
  const navigate= useNavigate()

  function onSelectGenre(genreId){
    setSelectedGenre(genreId)
    navigate(`/genre/${genreId}`)
  }

  return (
    <div className='explore-page'>
      <h1 className='explore-page__title'>Browse All</h1>
      <div className='explore-grid'>
        {genres.map((genre) => (
          <GenreCard key={genre._id} genre={genre} onSelect={() => onSelectGenre(genre._id)} />
        ))}
      </div>
    </div>
  )
}
