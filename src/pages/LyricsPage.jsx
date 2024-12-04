import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { lyricsService } from '../services/lyrics.service'
import { FastAverageColor } from 'fast-average-color'

export function Lyrics() {
  const [lyrics, setLyrics] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [colorStyle, setColorStyle] = useState({ background: '#121212', color: '#FFFFFF' })
  const currentSong = useSelector((state) => state.playerModule.currentSong)
  const fac = new FastAverageColor()

  useEffect(() => {
    if (!currentSong) return

    const loadBackgroundColor = async () => {
      try {
        const imgUrl = Array.isArray(currentSong.imgUrl) ? currentSong.imgUrl[0].url : currentSong.imgUrl

        const color = await fac.getColorAsync(imgUrl)
        const [r, g, b] = color.value
        // Source: https://www.w3.org/TR/WCAG20/#relativeluminancedef
        const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255

        setColorStyle({
          background: `rgb(${r}, ${g}, ${b})`,
          color: brightness > 0.5 ? '#000000' : '#FFFFFF',
          textShadow: brightness > 0.5 ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.5)',
        })
      } catch (err) {
        console.error('Error getting average color:', err)
        setColorStyle({
          background: '#121212',
          color: '#FFFFFF',
        })
      }
    }

    const fetchLyrics = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const songLyrics = await lyricsService.getLyrics(currentSong.name, currentSong.artists[0].name)
        setLyrics(songLyrics)
      } catch (err) {
        setError('Could not load lyrics')
      } finally {
        setIsLoading(false)
      }
    }

    loadBackgroundColor()
    fetchLyrics()
  }, [currentSong])

  if (!currentSong) return null

  return (
    <div
      className='lyrics-page'
      style={{
        ...colorStyle,
        height: '100%',
        transition: 'background 0.3s ease, color 0.3s ease',
      }}
    >
      <div className='lyrics-content'>
        {isLoading && (
          <div className='lyrics-loading' style={{ color: colorStyle.color }}>
            Loading lyrics...
          </div>
        )}
        {error && (
          <div className='lyrics-error' style={{ color: colorStyle.color }}>
            {error}
          </div>
        )}
        {lyrics && (
          <pre className='lyrics-text' style={{ color: colorStyle.color }}>
            {lyrics}
          </pre>
        )}
      </div>
    </div>
  )
}
