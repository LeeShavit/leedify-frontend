import { useEffect, useState } from 'react'
import exploredata from '../../data/exploredata.json'
import { GenreCard } from '../cmps/GenreCard'

export function Explore() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const categories = exploredata.categories.items

  return (
    <div className='explore-page'>
      <h1 className='explore-page__title'>Browse All</h1>

      <div className='explore-categories'>
        <div className='explore-grid'>
          {categories.map((category) => (
            <GenreCard key={category.id} category={category} onSelect={() => setSelectedCategory(category.id)} />
          ))}
        </div>
      </div>
    </div>
  )
}
