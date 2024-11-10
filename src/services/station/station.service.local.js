import { storageService } from '../async-storage.service'
import { makeId, saveToStorage } from '../util.service'
const STORAGE_KEY = 'stations_db'
const SONG_STORAGE_KEY = 'current-playing-song'

export const stationService = {
  query,
  getById,
  save,
  remove,
  getEmptyStation,
  addSongToStation,
  removeSongFromStation,
  getCurrentSong,
}

_createDemoData()
_createDemoSong()

async function query(filterBy = {}) {
  try {
    let stations = await storageService.query(STORAGE_KEY)

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
  } catch (err) {
    console.error("station service - couldn't get stations", err)
    throw err
  }
}

async function getById(stationId) {
  try {
    return await storageService.get(STORAGE_KEY, stationId)
  } catch (err) {
    console.error("station service - couldn't get station", err)
    throw err
  }
}

async function remove(stationId) {
  try {
    return await storageService.remove(STORAGE_KEY, stationId)
  } catch (err) {
    console.error("station service - couldn't remove station", err)
    throw err
  }
}

async function save(station) {
  try {
    if (station._id) {
      return await storageService.put(STORAGE_KEY, station)
    } else {
      return await storageService.post(STORAGE_KEY, station)
    }
  } catch (err) {
    console.error("station service - couldn't save station", err)
    throw err
  }
}

async function addSongToStation(stationId, song) {
  try {
    const station = await getById(stationId)
    if (!station) throw new Error(`Station ${stationId} not found`)

    const songExists = station.songs.some((s) => s.id === song.id)
    if (songExists) return station

    const songToAdd = {
      ...song,
      addedAt: Date.now(),
    }
    station.songs.push(songToAdd)
    return await save(station)
  } catch (err) {
    console.error("station service - couldn't add song to station", err)
    throw err
  }
}

async function removeSongFromStation(stationId, songId) {
  try {
    const station = await getById(stationId)
    if (!station) throw new Error(`Station ${stationId} not found`)

    const songIdx = station.songs.findIndex((song) => song.id === songId)
    if (songIdx === -1) return station

    station.songs.splice(songIdx, 1)
    return await save(station)
  } catch (err) {
    console.error("station service - couldn't remove song from station", err)
    throw err
  }
}

function getEmptyStation() {
  return {
    name: 'New Playlist',
    description: '',
    tags: [],
    imgUrl: 'https://community.spotify.com/t5/image/serverpage/image-id/55829iC2AD64ADB887E2A5/image-size/large',
    createdBy: {},
    likedByUsers: [],
    songs: [],
  }
}

