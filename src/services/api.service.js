import axios from 'axios'
import { loadFromStorage, saveToStorage } from './util.service.js'
import { YT_API_KEY, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from './credentials.js'
import { DEFAULT_IMG } from './station/station.service.local.js'

const YT_STORAGE_KEY = 'youtube ids'

let gAccessToken = await getAccessToken()
setTokenRefreshInterval()

export const ApiService = {
  getYTVideoId,
  getSpotifyItems,
  getStationsForHome,
}

async function getYTVideoId(currentSong) {
  const songData = `${currentSong.name} ${currentSong.artists[0].name}`
  const ytIdsMap = loadFromStorage(YT_STORAGE_KEY) || {}
  if (typeof ytIdsMap[songData] === 'string') return ytIdsMap[songData]
  try {
    const res = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${songData}&type=video&maxResults=1&key=${YT_API_KEY}`
    )
    const ytId = res.data.items[0].id.videoId

    ytIdsMap[songData] = ytId
    saveToStorage(YT_STORAGE_KEY, ytIdsMap)
    return ytId
  } catch (err) {
    console.log('YT API-> failed to get id from youtube')
    throw err
  }
}

async function getAccessToken() {
  try {
    // Encode client credentials (Client ID and Client Secret)
    const credentials = `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
    const encodedCredentials = btoa(credentials)

    // Make a POST request to the token endpoint
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${encodedCredentials}`,
        },
      }
    )
    // Extract and return the access token from the response
    const { data } = response

    return data.access_token
  } catch (err) {
    console.error('Error retrieving access token:', err.response ? err.response.data : err.message)
    throw err
  }
}

function setTokenRefreshInterval() {
  setInterval(async () => {
    try {
      gAccessToken = await getAccessToken()
      logger.info('Access token refreshed.')
    } catch (error) {
      console.error('Error refreshing access token:', error)
    }
  }, 3300000)
}

async function getSpotifyItems(req) {
  const { type, id, query, market } = req
  if (!gAccessToken) gAccessToken = await getAccessToken()
  const endpoints = _getEndpoints(id, query)
  try {
    // Make a GET request to the Spotify API endpoint
    const response = await axios.get(endpoints[type], {
      headers: {
        Authorization: `Bearer ${gAccessToken}`,
      },
      params: {
        market,
      },
    })
    // Clean and return the data from response
    let cleanData = await _cleanResponseData(response.data, type)
    return cleanData
  } catch (error) {
    console.error(
      'Error retrieving data:',
      error.response ? error.response.data : error.message,
      'Status Code:',
      error.response ? error.response.status : 'N/A',
      'Headers:',
      error.response ? error.response.headers : 'N/A'
    )
    throw error
  }
}

function _getEndpoints(id, query) {
  return {
    categoryStations: `https://api.spotify.com/v1/browse/categories/${id}/playlists?country=il&limit=50`,
    featured: `https://api.spotify.com/v1/browse/featured-playlists?country=US&locale=en_US&limit=20`,
    station: `https://api.spotify.com/v1/playlists/${id}`,
    playlistSearch: `https://api.spotify.com/v1/search?q=${query}&type=playlist&limit=20`,
    tracks: `https://api.spotify.com/v1/playlists/${id}/tracks`,
    search: `https://api.spotify.com/v1/search?q=${query}&type=track,playlist,album,artist&limit=20`,
    songSearch: `https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`,
    artist: `https://api.spotify.com/v1/artists/${id}`,
    album: `https://api.spotify.com/v1/albums/${id}`,
    artistTopTracks: `https://api.spotify.com/v1/artists/${id}/top-tracks?market=IL`,
    artistAlbums: `https://api.spotify.com/v1/artists/${id}/albums?limit=50`,
    artistRelatedArtists: `https://api.spotify.com/v1/artists/${id}/related-artists`,
    recommendations: `https://api.spotify.com/v1/recommendations?limit=100&seed_tracks=${id}`,
    track: `https://api.spotify.com/v1/tracks/${id}`,
  }
}

async function _cleanResponseData(data, type) {
  let cleanData

  switch (type) {
    case 'categoryStations':
    case 'featured':
      cleanData = _cleanCategoryStationsData(data)
      break
    case 'tracks':
      cleanData = _cleanStationTracksData(data)
      break
    case 'station':
      cleanData = await _cleanStationData(data)
      break
    case 'playlistSearch':
      cleanData = await _cleanPlaylistSearchData(data)
      break
    case 'search':
      cleanData = await _cleanSearchData(data)
      break
    case 'songSearch':
      cleanData = await _cleanSongSearchData(data)
      break
    case 'artist':
      cleanData = await _cleanArtistData(data)
      break
    case 'album':
      cleanData = _cleanAlbumData(data)
      break
    case 'artistTopTracks':
    case 'recommendations':
      cleanData = _cleanArtistTopTracksData(data)
      break
    case 'artistAlbums':
      cleanData = _cleanArtistAlbumsData(data)
      break
    case 'artistRelatedArtists':
      cleanData = _cleanArtistRelatedArtistsData(data)
      break
    case 'track':
      cleanData = _cleanTrackData(data)
      break
  }
  return cleanData
}

function _cleanTrackData(data) {
  return {
    _id: data.id,
    name: data.name,
    imgUrl: data.album.images[1].url,
    duration: data.duration_ms,
    owner: { name: data.artists[0].name },
    releaseDate: data.album.release_date.slice(0, 4),
    addedAt: song.addedAt || Date.now(),
    artists: _cleanArtists(data.artists),
    album: { name: data.album.name, _id: data.album.id },
    isTrack: true,
    youtubeId: '',
  }
}

function _cleanArtistRelatedArtistsData(data) {
  return data.artists.map((artist) => {
    return {
      _id: artist.id,
      name: artist.name,
      imgUrl: artist.images[1]?.url,
      isArtist: true,
    }
  })
}

function _cleanArtistAlbumsData(data) {
  return data.items.map((album) => {
    return {
      _id: album.id,
      name: album.name,
      imgUrl: album.images[1].url,
      releaseDate: album.release_date,
      artists: _cleanArtists(album.artists),
      type: album.album_type,
      group: album.album_group,
      isAlbum: true,
    }
  })
}

function _cleanArtistTopTracksData(data) {
  return data.tracks.map((track) => {
    return {
      _id: track.id,
      name: track.name,
      artists: _cleanArtists(track.artists),
      imgUrl: track.album.images,
      duration: track.duration_ms,
      album: { name: track.album.name, _id: track.album.id },
      youtubeId: '',
    }
  })
}
async function _cleanPlaylistSearchData(data) {
  if (!data.playlists || !data.playlists.items) {
    return { playlists: [] }
  }

  const playlists = data.playlists.items.map((playlist) => ({
    _id: playlist.id,
    name: playlist.name,
    imgUrl: playlist.images && playlist.images.length > 0 ? playlist.images[0].url : DEFAULT_IMG,
    description: playlist.description ? playlist.description.replace(/<a\b[^>]*>(.*?)<\/a>/gi, '') : '',
  }))

  return { playlists }
}

async function _cleanStationData(data) {
  return {
    _id: data.id,
    name: data.name,
    description: data.description ? data.description.replace(/<a\b[^>]*>(.*?)<\/a>/gi, '') : '',
    imgUrl: data.images?.[0]?.url || DEFAULT_IMG,
    createdBy: {
      _id: data.owner?.id || 'spotify',
      name: data.owner?.display_name || 'Spotify',
    },
    songs: _cleanStationTracksData(data.tracks),
    tags: [],
    likedByUsers: [],
  }
}

function _cleanAlbumData(data) {
  return {
    _id: data.id,
    name: data.name,
    imgUrl: data.images[0].url,
    releaseDate: data.release_date,
    artists: _cleanArtists(data.artists),
    owner: { name: data.artists[0].name },
    label: data.label,
    songs: _cleanAlbumTracksData(data.tracks.items, data.images),
    isAlbum: true,
  }
}

function _cleanAlbumTracksData(data, imgUrls) {
  return data.map((track) => {
    return {
      _id: track.id,
      name: track.name,
      artists: _cleanArtists(track.artists),
      duration: track.duration_ms,
      youtubeId: '',
      imgUrl: imgUrls,
    }
  })
}

function _cleanCategoryStationsData(data) {
  const stations = data.playlists.items
    .filter((item) => item !== null)
    .map((item) => ({
      _id: item.id ? item.id : '0',
      name: item.name,
      imgUrl: item.images && item.images.length > 0 ? item.images[0].url : '',
      description: item.description ? item.description.replace(/<a\b[^>]*>(.*?)<\/a>/gi, '') : '',
      snapshot_id: item.snapshot_id,
    }))
  return { name: data.message, stations }
}

function _cleanStationTracksData(data) {
  return data.items
    .filter((item) => item.track !== null)
    .map((item) => ({
      _id: item.track.id,
      name: item.track.name,
      artists: _cleanArtists(item.track.artists),
      album: {
        name: item.track.album.name,
        _id: item.track.album.id,
      },
      duration: item.track.duration_ms,
      imgUrl: item.track.album.images,
      addedAt: item.added_at,
      youtubeId: '',
    }))
}

async function _cleanSearchData(data) {
  console.log(data.tracks.items)
  const tracks = data.tracks.items.map((track) => ({
    _id: track.id,
    name: track.name,
    artists: _cleanArtists(track.artists),
    imgUrl: track.album?.images?.[0]?.url || DEFAULT_IMG,
    duration: track.duration_ms,
    album: { name: track.album.name, _id: track.album.id },
    youtubeId: '',
  }))

  const stations = data.playlists.items.map((station) => ({
    _id: station.id,
    name: station.name,
    imgUrl: station.images?.[0]?.url || DEFAULT_IMG,
    description: station.description.replace(/<a\b[^>]*>(.*?)<\/a>/gi, ''),
  }))

  const albums = data.albums.items.map((album) => ({
    _id: album.id,
    name: album.name,
    artists: _cleanArtists(album.artists),
    imgUrl: album.images?.[0]?.url || DEFAULT_IMG,
    releaseDate: album.release_date,
    isAlbum: true,
  }))

  const artists = data.artists.items.map((artist) => ({
    _id: artist.id,
    name: artist.name,
    imgUrl: artist.images[1]?.url,
    isArtist: true,
  }))

  return { tracks, stations, albums, artists }
}

async function _cleanSongSearchData(data) {
  const songs = data.tracks.items.map((track) => ({
    _id: track.id,
    name: track.name,
    artists: _cleanArtists(track.artists),
    imgUrl: track.album.images,
    duration: track.duration_ms,
    album: { name: track.album.name, _id: track.album.id },
    youtubeId: '',
  }))
  return { songs }
}

async function _cleanArtistData(data) {
  return {
    _id: data.id,
    name: data.name,
    imgUrl: data.images[0].url,
    followers: data.followers.total,
    isArtist: true,
    owner: { name: data.name },
  }
}

function _cleanArtists(artists) {
  return artists.map((artist) => ({
    name: artist.name,
    _id: artist.id,
  }))
}

async function getStationsForHome(market) {
  const categories = [
    { _id: 'featured', name: 'Featured Playlists' },
    { _id: '0JQ5DAqbMKFLVaM30PMBm4', name: 'Summer' },
    { _id: '0JQ5DAqbMKFAXlCG6QvYQ4', name: 'Workout' },
    { _id: '0JQ5DAqbMKFzHmL4tf05da', name: 'Mood' },
    { _id: '0JQ5DAqbMKFQIL0AXnG5AK', name: 'Trending' },
  ]

  const results = []

  for (const category of categories) {
    try {
      let section
      if (category._id === 'featured') {
        const featured = await getSpotifyItems({ type: 'featured', market })
        section = { category: category.name, categoryId: category._id, stations: featured.stations }
      } else {
        const res = await getSpotifyItems({ type: 'categoryStations', id: category._id, market })
        section = { category: res.name, categoryId: category._id, stations: res.stations }
      }
      results.push(section)
    } catch (error) {
      console.error(`Error fetching data for category ${category.name}: ${error.message}`)
      results.push([])
    }
  }

  return results
}

function _cleanDescriptions(arr) {
  arr.forEach((item) => {
    if (Array.isArray(item)) _cleanDescriptions(item)
    else if (typeof item === 'object') item.description = item.description.replace(/<a\b[^>]*>.*?<\/a>/gi, '')
  })
}
