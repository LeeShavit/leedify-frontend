import { storageService } from '../async-storage.service'

const STORAGE_KEY = 'stations'

export const stationService = {
  query,
  getById,
  save,
  remove,
  getEmptyStation,
  addSongToStation,
  removeSongFromStation,
  createDefaultStations,
}

async function query(filterBy = {}) {
  let stations = await storageService.query(STORAGE_KEY)
  if (!stations || !stations.length) {
    stations = await createDefaultStations()
    await storageService.post(STORAGE_KEY, stations)
  }

  // Apply filters
  if (filterBy.txt) {
    const regex = new RegExp(filterBy.txt, 'i')
    stations = stations.filter(
      (station) =>
        regex.test(station.name) || regex.test(station.description) || station.tags.some((tag) => regex.test(tag))
    )
  }
  if (filterBy.tag) {
    stations = stations.filter((station) => station.tags.includes(filterBy.tag))
  }

  return stations
}

async function getById(stationId) {
  return await storageService.get(STORAGE_KEY, stationId)
}

async function remove(stationId) {
  return await storageService.remove(STORAGE_KEY, stationId)
}

async function save(station) {
  if (station._id) {
    return await storageService.put(STORAGE_KEY, station)
  } else {
    // Create new station
    station.createdAt = Date.now()
    return await storageService.post(STORAGE_KEY, station)
  }
}

function getEmptyStation() {
  return {
    name: '',
    description: '',
    tags: [],
    imgUrl: '',
    createdBy: {},
    likedByUsers: [],
    songs: [],
  }
}

async function addSongToStation(stationId, song) {
  const station = await getById(stationId)
  if (!station) throw new Error(`Station ${stationId} not found`)

  // Check if song already exists
  const songExists = station.songs.some((s) => s.id === song.id)
  if (songExists) return station

  // Add song with metadata
  const songToAdd = {
    ...song,
    addedAt: Date.now(),
  }
  station.songs.push(songToAdd)
  return await save(station)
}

async function removeSongFromStation(stationId, songId) {
  const station = await getById(stationId)
  if (!station) throw new Error(`Station ${stationId} not found`)

  const songIdx = station.songs.findIndex((song) => song.id === songId)
  if (songIdx === -1) return station

  station.songs.splice(songIdx, 1)
  return await save(station)
}

async function createDefaultStations() {
  const stations = [
    {
      _id: utilService.makeId(),
      name: 'Karol G Top Hits',
      description: 'The best songs from Karol G',
      imgUrl: 'https://i.scdn.co/image/ab67616d0000b273491678beaffcefac517a699e',
      tags: ['Latin', 'Reggaeton'],
      createdBy: {
        _id: 'u101',
        fullname: 'Admin',
        imgUrl: '',
      },
      likedByUsers: [],
      songs: _createKarolGSongs(),
    },
    {
      _id: utilService.makeId(),
      name: 'Pink Floyd Classics',
      description: 'Timeless classics from Pink Floyd',
      imgUrl: 'https://i.scdn.co/image/ab67616d0000b273ea7caaff71dea1051d49b2fe',
      tags: ['Rock', 'Progressive Rock'],
      createdBy: {
        _id: 'u101',
        fullname: 'Admin',
        imgUrl: '',
      },
      likedByUsers: [],
      songs: _createPinkFloydSongs(),
    },
    {
      _id: utilService.makeId(),
      name: 'Romeo Santos Hits',
      description: "The king of Bachata's greatest hits",
      imgUrl: 'https://i.scdn.co/image/ab67616d0000b273e9da42890bbd629df1e8f640',
      tags: ['Bachata', 'Latin'],
      createdBy: {
        _id: 'u101',
        fullname: 'Admin',
        imgUrl: '',
      },
      likedByUsers: [],
      songs: _createRomeoSantosSongs(),
    },
  ]

  return stations
}

function _createKarolGSongs() {
  const karolGData = require('../data/karolgtopsongs.json')
  return karolGData.tracks.map((track) => ({
    id: track.id,
    title: track.name,
    artistName: track.artists.map((artist) => artist.name).join(', '),
    albumName: track.album.name,
    albumId: track.album.id,
    duration: track.duration_ms,
    imgUrl: track.album.images[0].url,
    addedAt: Date.now(),
    createdAt: new Date(track.album.release_date).getTime(),
    url: track.preview_url || null,
  }))
}

function _createPinkFloydSongs() {
  const pinkFloydData = require('../data/topUs10songs.json')
  return pinkFloydData.tracks.map((track) => ({
    id: track.id,
    title: track.name,
    artistName: track.artists.map((artist) => artist.name).join(', '),
    albumName: track.album.name,
    albumId: track.album.id,
    duration: track.duration_ms,
    imgUrl: track.album.images[0].url,
    addedAt: Date.now(),
    createdAt: new Date(track.album.release_date).getTime(),
    url: track.preview_url || null,
  }))
}

function _createRomeoSantosSongs() {
  const romeoSantosData = require('../data/romeoSantos.json')
  return romeoSantosData.tracks.map((track) => ({
    id: track.id,
    title: track.name,
    artistName: track.artists.map((artist) => artist.name).join(', '),
    albumName: track.album.name,
    albumId: track.album.id,
    duration: track.duration_ms,
    imgUrl: track.album.images[0].url,
    addedAt: Date.now(),
    createdAt: new Date(track.album.release_date).getTime(),
    url: track.preview_url || null,
  }))
}

// Helper function to format song duration from milliseconds
function _formatDuration(ms) {
  const minutes = Math.floor(ms / 60000)
  const seconds = ((ms % 60000) / 1000).toFixed(0)
  return `${minutes}:${seconds.padStart(2, '0')}`
}
