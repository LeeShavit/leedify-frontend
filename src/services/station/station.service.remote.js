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

async function query(filterBy = { createdById: userService.getLoggedinUser()._id }) {
    return httpService.get(`station`, filterBy)
}

function getById(stationId) {
    return httpService.get(`station/${stationId}`)
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

async function addSongToStation(stationId,song) {
    return await httpService.post(`station/${stationId}/song`, song)
}

async function removeSongFromStation(stationId,songId) {
    return await httpService.delete(`station/${stationId}/${songId}`)
}

async function getLikedSongsStation(){
    return await getById('liked-songs')
}

async function getSearchResSong(txt) {
    const res = await ApiService.getSpotifyItems({ type: 'songSearch', query: txt, market: 'US' })
    return res.songs
  }

async function getCurrentSong() {
    const user= await userService.getLoggedinUser()
    if(user.likedSongs[0]) return user.likedSongs[0]
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
  





