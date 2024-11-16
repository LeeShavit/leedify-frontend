// pages/HomePage.jsx
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import { SectionHeader } from '../cmps/SectionHeader'
import { QuickAccess } from '../cmps/AccessItems'
import { PlaylistCard } from '../cmps/PlaylistCard'
import { ApiService } from '../services/api.service'

export function GenreDetails() {

    const { genreId } = useParams()
    const [genre, setGenre] = useState(null)

    useEffect(() => {
        loadGenre()
    }, [])

    async function loadGenre() {
        const genreData = await ApiService.getSpotifyItems({ type: 'categoryStations', id: genreId, market: 'US' })
        setGenre(genreData)
    }

    return (
        <div className='genre-page'>
            <section className='home-page__section genre-page'>
                <SectionHeader title={genre?.name} />
                <div className='home-page__grid'>
                    {genre?.stations.map((station) => (
                        <PlaylistCard key={station._id} station={station} />
                    ))}
                </div>
            </section>
        </div>
    )
}