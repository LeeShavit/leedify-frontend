import { httpService } from '../http.service'
import { userService } from '../user'
import { ApiService } from '../api.service'
import { recentlyPlayedService } from '../recently-played.service'
import { loadFromStorage, saveToStorage } from '../util.service'


export const stationService = {
  query,
  getById,
  save,
  remove,
  addSongToStation,
  removeSongFromStation,
  getLikedSongsStation,
  getSearchResSong,
  getSections,
  getCurrentSong,
}

async function query(filterBy) {
  if (!filterBy) {
    const { _id } = userService.getLoggedinUser()
    filterBy = { createdById: _id }
  }
  return httpService.get(`station`, filterBy)
}

async function getById(stationId) {
  if (stationId.length === 22) {
    try {
      console.log('Fetching station from Spotify...')
      const spotifyStation = await ApiService.getSpotifyItems({ type: 'station', id: stationId, market: 'US' })
      return spotifyStation
    } catch (spotifyErr) {
      console.error('Failed to fetch from Spotify:', spotifyErr)
    }
  } else {
    try {
      const station = await httpService.get(`station/${stationId}`)
      return station
    } catch (err) {
      console.error('Failed to get station:', err)
    }
  }
}

async function remove(stationId) {
  return httpService.delete(`station/${stationId}`)
}

async function save(station) {
  if (station._id) {
    const res = await httpService.put(`station/${station._id}`, station)
    return res
  } else {
    return await httpService.post('station', station)
  }
}

async function addSongToStation(stationId, song) {
  return await httpService.post(`station/${stationId}/song`, song)
}

async function removeSongFromStation(stationId, songId) {
  console.log(stationId, songId)
  return await httpService.delete(`station/${stationId}/song/${songId}`)
}

async function getLikedSongsStation() {
  return await getById('liked-songs')
}

async function getSearchResSong(txt) {
  const res = await ApiService.getSpotifyItems({ type: 'songSearch', query: txt, market: 'US' })
  return res.songs
}

async function getSections() {
  return await ApiService.getStationsForHome('US')
}

function getCurrentSong() {
  const ytIdsMap = loadFromStorage('youtube ids') || {}
  ytIdsMap[`La Bachata`] = 'D6Ju9CyOB-I'
  saveToStorage('youtube ids', ytIdsMap)

  return {
    _id: '5ww2BF9slyYgNOk37BlC4u',
    name: 'La Bachata',
    artists: [
      {
        name: 'Manuel Turizo',
        _id: '0tmwSHipWxN12fsoLcFU3B',
      },
    ],
    album: {
      name: '2000',
      _id: '7ubO2LZJZFpyhiWMZkRwcH',
    },
    duration: 145200,
    url: 'youtube/song.mp4',
    imgUrl: 'https://i.scdn.co/image/ab67616d0000b273c9f744b0d62da795bc21d04a',
    likedBy: [],
    addedAt: 162521765262,
  }
}
