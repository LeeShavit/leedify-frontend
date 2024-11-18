import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { SectionHeader } from '../cmps/SectionHeader'
import { PlaylistCard } from '../cmps/PlaylistCard'
import { ApiService } from '../services/api.service'
import { useLocation } from 'react-router-dom'

export function GenreDetails() {
  const { genreId } = useParams()
  const [genre, setGenre] = useState(null)
  const location = useLocation()

  useEffect(() => {
    loadGenre()
  }, [genreId])

  async function loadGenre() {
    try {
      let genreData
      if (genreId === 'featured') {
        genreData = await ApiService.getSpotifyItems({
          type: 'featured',
          market: 'US',
        })
      } else {
        genreData = await ApiService.getSpotifyItems({
          type: 'categoryStations',
          id: genreId,
          market: 'US',
        })
      }
      setGenre(genreData)
    } catch (err) {
      console.error('Failed to load stations:', err)
    }
  }

  return (
    <div className='genre-page'>
      <SectionHeader title={genre?.name} />
      <div className='genre-page__grid'>
        {genre?.stations.map((station) => (
          <PlaylistCard key={station._id} station={station} className='genre-card' />
        ))}
      </div>
    </div>
  )
}