function _createDemoData() {
  const stations = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  if (stations.length > 0) return

  const demoStations = [
    {
      _id: makeId(),
      name: 'Pink Floyd Essentials',
      description: 'Best of Pink Floyd',
      imgUrl: 'https://i.scdn.co/image/ab67616d0000b273ea7caaff71dea1051d49b2fe',
      tags: ['Rock', 'Psychedelic'],
      createdBy: {
        _id: 'u101',
        fullname: 'Admin',
        imgUrl: '',
      },
      likedByUsers: [],
      songs: [
        {
          id: '4gMgiXfqyzZLMhsksGmbQV',
          name: 'Another Brick in the Wall, Pt. 2',
          artists: [{name:'Pink Floyd', _id:'0k17h0D3J5VfsdmQ1iZtE9'}],
          album: {name:'The Wall', _id:'5Dbax7G8SWrP9xyzkOvy2F'},
          duration: 238746,
          imgUrl: 'https://i.scdn.co/image/ab67616d0000b2735d48e2f56d691f9a4e4b0bdf',
          addedAt: Date.now(),
          uri: 'spotify:track:4gMgiXfqyzZLMhsksGmbQV',
          preview_url: 'https://p.scdn.co/mp3-preview/73d913b1a9cfa64fda1f7d04d7bb16345fa0aac4',
        },
        {
          id: '6mFkJmJqdDVQ1REhVfGgd1',
          name: 'Wish You Were Here',
          artists: [{name:'Pink Floyd', _id:'0k17h0D3J5VfsdmQ1iZtE9'}],
          album: {name:'Wish You Were Here', _id:'0bCAjiUamIFqKJsekOYuRw'},
          duration: 334743,
          imgUrl: 'https://i.scdn.co/image/ab67616d0000b2731a84d71391df7469c5ab8539',
          addedAt: Date.now(),
          uri: 'spotify:track:6mFkJmJqdDVQ1REhVfGgd1',
          preview_url: 'https://p.scdn.co/mp3-preview/e3d046771206da9115d0a619ede2210b610dc9f0',
        },
      ],
    },
    {
      _id: makeId(),
      name: 'Latin Hits',
      description: 'Top Latin songs',
      imgUrl: 'https://i.scdn.co/image/ab67616d0000b273491678beaffcefac517a699e',
      tags: ['Latin', 'Pop'],
      createdBy: {
        _id: 'u101',
        fullname: 'Admin',
        imgUrl: '',
      },
      likedByUsers: [],
      songs: [
        {
          id: '54zcJnb3tp9c5OVKREZ1Is',
          name: 'MI EX TENÍA RAZÓN',
          artists: [{name:'KAROL G', _id:'790FomKkXshlbRYZFtlgla'}],
          album: {name:'MAÑANA SERÁ BONITO (BICHOTA SEASON)', _id:'0FqAaUEyKCyUNFE1uQPZ7i'},
          duration: 154374,
          imgUrl: 'https://i.scdn.co/image/ab67616d0000b273d026bf9d7780f6a1267b4d03',
          addedAt: Date.now(),
          uri: 'spotify:track:54zcJnb3tp9c5OVKREZ1Is',
          preview_url: null,
        },
        {
          id: '5PycBIeabfvX3n9ILG7Vrv',
          name: 'Propuesta Indecente',
          artists: [{name:'Romeo Santos', _id:'5lwmRuXgjX8xIwlnauTZIP'}],
          album: {name:'Fórmula, Vol. 2 (Deluxe Edition)', _id:'17HsiXfqKUPoTP6Y5ebs1L'},
          duration: 235133,
          imgUrl: 'https://i.scdn.co/image/ab67616d0000b273e9da42890bbd629df1e8f640',
          addedAt: Date.now(),
          uri: 'spotify:track:5PycBIeabfvX3n9ILG7Vrv',
          preview_url: 'https://p.scdn.co/mp3-preview/517abecfde814f6ecb4459b4d2ff4c250ed80ec5',
        },
      ],
    },
  ]

  saveToStorage(STORAGE_KEY, demoStations)
}

function _formatDuration(ms) {
  const minutes = Math.floor(ms / 60000)
  const seconds = ((ms % 60000) / 1000).toFixed(0)
  return `${minutes}:${seconds.padStart(2, '0')}`
}

 function getCurrentSong(){
  return {song: JSON.parse(localStorage.getItem(SONG_STORAGE_KEY)), isPlaying: false}
}

function _createDemoSong(){
  let currentSong = JSON.parse(localStorage.getItem(SONG_STORAGE_KEY))
  if (currentSong) return

  currentSong= {
      id: '3xKsf9qdS1CyvXSMEid6g8',
      name: "Pink+White",
      artists: [
          {
              name: 'Frank Ocean',
              _id: '2h93pZq0e7k5yf4dywlkpM',
          }
      ],
      album: {
          name: 'Blonde',
          _id: '3mH6qwIy9crq0I9YQbOuDf'
      },
      duration: 182400,
      url: 'youtube/song.mp4',
      imgUrl: 'https://i.scdn.co/image/ab67616d00004851c5649add07ed3720be9d5526',
      likedBy: [],
      addedAt: 162521765262,
  }
  saveToStorage(SONG_STORAGE_KEY, currentSong)
}