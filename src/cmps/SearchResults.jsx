import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ApiService } from '../services/api.service'
import { PlaylistCard } from './PlaylistCard'
import { useSelector } from 'react-redux'
import { Like, Liked, Time } from '../assets/img/playlist-details/icons'
import { likeSong, dislikeSong } from '../store/actions/user.actions'
import { Explore } from '../pages/Explore'
import { setCurrentSong, setIsPlaying } from '../store/actions/player.actions'
import { PauseIcon, PlayIcon } from '../assets/img/player/icons'
import { Loader } from '../assets/img/library/icons'

export function SearchResults() {
  const [activeFilter, setActiveFilter] = useState('songs')
  const [results, setResults] = useState({ songs: [], playlists: [] })
  const [isLoading, setIsLoading] = useState(false)
  const [likedSongsIds, setLikedSongsIds] = useState([])

  const user = useSelector((state) => state.userModule.user)
  const currentSong = useSelector((state) => state.playerModule.currentSong)
  const isPlaying = useSelector((state) => state.playerModule.isPlaying)
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const query = searchParams.get('q')

  useEffect(() => {
    if (!query) return
    fetchResults()
  }, [query, activeFilter])

  useEffect(() => {
    if (user?.likedSongs) {
      setLikedSongsIds(user.likedSongs.map((song) => song._id))
    }
  }, [user?.likedSongs])

  const fetchResults = async () => {
    setIsLoading(true)
    try {
      const data = await ApiService.getSpotifyItems({
        type: activeFilter === 'songs' ? 'songSearch' : 'playlistSearch',
        query,
        market: 'US',
      })
      console.log(data)
      setResults((prevResults) => ({
        ...prevResults,
        [activeFilter]: activeFilter === 'songs' ? data.songs : data.playlists || [],
      }))
    } catch (err) {
      console.error('Search failed:', err)
      setResults((prevResults) => ({
        ...prevResults,
        [activeFilter]: [],
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const handleLikeDislikeSong = async (song) => {
    try {
      const likedSongs = !likedSongsIds.includes(song._id) ? await likeSong(song) : await dislikeSong(song._id)

      setLikedSongsIds(_getLikedSongsIds(likedSongs))
    } catch (err) {
      console.error('Failed to like/dislike song:', err)
    }
  }

  const handleAddPlaylist = async (playlist) => {
    try {
      await userService.likeStation(playlist)
    } catch (err) {
      console.error('Failed to add playlist:', err)
    }
  }

  function onPlaySong(song) {
    if (currentSong._id !== song._id) {
      setCurrentSong(song)
    }
    setIsPlaying(true)
  }

  function onPauseSong() {
    setIsPlaying(false)
  }
  function formatDuration(ms) {
    const minutes = Math.floor(ms / 60000)
    const seconds = ((ms % 60000) / 1000).toFixed(0)
    return `${minutes}:${seconds.padStart(2, '0')}`
  }

  const renderSongRow = (song, index) => (
    <div key={song._id} className='search-results__song-row'>
      <div className='search-results__song-number'>{index + 1}</div>
      <button
        className='search-results__image-button'
        onClick={isPlaying && currentSong._id === song._id ? onPauseSong : () => onPlaySong(song)}
      >
        {isPlaying && currentSong._id === song._id ? <PauseIcon /> : <PlayIcon />}
      </button>

      <div className='search-results__song-info'>
        <img src={song.imgUrl[2].url} alt={song.name} />
        <div className='search-results__song-info-details'>
          <div className='search-results__song-name'>{song.name}</div>
          <div className='search-results__song-artist'>{song.artists.map((artist) => artist.name).join(', ')}</div>
        </div>
      </div>

      <div className='search-results__song-album hide-on-mobile'>{song.album.name}</div>
      <button
        className={`like-song ${likedSongsIds.includes(song._id) ? 'liked' : ''}`}
        onClick={() => handleLikeDislikeSong(song)}
      >
        {likedSongsIds.includes(song._id) ? <Liked /> : <Like />}
      </button>
      <div className='search-results__song-duration'>{formatDuration(song.duration)}</div>
    </div>
  )

  function _getLikedSongsIds(songs) {
    return songs.map((likedSong) => likedSong._id)
  }

  if (!query) return <Explore />

  return (
    <div className='search-results'>
      <div className='search-results__filters'>
        <button
          className={`search-results__filter-btn ${activeFilter === 'songs' ? 'active' : ''}`}
          onClick={() => setActiveFilter('songs')}
        >
          Songs
        </button>
        <button
          className={`search-results__filter-btn ${activeFilter === 'playlists' ? 'active' : ''}`}
          onClick={() => setActiveFilter('playlists')}
        >
          Playlists
        </button>
      </div>

      {isLoading && (
        <div className='search-results__loading'>
          <Loader />
        </div>
      )}

      {!isLoading && (
        <div className='search-results__content'>
          {activeFilter === 'songs' && (
            <>
              <div className='search-results__table-header'>
                <div className='search-results__table-header__number'>#</div>
                <div className='search-results__table-header__title'>Title</div>
                <div className='search-results__table-header__album hide-on-mobile'>Album</div>
                <div className='search-results__table-header__duration'>Duration</div>
              </div>
              <div className='search-results__songs'>
                {results.songs.map((song, index) => renderSongRow(song, index))}
              </div>
            </>
          )}

          {activeFilter === 'playlists' && (
            <div className='search-results__playlists'>
              {results.playlists &&
                results.playlists.map((playlist) => <PlaylistCard key={playlist._id} station={playlist} />)}
            </div>
          )}

          {!isLoading && results[activeFilter].length === 0 && (
            <div className='search-results__empty'>
              No {activeFilter} found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  )
}
