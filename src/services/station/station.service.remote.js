import { httpService } from '../http.service'
import { userService } from '../user'
import { ApiService } from '../api.service'

export const stationService = {
  query,
  getById,
  save,
  remove,
  addSongToStation,
  removeSongFromStation,
  getLikedSongsStation,
  getSearchResSong,
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
  try {
    const station = await httpService.get(`station/${stationId}`)
    return station
  } catch (err) {
    if (err.response?.status === 404 || err.response?.status === 400) {
      console.log('Station not found in DB, fetching from Spotify...')
      try {
        const spotifyStation = await ApiService.getSpotifyItems({
          type: 'station',
          id: stationId,
          market: 'US',
        })

        if (spotifyStation) {
          return {
            _id: spotifyStation._id,
            name: spotifyStation.name,
            description: spotifyStation.description || '',
            imgUrl: spotifyStation.imgUrl,
            createdBy: { _id: 'spotify', name: 'Spotify' },
            songs: spotifyStation.songs.map((song) => ({
              ...song,
              addedAt: song.addedAt || new Date().toISOString(),
            })),
            tags: [],
            likedByUsers: [],
          }
        }
      } catch (spotifyErr) {
        console.error('Failed to fetch from Spotify:', spotifyErr)
        throw spotifyErr
      }
    }

    throw err
  }
}

async function remove(stationId) {
  return httpService.delete(`station/${stationId}`)
}

async function save(station) {
  if (station._id) {
    return await httpService.put(`station/${station._id}`, station)
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

async function getCurrentSong() {
  const user = await userService.getLoggedinUser()
  if (user.likedSongs[0]) return user.likedSongs[0]
  return {
    _id: '2L9N0zZnd37dwF0clgxMGI',
    name: 'ceilings',
    artists: [
      {
        name: 'Lizzy McAlpine',
        _id: '1GmsPCcpKgF9OhlNXjOsbS',
      },
    ],
    album: {
      name: 'five seconds flat',
      _id: '68L5xVV9wydotfDXEik7eD',
    },
    duration: 181200,
    url: 'youtube/song.mp4',
    imgUrl: 'https://i.scdn.co/image/ab67616d00001e02d370fdc4dbc47778b9b667c3',
    likedBy: [],
    addedAt: 162521765262,
  }
}
