import axios from 'axios'
import { loadFromStorage, saveToStorage } from './util.service'

const LYRICS_STORAGE_KEY = 'lyrics_db'
const RAPID_API_KEY = '3113f4880dmshabec1dfb117c1e5p19da03jsn5bbb6e6896da'
const GENIUS_API = 'https://genius-song-lyrics1.p.rapidapi.com'

export const lyricsService = {
  getLyrics,
}

async function getLyrics(songName, artistName) {
  try {
    const cacheKey = `${songName}-${artistName}`.toLowerCase()
    const cachedLyrics = loadFromStorage(LYRICS_STORAGE_KEY)

    if (cachedLyrics?.[cacheKey]) {
      console.log('Getting lyrics from cache')
      return cachedLyrics[cacheKey]
    }

    console.log('Searching for:', songName, 'by', artistName)

    const searchResponse = await axios.get(`${GENIUS_API}/search/`, {
      params: {
        q: `${songName} ${artistName}`,
        per_page: '10',
        page: '1',
      },
      headers: {
        'X-RapidAPI-Key': RAPID_API_KEY,
        'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com',
      },
    })

    const hit = searchResponse.data.hits.find((hit) => {
      const result = hit.result
      return (
        result.primary_artist.name.toLowerCase().includes(artistName.toLowerCase()) &&
        result.title.toLowerCase().includes(songName.toLowerCase())
      )
    })

    if (!hit) {
      console.log('No matching song found')
      return null
    }

    console.log('Found song:', hit.result.title)

    const lyricsResponse = await axios.get(`${GENIUS_API}/song/lyrics/`, {
      params: { id: hit.result.id },
      headers: {
        'X-RapidAPI-Key': RAPID_API_KEY,
        'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com',
      },
    })

    const htmlContent = lyricsResponse.data?.lyrics?.lyrics?.body?.html
    if (!htmlContent) {
      console.log('No lyrics found in response')
      return null
    }

    const lyrics = extractLyricsFromHtml(htmlContent)

    const lyricsCache = loadFromStorage(LYRICS_STORAGE_KEY) || {}
    lyricsCache[cacheKey] = lyrics
    saveToStorage(LYRICS_STORAGE_KEY, lyricsCache)

    console.log('Successfully retrieved and cached lyrics')
    return lyrics
  } catch (err) {
    console.error('Failed to fetch lyrics:', err)
    throw err
  }
}

function extractLyricsFromHtml(html) {
  try {
    let text = html

      .replace(/\[([^\]]+)\]/g, '\n\n[$1]\n')
      .replace(/<br\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<i>/g, '')
      .replace(/<\/i>/g, '')
      .replace(/<a[^>]*>(.*?)<\/a>/g, '$1')
      .replace(/<[^>]*>/g, '')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#x27;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/\)([A-Za-z])/g, ') $1')
      .replace(/([A-Za-z])\(/g, '$1 (')

      .replace(/\s+([.,!?])/g, '$1')

      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .replace(/[ \t]+/g, ' ')

      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line)
      .join('\n')

      .replace(/(\[[^\]]+\])\n/g, '$1\n\n')

      .trim()

    return text
  } catch (err) {
    console.error('Error extracting lyrics:', err)
    return null
  }
}
