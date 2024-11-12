import { useEffect, useState } from 'react'
import exploredata from '../../data/exploredataa.json'
import { GenreCard } from '../cmps/GenreCard'

export function Explore() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const categories = exploredata.categories

  return (
    <div className='explore-page'>
      <h1 className='explore-page__title'>Browse All</h1>
      <div className='explore-grid'>
        {categories.map((category) => (
          <GenreCard key={category._id} category={category} onSelect={() => setSelectedCategory(category._id)} />
        ))}
      </div>
    </div>
  )
}
